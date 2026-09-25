import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight, Megaphone } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { useContent } from '@/content/ContentContext';
import { cn } from '@/utils/cn';

const tagTones = {
  Admission: 'green',
  Notice: 'navy',
  Event: 'amber',
  News: 'green',
  Achievement: 'amber',
  Update: 'gray',
};

const toneClasses = {
  gray: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  navy: 'bg-navy-50 text-navy-700 dark:bg-navy-500/20 dark:text-navy-200',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

/** Public news & notices board — only published items. */
export default function NewsPage() {
  const { publishedAnnouncements } = useContent();
  useSeo(
    'News & Notices',
    'Admission notices, events and announcements from Janaki Technical Training Center (JTTC).'
  );

  const [filter, setFilter] = useState('All');

  const tags = useMemo(() => {
    const set = new Set(publishedAnnouncements.map((a) => a.tag).filter(Boolean));
    return ['All', ...set];
  }, [publishedAnnouncements]);

  const items = useMemo(
    () => (filter === 'All' ? publishedAnnouncements : publishedAnnouncements.filter((a) => a.tag === filter)),
    [publishedAnnouncements, filter]
  );

  return (
    <>
      <PageHero
        title="News & Notices"
        description="Admission notices, events and announcements from the training center."
        breadcrumb={[{ label: 'News & Notices' }]}
      />

      <section className="bg-slate-50 py-14 dark:bg-white/[0.02] sm:py-16">
        <div className="container-x">
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter news by category">
            {tags.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  filter === cat
                    ? 'border-navy-700 bg-navy-700 text-white shadow-soft dark:border-accent-500 dark:bg-accent-500 dark:text-navy-950'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-800 dark:border-white/15 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/40'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="mt-12 text-center text-slate-500 dark:text-slate-400">
              No notices in this category yet. Check back soon.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 0.06} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-white/[0.04]">
                    {a.image ? (
                      <Link to={`/news/${a.slug}`} className="relative block overflow-hidden" tabIndex={-1}>
                        <img
                          src={a.image}
                          alt={a.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                        {a.pinned && (
                          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-accent-500 px-2.5 py-1 text-[11px] font-bold text-navy-950">
                            <Megaphone className="h-3 w-3" /> Pinned
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between bg-navy-50 px-4 py-3 dark:bg-white/[0.05]">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', toneClasses[tagTones[a.tag] || 'gray'])}>
                          {a.tag}
                        </span>
                        {a.pinned && <Megaphone className="h-4 w-4 text-accent-500" aria-label="Pinned" />}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2">
                        {a.image ? (
                          <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', toneClasses[tagTones[a.tag] || 'gray'])}>
                            {a.tag}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(a.date)}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-[17px] font-bold leading-snug text-navy-900 dark:text-white">
                        <Link to={`/news/${a.slug}`} className="transition-colors hover:text-navy-600 dark:hover:text-accent-300">
                          {a.title}
                        </Link>
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{a.excerpt}</p>
                      <Link
                        to={`/news/${a.slug}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy-700 transition-colors hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300"
                      >
                        Read full notice <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}