import { useContent } from '@/content/ContentContext';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export function WhyChooseUs() {
  const { whyChooseUs } = useContent();
  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-24">
      <div className="absolute inset-0 hero-grid bg-grid opacity-40" aria-hidden="true" />
      <div
        className="absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-navy-600/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" aria-hidden="true" />

      <div className="container-x relative">
        <SectionHeading
          dark
          eyebrow="Why Choose Us"
          title="Training That Puts Skills First"
          description="Everything we do is designed around one idea: learners master a trade by practicing it."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08} className="h-full">
              <article className="group h-full rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-500/40 hover:bg-white/[0.08]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-navy-950 shadow-soft transition-transform group-hover:scale-110">
                  <DynamicIcon name={item.icon} className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

