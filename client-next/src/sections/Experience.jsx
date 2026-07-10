import { motion } from 'framer-motion';
import { EXPERIENCE_DATA } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowCard from '@/components/ui/GlowCard';

/**
 * Experience — Vertical experience timeline with detailed roles & achievements
 */
export default function Experience() {
  return (
    <section id="experience" className="section relative overflow-hidden py-24">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-accent-violet/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="05 — Experience"
          title="Professional Journey &"
          highlight="Achievements"
          description="A record of my roles in customer success, scalability operations, and academic progression."
        />

        <div className="relative pl-6 sm:pl-12 border-l border-border-glass max-w-4xl mx-auto space-y-16">
          {EXPERIENCE_DATA.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative group"
            >
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[55px] top-2 w-5 h-5 rounded-full bg-bg-primary border-[3px] border-accent-violet flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:border-accent-cyan">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-violet group-hover:bg-accent-cyan" />
              </div>

              <GlowCard className="p-6 sm:p-8" glowColor="rgba(124, 109, 250, 0.15)">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-xl text-text-primary">
                      {exp.role}
                    </h3>
                    <div className="font-mono text-sm text-accent-violet font-semibold mt-1">
                      {exp.company}
                    </div>
                  </div>

                  <span className="font-mono text-xs text-text-muted bg-white/5 border border-border-glass px-4 py-1.5 rounded-full self-start sm:self-center">
                    {exp.duration}
                  </span>
                </div>

                <p className="font-body text-sm text-text-secondary leading-relaxed mb-6">
                  {exp.description}
                </p>

                {/* Achievements bullets */}
                <h4 className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-accent-cyan mb-3">
                  Key Deliverables
                </h4>
                <ul className="space-y-3.5 pl-1">
                  {exp.achievements.map((ach, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-text-tertiary items-start">
                      <span className="text-accent-cyan text-base flex-shrink-0 select-none">✦</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
