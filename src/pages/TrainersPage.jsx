import { Mail } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { TrainerCard } from '@/components/cards/TrainerCard';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { useContent } from '@/content/ContentContext';

export default function TrainersPage() {
  const { trainers } = useContent();
  useSeo(
    'Trainers & Instructors',
    'Meet the instructors guiding practical training at Janaki Technical Training Center.'
  );

  return (
    <>
      <PageHero
        title="Our Trainers"
        description="Experienced instructors guide trainees step by step through every trade."
        breadcrumb={[{ label: 'Trainers' }]}
      />

      <section className="bg-slate-50 py-14 dark:bg-white/[0.02] sm:py-16">
        <div className="container-x">
          {trainers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trainers.map((t, i) => (
                <Reveal key={t.id} delay={(i % 3) * 0.08} className="h-full">
                  <TrainerCard trainer={t} />
                </Reveal>
              ))}
            </div>
          ) : (
            /* No invented profiles: say what trainees can expect instead. */
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:p-10">
              <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">
                Instructor profiles are being published
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                We would rather show you nothing than make up a name. Every trainer who takes a class here is a
                certified tradesperson with real field experience, and we publish their full profile — certifications,
                specialisations and the courses they teach — before their first intake.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Certified in the trade they teach',
                  'Field experience, not only classroom theory',
                  'Practical workshop assessment every intake',
                  'Small batches so nobody gets left behind',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/admission" variant="accent">
                  How admission works
                </Button>
                <Button to="/courses" variant="outline">
                  Browse programs
                </Button>
              </div>
            </div>
          )}

          {/* Join as trainer */}
          <Reveal delay={0.15}>
            <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:flex-row">
              <div>
<h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">
                  Are you an experienced tradesperson?
                </h2>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  We are always interested in hearing from skilled professionals who enjoy teaching the next generation of technicians.
                </p>
              </div>
              <Button to="/contact" variant="accent" size="lg" className="shrink-0 group">
                <Mail className="h-4 w-4" />
                Contact us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
