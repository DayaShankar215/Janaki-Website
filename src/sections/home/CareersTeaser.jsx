import { useContent } from '@/content/ContentContext';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

/** "Where can these skills take you?" — informational, no guarantees. */
export function CareersTeaser() {
  const { careerPathways, careerExamples } = useContent();
  return (
    <section className="bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Career Opportunities"
          title="Where Can These Skills Take You?"
          description="Vocational skills create multiple pathways. Where they lead depends on your effort, your trade, and your local market."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {careerPathways.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08} className="h-full">
              <article className="flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-white/[0.04]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-accent-400">
                  <DynamicIcon name={p.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-navy-900 dark:text-white">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Examples */}
        <Reveal delay={0.1}>
          <div className="mt-8 grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:p-8 md:grid-cols-2">
            {careerExamples.map((ex) => (
              <div key={ex.course}>
                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-accent-600 dark:text-accent-400">
                  {ex.course}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ex.roles.map((r) => (
                    <li
                      key={r}
                      className="rounded-full bg-navy-50 px-3 py-1.5 text-[13px] font-medium text-navy-800 dark:bg-white/10 dark:text-slate-200"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <p className="mt-6 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          These are common possibilities shared for guidance only — the center does not guarantee employment or income
          outcomes.
        </p>
      </div>
    </section>
  );
}

