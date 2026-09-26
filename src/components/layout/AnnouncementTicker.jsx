import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, X, ArrowRight } from 'lucide-react';
import { useContent } from '@/content/ContentContext';

const DISMISS_KEY = 'jttc-ticker-dismissed';

/**
 * Slim slim notice bar above the navbar — cycles through the latest
 * published announcements so visitors see updates without visiting /news.
 */
export function AnnouncementTicker() {
  const { publishedAnnouncements } = useContent();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  const items = publishedAnnouncements.slice(0, 5);

  useEffect(() => {
    if (items.length < 2 || paused) return undefined;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => window.clearInterval(t);
  }, [items.length, paused]);

  useEffect(() => setIndex(0), [items.length]);

  if (hidden || items.length === 0) return null;
  const item = items[index];

  const dismiss = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative z-40 bg-navy-950 text-slate-300"
    >
      <div className="container-x flex h-9 items-center gap-3">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-navy-950">
          <Megaphone className="h-3 w-3" /> Notice
        </span>

        <Link
          to={`/news/${item.slug}`}
          className="group flex min-w-0 flex-1 items-center gap-2 text-xs font-medium"
          title={item.title}
        >
          <span className="truncate transition-colors group-hover:text-accent-400">{item.title}</span>
          <ArrowRight className="h-3 w-3 shrink-0 text-accent-400 transition-transform group-hover:translate-x-1" />
        </Link>

        {items.length > 1 && (
          <span className="hidden shrink-0 text-[10px] font-semibold text-slate-500 sm:inline">
            {index + 1} / {items.length}
          </span>
        )}

        <Link
          to="/news"
          className="hidden shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-accent-400 md:inline"
        >
          All news
        </Link>

        <button
          onClick={dismiss}
          aria-label="Hide announcements"
          title="Hide announcements"
          className="shrink-0 rounded p-1 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}