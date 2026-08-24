import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { ArrowRight, Send, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { Button } from '@/components/ui/Button';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=75';

const trustPoints = ['Hands-on workshop training', 'Instructor-guided learning', 'Short, focused programs'];

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

/** Counts up to `end` when scrolled into view. */
function StatCounter({ end, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, end, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, end]);

  return (
    <p ref={ref} className="font-display text-2xl font-extrabold text-accent-400 sm:text-3xl">
      {val}
      {suffix}
    </p>
  );
}

export function HeroSection() {
  const { siteConfig, courses, categories, getActiveCourses } = useContent();
  const activeCount = getActiveCourses().length;

  return (
    <section className="relative overflow-hidden bg-navy-950">
      {/* Background image + overlays */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover object-center"
          loading="eager"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40" />
        <div className="absolute inset-0 hero-grid bg-grid opacity-50" />
      </div>

      <div className="container-x relative flex min-h-[calc(100vh-6rem)] max-h-[820px] flex-col justify-center py-16 sm:min-h-[640px]">
        <div className="max-w-3xl">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent-400 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true" />
            Technical &amp; Vocational Training Institute
          </motion.p>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Building Skills.
            <br />
            Creating{' '}
            <span className="relative inline-block text-transparent [background-clip:text] [-webkit-background-clip:text] [background-image:linear-gradient(120deg,#FBBF24,#F59E0B)]">
              Opportunities.
              <svg
                className="absolute -bottom-2 left-0 w-full text-accent-500/70"
                viewBox="0 0 220 12"
                fill="none"
                aria-hidden="true"
              >
                <path d="M3 9C60 3 150 3 217 8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.36 }}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <Button to="/courses" variant="accent" size="lg" className="group">
              Explore Courses
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button to="/contact" variant="white-outline" size="lg">
              <Send className="h-4 w-4" />
              Enquire Now
            </Button>
          </motion.div>

          <motion.ul
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.48 }}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-2"
          >
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {point}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4"
        >
          {[
            { end: activeCount > 0 ? activeCount : courses.length, suffix: '+', label: 'Training programs' },
            { end: categories.length, suffix: '', label: 'Skill categories' },
            { end: 100, suffix: '%', label: 'Practical-first learning' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-md transition-colors hover:border-accent-500/40 sm:p-5"
            >
              <StatCounter end={stat.end} suffix={stat.suffix} />
              <p className="mt-1 text-xs font-medium leading-snug text-slate-300 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <a
        href="#quick-info"
        aria-label="Scroll to learn more"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-slate-400 hover:text-white md:block"
      >
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  );
}


