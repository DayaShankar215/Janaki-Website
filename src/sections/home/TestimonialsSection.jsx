import { useContent } from '@/content/ContentContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function TestimonialsSection() {
  const { t } = useLanguage();
  const { testimonials } = useContent();
  return (
    <section className="bg-white py-16 dark:bg-navy-950 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow={t('home.testimonialsEyebrow')}
          title={t('home.testimonialsTitle')}
          description={t('home.testimonialsDesc')}
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

