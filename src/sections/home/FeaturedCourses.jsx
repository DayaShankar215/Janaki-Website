import { ArrowRight } from 'lucide-react';
import { courses } from '@/data/courses';
import { CourseCard } from '@/components/cards/CourseCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

/** Featured (currently enrolling) courses on the homepage. */
export function FeaturedCourses() {
  const active = courses.filter((c) => c.active).slice(0, 6);
  const featured = active.length > 0 ? active : courses.slice(0, 6);

  return (
    <section className="bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Training Programs"
          title="Popular Vocational Courses"
          description="Practical, career-focused training programs taught in workshop environments by experienced instructors."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course, i) => (
            <Reveal key={course.slug} delay={(i % 3) * 0.08} className="h-full">
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button to="/courses" variant="primary" size="lg" className="group">
            View All Courses
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
