import { Link } from 'react-router-dom';
import { Megaphone, CalendarDays, ArrowRight } from 'lucide-react';
import { announcements } from '@/data/announcements';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';

const tagTones = {
  Admission: 'green',
  Notice: 'navy',
  Event: 'amber',
  Course: 'gray',
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

/** Notice board — renders only when announcements exist. */
export function AnnouncementsSection() {
  if (announcements.length === 0) return null;
  const sorted = [...announcements].sort(
    (a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.date.localeCompare(a.date)
  );

  return (
    <section className="bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow="Notice Board"
          title="News & Announcements"
          description="Admission notices, schedules and events from the training center."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {sorted.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.08}>
              <article
                className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover dark:bg-white/[0.04] ${
                  a.pinned ? 'border-accent-400/60 dark:border-accent-500/40' : 'border-slate-200 dark:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge tone={tagTones[a.tag] || 'gray'}>{a.tag}</Badge>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(a.date)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-[17px] font-bold leading-snug text-navy-900 dark:text-white">
                  {a.pinned && <Megaphone className="mr-1.5 inline h-4 w-4 text-accent-500" aria-label="Pinned" />}
                  {a.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{a.excerpt}</p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy-700 transition-colors hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
