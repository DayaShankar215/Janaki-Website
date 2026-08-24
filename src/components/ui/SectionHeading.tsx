import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 mb-4',
            dark ? 'bg-accent-500/15 text-accent-400' : 'bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-400'
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'font-display text-3xl sm:text-4xl font-bold tracking-tight',
          dark ? 'text-white' : 'text-navy-900 dark:text-white'
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('mt-4 text-base leading-relaxed', dark ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300')}>
          {description}
        </p>
      )}
    </div>
  );
}
