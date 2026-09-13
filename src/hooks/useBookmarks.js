import { useCallback, useEffect, useState } from 'react';

const KEY = 'jttc-bookmarks-v1';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Module-level bus so every mounted card stays in sync instantly.
const listeners = new Set();
function notify() {
  listeners.forEach((fn) => fn());
}

/** Bookmark (favourite) courses. Stored in the browser, synced across components. */
export function useBookmarks() {
  const [items, setItems] = useState(read);

  useEffect(() => {
    const update = () => setItems(read());
    listeners.add(update);
    return () => listeners.delete(update);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage full — ignore */
    }
  }, [items]);

  const toggle = useCallback((slug) => {
    setItems((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
    notify();
  }, []);

  const isBookmarked = useCallback((slug) => items.includes(slug), [items]);

  return { bookmarks: items, toggle, isBookmarked };
}