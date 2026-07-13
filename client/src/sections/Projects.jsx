import { useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { PROJECTS_DATA, PROJECT_CATEGORIES } from '@/lib/constants';

/**
 * Projects — Cynthia Ugwu Style List
 * Clean rows, outline dividers, mouse-following project image preview with smooth spring lag and speed tilts.
 *
 * Fixes applied:
 * - Removed window-level mousemove listener (memory leak) — handled on container div only
 * - Replaced innerHTML injection (XSS) with React-safe state-based image fallback
 * - useCallback on event handlers to prevent unnecessary re-renders
 */
export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);
  // Track image load errors per project id to render safe fallback
  const [imgErrors, setImgErrors] = useState({});

  // Coordinates for the floating cursor follower
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ref to the project list container to calculate bounding boxes
  const listRef = useRef(null);

  // Velocity-based rotation calculation variables
  const [rotate, setRotate] = useState(0);
  const lastX = useRef(0);
  const lastTime = useRef(Date.now());

  // Apply smooth spring physics to mouse movements (lag/easing effect)
  const springX = useSpring(mouseX, { stiffness: 220, damping: 25, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 25, mass: 0.5 });

  const filteredProjects = PROJECTS_DATA.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const handleMouseMove = useCallback((e) => {
    if (!listRef.current) return;

    // Get mouse coordinates relative to the projects container
    const rect = listRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    // Calculate rotation based on velocity (change in X over time)
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 10) {
      const speed = (e.clientX - lastX.current) / dt;
      setRotate(Math.min(Math.max(speed * 120, -15), 15));
      lastX.current = e.clientX;
      lastTime.current = now;
    }
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setHoveredProject(null);
    setRotate(0);
  }, []);

  const handleImgError = useCallback((id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  }, []);

  return (
    <section id="projects" className="section bg-black relative" aria-labelledby="projects-heading">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-meta">Case Studies</span>
            <h2
              id="projects-heading"
              className="font-display font-extrabold text-white tracking-tighter mt-2"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', textTransform: 'uppercase' }}
            >
              Selected Work
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter case studies by category"
          >
            {PROJECT_CATEGORIES.map((cat) => (
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
        </div>

        {/* Project Row List Container */}
        <div
          ref={listRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full border-b border-white/10"
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-row group"
              onMouseEnter={() => setHoveredProject(project)}
            >
              {/* Title & Tech Stack */}
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-8">
                <span className="project-row-title">{project.title}</span>
                <div className="flex flex-wrap gap-1.5 mt-2 md:mt-0">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[0.55rem] tracking-wider uppercase text-neutral-600 group-hover:text-neutral-400 border border-white/5 rounded px-2 py-0.5 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta Right */}
              <div className="flex items-center gap-6">
                <span className="project-row-meta hidden sm:inline-block">
                  {project.category === 'fullstack' ? 'MERN Stack' : 'Frontend'}
                </span>

                {/* GitHub Icon — secure link */}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-white/10 rounded-full text-neutral-500 hover:text-white hover:border-white transition-colors"
                  aria-label={`View ${project.title} source code on GitHub`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
              </div>
            </div>
          ))}

          {/* Cursor Follower Project Preview Card */}
          <AnimatePresence>
            {hoveredProject && (
              <motion.div
                className="absolute pointer-events-none z-50 w-72 h-44 overflow-hidden rounded-xl border border-white/20 bg-neutral-900 shadow-2xl"
                style={{
                  left: springX,
                  top: springY,
                  x: '-50%',
                  y: '-50%',
                  rotate,
                  transformOrigin: 'center center',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                aria-hidden="true"
              >
                {/* Safe React image fallback — no innerHTML injection */}
                {imgErrors[hoveredProject.id] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950 text-white select-none">
                    <span className="text-3xl">💻</span>
                    <span className="text-xs uppercase mt-2 tracking-widest text-neutral-500">
                      {hoveredProject.title}
                    </span>
                  </div>
                ) : (
                  <img
                    src={hoveredProject.image}
                    alt=""
                    className="w-full h-full object-cover object-top"
                    onError={() => handleImgError(hoveredProject.id)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="font-mono text-[0.6rem] text-neutral-700 text-center mt-12 uppercase tracking-wider" aria-hidden="true">
          Hover rows to reveal project previews · Click GitHub icon for source code
        </p>
      </div>
    </section>
  );
}
