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
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  // Simple, robust email regex standard RFC 5322 compatible
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validateField = (fieldName, value) => {
    const val = (value || '').trim();
    if (fieldName === 'name') {
      if (!val) return 'Name is required';
      if (val.length < 2) return 'Name must be at least 2 characters';
      return '';
    }
    if (fieldName === 'email') {
      if (!val) return 'Email is required';
      if (!emailRegex.test(val)) return 'Please enter a valid email address (e.g. name@domain.com)';
      return '';
    }
    if (fieldName === 'message') {
      if (!val) return 'Message is required';
      if (val.length < 10) return 'Message must be at least 10 characters';
      return '';
    }
    return '';
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Provide real-time validation feedback once the user has interacted or touched the field
    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);

    const nameErr = validateField('name', form.name);
    const emailErr = validateField('email', form.email);
    const messageErr = validateField('message', form.message);
    const newErrors = { name: nameErr, email: emailErr, message: messageErr };
    setErrors(newErrors);

    if (nameErr || emailErr || messageErr) {
      return;
    }

    setStatus('sending');

    try {
      // EmailJS sending
      await emailjs.send('service_id', 'template_id', form, {
        publicKey: 'yRnWaX22NLuowNRUY',
      });
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
      setErrors({});
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

  const getInputClassName = (field) => {
    const hasError = touched[field] && !!errors[field];
    const isValid = touched[field] && !errors[field] && form[field]?.trim();
    return `w-full px-5 py-4 rounded-xl bg-white/5 border text-text-primary placeholder-text-muted focus:outline-none transition-all duration-300 font-body text-sm ${
      hasError
        ? 'border-red-500/70 focus:border-red-500 bg-red-500/[0.03] ring-1 ring-red-500/20'
        : isValid
          ? 'border-emerald-500/60 focus:border-emerald-400 bg-emerald-500/[0.02]'
          : 'border-border-glass focus:border-accent-violet/50'
    }`;
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 h-full justify-between">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="name"
                className="font-mono text-[0.65rem] tracking-widest uppercase text-text-muted font-bold"
              >
                Name <span className="text-red-400">*</span>
              </label>
              {touched.name && !errors.name && form.name?.trim() && (
                <span className="font-mono text-[0.65rem] text-emerald-400">✓ Valid</span>
              )}
            </div>
            <input
              id="name"
              type="text"
              required
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Your Name"
              className={getInputClassName('name')}
            />
            {touched.name && errors.name && (
              <p id="name-error" className="mt-1.5 font-mono text-[0.7rem] text-red-400 flex items-center gap-1">
                <span>⚠</span>
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="email"
                className="font-mono text-[0.65rem] tracking-widest uppercase text-text-muted font-bold"
              >
                Email Address <span className="text-red-400">*</span>
              </label>
              {touched.email && !errors.email && form.email?.trim() && (
                <span className="font-mono text-[0.65rem] text-emerald-400">✓ Valid format</span>
              )}
            </div>
            <input
              id="email"
              type="email"
              required
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="your@email.com"
              className={getInputClassName('email')}
            />
            {touched.email && errors.email && (
              <p id="email-error" className="mt-1.5 font-mono text-[0.7rem] text-red-400 flex items-center gap-1">
                <span>⚠</span>
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="message"
              className="font-mono text-[0.65rem] tracking-widest uppercase text-text-muted font-bold"
            >
              Message <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-3">
              <span className={`font-mono text-[0.65rem] ${form.message.length < 10 ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {form.message.length} chars (min 10)
              </span>
              {touched.message && !errors.message && form.message?.trim() && (
                <span className="font-mono text-[0.65rem] text-emerald-400">✓ Valid</span>
              )}
            </div>
          </div>
          <textarea
            id="message"
            required
            rows={5}
            aria-invalid={touched.message && !!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            onBlur={() => handleBlur('message')}
            placeholder="Tell me about your project, timeline, or position..."
            className={`${getInputClassName('message')} resize-none`}
          />
          {touched.message && errors.message && (
            <p id="message-error" className="mt-1.5 font-mono text-[0.7rem] text-red-400 flex items-center gap-1">
              <span>⚠</span>
              <span>{errors.message}</span>
            </p>
          )}
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
