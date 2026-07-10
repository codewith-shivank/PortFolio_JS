import { motion } from 'framer-motion';
import { SERVICES_DATA } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowCard from '@/components/ui/GlowCard';

/**
 * Services — Grid of service offerings with high-fidelity hover effects
 */
export default function Services() {
  return (
    <section id="services" className="section relative overflow-hidden py-24">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="06 — Services"
          title="Fulfilling Your Project"
          highlight="Requirements"
          description="High-performance web architecture, fluid frontend interactions, and full-stack solutions tailored to your products."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((srv, i) => (
            <motion.div
              key={srv.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            >
              <GlowCard
                className="p-8 h-full flex flex-col items-start group"
                glowColor="rgba(0, 212, 255, 0.15)"
              >
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-border-glass flex items-center justify-center text-2xl mb-6 transform group-hover:scale-115 group-hover:bg-accent-cyan/10 group-hover:border-accent-cyan/30 transition-all duration-500">
                  {srv.icon}
                </div>

                <h3 className="font-display font-bold text-lg text-text-primary mb-3 group-hover:text-accent-cyan transition-colors">
                  {srv.title}
                </h3>
                <p className="font-body text-sm text-text-tertiary leading-relaxed">
                  {srv.description}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
