import { GraduationCap, Hammer, Users, Briefcase } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const items = [
  {
    icon: GraduationCap,
    title: 'Technical & Vocational Training',
    text: 'Skill-focused programs across essential trades.',
  },
  {
    icon: Hammer,
    title: 'Practical Learning',
    text: 'Trainees work directly with tools and materials.',
  },
  {
    icon: Users,
    title: 'Experienced Trainers',
    text: 'Instructor-guided sessions with real demonstrations.',
  },
  {
    icon: Briefcase,
    title: 'Career-Oriented Skills',
    text: 'Abilities designed for workplaces and self-employment.',
  },
];

/** Quick information bar overlapping the hero. */
export function QuickInfoBar() {
  return (
    <section id="quick-info" className="relative z-10 bg-white dark:bg-navy-950">
      <div className="container-x">
        <Reveal className="-mt-14 sm:-mt-16">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/80 shadow-card-hover dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex items-start gap-4 bg-white p-5 transition-colors hover:bg-navy-50/70 dark:bg-navy-900 dark:hover:bg-white/[0.06] sm:p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-accent-400 shadow-soft">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-[15px] font-bold leading-snug text-navy-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
