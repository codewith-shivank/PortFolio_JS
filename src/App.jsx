import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

import Loader from './components/Loader/index.jsx';
import Navigation from './components/Navigation/index.jsx';
import MagneticCursor from './components/Cursor/index.jsx';
import HeroBackground from './components/HeroBackground/index.jsx';
import Avatar from './components/Avatar/index.jsx';
import PhysicsDesk from './components/PhysicsDesk/index.jsx';
import Gamification from './components/Gamification/index.jsx';
import { ContextMenu, AchievementToast, GitHubFeed } from './components/UIOverlays/index.jsx';
import { SolarSystemScene, SkillPopup } from './components/SolarSystem/index.jsx';

// ─── Section scroll progress hook ─────────────────────────────────────────────
function useSectionTracking() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const sections = ['hero', 'skills', 'projects', 'about', 'contact'];

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / total;

      const idx = Math.floor(progress * sections.length);
      const clamped = Math.min(idx, sections.length - 1);
      setSectionIndex(clamped);
      setSectionProgress((progress * sections.length) % 1);

      // Find visible section via IntersectionObserver fallback
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
            setCurrentSection(id);
            // Update tab title
            const titles = {
              hero: 'CodeWithShivank — Web Developer',
              skills: 'Skills — CodeWithShivank',
              projects: 'Projects — CodeWithShivank',
              about: 'About — CodeWithShivank',
              contact: 'Contact — CodeWithShivank',
            };
            document.title = titles[id] || document.title;
          }
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { currentSection, sectionIndex, sectionProgress };
}

// ─── Scroll progress bar ───────────────────────────────────────────────────────
function ScrollProgressBar() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProg(window.scrollY / total);
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

