import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Context
import SmoothScroll from '@/components/layout/SmoothScroll';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/layout/CustomCursor';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Pages
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';

// Hooks
import useSectionTracking from '@/hooks/useSectionTracking.js';
import useLetterbox from '@/hooks/useLetterbox.js';

// 3D & Feature Components
import Loader from '@/components/3d/Loader/index.jsx';
import HeroBackground from '@/components/3d/HeroBackground/index.jsx';
import Avatar from '@/components/3d/Avatar/index.jsx';
import Gamification from '@/components/features/Gamification/index.jsx';
import { ContextMenu, AchievementToast } from '@/components/features/UIOverlays/index.jsx';
import SkillPopup from '@/components/3d/SolarSystem/SkillPopup.jsx';

// Lazy Loaded Scenes
const PhysicsDesk = lazy(() => import('@/components/3d/PhysicsDesk/index.jsx'));
const SolarSystemScene = lazy(() =>
  import('@/components/3d/SolarSystem/index.jsx').then((m) => ({ default: m.SolarSystemScene }))
);

// Sections
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Skills from '@/sections/Skills';
import Projects from '@/sections/Projects';
import Experience from '@/sections/Experience';
import Services from '@/sections/Services';
import Testimonials from '@/sections/Testimonials';
import Contact from '@/sections/Contact';

/**
 * Main Home Page Layout displaying scroll-spy sections and interactive WebGL canvas models
 */
function HomePage({
  loaded,
  setLoaded,
  selectedSkill,
  setSelectedSkill,
  achievement,
  setAchievement,
}) {
  const { currentSection, sectionIndex, sectionProgress } = useSectionTracking();
  const letterbox = useLetterbox();
  const prevSection = useRef('hero');

  // Trigger letterbox animation bars on section changes
  useEffect(() => {
    if (currentSection !== prevSection.current) {
      letterbox.activate();
      prevSection.current = currentSection;
    }
  }, [currentSection, letterbox]);

  const handleAchievement = (ach) => {
    setAchievement(ach);
  };

  return (
    <>
      {/* Custom magnetic cursor overlay */}
      <CustomCursor />

      {/* Retro film grain noise effect */}
      <div className="film-grain" />

      {/* Screen Letterbox Bars */}
      <motion.div
        className="letterbox-bar letterbox-bar--top"
        animate={{ y: letterbox.active ? 0 : '-100%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="letterbox-bar letterbox-bar--bottom"
        animate={{ y: letterbox.active ? 0 : '100%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* 3D Entry Loader */}
      <AnimatePresence>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* Persistent WebGL Background canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          gl={{ antialias: false, alpha: false }}
          className="w-full h-full"
        >
          <HeroBackground sectionIndex={sectionIndex} sectionProgress={sectionProgress} />
        </Canvas>
      </div>

      {/* Site Navigation */}
      {loaded && <Navbar />}

      {/* Primary Scroll Contents */}
      {loaded && (
        <SmoothScroll>
          <main className="relative z-10">
            {/* Hero Section */}
            <Hero />

            {/* About Section */}
            <About />

            {/* Skills grid section */}
            <Skills />

            {/* Interactive 3D Skills Solar System */}
            <section
              id="skills-universe"
              className="section relative min-h-screen py-16"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
                <h3 className="font-display font-extrabold text-[clamp(2.2rem,5vw,4.5rem)] tracking-tight text-text-primary">
                  Skills <span className="gradient-text">Universe</span>
                </h3>
                <p className="font-body text-text-tertiary text-sm max-w-lg mt-2">
                  Each planet represents a skill sized by depth of usage. Click planets to inspect details. Certification badges are orbits.
                </p>
              </div>

              {/* Solar system interactive WebGL container */}
              <div className="w-full h-[65vh] relative bg-bg-secondary/20 border-y border-border-glass">
                <Canvas camera={{ position: [0, 8, 18], fov: 55 }}>
                  <Suspense fallback={null}>
                    <SolarSystemScene onSelectSkill={setSelectedSkill} />
                  </Suspense>
                </Canvas>
              </div>

              {/* Detail drawer overlay */}
              <SkillPopup skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
            </section>

            {/* Standard Projects Section */}
            <Projects />

            {/* 3D Physics Cards Desk */}
            <section
              id="projects-desk"
              className="section relative min-h-screen py-16"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
                <h3 className="font-display font-extrabold text-[clamp(2.2rem,5vw,4.5rem)] tracking-tight text-text-primary">
                  Physics <span className="gradient-text-rose">Desk</span>
                </h3>
                <p className="font-body text-text-tertiary text-sm max-w-lg mt-2">
                  Grab, throw, and fling cards built with physical mass and gravity. Click cards to access repos.
                </p>
              </div>

              <div className="w-full h-[65vh] relative bg-bg-secondary/20 border-y border-border-glass">
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-muted">Assembling desk physics...</div>}>
                  <PhysicsDesk />
                </Suspense>
              </div>
            </section>

            {/* Experience Section */}
            <Experience />

            {/* Services Section */}
            <Services />

            {/* Testimonials Section */}
            <Testimonials />

            {/* Contact Section */}
            <Contact />
          </main>
          
          {/* Footer */}
          <Footer />
        </SmoothScroll>
      )}

      {/* Floating 3D AI Assistant Avatar */}
      {loaded && <Avatar currentSection={currentSection} />}

      {/* Secret Gamification Overlay (Konami trigger, star clicks) */}
      {loaded && <Gamification onAchievement={handleAchievement} />}

      {/* Right Click Context Menu Customizer */}
      {loaded && <ContextMenu />}

      {/* Achievement Banner Alert */}
      <AchievementToast achievement={achievement} onDone={() => setAchievement(null)} />
    </>
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
  const [loaded, setLoaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [achievement, setAchievement] = useState(null);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  loaded={loaded}
                  setLoaded={setLoaded}
                  selectedSkill={selectedSkill}
                  setSelectedSkill={setSelectedSkill}
                  achievement={achievement}
                  setAchievement={setAchievement}
                />
              }
            />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
