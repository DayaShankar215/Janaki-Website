import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, CheckCircle2 } from 'lucide-react';
import { values } from '@/data/misc';
import { siteConfig } from '@/config/siteConfig';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

const missionPoints = [
  'Deliver practical, hands-on technical training',
  'Build employable, industry-relevant skills',
  'Develop technical competence and confidence',
  'Support career development for every learner',
  'Make quality vocational education accessible',
];

const IMG_MAIN =
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=72';
const IMG_SMALL =
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=700&q=70';

export function AboutPreview() {
  return (
    <section className="bg-white py-16 dark:bg-navy-950 sm:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image collage */}
        <Reveal className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border-2 border-accent-400/50 dark:border-accent-500/30" aria-hidden="true" />
          <img
            src={IMG_MAIN}
            alt="Instructor guiding trainees through technical practice"
            loading="lazy"
            className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-card-hover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <img
            src={IMG_SMALL}
            alt="Welding practice at the workshop"
            loading="lazy"
            className="absolute -bottom-8 -right-4 hidden w-44 rounded-2xl object-cover shadow-card-hover ring-8 ring-white dark:ring-navy-950 sm:block aspect-square"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </Reveal>

        {/* Content */}
        <div>
          <SectionHeading
            align="left"
            eyebrow="About Our Center"
            title="A Center Dedicated to Practical Skill Development"
            className="[&>p]:mt-3"
          />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              <strong className="font-semibold text-navy-900 dark:text-white">{siteConfig.name}</strong> is a
              technical and vocational training institution focused on hands-on skill development. We prepare
              learners for real work â€” in workshops, on sites, and in service businesses.
            </p>

            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy-900 dark:text-white">
                  <Target className="h-5 w-5 text-accent-500" />
                  Our Mission
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Equip learners with practical skills, technical competence, and the confidence to build careers.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy-900 dark:text-white">
                  <Eye className="h-5 w-5 text-accent-500" />
                  Our Vision
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  To produce skilled, capable human resources who strengthen communities and industries.
                </p>
              </div>
            </div>

            <ul className="grid gap-x-6 gap-y-2 pt-1 sm:grid-cols-2">
              {missionPoints.map((m) => (
                <li key={m} className="flex items-start gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {m}
                </li>
              ))}
            </ul>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-navy-800 dark:text-slate-200">Our values:</span>{' '}
              {values.map((v) => v.title).join(' Â· ')}
            </p>
          </div>

          <Button to="/about" variant="primary" size="lg" className="group mt-7">
            More About Us
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}

