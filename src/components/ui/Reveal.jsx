import { motion, useReducedMotion } from 'framer-motion';

/** Fade-up on scroll into view. Respects prefers-reduced-motion. */
export function Reveal({ children, delay = 0, y = 24, className, once = true }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
