import { motion } from 'framer-motion';
import { PERSONAL, TIMELINE_DATA, CERTIFICATES_DATA } from '@/lib/constants';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

/**
 * About — Cynthia Ugwu Style Layout
 * Stark black-and-white, split layout, prominent typography
 */
export default function About() {
  return (
    <section id="about" className="section bg-black" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          {/* ── Left Column: Giant Uppercase Header ── */}
          <motion.div {...fadeUp(0)} className="lg:col-span-1">
            <span className="text-meta">Introduction</span>
            <h2
              id="about-heading"
              className="font-display font-extrabold text-white tracking-tighter mt-2 uppercase leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
            >
              About<br />
              <span className="text-neutral-500">Myself</span>
            </h2>

            {/* Profile Avatar Frame */}
            <div className="mt-8 relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] max-w-xs">
              <img
                src="/Profile%20insta.jpg"
                alt="Shivank Maurya, MERN Stack Software Engineer"
                className="w-full h-full object-cover grayscale contrast-125"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-full h-full flex items-center justify-center bg-neutral-900 text-6xl';
                  fallback.textContent = '👨‍💻';
                  e.currentTarget.parentNode.appendChild(fallback);
                }}
              />
            </div>
          </motion.div>

          {/* ── Right Column: Bio Content & Sub-grids ── */}
          <div className="lg:col-span-2 space-y-12">
            {/* Bio Paragraphs */}
            <motion.div {...fadeUp(0.1)} className="space-y-6 text-neutral-400 font-body text-base leading-relaxed">
              {PERSONAL.bio.map((para, i) => (
                <p key={i} className="text-sm sm:text-base">
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Sub-grid: Timeline & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/10 pt-10">
              
              {/* Timeline (Academic Journey) */}
              <motion.div {...fadeUp(0.2)}>
                <h3 className="text-meta mb-6 text-white font-bold flex items-center gap-2">
                  Timeline
                </h3>
                <div className="space-y-6 border-l border-white/10 pl-4" role="list">
                  {TIMELINE_DATA.map((item) => (
                    <div key={item.year} role="listitem" className="relative group">
                      {/* Accent Dot */}
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-500 group-hover:bg-white border border-black transition-colors" />
                      <span className="font-mono text-[0.68rem] text-neutral-500 font-semibold">{item.year}</span>
                      <h4 className="font-display font-bold text-sm text-white uppercase mt-0.5">{item.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Certifications */}
              <motion.div {...fadeUp(0.3)}>
                <h3 className="text-meta mb-6 text-white font-bold">
                  Certifications
                </h3>
                <div className="space-y-4" role="list">
                  {CERTIFICATES_DATA.map((cert) => (
                    <div key={cert.title} role="listitem" className="pb-3 border-b border-white/5 hover:border-white/20 transition-colors">
                      <h4 className="font-display font-semibold text-sm text-white uppercase">{cert.title}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-mono text-[0.6rem] text-neutral-500 uppercase">{cert.issuer}</span>
                        <span className="font-mono text-[0.6rem] text-neutral-500">{cert.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
