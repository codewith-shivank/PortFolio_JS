import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ─── Magnetic cursor that bends toward interactive elements ───────────────────
export default function MagneticCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const [variant, setVariant] = useState('default'); // default | hover | click | text

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
    };

    const onDown = () => setVariant('click');
    const onUp = () => setVariant('default');

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    // Detect interactive elements
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'button, a, [data-cursor], input, textarea, .planet-orb, .project-card-3d'
      );
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          const type = el.dataset.cursor || 'hover';
          setVariant(type);

          // Magnetic pull effect
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const pull = (e) => {
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const strength = Math.max(0, 1 - dist / 80);
            cursorX.set(e.clientX - 20 + dx * strength * 0.4);
            cursorY.set(e.clientY - 20 + dy * strength * 0.4);
          };
          el.addEventListener('mousemove', pull);
          el._pullHandler = pull;
        });

        el.addEventListener('mouseleave', () => {
          setVariant('default');
          if (el._pullHandler) {
            el.removeEventListener('mousemove', el._pullHandler);
            delete el._pullHandler;
          }
        });
      });
    };

    // Re-run after content loads
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      observer.disconnect();
    };
  }, []);

  const variants = {
    default: {
      width: 40,
      height: 40,
      borderWidth: 1.5,
      borderColor: 'rgba(124,109,250,0.7)',
      backgroundColor: 'transparent',
      scale: 1,
    },
    hover: {
      width: 60,
      height: 60,
      borderWidth: 1,
      borderColor: 'rgba(0,212,255,0.9)',
      backgroundColor: 'rgba(0,212,255,0.06)',
      scale: 1,
    },
    click: {
      width: 30,
      height: 30,
      borderWidth: 2,
      borderColor: 'rgba(255,107,157,0.9)',
      backgroundColor: 'rgba(255,107,157,0.15)',
      scale: 0.9,
    },
    text: {
      width: 3,
      height: 32,
      borderRadius: 2,
      borderWidth: 0,
      backgroundColor: 'rgba(124,109,250,1)',
      scale: 1,
    },
  };

  const current = variants[variant] || variants.default;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        ref={cursorRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: springX,
          y: springY,
          zIndex: 9999,
          pointerEvents: 'none',
          borderStyle: 'solid',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
        animate={{
          width: current.width,
          height: current.height,
          borderColor: current.borderColor,
          borderWidth: current.borderWidth,
          backgroundColor: current.backgroundColor,
          scale: current.scale,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 400, mass: 0.3 }}
      />

      {/* Center dot */}
      <motion.div
        ref={dotRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: dotX,
          y: dotY,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'rgba(124,109,250,1)',
          zIndex: 10000,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
        animate={{ scale: variant === 'click' ? 0.5 : 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 600 }}
      />
    </>
  );
}
