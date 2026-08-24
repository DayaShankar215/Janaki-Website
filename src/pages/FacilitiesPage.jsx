import { Info } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { FacilityCard } from '@/components/cards/FacilityCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { useContent } from '@/content/ContentContext';

export default function FacilitiesPage() {
  const { facilities } = useContent();
  useSeo(
    'Workshops & Facilities',
    'Explore the workshops and practice areas at Janaki Technical Training Center — electrical workshop, welding bays, computer lab, construction yard and more.'
  );

  return (
    <>
      <PageHero
        title="Workshops & Facilities"
        description="Purpose-built practice environments where skills are developed with real tools, materials and equipment."
        breadcrumb={[{ label: 'Facilities' }]}
      />

      <section className="bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Learning Spaces"
            title="Where Practical Training Happens"
            description="Each facility supports hands-on learning for specific trades under instructor supervision."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f, i) => (
              <Reveal key={f.id} delay={(i % 3) * 0.08} className="h-full">
                <FacilityCard facility={f} />
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-10 flex max-w-2xl items-start gap-2.5 rounded-xl border border-accent-200 bg-accent-50 p-4 text-xs leading-relaxed text-accent-900 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-accent-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Facility details shown here are editable sample content. The center should update
            <code className="mx-1 rounded bg-white/60 px-1.5 py-0.5 font-mono dark:bg-white/10">src/data/facilities.js</code>
            to reflect the actual workshops and equipment available.
          </p>

          <div className="mt-12 text-center">
            <Button to="/practical-training" variant="primary" size="lg">
              See Our Training Approach →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

