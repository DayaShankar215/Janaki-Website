import { useRef, useState } from 'react';
import { Clock3, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/content/ContentContext';
import { useRecentCourseSlugs } from '@/hooks/useRecentlyViewed';
import { CourseCard } from '@/components/cards/CourseCard';
import { Reveal } from '@/components/ui/Reveal';

/** "Continue exploring" strip for the homepage — courses you viewed recently. */
export function RecentlyViewedCourses({ max = 4 }) {
  const { courses, getCourseBySlug } = useContent();
  const slugs = useRecentCourseSlugs(6);
  const recent = slugs.map(getCourseBySlug).filter(Boolean).slice(0, max);

  if (recent.length === 0) return null;

  return (
    <section className="bg-slate-50 py-14 dark:bg-white/[0.02] sm:py-16">
      <div className="container-x">
        <Reveal>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
                <Clock3 className="h-4 w-4" /> Continue exploring
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-3xl">
                Recently viewed courses
              </h2>
            </div>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((course, i) => (
            <Reveal key={course.slug} delay={i * 0.06}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Small breadcrumb-like "viewed" strip used on course detail pages. */
export function RecentStrip({ currentSlug }) {
  const { getCourseBySlug } = useContent();
  const [hidden, setHidden] = useState(false);
  const slugs = useRecentCourseSlugs(4).filter((s) => s !== currentSlug && getCourseBySlug(s));
  const ref = useRef(null);
  if (hidden || slugs.length === 0) return null;
  const items = slugs.slice(0, 3);

  return (
    <div ref={ref} className="container-x sticky top-20 z-30 mt-4 hidden lg:block">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 shadow-soft backdrop-blur dark:border-white/10 dark:bg-navy-900/85">
        <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Eye className="h-3.5 w-3.5" /> Recently viewed
        </span>
        {items.map((slug) => {
          const c = getCourseBySlug(slug);
          if (!c) return null;
          return (
            <Link
              key={slug}
              to={`/courses/${slug}`}
              className="max-w-[180px] truncate rounded-md bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-700 transition hover:bg-accent-500 hover:text-navy-950 dark:bg-white/10 dark:text-slate-200"
            >
              {c.title}
            </Link>
          );
        })}
        <button onClick={() => setHidden(true)} aria-label="Dismiss recently viewed"
          className="ml-auto rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}