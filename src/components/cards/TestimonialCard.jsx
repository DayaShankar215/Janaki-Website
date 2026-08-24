import { Star, Quote, Info } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? 'text-accent-400' : 'text-slate-300 dark:text-slate-600'}`}
          fill={n <= rating ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialCard({ testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04]">
      <Quote className="h-7 w-7 text-accent-400" aria-hidden="true" />
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-500 to-navy-800 font-display text-sm font-bold text-white">
          {testimonial.name
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy-900 dark:text-white">{testimonial.name}</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{testimonial.course}</p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1.5">
          <Stars rating={testimonial.rating} />
          {testimonial.isSample && (
            <Badge tone="amber">
              <Info className="h-3 w-3" /> Sample
            </Badge>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
