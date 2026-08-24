import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { facilities } from '@/data/facilities';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

const IMG_A = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=72';
const IMG_B = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=70';

/** "Learn by Doing" — practical training teaser. */
export function PracticalBand() {
  return (
    <section className="bg-white py-16 dark:bg-navy-950 sm:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Content */}
        <div className="order-2 lg:order-1">
          <SectionHeading
            align="left"
            eyebrow="Practical Training"
            title={
              <>
                Learn by Doing.<span className="text-accent-500"> Master by Practicing.</span>
              </>
            }
            description="Our workshops and practice areas let trainees apply every concept immediately — the same way skills are used on real jobs."
            className="[&>p]:mt-4"
          />

          <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {facilities.map((f) => (
              <li key={f.id} className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                {f.name}
              </li>
            ))}
          </ul>

          <Button to="/practical-training" variant="primary" size="lg" className="group mt-8">
            See How We Train
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Image stack */}
        <Reveal className="relative order-1 mx-auto w-full max-w-lg lg:order-2 lg:max-w-none">
          <img
            src={IMG_A}
            alt="Welding training with protective equipment"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card-hover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <img
            src={IMG_B}
            alt="Construction practice at the training yard"
            loading="lazy"
            className="absolute -bottom-10 -left-4 hidden w-52 rounded-2xl object-cover shadow-card-hover ring-8 ring-white dark:ring-navy-950 sm:block aspect-[5/4]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div
            className="absolute -right-3 -top-3 rounded-2xl bg-accent-500 px-4 py-3 shadow-card-hover sm:-right-5"
            aria-hidden="true"
          >
            <p className="font-display text-xl font-extrabold leading-none text-navy-950">Hands-on</p>
            <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-navy-900">every session</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
