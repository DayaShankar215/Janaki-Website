import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { defaults } from './defaults';

const STORAGE_KEY = 'jttc-content-v1';

// ── Shape metadata for every overridable collection in `defaults` ──
// key         : identity field used to merge stale/partial items onto their
//               default counterpart so missing fields are backfilled.
// arrayFields : fields that must be arrays (guarded against old/broken data).
// boolFields  : fields that must be real booleans (legacy admin data can
//               store 'true' / 'false' strings that break filtering).
const COLLECTION_META = {
  courses: { key: 'slug', arrayFields: ['overview', 'skills', 'practicalSkills', 'eligibility', 'tools', 'careers'], boolFields: ['active', 'practicalFocus'] },
  categories: { key: 'id', arrayFields: [], boolFields: [] },
  trainers: { key: 'id', arrayFields: ['expertise'], boolFields: ['isSample'] },
  testimonials: { key: 'id', arrayFields: [], boolFields: ['isSample'] },
  facilities: { key: 'id', arrayFields: ['features'], boolFields: [] },
  galleryItems: { key: 'id', arrayFields: [], boolFields: [] },
  faqs: { key: 'question', arrayFields: [], boolFields: [] },
  announcements: { key: 'id', arrayFields: ['images'], boolFields: ['pinned', 'isSample', 'popup'], enumFields: { status: ['draft', 'published', 'archived'] } },
  whyChooseUs: { key: 'title', arrayFields: [], boolFields: [] },
  values: { key: 'title', arrayFields: [], boolFields: [] },
  methodologySteps: { key: 'title', arrayFields: [], boolFields: [] },
  careerPathways: { key: 'title', arrayFields: [], boolFields: [] },
  careerExamples: { key: 'course', arrayFields: ['roles'], boolFields: [] },
  admissionSteps: { key: 'title', arrayFields: [], boolFields: [] },
  admissionDocuments: { key: null, arrayFields: [], boolFields: [] },
  educationLevels: { key: null, arrayFields: [], boolFields: [] },
  preferredTimings: { key: null, arrayFields: [], boolFields: [] },
};

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function ensureArray(v) {
  return Array.isArray(v) ? v : [];
}

function coerceBool(v) {
  if (typeof v === 'boolean') return v;
  if (v === 'true' || v === 1 || v === 'on') return true;
  if (v === 'false' || v === 0 || v === 'off' || v === '') return false;
  return Boolean(v);
}

/** Merge one override item onto its default shape, repairing wrong types. */
function sanitizeItem(item, defaultsList, meta) {
  if (!isPlainObject(item)) return null;
  if (!meta) return item;
  const base = (meta.key && defaultsList.find((d) => isPlainObject(d) && d[meta.key] === item[meta.key])) || {};
  const out = { ...base, ...item };
  meta.arrayFields.forEach((f) => {
    out[f] = ensureArray(out[f]);
  });
  meta.boolFields.forEach((f) => {
    out[f] = coerceBool(out[f]);
  });
  if (meta.enumFields) {
    Object.entries(meta.enumFields).forEach(([f, allowed]) => {
      if (!allowed.includes(out[f])) {
        out[f] = (f === 'status' && Array.isArray(allowed)) ? allowed[1] : (allowed[0] || out[f]);
      }
    });
  }
  return out;
}

/**
 * Repair anything saved from an older/broken admin session so the app
 * can never crash on stale localStorage: non-array collections fall back
 * to defaults, partial items are backfilled, booleans are re-coerced.
 */
function sanitizeContent(raw) {
  if (!isPlainObject(raw)) return {};
  const out = {};
  Object.keys(defaults).forEach((key) => {
    const val = raw[key];
    if (val === undefined) return;
    const def = defaults[key];
    if (Array.isArray(def)) {
      const meta = COLLECTION_META[key];
      if (!Array.isArray(val)) {
        out[key] = def; // corrupt entry -> keep the known-good defaults
        return;
      }
      out[key] = meta ? val.map((it) => sanitizeItem(it, def, meta)).filter(Boolean) : val;
    } else if (isPlainObject(def)) {
      out[key] = isPlainObject(val) ? { ...def, ...val } : def;
    } else {
      out[key] = val;
    }
  });
  return out;
}

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
    const content = { ...defaults, ...sanitizeContent(overrides || {}) };
    const { courses, categories } = content;

    const labelMap = new Map(categories.map((c) => [c.id, c.label]));
    const iconMap = new Map(categories.map((c) => [c.id, c.icon]));

    // Public-facing news: only items marked as published, newest first.
    // slug falls back to id so older entries always have a valid article link.
    const publishedAnnouncements = [...(content.announcements || [])]
      .filter((a) => a.status === 'published' && (a.title || '').trim())
      .map((a) => ({ ...a, slug: a.slug || a.id }))
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

    return {
      ...content,

      // ── derived helpers (operate on live content) ──
      publishedAnnouncements,
      getAnnouncementBySlug: (slug) => publishedAnnouncements.find((a) => a.slug === slug || a.id === slug),
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