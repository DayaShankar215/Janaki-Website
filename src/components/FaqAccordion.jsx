import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.question}
            className={cn(
              'overflow-hidden rounded-xl border transition-colors',
              open
                ? 'border-navy-300 bg-white shadow-card dark:border-accent-500/40 dark:bg-white/[0.05]'
                : 'border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]'
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-display text-[15px] font-bold text-navy-900 dark:text-white">{item.question}</span>
              <ChevronDown
                className={cn('h-5 w-5 shrink-0 text-navy-500 transition-transform duration-300 dark:text-navy-300', open && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
