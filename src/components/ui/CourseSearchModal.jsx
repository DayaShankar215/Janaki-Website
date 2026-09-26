import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, CornerDownLeft, SearchX, Zap, Newspaper, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useContent } from '@/content/ContentContext';

const PAGES = [
  { to: '/about', title: 'About Us', keywords: 'about who we are mission history team' },
  { to: '/courses', title: 'Courses', keywords: 'training courses programs list' },
  { to: '/practical-training', title: 'Practical Training', keywords: 'practical training hands-on onsite' },
  { to: '/facilities', title: 'Facilities', keywords: 'facilities labs workshop hostel infrastructure' },
  { to: '/trainers', title: 'Trainers', keywords: 'trainers instructors teachers staff' },
  { to: '/gallery', title: 'Gallery', keywords: 'gallery photos pictures images students' },
  { to: '/news', title: 'News & Notices', keywords: 'news notices announcements updates' },
  { to: '/admission', title: 'Admission', keywords: 'admission apply enroll eligibility form' },
  { to: '/faq', title: 'FAQ', keywords: 'faq questions answers help' },
  { to: '/contact', title: 'Contact', keywords: 'contact visit address phone email map' },
];

const maxPerGroup = { courses: 6, news: 4, pages: 10 };

/**
 * Global quick-search modal triggered with Ctrl/Cmd + K (or the
 * search button in the navbar). Filters courses, news and pages.
 */
export function CourseSearchModal({ open, onClose }) {
  const { courses, publishedAnnouncements, getCategoryLabel } = useContent();
  const navigate = useNavigate();
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

  const groups = useMemo(() => {
    const rowsFor = (type, items) => items.map((item) => ({ type, item }));
    if (!q.trim()) {
      return [{ key: 'courses', label: 'Courses', icon: Zap, rows: rowsFor('course', courses.slice(0, 8)) }];
    }
    const needle = q.trim().toLowerCase();

    const courseHits = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        c.shortDescription.toLowerCase().includes(needle) ||
        c.skills?.some((s) => s.toLowerCase().includes(needle))
    );

    const newsHits = publishedAnnouncements.filter(
      (a) => (a.title || '').toLowerCase().includes(needle) || (a.excerpt || '').toLowerCase().includes(needle)
    );

    const pageHits = PAGES.filter(
      (p) => p.title.toLowerCase().includes(needle) || p.keywords.includes(needle)
    );

    const groups = [];
    if (courseHits.length) groups.push({ key: 'courses', label: 'Courses', icon: Zap, rows: rowsFor('course', courseHits.slice(0, maxPerGroup.courses)) });
    if (newsHits.length) groups.push({ key: 'news', label: 'News & notices', icon: Newspaper, rows: rowsFor('news', newsHits.slice(0, maxPerGroup.news)) });
    if (pageHits.length) groups.push({ key: 'pages', label: 'Pages', icon: FileText, rows: rowsFor('page', pageHits.slice(0, maxPerGroup.pages)) });
    return groups;
  }, [q, courses, publishedAnnouncements]);

  const rows = useMemo(() => groups.flatMap((g) => g.rows), [groups]);
  const total = rows.length;

  useEffect(() => setIdx(0), [q]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, Math.max(total - 1, 0)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && rows[idx]) {
        e.preventDefault();
        onClose();
        navigate(rows[idx].item.to);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, rows, idx, total, onClose, navigate]);

  const rowIcon = (type) => (type === 'course' ? Zap : type === 'news' ? Newspaper : FileText);
  const rowSub = (type, item) => {
    if (type === 'course') return `${getCategoryLabel(item.categoryId)} · ${item.durationLabel}`;
    if (type === 'news') return `News · ${item.tag || 'Notice'}${item.date ? ` · ${String(item.date).slice(0, 10)}` : ''}`;
    return 'Page';
  };

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
                placeholder="Search courses, news, pages…"
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
              {total === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                  <SearchX className="h-8 w-8" />
                  <p className="text-sm">{'Nothing found for'} “{q}”.</p>
                </div>
              ) : (
                groups.map((group) => (
                  <div key={group.key} className="pb-1">
                    <p className="flex items-center gap-1.5 px-4 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <group.icon className="h-3.5 w-3.5" /> {group.label}
                      <span className="text-slate-300">({group.rows.length})</span>
                    </p>
                    {group.rows.map((row) => {
                      const { type, item } = row;
                      const Icon = rowIcon(type);
                      const i = rows.indexOf(row);
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={onClose}
                          onMouseEnter={() => setIdx(i)}
                          className={`flex items-center gap-3 px-4 py-2.5 transition ${i === idx ? 'bg-navy-50 dark:bg-white/10' : ''}`}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-white/10 dark:text-accent-400">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-navy-900 dark:text-white">
                              {type === 'course' ? item.title : item.title || item.to}
                            </span>
                            <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                              {rowSub(type, item)}
                            </span>
                          </span>
                          {i === idx && <CornerDownLeft className="h-4 w-4 shrink-0 text-accent-500" />}
                        </Link>
                      );
                    })}
                  </div>
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