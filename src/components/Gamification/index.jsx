import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  useEffect(() => {
    const onKey = (e) => {
      konamiBuffer.current.push(e.code);
      if (konamiBuffer.current.length > KONAMI.length) {
        konamiBuffer.current.shift();
      }
      if (konamiBuffer.current.join(',') === KONAMI.join(',')) {
        konamiBuffer.current = [];
        setSpaceInvaders(true);
        spawnParticles();
        onAchievement?.({ icon: '🎮', title: 'Konami Master', desc: 'You found the secret code!' });
      }

      // Secret 'hacker' keyword
      const last10 = konamiBuffer.current.slice(-6).map(k => k.replace('Key','')).join('').toLowerCase();
      if (last10.includes('hacker') || last10 === 'hack') {
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
  }, [hackerMode]);

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

// ─── Space Invaders mini-game ─────────────────────────────────────────────────
const SKILL_EMOJIS = ['⚡', '⚛️', '🎨', '📊', '🌐', '🔧'];

function SpaceInvadersGame({ onClose }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = Math.min(800, window.innerWidth - 40);
    canvas.height = 500;

    const state = {
      player: { x: canvas.width / 2, y: canvas.height - 50, w: 40, h: 20, speed: 6 },
      bullets: [],
      enemies: [],
      score: 0,
      gameOver: false,
      keys: {},
    };
    gameRef.current = state;

    // Create enemies
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        state.enemies.push({
          x: 80 + col * 110,
          y: 60 + row * 70,
          w: 50, h: 40,
          emoji: SKILL_EMOJIS[col % SKILL_EMOJIS.length],
          alive: true,
          dx: 0.8,
        });
      }
    }

    const onKey = (e) => { state.keys[e.code] = e.type === 'keydown'; };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    let lastShot = 0;
    let rafId;

    const loop = (timestamp) => {
      if (state.gameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Player movement
      if (state.keys['ArrowLeft'] || state.keys['KeyA']) state.player.x -= state.player.speed;
      if (state.keys['ArrowRight'] || state.keys['KeyD']) state.player.x += state.player.speed;
      state.player.x = Math.max(20, Math.min(canvas.width - 20, state.player.x));

      // Shoot
      if ((state.keys['Space'] || state.keys['ArrowUp']) && timestamp - lastShot > 300) {
        state.bullets.push({ x: state.player.x, y: state.player.y - 10, speed: 8 });
        lastShot = timestamp;
      }

      // Draw player (spaceship)
      ctx.fillStyle = '#7c6dfa';
      ctx.beginPath();
      ctx.moveTo(state.player.x, state.player.y - 15);
      ctx.lineTo(state.player.x - 18, state.player.y + 10);
      ctx.lineTo(state.player.x + 18, state.player.y + 10);
      ctx.closePath();
      ctx.fill();
      ctx.shadowColor = '#7c6dfa';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Move & draw enemies
      let reverseDir = false;
      state.enemies.forEach(e => {
        if (!e.alive) return;
        e.x += e.dx;
        if (e.x > canvas.width - 60 || e.x < 10) reverseDir = true;
      });
      if (reverseDir) {
        state.enemies.forEach(e => {
          e.dx *= -1;
          e.y += 15;
        });
      }

      state.enemies.forEach(e => {
        if (!e.alive) return;
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.fillText(e.emoji, e.x + e.w / 2, e.y + e.h - 4);
      });

      // Bullets
      state.bullets = state.bullets.filter(b => {
        b.y -= b.speed;
        if (b.y < 0) return false;

        // Collision
        let hit = false;
        state.enemies.forEach(e => {
          if (!e.alive) return;
          if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
            e.alive = false;
            state.score += 100;
            hit = true;
          }
        });
        if (hit) return false;

        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x - 2, b.y - 6, 4, 12);
        ctx.shadowBlur = 0;
        return true;
      });

      // Score & HUD
      ctx.fillStyle = '#f0f0ff';
      ctx.font = '16px Space Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE: ${state.score}`, 20, 28);
      ctx.textAlign = 'right';
      ctx.fillText('ARROWS + SPACE', canvas.width - 20, 28);

      // Win check
      if (state.enemies.every(e => !e.alive)) {
        state.gameOver = true;
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 40px Space Grotesk, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('YOU WIN! 🎉', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = '#7c6dfa';
        ctx.font = '20px Space Mono, monospace';
        ctx.fillText(`Final Score: ${state.score}`, canvas.width / 2, canvas.height / 2 + 50);
        setTimeout(onClose, 2500);
        return;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'min(800px,calc(100vw-40px))' }}>
        <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:800, fontSize:'1.5rem', color:'#7c6dfa' }}>
          🎮 Skill Invaders
        </div>
        <button onClick={onClose} style={{ background:'none', border:'1px solid rgba(255,255,255,0.2)', borderRadius:6, color:'rgba(255,255,255,0.5)', padding:'0.4rem 0.8rem', fontFamily:'Space Mono,monospace', fontSize:'0.7rem' }}>
          ESC · Close
        </button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ border:'1px solid rgba(124,109,250,0.3)', borderRadius:12, boxShadow:'0 0 40px rgba(124,109,250,0.2)' }}
      />
    </motion.div>
  );
}
