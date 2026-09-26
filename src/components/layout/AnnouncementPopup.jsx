import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CalendarDays, ArrowRight, XCircle } from 'lucide-react';
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

// One flag per announcement, kept for the whole browser session, so an item is
// never shown twice during the same visit.
const SEEN_PREFIX = 'jttc-popup-seen-';

function readSeenIds() {
  const ids = [];
  try {
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(SEEN_PREFIX)) ids.push(key.slice(SEEN_PREFIX.length));
    }
  } catch {
    /* ignore */
  }
  return ids;
}

/**
 * Homepage feature popup. Shows published announcements that have
 * "Show as popup" enabled in the admin panel — newest first, once per
 * browser session per announcement.
 *
 * When several are queued, closing the current one (X / Close / backdrop /
 * Escape) shows the next one straight away. "Close all" ends the whole
 * sequence and marks the remaining items as seen so they stay away for the
 * rest of the visit.
 */
export function AnnouncementPopup() {
  const { publishedAnnouncements } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null); // announcement currently on screen
  const [visible, setVisible] = useState(false); // backdrop is on screen
  const [seenIds, setSeenIds] = useState(readSeenIds);
  const [total, setTotal] = useState(1); // size of the running sequence
  const itemRef = useRef(null);
  itemRef.current = item;

  // Only feature the popup on the homepage — that is "when a visitor first opens the website".
  const onHome = location.pathname === '/';

  // Published + flagged for the popup + has a photo, newest first, minus
  // everything already shown during this visit. Content comes from Firebase
  // whenever cloud sync is live, so unpublished items never reach the queue.
  const queue = useMemo(() => {
    return [...(publishedAnnouncements || [])]
      .filter((a) => a.popup === true && !!a.image && (a.title || '').trim())
      .filter((a) => !seenIds.includes(a.id))
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  }, [publishedAnnouncements, seenIds]);

  useBodyScrollLock(visible);

  const markSeen = (ids) => {
    const list = Array.isArray(ids) ? ids : [ids];
    if (!list.length) return;
    try {
      list.forEach((id) => sessionStorage.setItem(SEEN_PREFIX + id, '1'));
    } catch {
      /* ignore */
    }
    setSeenIds((prev) => {
      const next = [...prev];
      list.forEach((id) => {
        if (!next.includes(id)) next.push(id);
      });
      return next.length === prev.length ? prev : next;
    });
  };

  // Open the first unseen item shortly after the homepage settles — but only
  // while nothing is on screen, so it can never interrupt the current item.
  useEffect(() => {
    if (!onHome || item || !queue.length) return undefined;
    const t = window.setTimeout(() => {
      const first = queue[0];
      setTotal(queue.length);
      setItem(first);
      setVisible(true);
      markSeen(first.id);
    }, 900);
    return () => window.clearTimeout(t);
  }, [onHome, item, queue]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, item, queue]);

  // Closing the current popup shows the next queued item, or ends the sequence.
  function showNext() {
    const [next] = queue;
    if (next) {
      setItem(next);
      markSeen(next.id);
      return;
    }
    setItem(null);
  }

  // "Close all" — stop the sequence and keep the remaining items away for
  // the rest of this visit.
  function closeAll() {
    markSeen(queue.map((a) => a.id));
    setItem(null);
  }

  // If the item on screen is unpublished (or removed) while the popup is up —
  // e.g. an admin edit arriving from Firebase — move on instead of showing it.
  const onScreen = useMemo(
    () => (item ? (publishedAnnouncements || []).some((a) => a.id === item.id) : true),
    [item, publishedAnnouncements]
  );

  useEffect(() => {
    if (item && !onScreen) {
      const [next] = queue;
      if (next) {
        setItem(next);
        markSeen(next.id);
      } else {
        setItem(null);
      }
    }
  }, [item, onScreen, queue]);

  if (!onHome) return null;

  const goRead = () => {
    setItem(null);
    setVisible(false);
    navigate(`/news/${item.slug}`);
  };

  const dateText = (() => {
    if (!item) return '';
    try {
      return new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return item.date;
    }
  })();

  const position = Math.max(1, total - queue.length); // current item is already marked as seen
  const remaining = queue.length; // items still queued behind this one

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: item ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={showNext}
          role="dialog"
          aria-modal="true"
          aria-label={item ? `Featured announcement ${total > 1 ? `${position} of ${total}` : ''}: ${item.title}` : 'Featured announcement'}
        >
          {/* One card per item: closing swaps them in place, the backdrop stays. */}
          <AnimatePresence mode="wait" onExitComplete={() => { if (!itemRef.current) setVisible(false); }}>
            {item && (
              <motion.div
                key={item.id}
                role="presentation"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.18, ease: 'easeIn' } }}
                transition={{ type: 'spring', damping: 24, stiffness: 260 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-slate-900"
              >
                {/* Close — moves on to the next announcement */}
                <button
                  type="button"
                  onClick={showNext}
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
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge tone={tagTones[item.tag] || 'gray'}>{item.tag}</Badge>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" /> {dateText}
                      </span>
                    </div>
                    {total > 1 && (
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-white/5 dark:text-slate-400">
                        {position} of {total}
                      </span>
                    )}
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
                    <div className="flex items-center gap-3">
                      {remaining > 0 && (
                        <button
                          type="button"
                          data-testid="popup-close-all"
                          onClick={closeAll}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-red-500"
                        >
                          <XCircle className="h-4 w-4" /> Close all
                        </button>
                      )}
                      <button
                        type="button"
                        data-testid="popup-close"
                        onClick={showNext}
                        className="text-sm font-semibold text-slate-500 transition hover:text-navy-800 dark:hover:text-slate-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {item.isSample && (
                    <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400">
                      This is a sample announcement. You can edit or remove it from the admin panel (News & Notices → popup option).
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
