import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useContent } from '@/content/ContentContext';

/**
 * Floating WhatsApp chat button (bottom-left, so it doesn't clash
 * with the back-to-top button). Uses the configured phone number —
 * empty phone or number missing N adjustments are hidden gracefully.
 */
export function WhatsAppButton() {
  const { siteConfig } = useContent();
  const [open, setOpen] = useState(false);

  const digits = (siteConfig.phone || '').replace(/\D/g, '');
  const valid = digits.length >= 8;
  if (!valid) return null;

  // Standard WhatsApp deep-link format: full international number
  // without '+' or leading '0'.
  const waLink = `https://wa.me/977${digits.replace(/^0/, '')}`;

  const message = encodeURIComponent('Hello Janaki TTC! I found your website and I would like to ask about your training programs.');

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card-hover dark:border-white/10 dark:bg-navy-900"
          >
            <p className="text-sm font-bold text-navy-900 dark:text-white">Chat with us on WhatsApp</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Ask about courses, schedules, fees or enrollment — we usually reply quickly during office hours.
            </p>
            <a
              href={`${waLink}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
            >
              <MessageCircle className="h-4 w-4" /> Start a chat
            </a>
            <p className="mt-2 text-center text-[11px] text-slate-400">{siteConfig.phone}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card-hover"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-7 w-7" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500" />
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}