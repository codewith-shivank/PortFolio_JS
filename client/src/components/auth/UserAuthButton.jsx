import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * UserAuthButton — Cynthia Ugwu themed Google Sign-In & User Profile menu
 */
export default function UserAuthButton({ isMobile = false }) {
  const { user, isAdmin, signInWithGoogle, logout, loading, isSigningIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSignIn = async () => {
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        setDropdownOpen(false);
      }
    } catch {
      // User cancelled or closed prompt gracefully handled
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setDropdownOpen(false);
    } catch (err) {
      console.warn('Sign out encountered an issue:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 animate-pulse" />
    );
  }

  // Not signed in
  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white font-mono text-[0.65rem] tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-sm ${
          isSigningIn ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        aria-label="Sign in with Google"
      >
        <FaGoogle className="text-red-400 text-xs" />
        <span>{isSigningIn ? 'Connecting...' : 'Sign In'}</span>
      </button>
    );
  }

  // Signed in
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
        aria-label={`User menu for ${user.displayName}`}
        aria-expanded={dropdownOpen}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-6 h-6 rounded-full object-cover border border-white/30"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-purple-600/40 text-white text-[0.65rem] font-bold flex items-center justify-center">
            {user.displayName?.charAt(0) || 'U'}
          </div>
        )}
        <span className="font-mono text-[0.65rem] tracking-wider text-neutral-300 max-w-[100px] truncate hidden sm:inline-block">
          {user.displayName?.split(' ')[0]}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </button>

      {/* Popover / Dropdown */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${
              isMobile ? 'left-1/2 -translate-x-1/2 bottom-full mb-3' : 'right-0 top-full mt-2'
            } w-64 p-3 rounded-2xl border border-white/15 bg-[#0e0e16]/95 backdrop-blur-xl shadow-2xl z-[150] text-left`}
          >
            {/* Header info */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-purple-600/40 text-white text-xs font-bold flex items-center justify-center">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  {user.displayName}
                </p>
                <p className="text-[0.65rem] text-text-muted truncate">
                  {user.email}
                </p>
                <span className="inline-block mt-0.5 text-[0.55rem] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Google Verified
                </span>
              </div>
            </div>

            {/* Menu Options */}
            <div className="space-y-1">
              {isAdmin && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <FaShieldAlt className="text-purple-400 text-xs" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span>✉️ Send an Inquiry</span>
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  const el = document.getElementById('guestbook');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span>⭐ Leave Endorsement</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer pt-2 mt-1 border-t border-white/5"
              >
                <FaSignOutAlt className="text-xs" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
