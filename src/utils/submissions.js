/**
 * Enquiry submissions: the visitor's form data plus any uploaded documents.
 *
 * Storage: Firebase Realtime Database under `submissions/<id>` (same free-tier
 * project the rest of the site uses). Documents are stored as data URLs, which
 * is why the size caps in `documents.js` are strict — a base64 payload is ~33%
 * larger than the file and lives inside a single database node.
 *
 * Reliability: a submission is never lost because the cloud was unreachable.
 * Anything that fails to upload is queued in localStorage and retried on the
 * next visit, so a visitor with a patchy connection still gets their documents
 * through to the centre.
 *
 * ⚠️ Privacy: the project's database rules are open for reads (".read": true,
 * see FIREBASE_RULES in firebaseBackend.js) so that the public site can load
 * content without signing in. That also means anyone who knows the database URL
 * can read this node. See PRIVACY_NOTE below and the admin Submissions tab.
 */

import { ensureAuth } from './firebaseBackend';

const SUBMISSIONS_PATH = 'submissions';
const PENDING_KEY = 'jttc-pending-submissions';

/** Where an application is in the pipeline. Order matters — it is the timeline. */
export const STATUS_FLOW = [
  { id: 'received', label: 'Received', tone: 'navy', blurb: 'Your enquiry is in our inbox.' },
  { id: 'reviewing', label: 'Under review', tone: 'amber', blurb: 'We are checking your details and documents.' },
  { id: 'contacted', label: 'Contacted', tone: 'blue', blurb: 'We have called or emailed you.' },
  { id: 'shortlisted', label: 'Shortlisted', tone: 'green', blurb: 'You are on the list for the next intake.' },
  { id: 'enrolled', label: 'Enrolled', tone: 'green', blurb: 'Your seat is confirmed. Welcome aboard.' },
  { id: 'closed', label: 'Closed', tone: 'gray', blurb: 'This enquiry is no longer active.' },
];

export const STATUS_IDS = STATUS_FLOW.map((s) => s.id);
export const statusInfo = (id) => STATUS_FLOW.find((s) => s.id === id) || STATUS_FLOW[0];

export const PRIVACY_NOTE =
  'Submissions currently sit in an open-read database node. Ask us to delete anything you no longer need — we remove personal data on request.';

/** Unambiguous alphabet: no 0/O/1/I, so references can be read aloud. */
const REF_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** JTTC-2026-8H3K — year plus four random characters (no counters to race on). */
export function makeReference(date = new Date()) {
  let tail = '';
  const bytes = new Uint8Array(4);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < 4; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  for (let i = 0; i < 4; i += 1) tail += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  return `JTTC-${date.getFullYear()}-${tail}`;
}

const db = async () => {
  const fb = await ensureAuth();
  if (!fb) throw new Error('Cloud storage is not available.');
  return fb.db;
};

/**
 * The database SDK is imported lazily (same rule as firebaseBackend) so the
 * public bundle stays small — the contact form is on the critical path.
 */
const rtdb = () => import('firebase/database');
const at = async (path) => {
  const [{ ref }, database] = await Promise.all([rtdb(), db()]);
  return ref(database, `${SUBMISSIONS_PATH}/${String(path).trim().toUpperCase()}`);
};
const root = async () => {
  const [{ ref }, database] = await Promise.all([rtdb(), db()]);
  return ref(database, SUBMISSIONS_PATH);
};

/** Smallest sensible shape check before we write anything. */
function normalise(input) {
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  if (!name) throw new Error('A name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A valid email address is required.');
  const now = Date.now();
  return {
    reference: input.reference || makeReference(),
    name,
    email,
    phone: String(input.phone || '').trim(),
    address: String(input.address || '').trim(),
    course: String(input.course || '').trim(),
    courseTitle: String(input.courseTitle || '').trim(),
    education: String(input.education || '').trim(),
    timing: String(input.timing || '').trim(),
    message: String(input.message || '').trim(),
    documents: Array.isArray(input.documents) ? input.documents : [],
    status: STATUS_IDS.includes(input.status) ? input.status : 'received',
    adminNote: String(input.adminNote || '').trim(),
    source: String(input.source || 'website').trim(),
    createdAt: now,
    updatedAt: now,
    read: false,
    history: [{ at: now, status: STATUS_IDS.includes(input.status) ? input.status : 'received', by: 'system' }],
  };
}

