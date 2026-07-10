import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * SectionHeading — Consistent section header with label, title, description
 */
export default function SectionHeading({
  label,
  title,
  highlight,
  description,
  align = 'left',
  className,
}) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <div className={cn('max-w-2xl mb-16', alignClasses[align], className)}>
      {label && (
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {label}
        </motion.p>
      )}

      <div className="overflow-hidden">
        <motion.h2
          className="font-display font-extrabold text-[clamp(2.5rem,6vw,5rem)] tracking-tight leading-[0.95] text-text-primary"
          initial={{ y: '110%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {title}{' '}
          {highlight && (
            <span className="gradient-text">{highlight}</span>
          )}
        </motion.h2>
      </div>

      {description && (
        <motion.p
          className="font-body text-text-tertiary text-base sm:text-lg leading-relaxed mt-4 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
