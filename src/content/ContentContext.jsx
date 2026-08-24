import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { defaults } from './defaults';

const STORAGE_KEY = 'jttc-content-v1';

const ContentContext = createContext(null);

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Central content store. Serves code defaults merged with any
 * overrides saved from the Admin Panel (browser localStorage).
 */
export function ContentProvider({ children }) {
  const [overrides, setOverrides] = useState(loadStored);

  const persist = useCallback((next) => {
    setOverrides(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return true;
    } catch (e) {
      console.error('[Content] Could not save (storage full?):', e);
      return false;
    }
  }, []);

  /** Replace one section of the content tree. Returns success bool. */
  const updateSection = useCallback(
    (section, value) => {
      const next = { ...(loadStored() || {}), [section]: value };
      return persist(next);
    },
    [persist]
  );

  /** Revert one section back to the code defaults. */
  const resetSection = useCallback(
    (section) => {
      const next = { ...(loadStored() || {}) };
      delete next[section];
      return persist(next);
    },
    [persist]
  );

  const resetAll = useCallback(() => persist({}), [persist]);

  const exportAll = useCallback(() => JSON.stringify(overrides || {}, null, 2), [overrides]);

  const importAll = useCallback(
    (jsonText) => {
      const parsed = JSON.parse(jsonText); // throws on invalid input
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Invalid backup file');
      }
      return persist(parsed);
    },
    [persist]
  );

  const value = useMemo(() => {
    const content = { ...defaults, ...(overrides || {}) };
    const { courses, categories } = content;

    const labelMap = new Map(categories.map((c) => [c.id, c.label]));
    const iconMap = new Map(categories.map((c) => [c.id, c.icon]));

    return {
      ...content,

      // ── derived helpers (operate on live content) ──
      getCategoryLabel: (id) => labelMap.get(id) || id,
      getCategoryIcon: (id) => iconMap.get(id) || 'book-open',
      courseCountForCategory: (id) => courses.filter((c) => c.categoryId === id).length,
      getCourseBySlug: (slug) => courses.find((c) => c.slug === slug),
      getRelatedCourses: (course, max = 3) => {
        const sameCat = courses.filter((c) => c.categoryId === course.categoryId && c.slug !== course.slug);
        const others = courses.filter((c) => c.categoryId !== course.categoryId && c.slug !== course.slug && c.active);
        return [...sameCat, ...others].slice(0, max);
      },
      getActiveCourses: () => courses.filter((c) => c.active),

      // ── admin actions ──
      updateSection,
      resetSection,
      resetAll,
      exportAll,
      importAll,
    };
  }, [overrides, updateSection, resetSection, resetAll, exportAll, importAll]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>');
  return ctx;
}
