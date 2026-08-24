import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Gauge,
  Send,
  Wrench,
  Briefcase,
  ClipboardList,
  GraduationCap,
  CheckCircle2,
  CircleAlert,
} from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { CourseCard } from '@/components/cards/CourseCard';
import NotFoundPage from './NotFoundPage';
import { getCourseBySlug, getRelatedCourses } from '@/data/courses';
import { getCategoryLabel } from '@/data/categories';

function DetailBlock({ icon: Icon, title, children }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-navy-900 dark:text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-accent-400">
          <Icon className="h-5 w-5" />
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const course = getCourseBySlug(slug);

  // Hooks must run unconditionally — call useSeo with computed values
  useSeo(
    course ? course.title : 'Course Not Found',
    course ? course.shortDescription : undefined
  );

  if (!course) return <NotFoundPage />;

  const related = getRelatedCourses(course);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 hero-grid bg-grid opacity-40" aria-hidden="true" />
        <div className="container-x relative py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-accent-400">Home</Link></li>
              <li aria-hidden="true"><ArrowRight className="inline h-3.5 w-3.5" /></li>
              <li><Link to="/courses" className="hover:text-accent-400">Courses</Link></li>
              <li aria-hidden="true"><ArrowRight className="inline h-3.5 w-3.5" /></li>
              <li><span className="text-slate-300" aria-current="page">{course.title}</span></li>
            </ol>
          </nav>

          <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="amber">{getCategoryLabel(course.categoryId)}</Badge>
                {course.active ? (
                  <Badge tone="green">Currently enrolling</Badge>
                ) : (
                  <Badge tone="gray">Not currently enrolling</Badge>
                )}
              </div>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                {course.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{course.shortDescription}</p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent-400" /> {course.durationLabel}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-accent-400" /> {course.level}
                </span>
                {course.practicalFocus && (
                  <span className="inline-flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-accent-400" /> Hands-on practical training
                  </span>
                )}
              </div>
            </div>

            <SmartImage
              src={course.image}
              alt={course.title}
              aspect="aspect-[4/3]"
              wrapperClassName="rounded-3xl shadow-card-hover ring-1 ring-white/15"
              priority
            />
          </div>
        </div>
      </section>

      {!course.active && (
        <div className="container-x pt-6">
          <p className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <CircleAlert className="h-5 w-5 shrink-0" />
            This program is listed for information only and is not currently open for enrollment. Contact us to ask
            about upcoming batches.
          </p>
        </div>
      )}

      {/* Body */}
      <section className="bg-white pb-20 pt-10 dark:bg-navy-950">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          {/* Main content */}
          <article>
            <DetailBlock icon={GraduationCap} title="Overview">
              <div className="space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {course.overview.map((para) => (
                  <p key={para.slice(0, 32)}>{para}</p>
                ))}
              </div>
            </DetailBlock>

            <DetailBlock icon={CheckCircle2} title="What You Will Learn">
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {course.skills.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-slate-200"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </DetailBlock>

            <DetailBlock icon={Wrench} title="Practical Skills You Practice">
              <ul className="space-y-2.5">
                {course.practicalSkills.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </DetailBlock>

            <DetailBlock icon={ClipboardList} title="Eligibility">
              <ul className="space-y-2.5">
                {course.eligibility.map((e) => (
                  <li key={e} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-navy-500 dark:text-accent-400" />
                    {e}
                  </li>
                ))}
              </ul>
            </DetailBlock>

            <DetailBlock icon={Wrench} title="Tools & Equipment You Will Use">
              <div className="flex flex-wrap gap-2">
                {course.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </DetailBlock>

            <DetailBlock icon={Briefcase} title="Career Opportunities">
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {course.careers.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2.5 rounded-xl bg-gradient-to-r from-navy-50 to-transparent p-3 text-sm font-medium text-navy-900 dark:from-white/[0.05] dark:to-transparent dark:text-slate-200"
                  >
                    <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-accent-600 dark:text-accent-400" />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Career examples are informational — they describe common pathways in this trade, not guaranteed
                placements.
              </p>
            </DetailBlock>
          </article>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04]">
              <h2 className="font-display text-lg font-bold text-navy-900 dark:text-white">Course Summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ['Category', getCategoryLabel(course.categoryId)],
                  ['Duration', course.durationLabel],
                  ['Skill level', course.level],
                  ['Format', 'Workshop-based practical training'],
                  ['Status', course.active ? 'Open for enrollment' : 'Not currently running'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-3 last:border-0 dark:border-white/[0.07]">
                    <dt className="font-medium text-slate-500 dark:text-slate-400">{label}</dt>
                    <dd className="text-right font-semibold text-navy-900 dark:text-white">{value}</dd>
                  </div>
                ))}
              </dl>

              <Button
                to={`/contact?course=${course.slug}`}
                variant="accent"
                size="lg"
                className="mt-5 w-full group"
              >
                <Send className="h-4 w-4" />
                Enquire About This Course
              </Button>
              <Button to="/admission" variant="outline" size="md" className="mt-3 w-full">
                See Admission Process
              </Button>
            </div>

            <Link
              to="/courses"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy-700 hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all courses
            </Link>
          </aside>
        </div>

        {/* Related courses */}
        {related.length > 0 && (
          <div className="container-x mt-20">
            <Reveal>
              <SectionHeadingSmall />
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.08} className="h-full">
                  <CourseCard course={c} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function SectionHeadingSmall() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-3xl">
        Related Training Programs
      </h2>
      <Link to="/courses" className="group inline-flex items-center gap-1.5 text-sm font-bold text-navy-700 hover:text-accent-600 dark:text-accent-400">
        View all courses
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
