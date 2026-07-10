import { motion } from 'framer-motion';
import { SITE, SOCIAL_LINKS, NAV_SECTIONS } from '@/lib/constants';
import { scrollToElement } from '@/lib/utils';

/**
 * Footer — Modern multi-column footer with newsletter, socials, back-to-top
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border-glass bg-bg-secondary/50">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display font-bold text-2xl gradient-text mb-4">
                {SITE.name}
              </h3>
              <p className="font-body text-text-tertiary text-sm leading-relaxed max-w-md mb-6">
                Building premium web experiences with the MERN stack. Available for full-time roles, freelance projects, and exciting collaborations.
              </p>
              {/* Social Icons */}
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl border border-border-glass bg-surface-glass flex items-center justify-center text-text-muted hover:text-accent-violet hover:border-accent-violet/30 hover:bg-accent-violet/5 transition-all duration-300"
                    title={link.label}
                  >
                    <SocialIcon name={link.icon} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent-cyan mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollToElement(s.id)}
                    className="font-body text-sm text-text-muted hover:text-text-primary transition-colors duration-300"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent-cyan mb-6">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-text-primary transition-colors"
                >
                  {SITE.email}
                </a>
              </li>
              <li>{SITE.location}</li>
              <li>
                <span className="live-badge">
                  <span className="live-dot" />
                  {SITE.availability}
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-glass">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[0.65rem] tracking-[0.1em] text-text-muted">
            © {currentYear} {SITE.name} · Built with React + Node.js + Three.js
          </p>

          {/* Back to top */}
          <motion.button
            onClick={() => scrollToElement('hero')}
            className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.1em] uppercase text-text-muted hover:text-accent-violet transition-colors"
            whileHover={{ y: -2 }}
          >
            Back to Top ↑
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }) {
  const icons = {
    github: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    linkedin: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    twitter: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    youtube: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  };
  return icons[name] || null;
}
