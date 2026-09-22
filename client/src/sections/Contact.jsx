import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { doc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { FaGoogle, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { SITE, SOCIAL_LINKS, PERSONAL, API_BASE } from '@/lib/constants';
import Magnetic from '@/components/ui/Magnetic';
import { useAuth } from '@/context/AuthContext';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

/**
 * Contact — Cynthia Ugwu Style Contact Section
 * Stark layouts, bottom-bordered inputs, Firestore persistence & Google Auth identity
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
              <span className="text-meta">Inquiries & Contact</span>
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
              <div className="flex flex-wrap gap-4">
                <Magnetic>
                  <button
                    onClick={handleResumeDownload}
                    className="btn btn-outline text-xs"
                    aria-label="Download CV"
                  >
                    Download CV ↓
                  </button>
                </Magnetic>
              </div>

              {/* Social links list */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-neutral-600">Connect</p>
                <div className="flex flex-wrap gap-4">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                      aria-label={`${link.label} (opens in new tab)`}
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right Column: Form ── */}
          <motion.div className="lg:col-span-3" {...fadeUp(0.2)}>
            <div className="border border-white/10 p-6 sm:p-10 rounded-2xl bg-neutral-950/50 backdrop-blur-sm">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const { user, signInWithGoogle, isSigningIn } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [myInquiries, setMyInquiries] = useState([]);
  const [showInquiries, setShowInquiries] = useState(false);

  // Email format regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validateField = (fieldName, value) => {
    const val = (value || '').trim();
    if (fieldName === 'name') {
      if (!val) return 'Name cannot be empty';
      if (val.length < 2) return 'Name must be at least 2 characters';
      return '';
    }
    if (fieldName === 'email') {
      if (!val) return 'Email cannot be empty';
      if (!emailRegex.test(val)) return 'Please enter a valid email format (e.g. you@example.com)';
      return '';
    }
    if (fieldName === 'message') {
      if (!val) return 'Message cannot be empty';
      if (val.length < 10) return `Message must be at least 10 characters (${val.length}/10)`;
      return '';
    }
    return '';
  };

  // Sync Google user profile to form inputs
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  // Real-time listener for current user's submitted inquiries
  useEffect(() => {
    if (!user?.uid) {
      setMyInquiries([]);
      return;
    }

    try {
      const q = query(
        collection(db, 'inquiries'),
        where('userId', '==', user.uid)
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          // Sort client-side by date descending
          docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMyInquiries(docs);
        },
        (error) => {
          console.error('Error fetching user inquiries:', error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error('Snapshot registration failed:', err);
    }
  }, [user?.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateForm = () => {
    setTouched({ name: true, email: true, message: true });
    const nameErr = validateField('name', form.name);
    const emailErr = validateField('email', form.email);
    const messageErr = validateField('message', form.message);
    const newErrors = { name: nameErr, email: emailErr, message: messageErr };
    setErrors(newErrors);

    if (nameErr) {
      toast.error(nameErr);
      return false;
    }
    if (emailErr) {
      toast.error(emailErr);
      return false;
    }
    if (messageErr) {
      toast.error(messageErr);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const inquiryPath = `inquiries/${inquiryId}`;

    const inquiryData = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: (form.subject || 'Portfolio Inquiry').trim(),
      message: form.message.trim(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    if (user?.uid) {
      inquiryData.userId = user.uid;
    }

    try {
      // 1. Direct durable Cloud Firestore persistence
      await setDoc(doc(db, 'inquiries', inquiryId), inquiryData);

      // 2. Also notify backend API if available
      axios.post(`${API_BASE}/contact`, inquiryData).catch(() => {});

      toast.success("Inquiry received! Stored securely in Firestore.", { duration: 5000 });
      setForm({
        name: user ? (user.displayName || '') : '',
        email: user ? (user.email || '') : '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error('Firestore submission error:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, inquiryPath);
      } catch {
        // Fallback to local API or mailto
        try {
          await axios.post(`${API_BASE}/contact`, inquiryData);
          toast.success("Message sent! I'll get back to you within 24 hours.", { duration: 5000 });
          setForm({
            name: user ? (user.displayName || '') : '',
            email: user ? (user.email || '') : '',
            subject: '',
            message: '',
          });
        } catch {
          const mailtoFallback = `mailto:${SITE.email}?subject=${encodeURIComponent(
            form.subject || 'Portfolio Inquiry'
          )}&body=${encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
          )}`;
          toast.error(
            'Server temporarily unavailable — opening email client as fallback.',
            { duration: 4000, icon: '✉️' }
          );
          setTimeout(() => {
            window.location.href = mailtoFallback;
          }, 1600);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Auth identity bar */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {user ? (
          <div className="flex items-center gap-2.5">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-7 h-7 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-purple-600/30 text-white flex items-center justify-center font-bold text-xs">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <p className="font-semibold text-white flex items-center gap-1.5">
                <span>{user.displayName}</span>
                <FaCheckCircle className="text-emerald-400 text-xs" />
              </p>
              <p className="font-mono text-[0.65rem] text-text-muted">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-600" />
            <span className="font-mono text-[0.7rem] text-neutral-400">
              Submit as guest or authenticate
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {!user && (
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              disabled={isSigningIn}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 text-white font-mono text-[0.65rem] uppercase tracking-wider transition-colors cursor-pointer ${
                isSigningIn ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <FaGoogle className="text-red-400 text-xs" />
              <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          )}

          {user && myInquiries.length > 0 && (
            <button
              type="button"
              onClick={() => setShowInquiries(!showInquiries)}
              className="font-mono text-[0.65rem] uppercase tracking-wider text-purple-400 hover:text-purple-300 underline cursor-pointer"
            >
              {showInquiries ? 'Hide My Inquiries' : `Your Inquiries (${myInquiries.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Accordion of sent inquiries */}
      <AnimatePresence>
        {showInquiries && myInquiries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-3 overflow-hidden text-xs"
          >
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-neutral-500">
              Your Inquiries (Real-time Firestore sync)
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {myInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-2.5 rounded-lg border border-white/5 bg-white/5 flex items-center justify-between"
                >
                  <div className="overflow-hidden pr-2">
                    <p className="font-medium text-white truncate">{inq.subject}</p>
                    <p className="text-[0.65rem] text-neutral-400 truncate">{inq.message}</p>
                  </div>
                  <span
                    className={`font-mono text-[0.6rem] uppercase px-2 py-0.5 rounded ${
                      inq.status === 'read'
                        ? 'bg-blue-500/20 text-blue-300'
                        : inq.status === 'archived'
                        ? 'bg-neutral-800 text-neutral-400'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {inq.status === 'unread' ? 'Received' : inq.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-label="Contact form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="contact-name" className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-500 block">
                Name <span className="text-red-400">*</span>
              </label>
              {touched.name && !errors.name && form.name?.trim() && (
                <span className="font-mono text-[0.6rem] text-emerald-400">✓ Valid</span>
              )}
            </div>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="YOUR NAME"
              className={`form-input-cynthia font-display uppercase tracking-wider font-semibold placeholder-neutral-800 ${
                touched.name && errors.name
                  ? 'border-b-red-500/80 text-red-100'
                  : touched.name && !errors.name && form.name?.trim()
                  ? 'border-b-emerald-500/80'
                  : ''
              }`}
              autoComplete="name"
            />
            {touched.name && errors.name && (
              <p id="contact-name-error" className="mt-1.5 font-mono text-[0.65rem] text-red-400 flex items-center gap-1">
                <span>⚠</span>
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="contact-email" className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-500 block">
                Email <span className="text-red-400">*</span>
              </label>
              {touched.email && !errors.email && form.email?.trim() && (
                <span className="font-mono text-[0.6rem] text-emerald-400">✓ Valid format</span>
              )}
            </div>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="YOU@EMAIL.COM"
              className={`form-input-cynthia font-display uppercase tracking-wider font-semibold placeholder-neutral-800 ${
                touched.email && errors.email
                  ? 'border-b-red-500/80 text-red-100'
                  : touched.email && !errors.email && form.email?.trim()
                  ? 'border-b-emerald-500/80'
                  : ''
              }`}
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <p id="contact-email-error" className="mt-1.5 font-mono text-[0.65rem] text-red-400 flex items-center gap-1">
                <span>⚠</span>
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-500 block">
            Subject
          </label>
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
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="contact-message" className="font-mono text-[0.6rem] uppercase tracking-wider text-neutral-500 block">
              Message <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-3 font-mono text-[0.6rem]">
              <span className={form.message.trim().length < 10 ? 'text-neutral-500' : 'text-neutral-400'}>
                {form.message.trim().length} chars (min 10)
              </span>
              {touched.message && !errors.message && form.message?.trim() && (
                <span className="text-emerald-400">✓ Valid</span>
              )}
            </div>
          </div>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            aria-invalid={touched.message && !!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="WRITE YOUR MESSAGE HERE..."
            className={`form-input-cynthia font-display uppercase tracking-wider font-semibold placeholder-neutral-800 resize-none ${
              touched.message && errors.message
                ? 'border-b-red-500/80 text-red-100'
                : touched.message && !errors.message && form.message?.trim()
                ? 'border-b-emerald-500/80'
                : ''
            }`}
          />
          {touched.message && errors.message && (
            <p id="contact-message-error" className="mt-1.5 font-mono text-[0.65rem] text-red-400 flex items-center gap-1">
              <span>⚠</span>
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        <Magnetic>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            aria-label={submitting ? 'Sending message...' : 'Send message'}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <FaPaperPlane className="text-xs" />
            <span>{submitting ? 'Sending...' : 'Send Message →'}</span>
          </button>
        </Magnetic>
      </form>
    </div>
  );
}
