import { Info, Mail } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { TrainerCard } from '@/components/cards/TrainerCard';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { trainers } from '@/data/trainers';

export default function TrainersPage() {
  useSeo(
    'Trainers & Instructors',
    'Meet the instructors guiding practical training at Janaki Technical Training Center.'
  );

  return (
    <>
      <PageHero
        title="Our Trainers"
        description="Instructor-guided practice is at the heart of our training. Meet the team that demonstrates, corrects and coaches."
        breadcrumb={[{ label: 'Trainers' }]}
      />

      <section className="bg-slate-50 py-14 dark:bg-white/[0.02] sm:py-16">
        <div className="container-x">
          <p className="mx-auto flex max-w-2xl items-start gap-2.5 rounded-xl border border-accent-200 bg-accent-50 p-4 text-xs leading-relaxed text-accent-900 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-accent-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Trainer profiles below are clearly-marked samples for design purposes. Real instructor profiles should
            replace them in
            <code className="mx-1 rounded bg-white/60 px-1.5 py-0.5 font-mono dark:bg-white/10">src/data/trainers.js</code>
            before launch.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 0.08} className="h-full">
                <TrainerCard trainer={t} />
              </Reveal>
            ))}
          </div>

          {/* Join as trainer */}
          <Reveal delay={0.15}>
            <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:flex-row">
              <div>
                <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">
                  Are you an experienced tradesperson?
                </h2>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  We are always interested in hearing from skilled professionals who enjoy teaching the next
                  generation of technicians.
                </p>
              </div>
              <Button to="/contact" variant="accent" size="lg" className="shrink-0 group">
                <Mail className="h-4 w-4" />
                Get in Touch
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
