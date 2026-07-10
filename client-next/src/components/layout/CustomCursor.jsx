import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * CustomCursor — Context-aware magnetic cursor with multiple states
 * States: default, link, text, button, hidden
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [cursorState, setCursorState] = useState('default');
  const [cursorText, setCursorText] = useState('');
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  const updateCursor = useCallback(() => {
    // Smooth interpolation
    pos.current.x += (target.current.x - pos.current.x) * 0.15;
    pos.current.y += (target.current.y - pos.current.y) * 0.15;

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
    }
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
    }

    requestAnimationFrame(updateCursor);
  }, []);

  useEffect(() => {
    // Only enable on hover-capable devices
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover)').matches) {
      return;
    }

    const handleMouseMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        if (cursorRef.current) cursorRef.current.style.opacity = '1';
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      visible.current = false;
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const handleMouseOver = (e) => {
      const el = e.target;
      if (el.closest('a, button, [role="button"], .cursor-pointer')) {
        setCursorState('link');
      } else if (el.closest('input, textarea, [contenteditable]')) {
        setCursorState('text');
      } else if (el.closest('[data-cursor-text]')) {
        setCursorState('text-label');
        setCursorText(el.closest('[data-cursor-text]').dataset.cursorText);
      } else if (el.closest('[data-cursor-hide]')) {
        setCursorState('hidden');
      } else {
        setCursorState('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    const raf = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(raf);
    };
  }, [updateCursor]);

  const sizeMap = {
    default: 32,
    link: 56,
    text: 4,
    'text-label': 80,
    hidden: 0,
  };

  const size = sizeMap[cursorState] || 32;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center"
        style={{ opacity: 0 }}
        animate={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
      >
        <div
          className="w-full h-full rounded-full border transition-colors duration-200"
          style={{
            borderColor:
              cursorState === 'link'
                ? 'rgba(124, 109, 250, 0.6)'
                : 'rgba(255, 255, 255, 0.5)',
            background:
              cursorState === 'link'
                ? 'rgba(124, 109, 250, 0.08)'
                : cursorState === 'text-label'
                  ? 'rgba(124, 109, 250, 0.15)'
                  : 'transparent',
          }}
        />
        {cursorState === 'text-label' && cursorText && (
          <span className="absolute text-[0.6rem] font-mono tracking-wider uppercase text-white">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{ opacity: 0 }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: cursorState === 'text' ? 2 : 4,
            height: cursorState === 'text' ? 20 : 4,
            marginLeft: cursorState === 'text' ? -1 : -2,
            marginTop: cursorState === 'text' ? -10 : -2,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        />
      </div>
    </>
  );
}
