import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS_DATA, SKILL_CATEGORIES } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowCard from '@/components/ui/GlowCard';

/**
 * Skills — Interactive skills grid with tab-based filtering and animated proficiency bars
 */
export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = SKILLS_DATA.filter(
    (skill) => activeCategory === 'all' || skill.category === activeCategory
  );

  return (
    <section id="skills" className="section relative overflow-hidden py-24">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-violet/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="03 — Skills"
          title="My Technical"
          highlight="Ecosystem"
          description="A curated selection of languages, frameworks, libraries, and developer utilities that I use to bring ideas to life."
        />

        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider transition-colors duration-300 border ${
                activeCategory === cat.id
                  ? 'border-accent-violet text-text-primary'
                  : 'border-border-glass text-text-muted hover:border-accent-violet/30 hover:text-text-secondary'
              }`}
            >
              {activeCategory === cat.id && (
                <motion.span
                  layoutId="activeSkillTab"
                  className="absolute inset-0 bg-accent-violet/10 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, i) => (
              <motion.div
                layout
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <GlowCard
                  className="p-5 flex flex-col h-full items-center justify-center text-center group"
                  glowColor="rgba(124, 109, 250, 0.15)"
                >
                  <span className="text-3xl mb-3 filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                    {skill.icon}
                  </span>
                  <h4 className="font-display font-bold text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    {skill.name}
                  </h4>

                  {/* Custom animated progress pill */}
                  <div className="w-full mt-4 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                    />
                  </div>
                  <span className="font-mono text-[0.6rem] text-text-muted mt-1.5">
                    {skill.proficiency}% Proficiency
                  </span>
                </GlowCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to Universe (Integration hint for 3D Solar System) */}
        <div className="mt-16 text-center">
          <p className="font-mono text-xs text-text-muted">
            Prefer a 3D visualization? Scroll down to explore my skills in the{' '}
            <span className="text-accent-cyan font-bold">Skills Universe</span> model.
          </p>
        </div>
      </div>
    </section>
  );
}
