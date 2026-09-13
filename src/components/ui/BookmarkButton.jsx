import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Heart toggle for marking a course as an "interest". Falls back to
 * a link to the inquiry form when JS bookmarks are unavailable.
 */
export function BookmarkButton({ slug, isOn, onToggle, className }) {
  const label = isOn ? 'Remove from my list' : 'Add to my list';
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(slug);
      }}
      aria-label={label}
      aria-pressed={isOn}
      title={label}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300',
        isOn
          ? 'bg-accent-500 text-navy-950 shadow-card-hover'
          : 'bg-navy-950/55 text-white hover:bg-accent-500 hover:text-navy-950',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isOn ? 'on' : 'off'}
          initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.4, rotate: 30, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex"
        >
          <Heart className={cn('h-4 w-4', isOn && 'fill-current')} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}