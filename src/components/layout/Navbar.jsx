import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Zap, ChevronDown, Mail, Phone } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { useTheme } from '@/hooks/useTheme';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { cn } from '@/utils/cn';

const primaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/practical-training', label: 'Practical Training' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/gallery', label: 'Gallery' },
];

const moreLinks = [
  { to: '/trainers', label: 'Trainers' },
  { to: '/faq', label: 'FAQ' },
  { to: '/admission', label: 'Admission' },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label={`${siteConfig.name} — Home`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-900 shadow-card transition-transform group-hover:scale-105 dark:from-navy-500 dark:to-navy-800">
        <Zap className="h-5 w-5 text-accent-400" fill="currentColor" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[15px] font-bold tracking-tight text-navy-900 dark:text-white">
          Janaki Technical
        </span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-500 dark:text-navy-300">
          Training Center
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();

  useBodyScrollLock(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    cn(
      'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
      isActive
        ? 'text-accent-600 dark:text-accent-400'
        : 'text-slate-700 hover:text-navy-700 hover:bg-navy-50 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10'
    );

  return (
    <>
      {/* ── Top information bar ── */}
      <div className="hidden bg-navy-950 text-white md:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 text-slate-300 hover:text-white">
              <Mail className="h-3.5 w-3.5" />
              {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 text-slate-300 hover:text-white">
              <Phone className="h-3.5 w-3.5" />
              {siteConfig.phone}
            </a>
          </div>
          <p className="hidden text-slate-400 lg:block">{siteConfig.tagline}</p>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <header
        className={cn(
          'sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300',
          scrolled
            ? 'border-slate-200/80 bg-white/90 shadow-soft dark:border-white/10 dark:bg-navy-950/85'
            : 'border-transparent bg-white/80 dark:bg-navy-950/70'
        )}
      >
        <nav className="container-x flex h-16 items-center justify-between" aria-label="Main navigation">
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {primaryLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} className={linkClass}>
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={cn(
                  'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                  moreLinks.some((m) => m.to === location.pathname)
                    ? 'text-accent-600 dark:text-accent-400'
                    : 'text-slate-700 hover:text-navy-700 hover:bg-navy-50 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10'
                )}
              >
                Institute
                <ChevronDown className={cn('h-4 w-4 transition-transform', moreOpen && 'rotate-180')} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-card-hover dark:border-white/10 dark:bg-navy-900"
                  >
                    {moreLinks.map((l) => (
                      <li key={l.to}>
                        <NavLink
                          to={l.to}
                          className={({ isActive }) =>
                            cn(
                              'block rounded-lg px-3 py-2 text-sm font-medium',
                              isActive
                                ? 'bg-navy-50 text-navy-800 dark:bg-white/10 dark:text-white'
                                : 'text-slate-600 hover:bg-navy-50 hover:text-navy-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                            )
                          }
                        >
                          {l.label}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-navy-100/70 dark:text-slate-300 dark:hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link
              to="/admission"
              className="hidden rounded-lg bg-accent-500 px-4 py-2 text-sm font-bold text-navy-950 shadow-soft transition-all hover:bg-accent-400 sm:inline-flex"
            >
              Apply Now
            </Link>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-navy-100/70 dark:text-slate-200 dark:hover:bg-white/10 lg:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-slate-200 bg-white dark:border-white/10 dark:bg-navy-950 lg:hidden"
            >
              <ul className="container-x space-y-1 py-4">
                {[...primaryLinks, ...moreLinks].map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-lg px-4 py-3 text-base font-semibold',
                          isActive
                            ? 'bg-navy-50 text-navy-800 dark:bg-white/10 dark:text-white'
                            : 'text-slate-700 hover:bg-navy-50 dark:text-slate-200 dark:hover:bg-white/10'
                        )
                      }
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    to="/admission"
                    className="block rounded-xl bg-accent-500 px-4 py-3 text-center text-base font-bold text-navy-950"
                  >
                    Apply Now — Enroll in a Course
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
