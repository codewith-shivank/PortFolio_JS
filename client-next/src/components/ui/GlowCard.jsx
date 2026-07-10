import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * GlowCard — Glassmorphism card with mouse-follow glow border effect
 */
export default function GlowCard({
  children,
  className,
  glowColor = 'rgba(124, 109, 250, 0.4)',
  ...props
}) {
  const cardRef = useRef(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'relative rounded-2xl overflow-hidden transition-all duration-500',
        'bg-surface-glass border border-border-glass',
        'hover:border-accent-violet/20',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      {...props}
    >
      {/* Glow effect that follows mouse */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 40%)`,
        }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-[0] rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 40%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
