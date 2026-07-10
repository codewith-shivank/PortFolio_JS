import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_SECTIONS, SOCIAL_LINKS, SITE } from '@/lib/constants';
import { cn, scrollToElement } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

/**
 * Navbar — Premium navigation with scroll spy, glassmorphism, overlay menu
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { theme, toggleTheme } = useTheme();

  // Scroll direction detection + scrolled state
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setHidden(y > lastScrollY.current && y > 200);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section tracking with Intersection Observer
  useEffect(() => {
    const observers = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setCurrentSection(id);
        },
        { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNav = (id) => {
    scrollToElement(id);
    setMenuOpen(false);
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main Nav Bar ─────────────────────────────────────── */}
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] px-6 lg:px-10 py-4 flex items-center justify-between transition-all duration-500',
          scrolled && 'glass-strong py-3',
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.button
          className="relative z-10"
          onClick={() => handleNav('hero')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="font-display font-bold text-lg gradient-text">
            {SITE.name}
          </span>
        </motion.button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_SECTIONS.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => handleNav(s.id)}
              className="relative group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
            >
              <span
                className={cn(
                  'font-mono text-[0.72rem] tracking-[0.1em] uppercase transition-colors duration-300',
                  currentSection === s.id
                    ? 'text-accent-violet'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {s.label}
              </span>
              {/* Active underline */}
              <motion.span
                className="absolute -bottom-1.5 left-0 right-0 h-[1px] bg-gradient-to-r from-accent-violet to-accent-cyan"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentSection === s.id ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.button>
          ))}

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border border-border-glass flex items-center justify-center text-text-muted hover:text-text-primary hover:border-accent-violet/30 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </motion.button>
        </div>

        {/* Menu Button */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            'relative z-[1000] flex items-center gap-2 px-4 py-2 rounded-md border font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-all duration-300',
            menuOpen
              ? 'border-accent-violet/50 bg-accent-violet/10 text-text-primary'
              : 'border-border-glass text-text-muted hover:border-accent-violet/30 hover:bg-surface-glass'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="lg:hidden">{menuOpen ? '✕' : '≡'}</span>
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </motion.button>
      </motion.nav>

      {/* ── Full-Screen Overlay Menu ─────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[900] bg-bg-primary/97 backdrop-blur-[40px] flex flex-col items-center justify-center gap-2"
            initial={{ clipPath: 'circle(0% at calc(100% - 50px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 50px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 50px) 40px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Nav links */}
            {NAV_SECTIONS.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => handleNav(s.id)}
                className="group"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ delay: i * 0.06 + 0.15 }}
              >
                <span
                  className={cn(
                    'font-display text-[clamp(2.5rem,8vw,6rem)] font-extrabold tracking-tight transition-colors duration-300',
                    currentSection === s.id
                      ? 'gradient-text'
                      : 'text-text-faint group-hover:text-text-primary'
                  )}
                >
                  {s.label}
                </span>
              </motion.button>
            ))}

            {/* Social links */}
            <motion.div
              className="flex gap-8 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-text-muted hover:text-accent-violet transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>

            {/* Theme toggle in menu */}
            <motion.button
              onClick={toggleTheme}
              className="mt-4 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-text-muted hover:text-accent-cyan transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Section Indicator Dots (Desktop) ────────────────── */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-[200] flex-col gap-2.5">
        {NAV_SECTIONS.map((s) => (
          <motion.button
            key={s.id}
            onClick={() => handleNav(s.id)}
            title={s.label}
            className="group relative"
            whileHover={{ scale: 1.3 }}
          >
            <motion.div
              className="rounded-full transition-all duration-300"
              animate={{
                width: currentSection === s.id ? 20 : 6,
                height: 6,
                background:
                  currentSection === s.id
                    ? 'linear-gradient(90deg, #7c6dfa, #00d4ff)'
                    : 'rgba(255,255,255,0.2)',
              }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            />
            {/* Tooltip */}
            <span className="absolute right-8 top-1/2 -translate-y-1/2 font-mono text-[0.6rem] tracking-wider uppercase text-text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {s.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* ── Scroll Progress Bar ──────────────────────────────── */}
      <ScrollProgressBar />
    </>
  );
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setProgress(window.scrollY / total);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/5 z-[1000] pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-accent-violet via-accent-cyan to-accent-rose"
        style={{ transformOrigin: 'left', scaleX: progress }}
      />
    </div>
  );
}
