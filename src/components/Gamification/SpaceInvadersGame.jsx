import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SKILL_EMOJIS = ['⚡', '⚛️', '🎨', '📊', '🌐', '🔧'];

export default function SpaceInvadersGame({ onClose }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
  }, [onClose]);

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
