import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * MagneticButton — Premium button with magnetic hover, glow, and ripple
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  magnetic = true,
  className,
  href,
  onClick,
  disabled,
  icon,
  ...props
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripple, setRipple] = useState(null);

  const handleMouse = (e) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.15, y: y * 0.15 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e) => {
    // Ripple effect
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setRipple({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: Date.now(),
      });
      setTimeout(() => setRipple(null), 600);
    }
    onClick?.(e);
  };

  const variants = {
    primary: 'bg-gradient-to-r from-accent-violet to-accent-violet-dark text-white shadow-[0_8px_32px_rgba(124,109,250,0.35)] hover:shadow-[0_16px_48px_rgba(124,109,250,0.5)]',
    secondary: 'bg-surface-glass border border-border-glass text-text-secondary hover:bg-surface-glass-hover hover:border-accent-violet/30 hover:text-text-primary',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-glass',
    danger: 'bg-gradient-to-r from-accent-rose to-red-600 text-white shadow-[0_8px_32px_rgba(255,107,157,0.3)]',
    success: 'bg-gradient-to-r from-accent-emerald to-emerald-600 text-bg-primary shadow-[0_8px_32px_rgba(0,255,136,0.3)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-full',
    md: 'px-6 py-3 text-sm rounded-full',
    lg: 'px-8 py-4 text-base rounded-full',
  };

  const baseClasses = cn(
    'relative inline-flex items-center justify-center gap-2 font-display font-semibold tracking-wide overflow-hidden transition-all duration-300',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 pointer-events-none',
    className,
  );

  const MotionTag = href ? motion.a : motion.button;
  const linkProps = href ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? 'noopener noreferrer' : undefined } : {};

  return (
    <MotionTag
      ref={ref}
      className={baseClasses}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...linkProps}
      {...props}
    >
      {/* Ripple */}
      {ripple && (
        <motion.span
          className="absolute rounded-full bg-white/20 pointer-events-none"
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{ left: ripple.x - 150, top: ripple.y - 150 }}
        />
      )}

      {/* Shimmer highlight on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </MotionTag>
  );
}
