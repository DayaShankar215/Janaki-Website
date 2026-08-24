import { CheckCircle2 } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { MethodologySection } from '@/sections/home/MethodologySection';
import { CTASection } from '@/sections/home/CTASection';

const practiceAreas = [
  {
    name: 'Electrical Practice',
    description: 'Wiring boards, installation panels and measuring instruments for safe, repeated hands-on practice.',
    icon: 'zap',
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=70',
  },
  {
    name: 'Plumbing Practice',
    description: 'Water supply and drainage demo lines where trainees cut, join and test real pipework.',
    icon: 'droplets',
    image:
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=70',
  },
  {
    name: 'Welding Bays',
    description: 'Individual bays with machines, ventilation and full protective equipment for arc and gas work.',
    icon: 'flame',
    image:
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=70',
  },
  {
    name: 'Construction Yard',
    description: 'Masonry walls, bar-bending stations and formwork assembly at working scale.',
    icon: 'construction',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=70',
  },
  {
    name: 'Computer Laboratory',
    description: 'Practice systems for hardware assembly, OS installation and office applications.',
    icon: 'monitor',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=70',
  },
  {
    name: 'Kitchen & Service Practice',
    description: 'Food production and service training that mirrors the pace of commercial hospitality.',
    icon: 'chef-hat',
    image:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=70',
  },
];

const principles = [
  'Every concept is demonstrated before it is practiced',
  'Trainees repeat tasks until movements become confident habits',
  'Instructors correct technique early, before errors become routine',
  'Safety rules are practiced as seriously as the skills themselves',
];

export default function PracticalTrainingPage() {
  useSeo(
    'Practical Training — Learn by Doing',
    'Hands-on vocational training at Janaki Technical Training Center: workshop practice in electrical, plumbing, welding, construction, computer and hospitality skills.'
  );

  return (
    <>
      <PageHero
        title="Practical Training"
        description="At our center, learning means doing. Here is how workshop-based training builds real, workplace-ready skills."
        breadcrumb={[{ label: 'Practical Training' }]}
      />

      {/* Intro + principles */}
      <section className="bg-white py-16 dark:bg-navy-950 sm:py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our Approach"
              title="Skills Are Built in the Workshop, Not Just the Classroom"
            />
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Reading about wiring is not the same as wiring a board. Watching a weld is not the same as striking an
              arc. That is why every one of our programs is built around supervised practice with the actual tools
              and materials of the trade.
            </p>
            <ul className="mt-6 space-y-3">
              {principles.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] font-medium text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <Reveal>
            <img
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1100&q=72"
              alt="Trainee practicing with technical equipment under supervision"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card-hover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* Practice areas */}
      <section className="bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Practice Areas"
            title="Dedicated Spaces for Every Trade"
            description="Each area is set up for safe, repeated practice of core trade skills."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area, i) => (
              <Reveal key={area.name} delay={(i % 3) * 0.08} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-white/[0.04]">
                  <img
                    src={area.image}
                    alt={area.name}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-navy-600 to-navy-800 text-accent-400 shadow-soft">
                      <DynamicIcon name={area.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-navy-900 dark:text-white">{area.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{area.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MethodologySection />

      <section className="bg-white py-12 text-center dark:bg-navy-950">
        <Button to="/gallery" variant="outline" size="lg">
          See Training Photos →
        </Button>
      </section>

      <CTASection />
    </>
  );
}
