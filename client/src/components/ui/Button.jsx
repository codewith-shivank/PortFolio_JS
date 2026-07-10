import { cn } from '@/lib/utils';

const variantMap = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
  danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors cursor-pointer',
  success: 'bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors cursor-pointer',
};

const sizeMap = {
  sm: 'btn-sm',
  lg: 'btn-lg',
  md: '',
};

/**
 * Button — Maps old variant/size props to CSS classes (shim for dashboard compatibility)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  type = 'button',
  disabled = false,
  onClick,
  ...props
}) {
  const classes = cn(
    variantMap[variant] || 'btn btn-primary',
    sizeMap[size] || '',
    className
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
