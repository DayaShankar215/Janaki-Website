import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

/**
 * Universal button. Renders a <Link> when `to` is given, an <a>
 * when `href` is given, otherwise a <button>.
 */
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
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-navy-950 select-none',
    {
      'bg-navy-700 text-white shadow-soft hover:bg-navy-600 hover:shadow-card-hover active:translate-y-px dark:bg-navy-500 dark:hover:bg-navy-400':
        variant === 'primary',
      'bg-accent-500 text-navy-950 font-bold shadow-soft hover:bg-accent-400 hover:shadow-card-hover active:translate-y-px':
        variant === 'accent',
      'border border-navy-300 text-navy-800 hover:border-navy-500 hover:bg-navy-50 dark:border-white/25 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/40':
        variant === 'outline',
      'text-navy-700 hover:bg-navy-100/70 dark:text-slate-200 dark:hover:bg-white/10': variant === 'ghost',
      'border border-white/60 text-white hover:bg-white/15 hover:border-white backdrop-blur-sm': variant === 'white-outline',
    },
    {
      'text-sm px-3.5 py-2': size === 'sm',
      'text-sm px-5 py-2.5': size === 'md',
      'text-base px-7 py-3.5': size === 'lg',
    },
    disabled && 'opacity-60 pointer-events-none',
    className
  );

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
