import { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

export default function Contact() {
  return (
    <section
      id="contact"
      className="section"
      style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}
    >
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 2rem', width: '100%' }}>
        <p className="section-label">05 — Contact</p>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          letterSpacing: '-0.03em',
          color: '#f0f0ff',
          marginBottom: '1.5rem',
        }}>
          Let's <span style={{ background: 'linear-gradient(135deg,#7c6dfa,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Build</span> Something
        </h2>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(240,240,255,0.5)', lineHeight: 1.7, marginBottom: '3rem' }}>
          Have a project in mind or want to collaborate? I'm available for full-time roles and freelance projects.
        </p>

        {/* Contact form */}
        <ContactForm />

        {/* Footer */}
        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,240,255,0.25)' }}>
            © 2025 CodeWithShivank · Built with React + Three.js + WebGL
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              ['GitHub', 'https://github.com/codewith-shivank'],
              ['LinkedIn', 'https://www.linkedin.com/in/shivank-maurya-21257a303/'],
              ['YouTube', 'https://www.youtube.com/@CodeWithShivank12'],
            ].map(([label, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,240,255,0.3)', textDecoration: 'none' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Easter egg hint */}
        <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>
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
    // EmailJS integration
    try {
      await emailjs.send('service_id', 'template_id', form, {
        publicKey: 'yRnWaX22NLuowNRUY',
      });
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS send failed, falling back to mailto:', error);
      // Fallback: open mailto
      window.location.href = `mailto:codewithshivank@gmail.com?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}`;
      setStatus('sent');
    }
    setTimeout(() => setStatus('idle'), 4000);
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0f0ff',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div>
          <label htmlFor="contact-name" style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Name</label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            placeholder="Your name"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(124,109,250,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
        </div>
        <div>
          <label htmlFor="contact-email" style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Email</label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            placeholder="your@email.com"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(124,109,250,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Message</label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
          rows={6}
          placeholder="Tell me about your project..."
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(124,109,250,0.5)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        />
      </div>

      <motion.button
        type="submit"
        disabled={status === 'sending'}
        style={{
          padding: '1rem 2.5rem',
          borderRadius: 99,
          border: 'none',
          background: status === 'sent'
            ? 'linear-gradient(135deg,#00ff88,#00cc70)'
            : 'linear-gradient(135deg,#7c6dfa,#5b4fcf)',
          color: status === 'sent' ? '#050510' : 'white',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: '1rem',
          boxShadow: '0 8px 32px rgba(124,109,250,0.35)',
          alignSelf: 'flex-start',
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(124,109,250,0.5)' }}
        whileTap={{ scale: 0.97 }}
      >
        {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Sent!' : 'Send Message →'}
      </motion.button>
    </form>
  );
}
