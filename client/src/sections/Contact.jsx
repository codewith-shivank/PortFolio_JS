import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { SITE, SOCIAL_LINKS, PERSONAL, API_BASE } from '@/lib/constants';
import Magnetic from '@/components/ui/Magnetic';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

/**
 * Contact — Cynthia Ugwu Style Contact Section
 * Stark layouts, bottom-bordered inputs, pre-filled fallback handlers
 */
export default function Contact() {
  const handleResumeDownload = () => {
    axios.post(`${API_BASE}/resume/download`).catch(() => {});
    window.open(PERSONAL.resumeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="section bg-black" aria-labelledby="contact-heading">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* ── Left Column: Headers & Info ── */}
          <motion.div className="lg:col-span-2 space-y-10" {...fadeUp(0)}>
            <div>
              <span className="text-meta">Inquiries</span>
              <h2
                id="contact-heading"
                className="font-display font-extrabold text-white tracking-tighter mt-2 uppercase leading-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
              >
                Let's<br />
                <span className="text-neutral-500">Connect</span>
              </h2>
            </div>

            {/* Location & Availability Status */}
            <div className="space-y-4 font-body text-neutral-400 text-sm">
              <div className="flex items-center gap-2">
                <span className="status-dot" />
                <span>{SITE.availability}</span>
              </div>
              <p>Based in {SITE.location}</p>
              <p>
                Email:{' '}
                <a href={`mailto:${SITE.email}`} className="text-white hover:underline transition-all">
                  {SITE.email}
                </a>
              </p>
            </div>

            {/* Direct Links */}
            <div className="space-y-6">
              <div>
                <span className="text-meta block mb-3">Resume</span>
                <Magnetic>
                  <button
                    onClick={handleResumeDownload}
                    className="btn btn-secondary text-xs"
                    aria-label="Download resume PDF"
                  >
                    Download Resume ↗
                  </button>
                </Magnetic>
              </div>

              {/* Social Channels */}
              <div>
                <span className="text-meta block mb-3">Socials</span>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <Magnetic key={link.label}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white hover:text-black font-mono text-[0.6rem] uppercase tracking-wider transition-all duration-200"
                        aria-label={`Visit my ${link.label}`}
                      >
                        {link.label}
                      </a>
                    </Magnetic>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right Column: Form Panel (Underline Fields) ── */}
          <motion.div className="lg:col-span-3" {...fadeUp(0.2)}>
            <div className="space-y-6">
              <span className="text-meta block">Contact Form</span>
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!form.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      toast.error('Please enter a message containing at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      await axios.post(`${API_BASE}/contact`, form);
      toast.success('Message sent! I\'ll get back to you within 24 hours.', { duration: 5000 });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.warn('Contact API error, triggering fallback:', err);
      toast.error('Contact database service is offline. Opening your email client to send the message...', {
        duration: 4000,
        icon: '✉️'
      });
      setTimeout(() => {
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(form.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-label="Contact form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="contact-name" className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-500 block">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="YOUR NAME"
            className="form-input-cynthia font-display uppercase tracking-wider font-semibold placeholder-neutral-800"
            autoComplete="name"
          />
        </div>
        
        <div>
          <label htmlFor="contact-email" className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-500 block">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="YOU@EMAIL.COM"
            className="form-input-cynthia font-display uppercase tracking-wider font-semibold placeholder-neutral-800"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-500 block">Subject</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          placeholder="OPPORTUNITY, COLLABORATION..."
          className="form-input-cynthia font-display uppercase tracking-wider font-semibold placeholder-neutral-800"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-500 block">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="WRITE YOUR MESSAGE HERE..."
          className="form-input-cynthia font-display uppercase tracking-wider font-semibold placeholder-neutral-800 resize-none"
        />
      </div>

      <Magnetic>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          aria-label="Send message"
        >
          {submitting ? 'Sending...' : 'Send Message →'}
        </button>
      </Magnetic>
    </form>
  );
}
