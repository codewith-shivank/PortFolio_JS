import { motion } from 'framer-motion';

export default function Hero() {
  const socialLinks = [
    { label: 'GitHub', url: 'https://github.com/codewith-shivank' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/shivank-maurya-21257a303/' },
    { label: 'X/Twitter', url: 'https://x.com/codewithshivank' },
    { label: 'YouTube', url: 'https://www.youtube.com/@CodeWithShivank12' },
  ];

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label" style={{ marginBottom: '1.5rem' }}>
            Available for full-time & freelance · Toronto, Canada
          </p>
        </motion.div>

        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(3.5rem, 11vw, 9rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: '#f0f0ff',
              marginBottom: '0.1em',
            }}
          >
            Web
          </motion.h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(3.5rem, 11vw, 9rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
                background: 'linear-gradient(135deg,#7c6dfa,#00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Developer
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(240,240,255,0.4)',
              marginBottom: '1rem',
              maxWidth: 220,
              lineHeight: 1.6,
            }}
          >
            Shivank Maurya<br />
            Since 2023 · Full Stack
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(240,240,255,0.5)',
            maxWidth: 540,
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          Building immersive web experiences with React, Three.js, and obsessive attention to craft.
          12th passout → self-taught → building the future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); handleScrollTo('projects'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.9rem 2rem',
              borderRadius: 99,
              background: 'linear-gradient(135deg,#7c6dfa,#5b4fcf)',
              color: 'white',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 8px 32px rgba(124,109,250,0.35)',
              textDecoration: 'none',
            }}
            className="btn btn-primary"
          >
            See Projects ↓
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleScrollTo('contact'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.9rem 2rem',
              borderRadius: 99,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(240,240,255,0.7)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            Get in Touch →
          </a>
        </motion.div>

        {/* Social links row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{ display: 'flex', gap: '1.5rem', marginTop: '4rem', flexWrap: 'wrap' }}
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(240,240,255,0.3)',
                textDecoration: 'none',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => { e.target.style.color = 'rgba(124,109,250,0.9)'; }}
              onMouseLeave={(e) => { e.target.style.color = 'rgba(240,240,255,0.3)'; }}
            >
              {link.label} ↗
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
