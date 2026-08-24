import { Link } from 'react-router-dom';
import { Clock, Gauge, ArrowRight, Send } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/Badge';
import { getCategoryLabel } from '@/data/categories';

export function CourseCard({ course }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-white/[0.04]">
      <div className="relative">
        <SmartImage
          src={course.image}
          alt={course.title}
          aspect="aspect-[16/10]"
          wrapperClassName="rounded-t-2xl"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-navy-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-400 backdrop-blur-sm">
            {getCategoryLabel(course.categoryId)}
          </span>
        </div>
        {!course.active && (
          <div className="absolute inset-0 flex items-end justify-start bg-navy-950/40 p-3">
            <Badge tone="gray" className="bg-navy-950/85 text-slate-200 backdrop-blur-sm">
              Not currently enrolling
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
          <Link to={`/courses/${course.slug}`} className="transition-colors hover:text-navy-600 dark:hover:text-accent-300">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {course.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-navy-500 dark:text-navy-300" />
            {course.durationLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-navy-500 dark:text-navy-300" />
            {course.level}
          </span>
          {course.practicalFocus && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              Hands-on practical
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2 pt-1">
          <Link
            to={`/courses/${course.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-navy-200 px-3 py-2 text-sm font-semibold text-navy-800 transition-colors hover:border-navy-500 hover:bg-navy-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={`/contact?course=${course.slug}`}
            aria-label={`Enquire about ${course.title}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-600 dark:bg-navy-500 dark:hover:bg-navy-400"
          >
            <Send className="h-4 w-4" />
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
