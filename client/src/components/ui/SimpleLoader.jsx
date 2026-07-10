import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PERSONAL } from '@/lib/constants';

/**
 * SimpleLoader — Minimal, elegant loading screen
 * White/dark background, name centered, thin animated progress bar.
 * Fades out in 0.8–1.2 seconds.
 */
export default function SimpleLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Animate progress from 0 → 100 over ~900ms
    const steps = [20, 50, 75, 90, 100];
    const delays = [80, 200, 350, 600, 900];

    const timers = steps.map((val, i) =>
      setTimeout(() => setProgress(val), delays[i])
    );

    // Trigger exit after progress completes
    const exitTimer = setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 400); // allow fade-out to complete
    }, 1100);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="loader-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      aria-label="Loading portfolio"
      role="status"
    >
      {/* Name */}
      <div className="text-center select-none">
        <motion.p
          className="font-mono text-xs tracking-[0.3em] uppercase text-text-muted mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Portfolio
        </motion.p>
        <motion.h1
          className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {PERSONAL.firstName}{' '}
          <span className="gradient-text">Maurya</span>
        </motion.h1>
        <motion.p
          className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {PERSONAL.role}
        </motion.p>
      </div>

      {/* Progress bar at bottom */}
      <div className="loader-progress-track">
        <motion.div
          className="loader-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
