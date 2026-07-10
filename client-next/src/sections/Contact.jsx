import { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { SITE, SOCIAL_LINKS } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowCard from '@/components/ui/GlowCard';
import Button from '@/components/ui/Button';

/**
 * Contact — Working contact form with dynamic status states and fallback to mailto
 */
export default function Contact() {
  return (
    <section id="contact" className="section relative overflow-hidden py-24">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-violet/5 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="08 — Contact"
          title="Let's Build Something"
          highlight="Remarkable"
          description="Have an idea, project, or full-time position you'd like to discuss? Reach out and I'll get back to you within 24 hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mt-12">
          {/* Contact Details / Socials */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="font-display font-bold text-xl text-text-primary">
                Contact Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="text-xl">📧</span>
                  <div>
                    <span className="font-mono text-[0.65rem] tracking-wider uppercase text-text-muted block">
                      Email
                    </span>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="font-body text-base text-text-secondary hover:text-accent-violet transition-colors"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="text-xl">📍</span>
                  <div>
                    <span className="font-mono text-[0.65rem] tracking-wider uppercase text-text-muted block">
                      Location
                    </span>
                    <span className="font-body text-base text-text-secondary">
                      {SITE.location}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="text-xl">⚡</span>
                  <div>
                    <span className="font-mono text-[0.65rem] tracking-wider uppercase text-text-muted block">
                      Availability
                    </span>
                    <span className="live-badge mt-1">
                      <span className="live-dot" />
                      {SITE.availability}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">
                Follow My Work
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border border-border-glass bg-surface-glass flex items-center gap-3 text-text-secondary hover:text-accent-violet hover:border-accent-violet/30 hover:bg-accent-violet/5 transition-all duration-300"
                  >
                    <span className="font-body text-sm font-semibold">{link.label}</span>
                    <span className="text-xs text-text-muted ml-auto">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <GlowCard className="p-8 h-full" glowColor="rgba(124, 109, 250, 0.2)">
              <ContactForm />
            </GlowCard>
          </div>
        </div>

        {/* Easter Egg Hint Banner */}
        <div className="mt-20 text-center font-mono text-[0.6rem] tracking-[0.2em] text-text-faint uppercase select-none">
          Try: ↑↑↓↓←→←→BA · Click 5 stars · Find 3 secrets
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // EmailJS sending
      await emailjs.send('service_id', 'template_id', form, {
        publicKey: 'yRnWaX22NLuowNRUY',
      });
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS send failed, falling back to mailto:', error);
      // Fallback: mailto link activation
      window.location.href = `mailto:${SITE.email}?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(
        form.message
      )}`;
      setStatus('sent');
    }

    setTimeout(() => setStatus('idle'), 4000);
  };

  const inputStyle =
    'w-full px-5 py-4 rounded-xl bg-white/5 border border-border-glass text-text-primary placeholder-text-muted focus:border-accent-violet/50 focus:outline-none transition-colors duration-300 font-body text-sm';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full justify-between">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block font-mono text-[0.65rem] tracking-widest uppercase text-text-muted mb-2 font-bold"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your Name"
              className={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-mono text-[0.65rem] tracking-widest uppercase text-text-muted mb-2 font-bold"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block font-mono text-[0.65rem] tracking-widest uppercase text-text-muted mb-2 font-bold"
            >
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Tell me about your project..."
            className={`${inputStyle} resize-none`}
          />
        </div>
      </div>

      <div className="pt-4 self-start">
        <Button
          type="submit"
          disabled={status === 'sending'}
          variant={status === 'sent' ? 'success' : 'primary'}
          size="lg"
        >
          {status === 'sending'
            ? 'Sending...'
            : status === 'sent'
              ? '✓ Sent Successfully!'
              : 'Send Message →'}
        </Button>
      </div>
    </form>
  );
}