// ─── Letterbox section-enter animation ────────────────────────────────────────
function useLetterbox() {
  const [active, setActive] = useState(false);
  const activate = () => {
    setActive(true);
    setTimeout(() => setActive(false), 700);
  };
  return { active, activate };
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
  }, [currentSection]);

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
          <section
            id="hero"
            className="section"
            style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', zIndex:10 }}
          >
            <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 2rem', width:'100%' }}>
              <motion.div
                initial={{ opacity:0, y:30 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.3, duration:0.8, ease:[0.16,1,0.3,1] }}
              >
                <p className="section-label" style={{ marginBottom:'1.5rem' }}>
                  Available for full-time & freelance · Toronto, Canada
                </p>
              </motion.div>

              <div style={{ overflow:'hidden' }}>
                <motion.h1
                  initial={{ y:'110%' }}
                  animate={{ y:0 }}
                  transition={{ delay:0.4, duration:1, ease:[0.16,1,0.3,1] }}
                  style={{
                    fontFamily:'Space Grotesk,sans-serif',
                    fontSize:'clamp(3.5rem, 11vw, 9rem)',
                    fontWeight:800,
                    letterSpacing:'-0.04em',
                    lineHeight:0.9,
                    color:'#f0f0ff',
                    marginBottom:'0.1em',
                  }}
                >
                  Web
                </motion.h1>
              </div>

              <div style={{ display:'flex', alignItems:'flex-end', gap:'1.5rem', marginBottom:'3rem', flexWrap:'wrap' }}>
                <div style={{ overflow:'hidden' }}>
                  <motion.h1
                    initial={{ y:'110%' }}
                    animate={{ y:0 }}
                    transition={{ delay:0.5, duration:1, ease:[0.16,1,0.3,1] }}
                    style={{
                      fontFamily:'Space Grotesk,sans-serif',
                      fontSize:'clamp(3.5rem, 11vw, 9rem)',
                      fontWeight:800,
                      letterSpacing:'-0.04em',
                      lineHeight:0.9,
                      background:'linear-gradient(135deg,#7c6dfa,#00d4ff)',
                      WebkitBackgroundClip:'text',
                      WebkitTextFillColor:'transparent',
                      backgroundClip:'text',
                    }}
                  >
                    Developer
                  </motion.h1>
                </div>
                <motion.div
                  initial={{ opacity:0, x:-20 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay:0.7 }}
                  style={{
                    fontFamily:'Space Mono,monospace',
                    fontSize:'0.75rem',
                    letterSpacing:'0.15em',
                    textTransform:'uppercase',
                    color:'rgba(240,240,255,0.4)',
                    marginBottom:'1rem',
                    maxWidth:220,
                    lineHeight:1.6,
                  }}
                >
                  Shivank Maurya<br />
                  Since 2023 · Full Stack
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.8 }}
                style={{
                  fontFamily:'Inter,sans-serif',
                  fontSize:'clamp(1rem, 2vw, 1.2rem)',
                  color:'rgba(240,240,255,0.5)',
                  maxWidth:540,
                  lineHeight:1.7,
                  marginBottom:'2.5rem',
                }}
              >
                Building immersive web experiences with React, Three.js, and obsessive attention to craft.
                12th passout → self-taught → building the future.
              </motion.p>

              <motion.div
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.9 }}
                style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}
              >
                <a
                  href="#projects"
                  onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({behavior:'smooth'}); }}
                  style={{
                    display:'inline-flex', alignItems:'center', gap:'0.5rem',
                    padding:'0.9rem 2rem', borderRadius:99,
                    background:'linear-gradient(135deg,#7c6dfa,#5b4fcf)',
                    color:'white', fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'0.95rem',
                    boxShadow:'0 8px 32px rgba(124,109,250,0.35)',
                    textDecoration:'none',
                  }}
                  className="btn btn-primary"
                >
                  See Projects ↓
                </a>
                <a
                  href="#contact"
                  onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}); }}
                  style={{
                    display:'inline-flex', alignItems:'center', gap:'0.5rem',
                    padding:'0.9rem 2rem', borderRadius:99,
                    background:'rgba(255,255,255,0.04)',
                    border:'1px solid rgba(255,255,255,0.12)',
                    color:'rgba(240,240,255,0.7)', fontFamily:'Space Grotesk,sans-serif', fontWeight:600, fontSize:'0.95rem',
                    textDecoration:'none',
                  }}
                >
                  Get in Touch →
                </a>
              </motion.div>

              {/* Social links row */}
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ delay:1.1 }}
                style={{ display:'flex', gap:'1.5rem', marginTop:'4rem', flexWrap:'wrap' }}
              >
                {[
                  { label:'GitHub', url:'https://github.com/codewith-shivank' },
                  { label:'LinkedIn', url:'https://www.linkedin.com/in/shivank-maurya-21257a303/' },
                  { label:'X/Twitter', url:'https://x.com/codewithshivank' },
                  { label:'YouTube', url:'https://www.youtube.com/@CodeWithShivank12' },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily:'Space Mono,monospace', fontSize:'0.7rem',
                      letterSpacing:'0.12em', textTransform:'uppercase',
                      color:'rgba(240,240,255,0.3)',
                      textDecoration:'none',
                      transition:'color 0.3s',
                    }}
                    onMouseEnter={e => e.target.style.color='rgba(124,109,250,0.9)'}
                    onMouseLeave={e => e.target.style.color='rgba(240,240,255,0.3)'}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </motion.div>
            </div>
          </section>

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

            <PhysicsDesk />
          </section>

          {/* ══ ABOUT ════════════════════════════════════════════ */}
          <section
            id="about"
            className="section"
            style={{ minHeight:'100vh', position:'relative', zIndex:10 }}
          >
            <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 2rem', width:'100%' }}>
              <p className="section-label">04 — About</p>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>
                <div>
                  <h2 style={{
                    fontFamily:'Space Grotesk,sans-serif', fontWeight:800,
                    fontSize:'clamp(2rem,5vw,4rem)', letterSpacing:'-0.03em', color:'#f0f0ff',
                    marginBottom:'1.5rem',
                  }}>
                    Hi, I'm <br />
                    <span style={{ background:'linear-gradient(135deg,#7c6dfa,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                      Shivank Maurya
                    </span>
                  </h2>

                  <p style={{ fontFamily:'Inter,sans-serif', fontSize:'1.05rem', color:'rgba(240,240,255,0.6)', lineHeight:1.8, marginBottom:'1.5rem' }}>
                    I'm a 12th passout student with a strong background in Physics, Chemistry, and Mathematics.
                    Self-taught web developer passionate about creating functional and visually stunning websites.
                    Based in Toronto, Canada.
                  </p>

                  <p style={{ fontFamily:'Inter,sans-serif', fontSize:'1.05rem', color:'rgba(240,240,255,0.6)', lineHeight:1.8, marginBottom:'2rem' }}>
                    I started with HTML/CSS/JS in 2023, mastered React in 2024, and am now expanding into full-stack development with Node.js and databases. I'm a detail-oriented quick learner eager to take on freelancing and full-time opportunities.
                  </p>

                  {/* Stats */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', marginBottom:'2rem' }}>
                    {[
                      { num:'2023', label:'Started' },
                      { num:'5+', label:'Projects' },
                      { num:'∞', label:'Learning' },
                    ].map(stat => (
                      <div key={stat.num} style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:800, fontSize:'2.5rem', background:'linear-gradient(135deg,#7c6dfa,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                          {stat.num}
                        </div>
                        <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(240,240,255,0.35)', marginTop:'0.3rem' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}); }}
                    style={{
                      display:'inline-flex', alignItems:'center', gap:'0.5rem',
                      padding:'0.85rem 2rem', borderRadius:99,
                      background:'linear-gradient(135deg,#7c6dfa,#5b4fcf)',
                      color:'white', fontFamily:'Space Grotesk,sans-serif', fontWeight:700,
                      textDecoration:'none',
                    }}
                  >
                    Let's Talk →
                  </a>
                </div>

                {/* Profile image + GitHub feed */}
                <div>
                  <div style={{
                    borderRadius:20, overflow:'hidden', marginBottom:'2rem',
                    border:'1px solid rgba(124,109,250,0.2)',
                    boxShadow:'0 20px 80px rgba(0,0,0,0.5), 0 0 40px rgba(124,109,250,0.15)',
                    aspectRatio:'1/1',
                    background:'linear-gradient(135deg,rgba(124,109,250,0.1),rgba(0,212,255,0.05))',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <img
                      src="/Profile insta.jpg"
                      alt="Shivank Maurya"
                      style={{ width:'100%', height:'100%', objectFit:'cover' }}
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = '<div style="font-size:6rem;display:flex;align-items:center;justify-content:center;height:100%">👨‍💻</div>';
                      }}
                    />
                  </div>

                  <GitHubFeed />
                </div>
              </div>

              {/* Timeline */}
              <div style={{ marginTop:'5rem' }}>
                <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'1.5rem', color:'#f0f0ff', marginBottom:'2rem' }}>
                  Journey
                </h3>
                <div style={{ position:'relative', paddingLeft:'2rem' }}>
                  <div style={{ position:'absolute', left:0, top:0, bottom:0, width:1, background:'linear-gradient(to bottom,#7c6dfa,rgba(124,109,250,0))' }} />
                  {[
                    { year:'2023', title:'Started Web Development', desc:'Began learning HTML, CSS, and JavaScript. Created first responsive websites.' },
                    { year:'2024', title:'Mastered React.js', desc:'Developed multiple React applications and deep-dived into modern web development.' },
                    { year:'2025', title:'Full Stack & Advanced Tech', desc:'Now building with Three.js, WebGL, physics engines, and AI integrations.' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity:0, x:-20 }}
                      whileInView={{ opacity:1, x:0 }}
                      viewport={{ once:true }}
                      transition={{ delay: i * 0.15 }}
                      style={{ position:'relative', paddingLeft:'1.5rem', marginBottom:'2.5rem' }}
                    >
                      <div style={{ position:'absolute', left:-0.5, top:6, width:8, height:8, borderRadius:'50%', background:'#7c6dfa', boxShadow:'0 0 12px #7c6dfa' }} />
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color:'#7c6dfa', letterSpacing:'0.1em', marginBottom:'0.3rem' }}>{item.year}</div>
                      <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, color:'#f0f0ff', fontSize:'1.1rem', marginBottom:'0.4rem' }}>{item.title}</div>
                      <div style={{ fontFamily:'Inter,sans-serif', color:'rgba(240,240,255,0.5)', fontSize:'0.9rem', lineHeight:1.6 }}>{item.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══ CONTACT ══════════════════════════════════════════ */}
          <section
            id="contact"
            className="section"
            style={{ minHeight:'100vh', position:'relative', zIndex:10 }}
          >
            <div style={{ maxWidth:700, margin:'0 auto', padding:'0 2rem', width:'100%' }}>
              <p className="section-label">05 — Contact</p>
              <h2 style={{
                fontFamily:'Space Grotesk,sans-serif', fontWeight:800,
                fontSize:'clamp(2.5rem,6vw,5rem)', letterSpacing:'-0.03em', color:'#f0f0ff',
                marginBottom:'1.5rem',
              }}>
                Let's <span style={{ background:'linear-gradient(135deg,#7c6dfa,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Build</span> Something
              </h2>

              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'1.05rem', color:'rgba(240,240,255,0.5)', lineHeight:1.7, marginBottom:'3rem' }}>
                Have a project in mind or want to collaborate? I'm available for full-time roles and freelance projects.
              </p>

              {/* Contact form */}
              <ContactForm />

              {/* Footer */}
              <div style={{ marginTop:'5rem', paddingTop:'2rem', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', letterSpacing:'0.1em', color:'rgba(240,240,255,0.25)' }}>
                  © 2025 CodeWithShivank · Built with React + Three.js + WebGL
                </div>
                <div style={{ display:'flex', gap:'1.5rem' }}>
                  {[
                    ['GitHub','https://github.com/codewith-shivank'],
                    ['LinkedIn','https://www.linkedin.com/in/shivank-maurya-21257a303/'],
                    ['YouTube','https://www.youtube.com/@CodeWithShivank12'],
                  ].map(([label, url]) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(240,240,255,0.3)', textDecoration:'none' }}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Easter egg hint */}
              <div style={{ textAlign:'center', marginTop:'2rem', fontFamily:'Space Mono,monospace', fontSize:'0.6rem', letterSpacing:'0.15em', color:'rgba(255,255,255,0.1)', textTransform:'uppercase' }}>
                Try: ↑↑↓↓←→←→BA · Click 5 stars · Find 3 secrets
              </div>
            </div>
          </section>

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

// ─── Contact form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    // EmailJS integration
    try {
      await window.emailjs?.send('service_id', 'template_id', form, 'yRnWaX22NLuowNRUY');
      setStatus('sent');
      setForm({ name:'', email:'', message:'' });
    } catch {
      // Fallback: open mailto
      window.location.href = `mailto:codewithshivank@gmail.com?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}`;
      setStatus('sent');
    }
    setTimeout(() => setStatus('idle'), 4000);
  };

  const inputStyle = {
    width:'100%', padding:'1rem', borderRadius:12,
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
    color:'#f0f0ff', fontFamily:'Inter,sans-serif', fontSize:'0.95rem', outline:'none',
    transition:'border-color 0.3s',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        <div>
          <label style={{ display:'block', fontFamily:'Space Mono,monospace', fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'0.5rem' }}>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({...f, name:e.target.value}))}
            required
            placeholder="Your name"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor='rgba(124,109,250,0.5)'}
            onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
          />
        </div>
        <div>
          <label style={{ display:'block', fontFamily:'Space Mono,monospace', fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'0.5rem' }}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({...f, email:e.target.value}))}
            required
            placeholder="your@email.com"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor='rgba(124,109,250,0.5)'}
            onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
          />
        </div>
      </div>
      <div>
        <label style={{ display:'block', fontFamily:'Space Mono,monospace', fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'0.5rem' }}>Message</label>
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({...f, message:e.target.value}))}
          required
          rows={6}
          placeholder="Tell me about your project..."
          style={{ ...inputStyle, resize:'vertical' }}
          onFocus={e => e.target.style.borderColor='rgba(124,109,250,0.5)'}
          onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
        />
      </div>

      <motion.button
        type="submit"
        disabled={status === 'sending'}
        style={{
          padding:'1rem 2.5rem', borderRadius:99, border:'none',
          background: status === 'sent'
            ? 'linear-gradient(135deg,#00ff88,#00cc70)'
            : 'linear-gradient(135deg,#7c6dfa,#5b4fcf)',
          color: status === 'sent' ? '#050510' : 'white',
          fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'1rem',
          boxShadow:'0 8px 32px rgba(124,109,250,0.35)',
          alignSelf:'flex-start',
        }}
        whileHover={{ scale: 1.03, boxShadow:'0 12px 40px rgba(124,109,250,0.5)' }}
        whileTap={{ scale: 0.97 }}
      >
        {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Sent!' : 'Send Message →'}
      </motion.button>
    </form>
  );
}
