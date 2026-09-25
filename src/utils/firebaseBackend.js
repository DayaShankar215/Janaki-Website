/**
 * Cloud sync layer (Firebase Realtime Database, free Spark tier).
 *
 * Purpose: make Admin Panel edits visible on EVERY device, not just the
 * browser where they were made. When a Firebase web config is available
 * (either pasted into the admin panel and saved to localStorage, or shipped
 * in /firebase-config.json), this module:
 *   - reads the shared content snapshot from the database,
 *   - subscribes to real-time changes so open pages update live,
 *   - writes updated content on every admin save / restore / reset.
 *
 * If Firebase is not configured the app behaves exactly as before
 * (localStorage only). All Firebase SDK code is imported lazily so the
 * main bundle stays small.
 */

const CONFIG_LS_KEY = 'jttc-firebase-config';
const STATIC_CONFIG_PATH = '/firebase-config.json';

/** The recommended database rules (copy to Firebase console → Realtime Database → Rules): */
export const FIREBASE_RULES = `{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}`;

function isConfig(cfg) {
  return (
    !!cfg &&
    typeof cfg === 'object' &&
    typeof cfg.databaseURL === 'string' &&
    cfg.databaseURL.startsWith('https')
  );
}

/**
 * Resolve the Firebase web config: prefer the config shipped with the site
 * (so every device auto-connects), fall back to the per-browser copy saved
 * in the admin panel.
 */
export async function loadFirebaseConfig() {
  try {
    const res = await fetch(STATIC_CONFIG_PATH, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (isConfig(json)) return json;
    }
  } catch {
    /* static file missing or not JSON — fall through */
  }
  try {
    const raw = localStorage.getItem(CONFIG_LS_KEY);
    if (raw) {
      const cfg = JSON.parse(raw);
      if (isConfig(cfg)) return cfg;
    }
  } catch {
    /* corrupt stored config — treat as unconfigured */
  }
  return null;
}

export function saveFirebaseConfig(cfg) {
  try {
    if (cfg) localStorage.setItem(CONFIG_LS_KEY, JSON.stringify(cfg));
    else localStorage.removeItem(CONFIG_LS_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Where the active config comes from: 'static' (shipped in /firebase-config.json,
 * so every device connects automatically) or 'local' (pasted in the admin panel).
 * Returns null when Firebase is not configured.
 */
export async function configSource() {
  try {
    const res = await fetch(STATIC_CONFIG_PATH, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (isConfig(json)) return 'static';
    }
  } catch {
    /* ignore — fall through */
  }
  try {
    const raw = localStorage.getItem(CONFIG_LS_KEY);
    if (raw && isConfig(JSON.parse(raw))) return 'local';
  } catch {
    /* corrupt stored config — ignore */
  }
  return null;
}

/** Pretty JSON ready to paste into public/firebase-config.json. */
export function configToJson(cfg) {
  return JSON.stringify(cfg, null, 2);
}

let firebasePromise = null;

function getFirebase() {
  if (!firebasePromise) {
    firebasePromise = (async () => {
      const [{ initializeApp }, { getDatabase }, { getAuth, signInAnonymously }] = await Promise.all([
        import('firebase/app'),
        import('firebase/database'),
        import('firebase/auth'),
      ]);
      const cfg = await loadFirebaseConfig();
      if (!cfg) throw new Error('Firebase not configured');
      const app = initializeApp(cfg, 'jttc');
      const db = getDatabase(app);
      const auth = getAuth(app);
      return { db, auth, signInAnonymously };
    })();
  }
  return firebasePromise;
}

/**
 * Sign in anonymously so writes satisfy the recommended
 * ".write": "auth != null" rule. Falls back to unauthenticated (some
 * setups allow writes without a signed-in user).
 */
let authPromise = null;

function ensureAuth() {
  if (!authPromise) {
    authPromise = getFirebase()
      .then(async ({ db, auth, signInAnonymously }) => {
        try {
          await signInAnonymously(auth);
        } catch {
          /* keep going — rules may not require auth */
        }
        return { db };
      })
      .catch(() => null);
  }
  return authPromise;
}

async function getDbRef() {
  const fb = await ensureAuth();
  if (!fb) throw new Error('Firebase not configured');
  const { ref } = await import('firebase/database');
  return { db: fb.db, rootRef: ref(fb.db, 'content') };
}

/** Fetch the shared content snapshot once. Resolves `{}` if empty/missing. */
export async function loadRemote() {
  const { db, rootRef } = await getDbRef();
  const { get } = await import('firebase/database');
  const snap = await get(rootRef);
  return snap.exists() && typeof snap.val() === 'object' ? snap.val() : {};
}

/**
 * Subscribe to live content changes. Calls `onData(remoteContent)` now and
 * whenever any device writes. Returns an unsubscribe function.
 */
export function subscribeRemote(onData, onError) {
  let unsub = () => {};
  ensureAuth()
    .then(async (fb) => {
      if (!fb) throw new Error('Firebase not configured');
      const { ref, onValue } = await import('firebase/database');
      const r = ref(fb.db, 'content');
      unsub = onValue(
        r,
        (snap) => onData(snap.exists() && typeof snap.val() === 'object' ? snap.val() : {}),
        (err) => onError && onError(err)
      );
    })
    .catch((err) => onError && onError(err));
  return () => unsub();
}

/** Write the full content snapshot to the shared store (last writer wins). */
export async function pushRemote(contentObj) {
  const { db, rootRef } = await getDbRef();
  const { set } = await import('firebase/database');
  await set(rootRef, contentObj == null ? {} : contentObj);
}

/** Empty the shared store (used by "Reset everything"). */
export async function clearRemote() {
  const { db, rootRef } = await getDbRef();
  const { set } = await import('firebase/database');
  await set(rootRef, null);
}

/** Smoke test: write + read a heartbeat value to confirm the connection. */
export async function testFirebaseConnection() {
  const { db } = await ensureAuth();
  if (!db) throw new Error('Firebase not configured');
  const { set, get, ref } = await import('firebase/database');
  const probe = ref(db, '__probe__');
  await set(probe, { ts: Date.now() });
  const snap = await get(probe);
  await set(probe, null);
  return snap.exists();
}