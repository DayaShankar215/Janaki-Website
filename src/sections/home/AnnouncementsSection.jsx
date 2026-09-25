import { Link } from 'react-router-dom';
import { Megaphone, CalendarDays, ArrowRight, ImageIcon } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';

const tagTones = {
  Admission: 'green',
  Notice: 'navy',
  Event: 'amber',
  News: 'green',
  Achievement: 'amber',
  Update: 'gray',
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

/** News & notices board — only published items, newest first. */
export function AnnouncementsSection() {
  const { publishedAnnouncements } = useContent();
  if (!publishedAnnouncements || publishedAnnouncements.length === 0) return null;
  const latest = [...publishedAnnouncements]
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
    .slice(0, 3);

  return (
    <section className="bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-20">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Stay Informed"
            title="Latest News & Notices"
            description="Admission notices, events and announcements from the training center."
            className="max-w-2xl"
          />
          <Reveal delay={0.1} className="shrink-0 pb-1">
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 px-4 py-2 text-sm font-bold text-navy-800 transition-colors hover:border-navy-500 hover:bg-navy-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              {'All news & notices'} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {latest.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.08} className="h-full">
              <article
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:bg-white/[0.04] ${
                  a.pinned ? 'border-accent-400/60 dark:border-accent-500/40' : 'border-slate-200 dark:border-white/10'
                }`}
              >
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
                        <Megaphone className="h-3 w-3" />
                        {'Pinned'}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="flex items-center justify-between bg-navy-50 px-4 py-3 dark:bg-white/[0.05]">
                    <Badge tone={tagTones[a.tag] || 'gray'}>{a.tag}</Badge>
                    {a.pinned && <Megaphone className="h-4 w-4 text-accent-500" aria-label="Pinned" />}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    {!a.image && null}
                    <Badge tone={tagTones[a.tag] || 'gray'}>{a.tag}</Badge>
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
                    {'Read more'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}