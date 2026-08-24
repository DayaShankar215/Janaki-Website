import { BadgeCheck, Info } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function TrainerCard({ trainer }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-navy-500 to-navy-800 font-display text-xl font-bold text-white shadow-soft ring-4 ring-navy-100 dark:ring-white/10">
        {initials(trainer.name)}
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">{trainer.name}</h3>
      <p className="mt-0.5 text-sm font-semibold text-accent-600 dark:text-accent-400">{trainer.position}</p>

      {trainer.isSample && (
        <Badge tone="amber" className="mx-auto mt-2">
          <Info className="h-3 w-3" /> Sample profile
        </Badge>
      )}

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{trainer.bio}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {trainer.expertise.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy-700 dark:bg-white/10 dark:text-slate-200"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-auto inline-flex items-center justify-center gap-1.5 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
        <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
        {trainer.experience}
      </p>
    </article>
  );
}
