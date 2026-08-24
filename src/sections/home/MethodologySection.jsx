import { methodologySteps } from '@/data/misc';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

/** The 5-step training methodology: Learn → Practice → Build → Improve → Prepare. */
export function MethodologySection() {
  return (
    <section className="bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Training Methodology"
          title="How Our Training Works"
          description="A simple, proven cycle that takes learners from first principles to workplace-ready skills."
        />

        <ol className="relative mt-14 grid gap-6 md:grid-cols-3 xl:grid-cols-5">
          {/* connecting line (desktop) */}
          <div
            className="absolute left-0 right-0 top-9 hidden h-0.5 bg-gradient-to-r from-navy-200 via-navy-300 to-accent-400 dark:from-white/10 dark:via-white/20 dark:to-accent-500/50 xl:block"
            aria-hidden="true"
          />
          {methodologySteps.map((step, i) => (
            <li key={step.step} className="relative">
              <Reveal delay={i * 0.1} className="h-full">
                <article className="group flex h-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-navy-300 hover:shadow-card-hover dark:border-white/10 dark:bg-navy-900 dark:hover:border-accent-500/40">
                  <span className="relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-gradient-to-br from-navy-600 to-navy-900 text-accent-400 shadow-card transition-transform group-hover:scale-110 dark:from-navy-500 dark:to-navy-800">
                    <DynamicIcon name={step.icon} className="h-7 w-7" strokeWidth={1.6} />
                  </span>
                  <p className="mt-4 font-display text-sm font-extrabold tracking-[0.25em] text-slate-300 dark:text-slate-500">
                    {step.step}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-navy-900 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.description}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
