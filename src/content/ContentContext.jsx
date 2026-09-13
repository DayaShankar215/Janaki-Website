import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { defaults } from './defaults';
import { useLanguage } from '@/i18n/LanguageContext';
import { contentOverlays } from '@/i18n/contentNe';

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

function withGroups(arr, lookup) {
  if (!lookup || !arr) return arr;
  return arr.map((item) => {
    const o = lookup[item.id];
    if (!o) return item;
    return { ...item, ...o };
  });
}

/**
 * Returns a copy of `base` with Nepali display overrides applied
 * when `ne` text is available; otherwise keeps the original field.
 * Only label/text fields are translated — ids, slugs, booleans and
 * numbers stay untouched so data integrity is preserved.
 */
function localizeContent(base, ne) {
  if (!ne) return base;

  const o = contentOverlays.ne || {};
  const { courses, categories } = base;

  return {
    ...base,
    categories: categories.map((c) => ({
      ...c,
      label: (o.categories && o.categories[c.id]) || c.label,
    })),
    courses: (courses || []).map((c) => {
      const tr = o.courses && o.courses[c.slug];
      return {
        ...c,
        title: (tr && tr.title) || c.title,
        shortDescription: (tr && tr.shortDescription) || c.shortDescription,
      };
    }),
    announcements: withGroups(base.announcements, o.announcements),
    testimonials: withGroups(base.testimonials, o.testimonials),
    faqs: (base.faqs || []).map((f) => {
      const tr = o.faqs && o.faqs[f.question];
      return {
        ...f,
        question: (tr && tr.question) || f.question,
        answer: (tr && tr.answer) || f.answer,
      };
    }),
    whyChooseUs: (base.whyChooseUs || []).map(overlayByTitle(o.whyChooseUs)),
    values: (base.values || []).map(overlayByTitle(o.values)),
    methodologySteps: (base.methodologySteps || []).map(overlayByTitle(o.methodologySteps)),
    careerPathways: (base.careerPathways || []).map(overlayByTitle(o.careerPathways)),
    careerExamples: (base.careerExamples || []).map((ex) => {
      const tr = o.careerExamples && o.careerExamples[ex.course];
      return { ...ex, course: (tr && tr.course) || ex.course, roles: (tr && tr.roles) || ex.roles };
    }),
    admissionSteps: (base.admissionSteps || []).map(overlayByTitle(o.admissionSteps)),
    admissionDocuments: overlayIndexed(base.admissionDocuments, o.admissionDocuments),
    educationLevels: overlayIndexed(base.educationLevels, o.educationLevels),
    preferredTimings: overlayIndexed(base.preferredTimings, o.preferredTimings),
  };
}

function overlayByTitle(lookup) {
  return (item) => {
    if (!lookup) return item;
    const tr = lookup[item.title];
    return { ...item, ...(tr || {}) };
  };
}

function overlayIndexed(items, overlay) {
  if (!overlay || !items) return items;
  return items.map((item, i) => (i < overlay.length ? overlay[i] : item));
}

/**
 * Central content store. Serves code defaults merged with any
 * overrides saved from the Admin Panel (browser localStorage).
 * When the site language is Nepali, display fields are overlaid
 * with Nepali translations (English stays canonical for admin).
 *
 * `useContent(raw = false)` — pass `true` from the Admin UI to get
 * the un-translated English content for editing.
 */
export function ContentProvider({ children }) {
  const [overrides, setOverrides] = useState(loadStored);
  const { isNe } = useLanguage();

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

  const buildValue = useCallback(
    (content) => {
      const { courses, categories } = content;

      const labelMap = new Map(categories.map((c) => [c.id, c.label]));
      const iconMap = new Map(categories.map((c) => [c.id, c.icon]));

      return {
        ...content,

        // ── derived helpers (operate on this content) ──
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
    },
    [updateSection, resetSection, resetAll, exportAll, importAll]
  );

  const rawValue = useMemo(() => {
    const base = { ...defaults, ...(overrides || {}) };
    return buildValue(base);
  }, [overrides, buildValue]);

  const value = useMemo(() => {
    const base = { ...defaults, ...(overrides || {}) };
    const localized = localizeContent(base, isNe);
    const val = buildValue(localized);
    return { ...val, raw: rawValue, isNe };
  }, [overrides, isNe, buildValue, rawValue]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(raw = false) {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>');
  return raw ? ctx.raw : ctx;
}