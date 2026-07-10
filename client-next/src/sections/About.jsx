import { motion } from 'framer-motion';
import { PERSONAL, STATS, TIMELINE_DATA, CERTIFICATES_DATA } from '@/lib/constants';
import { GitHubFeed } from '@/components/features/UIOverlays';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowCard from '@/components/ui/GlowCard';

/**
 * About — Premium about section with bio, statistics, timeline, certifications, and GitHub feed
 */
export default function About() {
  return (
    <section id="about" className="section relative overflow-hidden py-24">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-accent-violet/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-accent-cyan/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="02 — About Me"
          title="Product Mindset Meets"
          highlight="Clean Code"
          description="A self-taught developer bridging the gap between customer experience and engineering."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Bio & Stats */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-text-secondary leading-relaxed text-base sm:text-lg"
            >
              {PERSONAL.bio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <GlowCard className="p-6 text-center" glowColor="rgba(0, 212, 255, 0.2)">
                    <div className="font-display font-extrabold text-3xl sm:text-4xl gradient-text mb-2">
                      {stat.num}
                    </div>
                    <div className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-text-muted">
                      {stat.label}
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Profile & GitHub Feed */}
          <div className="lg:col-span-5 space-y-6">
            {/* Profile Image Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-border-glass bg-gradient-to-br from-accent-violet/10 to-accent-cyan/5 group"
            >
              <img
                src="/Profile insta.jpg"
                alt="Shivank Maurya"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="absolute inset-0 flex items-center justify-center text-7xl select-none">👨‍💻</div>';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* GitHub Feed Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <GitHubFeed />
            </motion.div>
          </div>
        </div>

        {/* Journey Timeline & Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-24">
          {/* Timeline */}
          <div className="lg:col-span-7">
            <h3 className="font-display font-bold text-xl text-text-primary mb-8 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-accent-violet" /> Journey Timeline
            </h3>

            <div className="relative pl-6 border-l border-border-glass space-y-12">
              {TIMELINE_DATA.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  {/* Timeline node */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-bg-primary border-2 border-accent-violet flex items-center justify-center transition-all duration-300 group-hover:border-accent-cyan group-hover:scale-125">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-violet group-hover:bg-accent-cyan" />
                  </div>

                  <div className="font-mono text-xs text-accent-violet group-hover:text-accent-cyan transition-colors mb-1">
                    {item.year}
                  </div>
                  <h4 className="font-display font-bold text-lg text-text-primary mb-2">
                    {item.title}
                  </h4>
                  <p className="font-body text-sm text-text-tertiary leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="lg:col-span-5">
            <h3 className="font-display font-bold text-xl text-text-primary mb-8 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-accent-cyan" /> Credentials & Certifications
            </h3>

            <div className="space-y-4">
              {CERTIFICATES_DATA.map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <GlowCard className="p-5 flex items-center justify-between" glowColor="rgba(124, 109, 250, 0.15)">
                    <div>
                      <h4 className="font-display font-bold text-sm text-text-primary mb-1">
                        {cert.title}
                      </h4>
                      <p className="font-mono text-[0.65rem] tracking-wider uppercase text-text-muted">
                        {cert.issuer}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-text-tertiary">{cert.year}</span>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
