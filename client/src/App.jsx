import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout & Context
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import SimpleLoader from '@/components/ui/SimpleLoader';

// Admin Pages (lazy)
const Login = lazy(() => import('@/pages/admin/Login'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));

// Sections
import Hero from '@/sections/Hero';
import Marquee from '@/components/ui/Marquee';
import About from '@/sections/About';
import Skills from '@/sections/Skills';
import Projects from '@/sections/Projects';
import Experience from '@/sections/Experience';
import Contact from '@/sections/Contact';

/**
 * HomePage — Minimal, recruiter-focused single-page layout
 */
function HomePage() {
  return (
    <>
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main id="main-content">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setProgress(window.scrollY / total);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX: progress, transformOrigin: 'left' }}
      />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center font-mono text-xs text-text-muted">
        Verifying session...
      </div>
    );
  }
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#14141f',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#7c6dfa', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      {/* Elegant simple loader — fades out in ~1s */}
      <AnimatePresence>
        {!appReady && <SimpleLoader onComplete={() => setAppReady(true)} />}
      </AnimatePresence>

      {appReady && (
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={null}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Suspense fallback={null}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      )}
    </AuthProvider>
  );
}
