import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'white-outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-navy-950 select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-navy-700 text-white shadow-soft hover:bg-navy-600 hover:shadow-card-hover active:translate-y-px dark:bg-navy-500 dark:hover:bg-navy-400',
  accent:
    'bg-accent-500 text-navy-950 shadow-soft hover:bg-accent-400 hover:shadow-card-hover active:translate-y-px font-bold',
  outline:
    'border border-navy-300 text-navy-800 hover:border-navy-500 hover:bg-navy-50 dark:border-white/25 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/40',
  ghost:
    'text-navy-700 hover:bg-navy-100/70 dark:text-slate-200 dark:hover:bg-white/10',
  'white-outline':
    'border border-white/60 text-white hover:bg-white/15 hover:border-white backdrop-blur-sm',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-7 py-3.5',
};

export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  disabled,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], disabled && 'opacity-60 pointer-events-none', className);

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
