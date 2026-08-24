import { Target, Eye, Info } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { values, whyChooseUs } from '@/data/misc';
import { siteConfig } from '@/config/siteConfig';

const IMG =
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1100&q=72';

export default function AboutPage() {
  useSeo(
    'About Us',
    'Learn about Janaki Technical Training Center Pvt. Ltd. — our mission, vision and values as a practical technical and vocational training institution.'
  );

  return (
    <>
      <PageHero
        title="About Our Training Center"
        description="A technical and vocational training institution built around one belief: real skills are learned by doing."
        breadcrumb={[{ label: 'About' }]}
      />

      {/* Who we are */}
      <section className="bg-white py-16 dark:bg-navy-950 sm:py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative">
              <img
                src={IMG}
                alt="Technical instructor demonstrating equipment"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card-hover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div
                className="absolute -bottom-6 -right-3 rounded-2xl bg-accent-500 px-5 py-4 shadow-card-hover sm:-right-6"
              >
                <p className="font-display text-lg font-extrabold leading-tight text-navy-950">Skills +</p>
                <p className="font-display text-lg font-extrabold leading-tight text-navy-950">Opportunity</p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading align="left" eyebrow="Who We Are" title="Practical Training for Real Work" />
            <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                <strong className="font-semibold text-navy-900 dark:text-white">{siteConfig.name}</strong> is a
                technical and vocational training institution dedicated to hands-on skill development. We offer
                training across trades such as electrical work, plumbing, construction, welding, computer skills,
                hospitality, agriculture and tailoring.
              </p>
              <p>
                Every program is designed around workshop practice — trainees handle the tools, materials and
                equipment of their trade under the guidance of experienced instructors. The goal is simple:
                graduates who can do the work, not just describe it.
              </p>
            </div>

            {/* Affiliation / accreditation — only shown if configured */}
            {siteConfig.affiliations.length > 0 ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                  <Info className="h-4 w-4" /> Recognition &amp; Affiliation
                </h3>
                <ul className="mt-3 space-y-2">
                  {siteConfig.affiliations.map((a) => (
                    <li key={a.label} className="text-sm text-emerald-900 dark:text-emerald-200">
                      <span className="font-bold">{a.label}:</span> {a.detail}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Direction" title="Our Mission & Vision" />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card dark:border-white/10 dark:bg-white/[0.04]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-accent-400 shadow-soft">
                  <Target className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-navy-900 dark:text-white">Our Mission</h3>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {[
                    'Deliver practical, employment-oriented technical training',
                    'Develop technical competence and workplace discipline',
                    'Support career development and self-employment pathways',
                    'Make quality vocational education accessible to all learners',
                  ].map((m) => (
                    <li key={m} className="flex gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                      {m}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card dark:border-white/10 dark:bg-white/[0.04]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-navy-950 shadow-soft">
                  <Eye className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-navy-900 dark:text-white">Our Vision</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  To be a trusted center of vocational excellence — producing skilled, capable human resources who
                  strengthen their families, communities and the industries they serve.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  We envision every graduate leaving with more than a certificate: a trade they can practice with
                  pride and confidence.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 dark:bg-navy-950 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="What Guides Us"
            title="Our Core Values"
            description="The principles behind every class, demonstration and assessment."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 0.06} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition-all hover:-translate-y-1 hover:shadow-card dark:border-white/10 dark:bg-white/[0.04]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-accent-400">
                    <DynamicIcon name={v.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display text-[15px] font-bold text-navy-900 dark:text-white">{v.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">{v.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose (reuse) + CTA */}
      <section className="bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="The JTTC Way"
            title="Why Trainees Choose Us"
            description="Six reasons learners pick up a trade with us."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.08} className="h-full">
                <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-accent-400 shadow-soft">
                    <DynamicIcon name={item.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button to="/courses" variant="accent" size="lg" className="group">
              Explore Our Courses →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
