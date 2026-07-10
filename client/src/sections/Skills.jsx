import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS_DATA, SKILL_CATEGORIES } from '@/lib/constants';

/**
 * Skills — Cynthia Ugwu Style Overhaul
 * Stark monochrome categories, clean square outline badges
 */
export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = SKILLS_DATA.filter(
    (skill) => activeCategory === 'all' || skill.category === activeCategory
  );

  return (
    <section id="skills" className="section bg-black" aria-labelledby="skills-heading">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-meta">Core Stack</span>
            <h2
              id="skills-heading"
              className="font-display font-extrabold text-white tracking-tighter mt-2 uppercase leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              Technologies
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter skills by category"
          >
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full font-mono text-[0.68rem] uppercase tracking-wider transition-all duration-200 border ${
                  activeCategory === cat.id
                    ? 'border-white text-white bg-white/10'
                    : 'border-white/10 text-neutral-500 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Skills Grid — Stark outlines, no color icons */}
        <motion.div
          layout
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
          role="list"
          aria-label={`${activeCategory === 'all' ? 'All' : activeCategory} skills`}
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                key={skill.name}
                role="listitem"
                className="group flex flex-col items-center justify-center p-5 rounded-lg bg-neutral-950 border border-white/5 hover:border-white/20 transition-all duration-300 select-none text-center h-24"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                title={skill.name}
              >
                {/* Monochromatic large letter/icon representation instead of color emoji */}
                <span className="text-2xl mb-2 opacity-65 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  {skill.icon}
                </span>
                <span className="font-mono text-[0.65rem] text-neutral-500 group-hover:text-white uppercase tracking-wider transition-colors">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
