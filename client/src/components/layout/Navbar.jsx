import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_SECTIONS, PERSONAL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/Magnetic';

/**
 * Navbar — Cynthia Ugwu Style Overhaul
 * Transparent/black, uppercase links, magnetic buttons
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section Tracking via Intersection Observer
  useEffect(() => {
    const observers = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setCurrentSection(id);
        },
        { threshold: 0.2, rootMargin: '-15% 0px -15% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNav = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] px-5 sm:px-8 lg:px-12 py-6 flex items-center justify-between transition-all duration-300',
          scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent'
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Magnetic>
          <button
            onClick={() => handleNav('hero')}
            className="font-display font-extrabold text-sm sm:text-base tracking-tighter uppercase text-white hover:text-neutral-400 transition-colors cursor-pointer"
            aria-label="Go to top"
          >
            {PERSONAL.firstName}{' '}
            <span className="text-neutral-500">Maurya</span>
          </button>
        </Magnetic>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Desktop navigation">
          <ul className="flex items-center gap-8 list-none">
            {NAV_SECTIONS.map((s) => (
              <li key={s.id}>
                <Magnetic>
                  <button
                    onClick={() => handleNav(s.id)}
                    className="relative group cursor-pointer"
                    aria-current={currentSection === s.id ? 'page' : undefined}
                  >
                    <span
                      className={cn(
                        'font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-colors duration-200',
                        currentSection === s.id
                          ? 'text-white font-bold'
                          : 'text-neutral-500 hover:text-white'
                      )}
                    >
                      {s.label}
                    </span>
                  </button>
                </Magnetic>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger (Magnetic wrapper on the trigger) */}
        <Magnetic>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-md text-neutral-500 hover:text-white transition-colors cursor-pointer"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <motion.span
              className="block w-5 h-0.5 bg-current"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-current"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-current"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </Magnetic>
      </motion.nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[90] bg-black flex flex-col items-center justify-center gap-8 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_SECTIONS.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => handleNav(s.id)}
                className="font-display font-extrabold text-4xl text-neutral-800 hover:text-white transition-colors duration-200 uppercase tracking-tighter cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 + 0.05 }}
                aria-current={currentSection === s.id ? 'page' : undefined}
              >
                <span className={currentSection === s.id ? 'text-white' : ''}>
                  {s.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
