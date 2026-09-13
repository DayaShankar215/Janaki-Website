import { useEffect } from 'react';

/** Tracks the last few courses the visitor viewed (persisted in the browser). */
export function trackCourseView(slug, max = 5) {
  try {
    const raw = localStorage.getItem('jttc-recent-v1');
    const list = raw ? JSON.parse(raw) : [];
    const next = [slug, ...list.filter((s) => s !== slug)].slice(0, max);
    localStorage.setItem('jttc-recent-v1', JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function getRecentCourseSlugs(max = 5) {
  try {
    const raw = localStorage.getItem('jttc-recent-v1');
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.slice(0, max) : [];
  } catch {
    return [];
  }
}

export function useRecentCourseSlugs(max = 5) {
  const [slugs, setSlugs] = useEffect ? getRecentCourseSlugs(max) : [];
  return slugs;
}