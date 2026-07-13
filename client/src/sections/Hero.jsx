import { motion } from 'framer-motion';
import { PERSONAL, SOCIAL_LINKS, SITE } from '@/lib/constants';
import Magnetic from '@/components/ui/Magnetic';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
});

/**
 * Hero — Cynthia Ugwu Style Overhaul
 * Stark black layout, giant typography, metadata bottom bar, magnetic buttons
 */
export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResumeDownload = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/resume/download`, {
      method: 'POST',
    }).catch(() => {});
    window.open(PERSONAL.resumeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-black flex flex-col justify-between overflow-hidden px-5 sm:px-8 lg:px-12 pt-28 pb-10"
      aria-labelledby="hero-heading"
    >
      {/* ── Subtle background gradient ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Main Headers (Cynthia Stack) ── */}
      <div className="w-full flex-grow flex flex-col justify-center max-w-7xl mx-auto">
        <div className="space-y-1">
          {/* Single h1 wrapping the full name — required for correct SEO/a11y */}
          <motion.h1
            id="hero-heading"
            className="title-giant text-text-primary"
            {...fadeUp(0.15)}
          >
            {PERSONAL.firstName}
          </motion.h1>

          <motion.div {...fadeUp(0.25)} className="flex items-center gap-6">
            {/* "Maurya" is a continuation of the name — use p with same visual style */}
            <p className="title-giant text-text-primary" aria-hidden="true">
              Maurya
            </p>
            {/* Status dot in the middle of headers */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="status-dot" aria-hidden="true" />
              <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-text-secondary">
                {SITE.availability}
              </span>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.35)}>
            <p className="title-giant text-neutral-600" aria-label={`Role: ${PERSONAL.role}`}>
              MERN Developer
            </p>
          </motion.div>
        </div>

        <motion.p
          className="font-body text-text-secondary text-sm sm:text-base leading-relaxed max-w-lg mt-8"
          {...fadeUp(0.45)}
        >
          {PERSONAL.tagline}
        </motion.p>
      </div>

      {/* ── Bottom Metadata Split (Cynthia Style) ── */}
      <div className="w-full max-w-7xl mx-auto border-t border-white/10 pt-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Availability / Location */}
        <motion.div {...fadeUp(0.5)} className="space-y-1">
          <p className="font-mono text-[0.62rem] text-text-muted uppercase tracking-wider">Currently Located In</p>
          <p className="text-sm font-semibold uppercase text-text-secondary">{SITE.location}</p>
        </motion.div>

        {/* Buttons / CTAs */}
        <motion.div {...fadeUp(0.6)} className="flex gap-4">
          <Magnetic>
            <button
              onClick={() => scrollTo('projects')}
              className="btn btn-primary"
              aria-label="View projects"
            >
              Projects
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={handleResumeDownload}
              className="btn btn-secondary"
              aria-label="Download resume"
            >
              Resume ↗
            </button>
          </Magnetic>
        </motion.div>

        {/* Links & Scroll Indicator */}
        <motion.div {...fadeUp(0.7)} className="flex items-center justify-between md:justify-end gap-12">
          {/* Social Links */}
          <div className="flex gap-4">
            {SOCIAL_LINKS.slice(0, 3).map((link) => (
              <Magnetic key={link.label}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.65rem] text-text-muted hover:text-text-primary tracking-widest uppercase transition-colors"
                  aria-label={`Visit my ${link.label}`}
                >
                  {link.label}
                </a>
              </Magnetic>
            ))}
          </div>

          {/* Minimal scroll prompt */}
          <button
            onClick={() => scrollTo('about')}
            className="group hidden sm:flex items-center gap-3 font-mono text-[0.65rem] text-text-muted hover:text-text-primary uppercase tracking-widest transition-colors"
            aria-label="Scroll down"
          >
            Scroll
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
