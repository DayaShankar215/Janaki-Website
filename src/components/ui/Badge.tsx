import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  tone?: 'green' | 'amber' | 'gray' | 'navy';
  className?: string;
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-accent-100 text-accent-800 dark:bg-accent-500/15 dark:text-accent-300',
  gray: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
  navy: 'bg-navy-100 text-navy-800 dark:bg-navy-500/20 dark:text-navy-200',
};

export function Badge({ children, tone = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
