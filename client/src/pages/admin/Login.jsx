import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FaGoogle } from 'react-icons/fa';

/**
 * Admin Login Page — Firebase Google Sign-In Portal
 */
export default function Login() {
  const [error, setError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setAuthenticating(true);
    try {
      const loggedUser = await signInWithGoogle();
      if (!loggedUser) {
        // Sign in was cancelled or dismissed by the user
        return;
      }
      if (
        loggedUser.email?.toLowerCase() === 'codewithshivank@gmail.com' ||
        isAdmin
      ) {
        navigate('/admin');
      } else {
        setError('Access denied: You must be logged in as codewithshivank@gmail.com to access the admin dashboard.');
      }
    } catch (err) {
      console.warn('Google sign-in status:', err?.message || err);
      setError('Unable to authenticate with Google. Please try again.');
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8 sm:p-10 border border-white/10 bg-[#0c0c14]/90 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-text-secondary">
              Firebase Auth & Cloud Firestore
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-tight mb-2">
            Admin Portal
          </h1>
          <p className="font-mono text-xs text-text-tertiary">
            Secure administrative access for portfolio management
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 font-mono text-xs text-center">
            ⚠️ {error}
          </div>
        )}

        {user ? (
          <div className="space-y-5 text-center">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-left flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-white font-mono text-sm">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-text-muted truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[0.65rem] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                  Role: {user.role || 'user'}
                </span>
              </div>
            </div>

            {isAdmin ? (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn btn-primary btn-lg w-full"
              >
                Proceed to Dashboard →
              </button>
            ) : (
              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 font-mono text-xs text-left">
                Notice: Administrative tools are restricted to{' '}
                <span className="text-white font-bold">codewithshivank@gmail.com</span>. You are currently logged in as a verified visitor.
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={logout}
                className="btn btn-ghost flex-1 text-xs"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-ghost flex-1 text-xs"
              >
                ← Back to Portfolio
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authenticating}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all duration-200 cursor-pointer shadow-lg hover:border-white/30"
              aria-label="Sign in with Google"
            >
              <FaGoogle className="text-red-400" />
              <span>
                {authenticating ? 'Connecting to Google...' : 'Continue with Google'}
              </span>
            </button>

            <p className="text-center font-mono text-[0.7rem] text-text-muted mt-4">
              Protected by Firebase Authentication & Zero-Trust Security Rules
            </p>

            <button
              type="button"
              className="btn btn-ghost w-full text-xs mt-2"
              onClick={() => navigate('/')}
              aria-label="Return to portfolio"
            >
              ← Back to Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
