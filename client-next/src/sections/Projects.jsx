import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS_DATA, PROJECT_CATEGORIES } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowCard from '@/components/ui/GlowCard';
import Button from '@/components/ui/Button';

/**
 * Projects — Portfolio project list with category filter and detail display
 */
export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = PROJECTS_DATA.filter(
    (project) => activeCategory === 'all' || project.category === activeCategory
  );

  return (
    <section id="projects" className="section relative overflow-hidden py-24">
      {/* Decorative gradient glowing spots */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-accent-rose/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-accent-violet/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="04 — Projects"
          title="Handcrafted Web"
          highlight="Solutions"
          description="A collection of frontend interfaces, backend services, and interactive 3D desk experiments I've built."
        />

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-colors duration-300 border ${
                activeCategory === cat.id
                  ? 'border-accent-rose text-text-primary'
                  : 'border-border-glass text-text-muted hover:border-accent-rose/30 hover:text-text-secondary'
              }`}
            >
              {activeCategory === cat.id && (
                <motion.span
                  layoutId="activeProjectTab"
                  className="absolute inset-0 bg-accent-rose/10 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <GlowCard
                  className="group flex flex-col h-full"
                  glowColor="rgba(255, 107, 157, 0.2)"
                >
                  {/* Thumbnail / Image Preview */}
                  <div className="relative aspect-video w-full bg-bg-tertiary overflow-hidden border-b border-border-glass">
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/40 to-transparent z-10" />
                    {/* Image Placeholder with nice SVG graphics */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-elevated to-bg-tertiary">
                      <div className="text-center p-6">
                        <span className="text-4xl block mb-2 opacity-80 transform group-hover:scale-110 transition-transform duration-500">
                          💻
                        </span>
                        <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
                          {project.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-md font-mono text-[0.65rem] tracking-wider uppercase bg-white/5 border border-border-glass text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-display font-bold text-xl text-text-primary mb-3 group-hover:text-accent-rose transition-colors">
                      {project.title}
                    </h3>
                    <p className="font-body text-sm text-text-tertiary leading-relaxed mb-6 flex-grow">
                      {project.description}
                    </p>

                    {/* Action Links */}
                    <div className="flex gap-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        href={project.github}
                      >
                        GitHub ↗
                      </Button>
                      {project.liveUrl !== '#' && (
                        <Button
                          variant="primary"
                          size="sm"
                          href={project.liveUrl}
                        >
                          Live Demo ↗
                        </Button>
                      )}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Physics Desk model helper text */}
        <div className="mt-16 text-center">
          <p className="font-mono text-xs text-text-muted">
            Want some play? Drag and fling project cards in the 3D{' '}
            <span className="text-accent-rose font-bold">Physics Desk</span> below.
          </p>
        </div>
      </div>
    </section>
  );
}
