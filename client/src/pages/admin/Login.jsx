import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Admin Login Page — Clean, secure login form
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-2xl gradient-text mb-2">
            Admin Portal
          </h1>
          <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest">
            Authenticate to access dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 font-mono text-xs text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Admin login form">
          <div>
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg w-full"
            aria-label="Sign in to admin panel"
          >
            {loading ? 'Authenticating...' : 'Sign In →'}
          </button>

          <button
            type="button"
            className="btn btn-ghost w-full text-xs"
            onClick={() => navigate('/')}
            aria-label="Return to portfolio"
          >
            ← Back to Portfolio
          </button>
        </form>
      </div>
    </div>
  );
}
