import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, CornerDownLeft, SearchX, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/content/ContentContext';

/**
 * Global quick-search modal triggered with Ctrl/Cmd + K (or the
 * search button in the navbar). Filters courses live by keyword.
 */
export function CourseSearchModal({ open, onClose }) {
  const { courses, getCategoryLabel } = useContent();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (open) {
      setQ('');
      setIdx(0);
      const t = window.setTimeout(() => document.getElementById('course-search-input')?.focus(), 60);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return courses;
    const needle = q.trim().toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        c.shortDescription.toLowerCase().includes(needle) ||
        c.skills.some((s) => s.toLowerCase().includes(needle))
    );
  }, [q, courses]);

  useEffect(() => setIdx(0), [q]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && results[idx]) window.location.assign(`/courses/${results[idx].slug}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, idx, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-navy-950/60 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-navy-900"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-white/10">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                id="course-search-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses… (training, welding, wiring…)"
                className="h-14 w-full bg-transparent text-base text-navy-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[46vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                  <SearchX className="h-8 w-8" />
                  <p className="text-sm">No courses match “{q}”.</p>
                </div>
              ) : (
                results.map((c, i) => (
                  <Link
                    key={c.slug}
                    to={`/courses/${c.slug}`}
                    onClick={onClose}
                    onMouseEnter={() => setIdx(i)}
                    className={`flex items-center gap-3 px-4 py-2.5 transition ${i === idx ? 'bg-navy-50 dark:bg-white/10' : ''}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-white/10 dark:text-accent-400">
                      <Zap className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-navy-900 dark:text-white">{c.title}</span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {getCategoryLabel(c.categoryId)} · {c.durationLabel}
                      </span>
                    </span>
                    {i === idx && <CornerDownLeft className="h-4 w-4 shrink-0 text-accent-500" />}
                  </Link>
                ))
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-400 dark:border-white/10">
              <span className="flex items-center gap-1"><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-white/10">↑</kbd><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-white/10">↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-white/10">↵</kbd> open</span>
              <span className="flex items-center gap-1"><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-white/10">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}