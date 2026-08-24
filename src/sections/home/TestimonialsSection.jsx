import { testimonials } from '@/data/testimonials';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function TestimonialsSection() {
  return (
    <section className="bg-white py-16 dark:bg-navy-950 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Student Voices"
          title="What Trainees Say"
          description="Experiences shared by the people who matter most — our trainees."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="h-full">
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
