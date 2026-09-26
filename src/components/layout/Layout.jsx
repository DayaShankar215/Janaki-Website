import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AnnouncementTicker } from './AnnouncementTicker';
import { ScrollToTop } from '@/hooks/ScrollToTop';
import { CourseSearchModal } from '@/components/ui/CourseSearchModal';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { AnnouncementPopup } from './AnnouncementPopup';
import { JsonLd, organizationSchema } from '@/components/Seo';
import { useContent } from '@/content/ContentContext';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-navy-600 via-accent-500 to-accent-400"
    />
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-navy-700 text-white shadow-card-hover transition-colors hover:bg-navy-600 dark:bg-accent-500 dark:text-navy-950 dark:hover:bg-accent-400"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Global Ctrl/Cmd + K shortcut to open quick course search. */
export function useGlobalSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return { searchOpen, setSearchOpen };
}

export function Layout() {
  const location = useLocation();
  const { searchOpen, setSearchOpen } = useGlobalSearch();
  const { siteConfig } = useContent();
  const reduceMotion = useReducedMotion();

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: 'easeOut' };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-700 dark:bg-navy-950 dark:text-slate-300">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-lg bg-accent-500 px-4 py-2 font-bold text-navy-950 focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <ScrollProgress />
      <AnnouncementTicker />
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <JsonLd data={organizationSchema(siteConfig)} />
      <main id="main-content" className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={transition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BackToTop />
      <WhatsAppButton />
      <Footer />
      <CourseSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AnnouncementPopup />
    </div>
  );
}