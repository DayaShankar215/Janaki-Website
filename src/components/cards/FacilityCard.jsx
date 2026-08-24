import { CheckCircle2 } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export function FacilityCard({ facility }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-white/[0.04]">
      <div className="relative">
        <SmartImage
          src={facility.image}
          alt={facility.name}
          aspect="aspect-[16/10]"
          fallbackIcon={facility.icon}
        />
        <span className="absolute -bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-800 text-accent-400 shadow-card-hover ring-4 ring-white transition-colors group-hover:bg-navy-700 dark:bg-navy-900 dark:ring-navy-950">
          <DynamicIcon name={facility.icon} className="h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-9">
        <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">{facility.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{facility.description}</p>
        <ul className="mt-4 space-y-1.5">
          {facility.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
