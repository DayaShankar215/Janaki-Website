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

/** Bookmark (favourite) courses. Stored in the browser. */
export function useBookmarks() {
  const [items, setItems] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage full — ignore */
    }
  }, [items]);

  const toggle = useCallback((slug) => {
    setItems((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const isBookmarked = useCallback((slug) => items.includes(slug), [items]);

  return { bookmarks: items, toggle, isBookmarked, setBookmarks: setItems };
}