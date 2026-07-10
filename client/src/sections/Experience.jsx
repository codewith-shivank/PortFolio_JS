import { motion } from 'framer-motion';
import { EXPERIENCE_DATA } from '@/lib/constants';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

/**
 * Experience — Cynthia Ugwu Style List
 * Stacked rows, thin borders, elegant deliverables listings
 */
export default function Experience() {
  return (
    <section id="experience" className="section bg-black" aria-labelledby="experience-heading">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <span className="text-meta">Work History</span>
          <h2
            id="experience-heading"
            className="font-display font-extrabold text-white tracking-tighter mt-2 uppercase leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Experience
          </h2>
        </motion.div>

        {/* Experience Rows */}
        <div
          className="w-full border-b border-white/10"
          role="list"
          aria-label="Experience timeline"
        >
          {EXPERIENCE_DATA.map((exp, i) => (
            <motion.article
              key={exp.id}
              role="listitem"
              className="py-10 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              aria-labelledby={`exp-title-${exp.id}`}
            >
              {/* Left Column: Duration */}
              <div className="lg:col-span-3">
                <span className="font-mono text-xs text-neutral-500 border border-white/10 rounded-full px-3.5 py-1">
                  {exp.duration}
                </span>
              </div>

              {/* Middle Column: Title & Role */}
              <div className="lg:col-span-4">
                <h3
                  id={`exp-title-${exp.id}`}
                  className="font-display font-bold text-lg text-white uppercase leading-tight"
                >
                  {exp.role}
                </h3>
                <span className="font-mono text-xs text-neutral-500 uppercase mt-1 block">
                  {exp.company}
                </span>
              </div>

              {/* Right Column: Details & Key Achievements */}
              <div className="lg:col-span-5 space-y-4">
                <p className="font-body text-sm text-neutral-400 leading-relaxed">
                  {exp.description}
                </p>
                
                <ul className="space-y-2" aria-label="Achievements">
                  {exp.achievements.map((ach, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs text-neutral-500">
                      <span className="text-white mt-0.5 flex-shrink-0" aria-hidden="true">✦</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
