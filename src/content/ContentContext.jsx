import { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { defaults } from './defaults';
import { subscribeRemote, pushRemote, loadFirebaseConfig, configSource, testFirebaseConnection, loadRemote } from '@/utils/firebaseBackend';

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
  // Cloud sync status: 'off' (no Firebase configured) | 'connecting' | 'on' | 'error'
  const [cloudStatus, setCloudStatus] = useState('off');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  // Config source: 'static' (ships with the site) | 'local' (admin panel) | null
  const [cloudSource, setCloudSource] = useState(null);
  const cloudActive = useRef(false);
  // Trusts the shared cloud snapshot only after a write succeeds. Until then the
  // browser's localStorage is the source of truth, so edits are never wiped by a
  // failed sync (previously: rejecting DB writes kept the cloud empty, and every
  // reload adopted the empty snapshot — reverting the admin's changes).
  const adoptRemote = useRef(false);

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

  // When cloud sync is active, every mutation is mirrored to the shared store
  // so all devices see the same content. A failed push drops back to local-only
  // mode (and stops trusting remote snapshots) until a write succeeds again.
  const mirrorToCloud = useCallback((next) => {
    if (!cloudActive.current) return;
    pushRemote(next)
      .then(() => {
        adoptRemote.current = true;
        setCloudStatus('on');
      })
      .catch((e) => {
        adoptRemote.current = false;
        setCloudStatus('error');
        console.error('[Content] Cloud sync failed — keeping changes local:', e);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsub = () => {};
    (async () => {
      const [cfg, src] = await Promise.all([loadFirebaseConfig(), configSource()]);
      if (!cfg || cancelled) return;
      cloudActive.current = true;
      setCloudSource(src);
      setCloudStatus('connecting');
      unsub = subscribeRemote(
        (remote) => {
          if (cancelled || !adoptRemote.current) return;
          // adopt shared snapshot — everyone sees the same content
          setOverrides(remote || {});
          setCloudStatus('on');
          setLastSyncedAt(Date.now());
        },
        () => {
          if (!cancelled) setCloudStatus('error');
        }
      );
      // Handshake: only start trusting the shared snapshot once a write works.
      // Until then the browser keeps its own localStorage content, so edits are
      // never lost to a sync that can't write.
      try {
        await testFirebaseConnection();
        if (cancelled) return;
        adoptRemote.current = true;
        const snap = await loadRemote();
        if (cancelled) return;
        setOverrides(snap);
        setCloudStatus('on');
        setLastSyncedAt(Date.now());
      } catch {
        if (!cancelled) setCloudStatus('error'); // writes blocked → local-only mode
      }
    })();
    return () => {
      cancelled = true;
      unsub();
      cloudActive.current = false;
      adoptRemote.current = false;
    };
  }, []);

  /** Push the browser's content to the shared store on demand. */
  const syncNow = useCallback(async () => {
    if (!cloudActive.current) throw new Error('Cloud sync is not connected.');
    await pushRemote(overrides || {});
    setLastSyncedAt(Date.now());
    return true;
  }, [overrides]);

  /** Replace browser content with the shared snapshot on demand. */
  const pullNow = useCallback(async () => {
    if (!cloudActive.current) throw new Error('Cloud sync is not connected.');
    const snap = await loadRemote();
    adoptRemote.current = true;
    persist(snap);
    setLastSyncedAt(Date.now());
    return true;
  }, [persist]);

  /** Replace one section of the content tree. Returns success bool. */
  const updateSection = useCallback(
    (section, value) => {
      const next = { ...(loadStored() || {}), [section]: value };
      const ok = persist(next);
      mirrorToCloud(next);
      return ok;
    },
    [persist, mirrorToCloud]
  );

  /** Revert one section back to the code defaults. */
  const resetSection = useCallback(
    (section) => {
      const next = { ...(loadStored() || {}) };
      delete next[section];
      const ok = persist(next);
      mirrorToCloud(next);
      return ok;
    },
    [persist, mirrorToCloud]
  );

  const resetAll = useCallback(() => {
    const ok = persist({});
    mirrorToCloud({});
    return ok;
  }, [persist, mirrorToCloud]);

  const exportAll = useCallback(() => JSON.stringify(overrides || {}, null, 2), [overrides]);

  const importAll = useCallback(
    (jsonText) => {
      const parsed = JSON.parse(jsonText); // throws on invalid input
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Invalid backup file');
      }
      const ok = persist(parsed);
      mirrorToCloud(parsed); // restore applies to every device at once
      return ok;
    },
    [persist, mirrorToCloud]
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

      // ── cloud sync ──
      cloudStatus,
      cloudSource,
      cloudSyncEnabled: cloudActive.current,
      lastSyncedAt,
      syncNow,
      pullNow,
    };
  }, [overrides, updateSection, resetSection, resetAll, exportAll, importAll, cloudStatus, cloudSource, lastSyncedAt, syncNow, pullNow]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>');
  return ctx;
}