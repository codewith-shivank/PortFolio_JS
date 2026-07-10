import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Button from '@/components/ui/Button';
import AnimatedText from '@/components/ui/AnimatedText';
import { PERSONAL, SOCIAL_LINKS, SITE } from '@/lib/constants';

const ROLES = ['Full Stack Developer', 'MERN Stack Engineer', 'UI/UX Enthusiast', 'Web Craftsman'];

/**
 * Hero — Cinematic hero section with GSAP timeline, typing roles, animated gradient
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);

  // Animated gradient blob that follows mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!glowRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      glowRef.current.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(124,109,250,0.08), transparent 40%)`;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP stagger animation for initial load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center z-10 overflow-hidden"
    >
      {/* Mouse-follow glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
      />

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-accent-violet/10 blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-20 -right-40 w-96 h-96 rounded-full bg-accent-cyan/8 blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-rose/5 blur-[150px] pointer-events-none morph-blob" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 w-full">
        {/* Availability Badge */}
        <motion.div
          className="hero-stagger mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border-glass bg-surface-glass">
            <span className="live-dot" />
            <span className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-text-muted">
              {SITE.availability}
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <div className="hero-stagger overflow-hidden mb-2">
          <motion.h1
            className="font-display font-extrabold text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] tracking-[-0.04em] text-text-primary"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            MERN Stack
          </motion.h1>
        </div>

        <div className="flex items-end gap-6 mb-6 flex-wrap hero-stagger">
          <div className="overflow-hidden">
            <motion.h1
              className="font-display font-extrabold text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] tracking-[-0.04em] gradient-text"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              Developer
            </motion.h1>
          </div>

          <motion.div
            className="mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="font-mono text-[0.72rem] tracking-[0.15em] uppercase text-text-muted leading-relaxed max-w-[220px]">
              {PERSONAL.name}
              <br />
              Since {PERSONAL.startedYear} · Full Stack
            </p>
          </motion.div>
        </div>

        {/* Typing Role */}
        <motion.div
          className="hero-stagger mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-accent-violet" />
            <AnimatedText
              text={ROLES[0]}
              animation="typing"
              className="font-mono text-sm text-accent-violet tracking-wide"
              delay={1.2}
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          className="hero-stagger font-body text-[clamp(1rem,2vw,1.15rem)] text-text-tertiary max-w-xl leading-[1.8] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {PERSONAL.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="hero-stagger flex flex-wrap gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              const el = document.getElementById('projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View Projects ↓
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get in Touch →
          </Button>
          <Button
            variant="ghost"
            size="lg"
            href={PERSONAL.resumeUrl}
          >
            📄 Resume
          </Button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="hero-stagger flex flex-wrap gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {SOCIAL_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text-muted hover:text-accent-violet transition-colors duration-300"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
            >
              {link.label} ↗
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-text-faint">
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-accent-violet to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
