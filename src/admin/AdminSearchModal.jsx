import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, CornerDownLeft, SearchX, BookOpen, Users, Building2, Image as ImageIcon, MessageSquareQuote, Megaphone, HelpCircle, Settings } from 'lucide-react';
import { useContent } from '@/content/ContentContext';

const COLLECTIONS = [
  { key: 'settings', label: 'Site Settings', icon: Settings, section: null },
  { key: 'courses', label: 'Courses', icon: BookOpen, section: 'courses', idKey: 'slug', displayKey: 'title' },
  { key: 'trainers', label: 'Trainers', icon: Users, section: 'trainers', idKey: 'id', displayKey: 'name' },
  { key: 'facilities', label: 'Facilities', icon: Building2, section: 'facilities', idKey: 'id', displayKey: 'name' },
  { key: 'gallery', label: 'Gallery', icon: ImageIcon, section: 'galleryItems', idKey: 'id', displayKey: 'title' },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, section: 'testimonials', idKey: 'id', displayKey: 'name' },
  { key: 'announcements', label: 'News & Notices', icon: Megaphone, section: 'announcements', idKey: 'id', displayKey: 'title' },
  { key: 'faqs', label: 'FAQs', icon: HelpCircle, section: 'faqs', idKey: 'id', displayKey: 'question' },
];

/**
 * Ctrl/Cmd + K search across every admin collection. Enter jumps straight to
 * the tab with that entry selected for editing.
 */
export default function AdminSearchModal({ open, onClose, onPick }) {
  const content = useContent();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (open) {
      setQ('');
      setIdx(0);
      const t = window.setTimeout(() => document.getElementById('admin-search-input')?.focus(), 50);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open]);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = [];
    for (const c of COLLECTIONS) {
      if (!c.section) {
        if (needle && c.label.toLowerCase().includes(needle)) {
          out.push({ key: c.key, label: c.label, icon: c.icon, rows: [{ tab: c.key, id: null }] });
        }
        continue;
      }
      const items = content[c.section] || [];
      const hits = !needle
        ? []
        : items.filter((it) => String(it[c.displayKey] || '').toLowerCase().includes(needle) || String(it[c.idKey] || '').toLowerCase().includes(needle));
      if (hits.length) {
        out.push({
          key: c.key,
          label: c.label,
          icon: c.icon,
          rows: hits.slice(0, 5).map((it) => ({ tab: c.key, id: it[c.idKey], title: it[c.displayKey] || it[c.idKey] })),
        });
      }
    }
    if (!needle) {
      // No query: offer the sections themselves as a quick launcher.
      return COLLECTIONS.map((c) => ({ key: c.key, label: c.label, icon: c.icon, rows: [{ tab: c.key, id: null }] }));
    }
    return out;
  }, [q, content]);

  const rows = useMemo(() => groups.flatMap((g) => g.rows), [groups]);

  useEffect(() => setIdx(0), [q]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, Math.max(rows.length - 1, 0)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && rows[idx]) {
        e.preventDefault();
        onPick(rows[idx]);
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, rows, idx, onClose, onPick]);

  return createPortal(
    <AnimatePresenceShim open={open}>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-navy-950/60 p-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-white/10">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                id="admin-search-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search all content — courses, news, trainers, FAQs…"
                className="h-14 w-full bg-transparent text-base text-navy-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <button onClick={onClose} aria-label="Close search" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-2">
              {rows.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                  <SearchX className="h-8 w-8" />
                  <p className="text-sm">{'Nothing matches'} “{q}”.</p>
                </div>
              ) : (
                groups.map((g) => (
                  <div key={g.key} className="pb-1">
                    <p className="flex items-center gap-1.5 px-4 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <g.icon className="h-3.5 w-3.5" /> {g.label} <span className="text-slate-300">({g.rows.length})</span>
                    </p>
                    {g.rows.map((row) => {
                      const i = rows.indexOf(row);
                      return (
                        <button
                          key={`${row.tab}-${row.id || 'tab'}`}
                          onClick={() => { onPick(row); onClose(); }}
                          onMouseEnter={() => setIdx(i)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${i === idx ? 'bg-navy-50 dark:bg-white/10' : ''}`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-white/10 dark:text-accent-400">
                            <g.icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-navy-900 dark:text-white">
                            {row.title || `${g.label} — open tab`}
                          </span>
                          {i === idx && <CornerDownLeft className="h-4 w-4 shrink-0 text-accent-500" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-400 dark:border-white/10">
              <span className="flex items-center gap-1">↑↓ navigate</span>
              <span className="flex items-center gap-1">↵ open &amp; edit</span>
              <span className="flex items-center gap-1">esc close</span>
            </div>
          </div>
        </div>
      )}
    </AnimatePresenceShim>,
    document.body
  );
}

function AnimatePresenceShim({ open, children }) {
  if (!open) return null;
  return children;
}
