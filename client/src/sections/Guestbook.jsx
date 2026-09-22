import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { FaGoogle, FaTrash, FaPen, FaQuoteLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import Magnetic from '@/components/ui/Magnetic';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

/**
 * Guestbook & Recommendations — Cynthia Ugwu Aesthetic
 * Verified visitor endorsements and recruiter recommendations powered by Firestore & Google Auth
 */
export default function Guestbook() {
  const { user, isAdmin, signInWithGoogle, isSigningIn } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);

  // Subscribe to guestbook entries in real-time
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'guestbook'),
        (snapshot) => {
          const docs = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          // Sort descending by creation date
          docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setEntries(docs);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching guestbook:', error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error('Snapshot registration failed:', err);
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast('Please sign in with Google to post', { icon: '✨' });
      return;
    }
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error('Please write a message before posting');
      return;
    }
    if (trimmed.length > 1000) {
      toast.error('Message cannot exceed 1000 characters');
      return;
    }

    setPosting(true);
    const entryId = `gb_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const entryPath = `guestbook/${entryId}`;

    const newEntry = {
      userId: user.uid,
      userName: user.displayName || 'Developer Visitor',
      message: trimmed,
      createdAt: new Date().toISOString(),
    };

    if (user.photoURL) newEntry.userPhoto = user.photoURL;
    if (user.email) newEntry.userEmail = user.email;

    try {
      await setDoc(doc(db, 'guestbook', entryId), newEntry);
      toast.success('Recommendation posted to Guestbook! Stored in Firestore.');
      setMessage('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, entryPath);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (entryId, authorUid) => {
    if (!user) return;
    if (user.uid !== authorUid && !isAdmin) {
      toast.error('You can only remove your own entries');
      return;
    }

    const entryPath = `guestbook/${entryId}`;
    try {
      await deleteDoc(doc(db, 'guestbook', entryId));
      toast.success('Entry removed');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, entryPath);
    }
  };

  return (
    <section id="guestbook" className="section bg-black border-t border-white/5" aria-labelledby="guestbook-heading">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16" {...fadeUp(0)}>
          <div>
            <span className="text-meta">Community & Peer Endorsements</span>
            <h2
              id="guestbook-heading"
              className="font-display font-extrabold text-white tracking-tighter mt-2 uppercase leading-none"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
            >
              Visitor<br />
              <span className="text-neutral-500">Guestbook</span>
            </h2>
          </div>

          <p className="font-mono text-xs text-neutral-400 max-w-sm">
            Recruiters, engineering peers, and visitors authenticated via Google Sign-In can leave endorsements persisted securely in Cloud Firestore.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form & Auth prompt */}
          <motion.div className="lg:col-span-5 space-y-6" {...fadeUp(0.1)}>
            <div className="border border-white/10 p-6 sm:p-8 rounded-2xl bg-neutral-950/60 backdrop-blur-sm">
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight mb-2 flex items-center gap-2">
                <FaPen className="text-purple-400 text-sm" />
                <span>Leave an Endorsement</span>
              </h3>
              <p className="font-mono text-xs text-neutral-400 mb-6">
                Share feedback on projects, engineering architecture, or recruiter inquiries.
              </p>

              {user ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full border border-white/20 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 text-white flex items-center justify-center font-mono text-xs">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white truncate">
                        {user.displayName}
                      </p>
                      <p className="text-[0.65rem] text-neutral-400 truncate">
                        Verified via Google Sign-In
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="guestbook-message" className="sr-only">
                      Your endorsement message
                    </label>
                    <textarea
                      id="guestbook-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your recommendation, note, or peer feedback..."
                      maxLength={1000}
                      className="form-input-cynthia text-sm placeholder-neutral-700 resize-none font-normal"
                    />
                    <div className="flex justify-between items-center mt-2 text-[0.65rem] font-mono text-neutral-500">
                      <span>Live sync with Cloud Firestore</span>
                      <span>{message.length} / 1000</span>
                    </div>
                  </div>

                  <Magnetic>
                    <button
                      type="submit"
                      disabled={posting || !message.trim()}
                      className="btn btn-primary w-full text-xs"
                    >
                      {posting ? 'Publishing...' : 'Post Endorsement →'}
                    </button>
                  </Magnetic>
                </form>
              ) : (
                <div className="space-y-4 text-center py-4">
                  <p className="font-mono text-xs text-neutral-300">
                    Sign in with your Google account to post a verified recommendation.
                  </p>
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    disabled={isSigningIn}
                    className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors cursor-pointer ${
                      isSigningIn ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaGoogle className="text-red-400 text-sm" />
                    <span>{isSigningIn ? 'Connecting to Google...' : 'Authenticate with Google'}</span>
                  </button>
                  <p className="font-mono text-[0.65rem] text-neutral-500">
                    Your avatar and verified name will be displayed alongside your note.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Live list of endorsements */}
          <motion.div className="lg:col-span-7 space-y-4" {...fadeUp(0.2)}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                Endorsements ({entries.length})
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Firestore Stream
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center font-mono text-xs text-neutral-500 animate-pulse">
                Fetching guestbook entries...
              </div>
            ) : entries.length === 0 ? (
              <div className="p-12 border border-white/5 rounded-2xl bg-white/[0.02] text-center space-y-2">
                <FaQuoteLeft className="mx-auto text-neutral-700 text-2xl" />
                <p className="font-mono text-xs text-neutral-400">
                  No endorsements posted yet.
                </p>
                <p className="font-mono text-[0.7rem] text-neutral-600">
                  Be the first visitor to sign the guestbook!
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 rounded-xl border border-white/10 bg-neutral-950/80 hover:border-white/20 transition-colors relative group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          {entry.userPhoto ? (
                            <img
                              src={entry.userPhoto}
                              alt={entry.userName}
                              className="w-8 h-8 rounded-full border border-white/20 object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-purple-600/30 text-white flex items-center justify-center font-mono text-xs">
                              {entry.userName?.charAt(0) || 'V'}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-semibold text-white">
                              {entry.userName}
                            </p>
                            <p className="font-mono text-[0.65rem] text-neutral-500">
                              {new Date(entry.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Author or Admin Delete action */}
                        {user && (user.uid === entry.userId || isAdmin) && (
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id, entry.userId)}
                            className="p-1.5 text-neutral-600 hover:text-red-400 transition-colors cursor-pointer rounded"
                            title="Delete entry"
                            aria-label={`Delete entry by ${entry.userName}`}
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>

                      <p className="text-sm font-body text-neutral-300 leading-relaxed whitespace-pre-wrap">
                        {entry.message}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
