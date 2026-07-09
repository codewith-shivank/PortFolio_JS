import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks
import useSectionTracking from './hooks/useSectionTracking.js';
import useLetterbox from './hooks/useLetterbox.js';

// Components
import Loader from './components/Loader/index.jsx';
import Navigation from './components/Navigation/index.jsx';
import MagneticCursor from './components/Cursor/index.jsx';
import HeroBackground from './components/HeroBackground/index.jsx';
import Avatar from './components/Avatar/index.jsx';
import Gamification from './components/Gamification/index.jsx';
import { ContextMenu, AchievementToast } from './components/UIOverlays/index.jsx';
import SkillPopup from './components/SolarSystem/SkillPopup.jsx';

// Lazy Loaded Components
const PhysicsDesk = lazy(() => import('./components/PhysicsDesk/index.jsx'));
const SolarSystemScene = lazy(() =>
  import('./components/SolarSystem/index.jsx').then(m => ({ default: m.SolarSystemScene }))
);

// Sections
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Contact from './sections/Contact.jsx';

// ─── Scroll progress bar ───────────────────────────────────────────────────────
function ScrollProgressBar() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setProg(window.scrollY / total);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 2,
      background: 'rgba(255,255,255,0.06)', zIndex: 1000, pointerEvents: 'none',
    }}>
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg,#7c6dfa,#00d4ff,#ff6b9d)',
          transformOrigin: 'left',
          scaleX: prog,
        }}
      />
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const { currentSection, sectionIndex, sectionProgress } = useSectionTracking();
  const letterbox = useLetterbox();
  const prevSection = useRef('hero');

  // Trigger letterbox on section change
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
      {/* ─── Custom cursor ───────────────────────────────────────── */}
      <MagneticCursor />

      {/* ─── Film grain overlay ──────────────────────────────────── */}
      <div className="film-grain" />

      {/* ─── Scroll progress bar ─────────────────────────────────── */}
      <ScrollProgressBar />

      {/* ─── Letterbox bars ──────────────────────────────────────── */}
      <motion.div
        className="letterbox-bar letterbox-bar--top"
        animate={{ y: letterbox.active ? 0 : '-100%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ position:'fixed', top:0, left:0, right:0, height:60, background:'#050510', zIndex:800, pointerEvents:'none' }}
      />
      <motion.div
        className="letterbox-bar letterbox-bar--bottom"
        animate={{ y: letterbox.active ? 0 : '100%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ position:'fixed', bottom:0, left:0, right:0, height:60, background:'#050510', zIndex:800, pointerEvents:'none' }}
      />

      {/* ─── Loader ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* ─── Background WebGL canvas ─────────────────────────────── */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          gl={{ antialias: false, alpha: false }}
          style={{ width:'100%', height:'100%' }}
        >
          <HeroBackground sectionIndex={sectionIndex} sectionProgress={sectionProgress} />
        </Canvas>
      </div>

      {/* ─── Navigation ──────────────────────────────────────────── */}
      {loaded && <Navigation currentSection={currentSection} />}

      {/* ─── Content ─────────────────────────────────────────────── */}
      {loaded && (
        <main>
          {/* ══ HERO ══════════════════════════════════════════════ */}
          <Hero />

          {/* ══ SKILLS SOLAR SYSTEM ═══════════════════════════════ */}
          <section
            id="skills"
            className="section"
            style={{ minHeight:'100vh', position:'relative', zIndex:10 }}
          >
            <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 2rem', width:'100%', marginBottom:'2rem' }}>
              <p className="section-label">02 — Skills</p>
              <h2 style={{
                fontFamily:'Space Grotesk,sans-serif', fontWeight:800,
                fontSize:'clamp(2.5rem,6vw,5rem)', letterSpacing:'-0.03em', color:'#f0f0ff',
              }}>
                Skills <span style={{ background:'linear-gradient(135deg,#7c6dfa,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Universe</span>
              </h2>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'1rem', color:'rgba(240,240,255,0.4)', marginTop:'0.75rem', maxWidth:480 }}>
                Each planet represents a skill — sized by proficiency. Click to explore. Rings indicate certifications.
              </p>
            </div>

            {/* Solar System canvas */}
            <div style={{ width:'100%', height:'70vh', position:'relative' }}>
              <Canvas camera={{ position: [0, 8, 18], fov: 55 }}>
                <Suspense fallback={null}>
                  <SolarSystemScene onSelectSkill={setSelectedSkill} />
                </Suspense>
              </Canvas>
            </div>

            {/* Skill popup */}
            <SkillPopup skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
          </section>

          {/* ══ PROJECTS PHYSICS DESK ════════════════════════════ */}
          <section
            id="projects"
            className="section"
            style={{ minHeight:'100vh', position:'relative', zIndex:10 }}
          >
            <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 2rem', width:'100%', marginBottom:'2rem' }}>
              <p className="section-label">03 — Projects</p>
              <h2 style={{
                fontFamily:'Space Grotesk,sans-serif', fontWeight:800,
                fontSize:'clamp(2.5rem,6vw,5rem)', letterSpacing:'-0.03em', color:'#f0f0ff',
              }}>
                The <span style={{ background:'linear-gradient(135deg,#ff6b9d,#7c6dfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Desk</span>
              </h2>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'1rem', color:'rgba(240,240,255,0.4)', marginTop:'0.75rem', maxWidth:480 }}>
                Project cards with real physics — grab and fling them. Click to open project details.
              </p>
            </div>

            <Suspense fallback={<div style={{ height:'70vh', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)', fontFamily:'Space Mono, monospace', fontSize:'0.8rem' }}>Loading Desk...</div>}>
              <PhysicsDesk />
            </Suspense>
          </section>

          {/* ══ ABOUT ════════════════════════════════════════════ */}
          <About />

          {/* ══ CONTACT ══════════════════════════════════════════ */}
          <Contact />
        </main>
      )}

      {/* ─── AI Avatar ───────────────────────────────────────────── */}
      {loaded && <Avatar currentSection={currentSection} />}

      {/* ─── Gamification layer ──────────────────────────────────── */}
      {loaded && <Gamification onAchievement={handleAchievement} />}

      {/* ─── Context menu ────────────────────────────────────────── */}
      {loaded && <ContextMenu />}

      {/* ─── Achievement toast ───────────────────────────────────── */}
      <AchievementToast achievement={achievement} onDone={() => setAchievement(null)} />
    </>
  );
}
