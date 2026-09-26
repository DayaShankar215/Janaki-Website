import { useEffect, useState } from 'react';

const LOG_KEY = 'jttc-admin-activity';
const SAVED_KEY = 'jttc-content-saved-at';
const EVENT = 'jttc-admin-activity-changed';
const MAX_ENTRIES = 25;

function readLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.slice(0, MAX_ENTRIES) : [];
  } catch {
    return [];
  }
}

/** Records one admin action (shown on the dashboard "Recent activity" list). */
export function logActivity(action, section = '') {
  try {
    const next = [{ ts: Date.now(), action, section }, ...readLog()].slice(0, MAX_ENTRIES);
    localStorage.setItem(LOG_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

/** Marks the moment content was last written, for the dashboard footer. */
export function markSaved(section = '') {
  try {
    localStorage.setItem(SAVED_KEY, String(Date.now()));
    if (section) logActivity(`Saved ${section}`, section);
  } catch {
    /* ignore */
  }
}

export function getLastSavedAt() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

/** Live list of recent admin actions (same-tab aware). */
export function useAdminActivity() {
  const [entries, setEntries] = useState(readLog);
  const [lastSavedAt, setLastSavedAt] = useState(getLastSavedAt);

  useEffect(() => {
    const refresh = () => {
      setEntries(readLog());
      setLastSavedAt(getLastSavedAt());
    };
    window.addEventListener(EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { entries, lastSavedAt };
}
