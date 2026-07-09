import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpaceInvadersGame from './SpaceInvadersGame.jsx';
import useKonamiCode from '../../hooks/useKonamiCode.js';

// ─── Gamification: Konami code, constellations, easter eggs, hacker mode ──────

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];

export default function Gamification({ onAchievement }) {
  const [hackerMode, setHackerMode] = useState(false);
  const [spaceInvaders, setSpaceInvaders] = useState(false);
  const [stars, setStars] = useState([]);
  const [constellations, setConstellations] = useState([]);
  const [easterEggsFound, setEasterEggsFound] = useState(0);
  const [particles, setParticles] = useState([]);
  const konamiBuffer = useRef([]);
  const starBuffer = useRef([]);

  // ── Konami code listener ─────────────────────────────────────────────────
  useKonamiCode(useCallback(() => {
    setSpaceInvaders(true);
    spawnParticles();
    onAchievement?.({ icon: '🎮', title: 'Konami Master', desc: 'You found the secret code!' });
  }, [onAchievement]));

  // ── Secret 'hacker' keyword listener ─────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      konamiBuffer.current.push(e.code);
      if (konamiBuffer.current.length > 10) {
        konamiBuffer.current.shift();
      }
      const last10 = konamiBuffer.current.slice(-6).map(k => k.replace('Key','')).join('').toLowerCase();
      if (last10.includes('hacker') || last10 === 'hack') {
        konamiBuffer.current = [];
        setEasterEggsFound(n => {
          const next = n + 1;
          if (next >= 3 && !hackerMode) {
            setHackerMode(true);
            onAchievement?.({ icon: '💻', title: 'Hacker Mode Unlocked', desc: 'You found all 3 easter eggs!' });
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hackerMode, onAchievement]);

  // ── Star click constellation ─────────────────────────────────────────────
  const onStarClick = useCallback((e) => {
    const newStar = { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() };
    starBuffer.current.push(newStar);
    setStars(prev => [...prev.slice(-15), newStar]);

    if (starBuffer.current.length >= 5) {
      const pts = starBuffer.current.slice(-5);
      setConstellations(prev => [...prev, { id: Date.now(), points: pts }]);
      starBuffer.current = [];
      spawnParticles();
      onAchievement?.({ icon: '⭐', title: 'Constellation Drawn!', desc: '5 stars → cosmic pattern' });
    }
  }, []);

  const spawnParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 5 - 2,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  // ── Hacker mode styles ───────────────────────────────────────────────────
  useEffect(() => {
    if (hackerMode) {
      document.documentElement.style.setProperty('--col-text', '#00ff41');
      document.documentElement.style.setProperty('--col-primary', '#00ff41');
      document.documentElement.style.setProperty('--col-bg', '#000000');
    } else {
      document.documentElement.style.removeProperty('--col-text');
      document.documentElement.style.removeProperty('--col-primary');
      document.documentElement.style.removeProperty('--col-bg');
    }
  }, [hackerMode]);

  return (
    <>
      {/* Click-to-add-star overlay (transparent, pointer-events pass-through except explicit click) */}
      <div
        data-cursor="crosshair"
        style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
        onClickCapture={onStarClick}
      />

      {/* Clickable stars */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.7] }}
          exit={{ scale: 0, opacity: 0 }}
          style={{
            position: 'fixed',
            left: star.x,
            top: star.y,
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
            zIndex: 800,
            fontSize: '1.2rem',
            filter: 'drop-shadow(0 0 6px gold)',
          }}
        >
          ★
        </motion.div>
      ))}

      {/* Constellation SVG lines */}
      <svg
        style={{ position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none', width: '100%', height: '100%' }}
      >
        {constellations.map(constellation => (
          <g key={constellation.id}>
            {constellation.points.map((pt, i) => {
              if (i === 0) return null;
              const prev = constellation.points[i - 1];
              return (
                <motion.line
                  key={i}
                  x1={prev.x} y1={prev.y} x2={pt.x} y2={pt.y}
                  stroke="rgba(255,220,50,0.4)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
          </g>
        ))}
      </svg>

      {/* Particle burst */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
          animate={{ x: p.x + p.vx * 80, y: p.y + p.vy * 80, opacity: 0, scale: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            width: 6, height: 6,
            borderRadius: '50%',
            background: `hsl(${Math.random() * 360},100%,70%)`,
            zIndex: 900,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Hacker mode overlay */}
      <AnimatePresence>
        {hackerMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1,
              background: 'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,255,65,0.02) 4px,rgba(0,255,65,0.02) 5px)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Space Invaders mini-game */}
      <AnimatePresence>
        {spaceInvaders && (
          <SpaceInvadersGame onClose={() => setSpaceInvaders(false)} />
        )}
      </AnimatePresence>

      {/* Easter egg counter */}
      {easterEggsFound > 0 && easterEggsFound < 3 && (
        <div style={{
          position: 'fixed', top: '5rem', right: '1.5rem', zIndex: 200,
          fontFamily: 'Space Mono,monospace', fontSize: '0.65rem', letterSpacing: '0.1em',
          color: 'rgba(255,220,50,0.6)',
        }}>
          🥚 {easterEggsFound}/3 Easter Eggs
        </div>
      )}
    </>
  );
}