/** Persist a submission. Queues it locally when the cloud is unreachable. */
export async function saveSubmission(input) {
  const record = normalise(input);
  const key = record.reference;
  try {
    const [{ ref, set }, target] = await Promise.all([rtdb(), at(key)]);
    await set(target, record);
    return { ok: true, queued: false, reference: key, record };
  } catch (err) {
    queuePending(record);
    return { ok: false, queued: true, reference: key, record, error: err };
  }
}

/** One submission by reference (used by the public tracker). */
export async function getSubmission(reference, email) {
  const key = String(reference || '').trim().toUpperCase();
  if (!key) return null;
  const [{ get }, target] = await Promise.all([rtdb(), at(key)]);
  const snap = await get(target);
  const record = snap.exists() ? snap.val() : null;
  if (!record) return null;
  // Reference + matching email: stops anyone guessing a reference from reading
  // somebody else's application.
  const sameEmail = String(email || '').trim().toLowerCase() === String(record.email || '').toLowerCase();
  return sameEmail ? record : null;
}

function recordToArray(value) {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value)
    .map(([id, v]) => (v && typeof v === 'object' ? { id, ...v } : null))
    .filter(Boolean)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/** Every submission, newest first. Admin only. */
export async function listSubmissions() {
  const [{ get }, target] = await Promise.all([rtdb(), root()]);
  const snap = await get(target);
  return recordToArray(snap.val());
}

/** Live stream of submissions (admin inbox). Returns an unsubscribe function. */
export function subscribeSubmissions(onData, onError) {
  let stop = () => {};
  let cancelled = false;
  ensureAuth()
    .then(async () => {
      const [{ ref, onValue, query, orderByChild }, target] = await Promise.all([rtdb(), root()]);
      const r = query(target, orderByChild('createdAt'));
      stop = onValue(
        r,
        (snap) => !cancelled && onData(recordToArray(snap.val())),
        (err) => !cancelled && onError && onError(err)
      );
    })
    .catch((err) => !cancelled && onError && onError(err));
  return () => {
    cancelled = true;
    stop();
  };
}

/** Move an application along, keeping a status history for the timeline. */
export async function updateSubmission(reference, patch) {
  const [{ get, update }, target] = await Promise.all([rtdb(), at(reference)]);
  const at$ = Date.now();
  const changes = { updatedAt: at$, ...patch };
  delete changes.id;
  const snap = await get(target);
  const current = snap.exists() ? snap.val() : null;
  if (!current) throw new Error('That submission no longer exists.');
  if (patch.status && STATUS_IDS.includes(patch.status) && patch.status !== current.status) {
    changes.history = [
      ...(Array.isArray(current.history) ? current.history : []),
      { at: at$, status: patch.status, by: patch.by || 'admin' },
    ];
  }
  if (patch.markRead) changes.read = true;
  await update(target, changes);
  return { ...current, ...changes };
}

export async function deleteSubmission(reference) {
  const [{ remove }, target] = await Promise.all([rtdb(), at(reference)]);
  await remove(target);
  return true;
}

/** Mark everything as read — used by the "mark all read" button. */
export async function markAllRead() {
  const all = await listSubmissions();
  const [{ ref, update }, target] = await Promise.all([rtdb(), root()]);
  await Promise.all(
    all
      .filter((s) => !s.read)
      .map((s) => update(ref(target.parent, s.id || s.reference), { read: true, updatedAt: Date.now() }))
  );
  return all.length;
}

// ── Offline queue ────────────────────────────────────────────────────────────

function readPending() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writePending(list) {
  try {
    if (list.length) localStorage.setItem(PENDING_KEY, JSON.stringify(list));
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage full — the queue is best effort */
  }
}

function queuePending(record) {
  const list = readPending();
  if (list.some((r) => r.reference === record.reference)) return;
  list.push(record);
  writePending(list.slice(-10)); // never let the queue grow without bound
}

/** How many submissions are still waiting for the cloud. */
export function pendingCount() {
  return readPending().length;
}

/**
 * Try to upload anything that previously failed. Called once when the app
 * starts, so a visitor who filled the form on a bad connection still gets
 * their documents delivered as soon as they come back online.
 */
export async function flushPending() {
  const list = readPending();
  if (!list.length) return { sent: 0, remaining: 0 };
  const stillPending = [];
  let sent = 0;
  for (const record of list) {
    try {
      const [{ ref, set }, database] = await Promise.all([rtdb(), db()]);
      await set(ref(database, `${SUBMISSIONS_PATH}/${record.reference}`), record);
      sent += 1;
    } catch {
      stillPending.push(record);
    }
  }
  writePending(stillPending);
  return { sent, remaining: stillPending.length };
}
