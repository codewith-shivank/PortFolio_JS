import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS_DATA } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowCard from '@/components/ui/GlowCard';

/**
 * Testimonials — Auto-playing animated carousel of client reviews
 */
export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex(
      (prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length
    );
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const activeTestimonial = TESTIMONIALS_DATA[activeIndex];

  return (
    <section id="testimonials" className="section relative overflow-hidden py-24">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-10 w-80 h-80 rounded-full bg-accent-violet/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="07 — Testimonials"
          title="What Clients &"
          highlight="Collaborators Say"
          description="Feedback from team members and project stakeholders on working together."
        />

        <div className="relative max-w-3xl mx-auto mt-12 min-h-[380px] sm:min-h-[300px] flex flex-col justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <GlowCard className="p-8 sm:p-12 relative" glowColor="rgba(124, 109, 250, 0.2)">
                {/* Quote decoration */}
                <span className="absolute top-4 left-6 text-7xl font-serif text-text-faint pointer-events-none select-none">
                  “
                </span>

                <blockquote className="relative z-10">
                  <p className="font-body text-base sm:text-lg text-text-secondary leading-relaxed italic mb-8">
                    {activeTestimonial.quote}
                  </p>

                  <div className="flex items-center gap-4 mt-6">
                    <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-xl">
                      {activeTestimonial.avatar}
                    </div>

                    <div>
                      <cite className="not-italic font-display font-bold text-sm text-text-primary block">
                        {activeTestimonial.name}
                      </cite>
                      <span className="font-mono text-[0.65rem] tracking-wider uppercase text-text-muted mt-0.5 block">
                        {activeTestimonial.role} · {activeTestimonial.company}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="ml-auto flex gap-0.5 text-accent-amber text-xs select-none">
                      {Array.from({ length: activeTestimonial.rating }).map((_, idx) => (
                        <span key={idx}>★</span>
                      ))}
                    </div>
                  </div>
                </blockquote>
              </GlowCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'bg-accent-violet w-6'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-border-glass bg-surface-glass flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent-violet/30 hover:bg-surface-glass-hover transition-all"
                aria-label="Previous testimonial"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-border-glass bg-surface-glass flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent-violet/30 hover:bg-surface-glass-hover transition-all"
                aria-label="Next testimonial"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
