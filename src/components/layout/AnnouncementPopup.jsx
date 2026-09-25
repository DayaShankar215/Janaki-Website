import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CalendarDays, ArrowRight } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { Badge } from '@/components/ui/Badge';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

const tagTones = {
  Admission: 'green',
  Notice: 'navy',
  Event: 'amber',
  News: 'green',
  Achievement: 'amber',
  Update: 'gray',
};

/**
 * Homepage feature popup. Shows the newest published announcement that
 * has "Show as popup" enabled in the admin panel — once per browser
 * session per announcement (id).
 */
export function AnnouncementPopup() {
  const { publishedAnnouncements } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Only feature the popup on the homepage — that is "when a visitor first opens the website".
  const onHome = location.pathname === '/';
  const item = useMemo(
    () =>
      [...(publishedAnnouncements || [])]
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
        .find((a) => a.popup === true && !!a.image),
    [publishedAnnouncements]
  );

  useBodyScrollLock(open);

  useEffect(() => {
    if (!onHome || !item) return undefined;
    const key = `jttc-popup-seen-${item.id}`;
    if (sessionStorage.getItem(key)) return undefined;
    const t = window.setTimeout(() => {
      sessionStorage.setItem(key, '1');
      setOpen(true);
    }, 900);
    return () => window.clearTimeout(t);
  }, [onHome, item?.id]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!onHome || !item || !open) return null;

  const goRead = () => {
    setOpen(false);
    navigate(`/news/${item.slug}`);
  };

  const dateText = (() => {
    try {
      return new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return item.date;
    }
  })();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label={`Featured announcement: ${item.title}`}
      >
        <motion.div
          role="presentation"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-slate-900"
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close announcement"
            className="announcement-popup-close absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/60 text-white backdrop-blur-sm transition hover:bg-navy-950"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image */}
          {item.image && (
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center gap-2">
              <Badge tone={tagTones[item.tag] || 'gray'}>{item.tag}</Badge>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" /> {dateText}
              </span>
            </div>
            <h2 className="mt-3 font-display text-xl font-bold leading-snug text-navy-900 dark:text-white">{item.title}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {item.excerpt || item.description}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goRead}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-accent-400"
              >
                Read full notice <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-slate-500 transition hover:text-navy-800 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>

            {item.isSample && (
              <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400">
                This is a sample announcement. You can edit or remove it from the admin panel (News & Notices → popup option).
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}