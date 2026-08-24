import { useState } from 'react';
import { cn } from '@/utils/cn';
import { DynamicIcon } from './DynamicIcon';

/**
 * Image with graceful degradation: if the remote image fails
 * (e.g. placeholder URLs offline), a branded gradient panel with
 * an icon is shown instead — the layout never breaks.
 */
export function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  aspect = 'aspect-[4/3]',
  fallbackIcon = 'hard-hat',
  priority = false,
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950',
        aspect,
        wrapperClassName
      )}
    >
      {failed ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70"
          role="img"
          aria-label={alt}
        >
          <DynamicIcon name={fallbackIcon} className="h-10 w-10 text-accent-400/80" strokeWidth={1.5} />
          <span className="px-4 text-center text-xs font-medium uppercase tracking-widest">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('h-full w-full object-cover', className)}
        />
      )}
    </div>
  );
}
