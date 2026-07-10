/**
 * GlowCard — Replaced by clean .card CSS class
 * Shim component for backward compatibility
 */
export default function GlowCard({ children, className = '', glowColor, style, ...props }) {
  return (
    <div
      className={`card ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
