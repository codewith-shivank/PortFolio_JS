import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'hero',     label: 'Home',     href: '#hero' },
  { id: 'skills',   label: 'Skills',   href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'about',    label: 'About',    href: '#about' },
  { id: 'contact',  label: 'Contact',  href: '#contact' },
];

export default function Navigation({ currentSection = 'hero' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      {/* Main nav bar */}
      <motion.nav
        className="nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          background: scrolled ? 'rgba(5,5,16,0.7)' : 'transparent',
          transition: 'background 0.4s, backdrop-filter 0.4s',
        }}
      >
        <motion.a
          href="#hero"
          className="nav-logo"
          onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
          whileHover={{ scale: 1.02 }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #7c6dfa, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '1.1rem',
          }}>
            CodeWithShivank
          </span>
        </motion.a>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: 'flex', gap: '2.5rem' }}>
          {sections.map((s, i) => (
            <motion.a
              key={s.id}
              href={s.href}
              className="nav-link"
              onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: currentSection === s.id ? '#7c6dfa' : 'rgba(240,240,255,0.5)',
                position: 'relative',
              }}
              whileHover={{ color: '#f0f0ff' }}
            >
              <span style={{
                position: 'absolute',
                bottom: '-6px',
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg,#7c6dfa,#00d4ff)',
                transform: currentSection === s.id ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }} />
              {s.label}
            </motion.a>
          ))}
        </div>

        {/* Menu button (mobile + hamburger) */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: '1px solid rgba(124,109,250,0.3)',
            borderRadius: '6px',
            color: '#f0f0ff',
            padding: '0.4rem 0.8rem',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          whileHover={{ borderColor: 'rgba(124,109,250,0.8)', background: 'rgba(124,109,250,0.1)' }}
          whileTap={{ scale: 0.95 }}
        >
          {menuOpen ? '✕ CLOSE' : '≡ MENU'}
        </motion.button>
      </motion.nav>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 900,
              background: 'rgba(5,5,16,0.97)',
              backdropFilter: 'blur(30px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {sections.map((s, i) => (
              <motion.a
                key={s.id}
                href={s.href}
                onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ delay: i * 0.07 + 0.15 }}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                  fontWeight: 800,
                  color: currentSection === s.id ? '#7c6dfa' : 'rgba(240,240,255,0.15)',
                  letterSpacing: '-0.03em',
                  transition: 'color 0.3s',
                }}
                whileHover={{ color: '#f0f0ff', x: 20 }}
              >
                {s.label}
              </motion.a>
            ))}

            {/* Social links in menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}
            >
              {[
                { label: 'GitHub', url: 'https://github.com/codewith-shivank' },
                { label: 'LinkedIn', url: 'https://www.linkedin.com/in/shivank-maurya-21257a303/' },
                { label: 'X/Twitter', url: 'https://x.com/codewithshivank' },
                { label: 'YouTube', url: 'https://www.youtube.com/@CodeWithShivank12' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(240,240,255,0.4)',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section indicator dots */}
      <div style={{
        position: 'fixed',
        right: '1.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
      }}>
        {sections.map((s) => (
          <motion.button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            title={s.label}
            style={{
              width: currentSection === s.id ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: currentSection === s.id
                ? 'linear-gradient(90deg,#7c6dfa,#00d4ff)'
                : 'rgba(255,255,255,0.2)',
              border: 'none',
              padding: 0,
              transition: 'width 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            whileHover={{ scale: 1.3 }}
          />
        ))}
      </div>
    </>
  );
}
