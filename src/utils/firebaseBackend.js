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

let sdkPromise = null;

/**
 * The app + database pair, and nothing else. `firebase/auth` is a separate
 * ~190 kB chunk, so it is deliberately NOT loaded here: reading the shared
 * content does not need it, and neither does writing when the rules allow
 * anonymous writes. Callers must not import 'firebase/database' themselves
 * either — a second import site ships a duplicate copy of the SDK.
 */
function getCore() {
  if (!sdkPromise) {
    sdkPromise = (async () => {
      const [{ initializeApp }, { getDatabase }] = await Promise.all([
        import('firebase/app'),
        import('firebase/database'),
      ]);
      const cfg = await loadFirebaseConfig();
      if (!cfg) throw new Error('Firebase not configured');
      const app = initializeApp(cfg, 'jttc');
      return { app, db: getDatabase(app) };
    })().catch((err) => {
      sdkPromise = null; // let a later attempt retry
      throw err;
    });
  }
  return sdkPromise;
}

let dbPromise = null;

/**
 * Resolves `{ app, db }`, or `null` when Firebase is not usable right now. A
 * failure is not cached: the config may be pasted in later, or a flaky
 * connection may recover, so the next call tries again.
 */
export function ensureDb() {
  if (!dbPromise) {
    dbPromise = getCore().catch(() => {
      dbPromise = null;
      return null;
    });
  }
  return dbPromise;
}

/**
 * The database module, shared with the rest of the app. Callers must not import
 * 'firebase/database' themselves — that ships a second copy of the SDK.
 */
export async function rtdbApi() {
  await getCore();
  return import('firebase/database');
}

let authPromise = null;

/** Loads the auth chunk and signs in anonymously. Resolves `false` on failure. */
function signInAnonymouslyOnce() {
  if (!authPromise) {
    authPromise = (async () => {
      const { app } = await getCore();
      const { getAuth, signInAnonymously } = await import('firebase/auth');
      await signInAnonymously(getAuth(app));
      return true;
    })().catch(() => {
      authPromise = null;
      return false;
    });
  }
  return authPromise;
}

const isPermissionError = (err) =>
  /permission|unauthenticated|unauthorized/i.test(String((err && (err.code || err.message)) || err));

/**
 * Run a write, and only if the rules reject it, sign in anonymously and try
 * once more. This keeps the auth chunk off the critical path for everyone whose
 * rules already allow the write, while still supporting the stricter
 * ".write": "auth != null" setup.
 */
export async function withWriteRetry(fn) {
  try {
    return await fn();
  } catch (err) {
    if (!isPermissionError(err)) throw err;
    await signInAnonymouslyOnce();
    return fn();
  }
}

async function getDbRef() {
  const fb = await ensureDb();
  if (!fb) throw new Error('Firebase not configured');
  const { ref } = await rtdbApi();
  return { db: fb.db, rootRef: ref(fb.db, 'content') };
}

/** Fetch the shared content snapshot once. Resolves `{}` if empty/missing. */
export async function loadRemote() {
  const { db, rootRef } = await getDbRef();
  const { get } = await rtdbApi();
  const snap = await get(rootRef);
  return snap.exists() && typeof snap.val() === 'object' ? snap.val() : {};
}

/**
 * Subscribe to live content changes. Calls `onData(remoteContent)` now and
 * whenever any device writes. Returns an unsubscribe function.
 */
export function subscribeRemote(onData, onError) {
  let stop = null;
  let closed = false;
  ensureDb()
    .then(async (fb) => {
      if (!fb) throw new Error('Firebase not configured');
      const { ref, onValue } = await rtdbApi();
      // Opening the connection takes two awaits, and the caller can walk away in
      // that window. Attaching the listener anyway would keep this provider's
      // data handler alive for the rest of the session.
      if (closed) return;
      const off = onValue(
        ref(fb.db, 'content'),
        (snap) => !closed && onData(snap.exists() && typeof snap.val() === 'object' ? snap.val() : {}),
        (err) => !closed && onError && onError(err)
      );
      // ...and the caller can leave between registering and storing the handle.
      if (closed) off();
      else stop = off;
    })
    .catch((err) => {
      if (!closed && onError) onError(err);
    });
  return () => {
    closed = true;
    if (stop) {
      stop();
      stop = null;
    }
  };
}

/** Write the full content snapshot to the shared store (last writer wins). */
export async function pushRemote(contentObj) {
  const { db, rootRef } = await getDbRef();
  const { set } = await rtdbApi();
  await set(rootRef, contentObj == null ? {} : contentObj);
}

/** Empty the shared store (used by "Reset everything"). */
export async function clearRemote() {
  await withWriteRetry(async () => {
    const { rootRef } = await getDbRef();
    const { set } = await rtdbApi();
    await set(rootRef, null);
  });
}

/** Smoke test: write + read a heartbeat value to confirm the connection. */
export async function testFirebaseConnection() {
  return withWriteRetry(async () => {
    const { db } = (await ensureDb()) || {};
    if (!db) throw new Error('Firebase not configured');
    const { set, get, ref } = await rtdbApi();
    const probe = ref(db, '__probe__');
    await set(probe, { ts: Date.now() });
    const snap = await get(probe);
    await set(probe, null);
    return snap.exists();
  });
}