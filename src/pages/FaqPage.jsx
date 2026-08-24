import { MessageCircleQuestion } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { useContent } from '@/content/ContentContext';

const categoryOrder = ['General', 'Courses', 'Admission'];

export default function FaqPage() {
  const { faqs } = useContent();
  useSeo(
    'Frequently Asked Questions',
    'Answers about training programs, eligibility, durations, practical training, enrollment and contacting Janaki Technical Training Center.'
  );

  const grouped = categoryOrder
    .map((cat) => ({ cat, items: faqs.filter((f) => f.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        description="Quick answers about our programs, admissions and how to reach us."
        breadcrumb={[{ label: 'FAQ' }]}
      />

      <section className="bg-white py-14 dark:bg-navy-950 sm:py-16">
        <div className="container-x max-w-3xl">
          {grouped.map((group, gi) => (
            <div key={group.cat} className={gi > 0 ? 'mt-12' : ''}>
              <h2 className="mb-5 flex items-center gap-2.5 font-display text-sm font-bold uppercase tracking-[0.16em] text-accent-600 dark:text-accent-400">
                <MessageCircleQuestion className="h-4 w-4" />
                {group.cat}
              </h2>
              <Reveal delay={gi * 0.06}>
                <FaqAccordion items={group.items} />
              </Reveal>
            </div>
          ))}

          {/* Still have questions */}
          <Reveal delay={0.1}>
            <div className="mt-14 rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-8 text-center shadow-card">
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Still have questions?</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                Send us your question directly — we are happy to help you choose the right program.
              </p>
              <Button to="/contact" variant="accent" size="lg" className="mt-6">
                Contact Us →
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

