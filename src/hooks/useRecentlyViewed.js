import { useState } from 'react';

const KEY = 'jttc-recent-v1';

/** Tracks the last few courses the visitor viewed (persisted in the browser). */
export function trackCourseView(slug, max = 5) {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    const next = [slug, ...list.filter((s) => s !== slug)].slice(0, max);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function getRecentCourseSlugs(max = 5) {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.slice(0, max) : [];
  } catch {
    return [];
  }
}

/** Reads recent slugs once on mount (listener-free read of localStorage). */
export function useRecentCourseSlugs(max = 5) {
  const [slugs] = useState(() => getRecentCourseSlugs(max));
  return slugs;
}