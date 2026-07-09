import { motion } from 'framer-motion';
import { GitHubFeed } from '../components/UIOverlays/index.jsx';

export default function About() {
  const stats = [
    { num: '2023', label: 'Started' },
    { num: '5+', label: 'Projects' },
    { num: '∞', label: 'Learning' },
  ];

  const timeline = [
    { year: '2023', title: 'Started Web Development', desc: 'Began learning HTML, CSS, and JavaScript. Created first responsive websites.' },
    { year: '2024', title: 'Mastered React.js', desc: 'Developed multiple React applications and deep-dived into modern web development.' },
    { year: '2025', title: 'Full Stack & Advanced Tech', desc: 'Now building with Three.js, WebGL, physics engines, and AI integrations.' },
  ];

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="about"
      className="section"
      style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', width: '100%' }}>
        <p className="section-label">04 — About</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              letterSpacing: '-0.03em',
              color: '#f0f0ff',
              marginBottom: '1.5rem',
            }}>
              Hi, I'm <br />
              <span style={{ background: 'linear-gradient(135deg,#7c6dfa,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Shivank Maurya
              </span>
            </h2>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(240,240,255,0.6)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              I build things with code and fix things for people — and I want to do both as a software engineer.
              Currently a BCA student at BBDU (2025–2028) and a Customer Support Associate at Niftel, where I handle real-time issue resolution for Swiggy's platform at scale.
              That experience taught me something most CS students don't get until their first job: users don't care about elegant code, they care about things that work.
            </p>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(240,240,255,0.6)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Now I'm channeling that product sense into frontend development — HTML, CSS, JavaScript — and AI tooling, with 4 certifications in prompt engineering and cyber/tech simulations from Deloitte, EY, and Microsoft.
              Open to internships, entry-level software engineering roles, and technical support engineering positions in Lucknow or remote.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              {stats.map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '2.5rem', background: 'linear-gradient(135deg,#7c6dfa,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {stat.num}
                  </div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,255,0.35)', marginTop: '0.3rem' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleScrollTo('contact'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                borderRadius: 99,
                background: 'linear-gradient(135deg,#7c6dfa,#5b4fcf)',
                color: 'white',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Let's Talk →
            </a>
          </div>

          {/* Profile image + GitHub feed */}
          <div>
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              marginBottom: '2rem',
              border: '1px solid rgba(124,109,250,0.2)',
              boxShadow: '0 20px 80px rgba(0,0,0,0.5), 0 0 40px rgba(124,109,250,0.15)',
              aspectRatio: '1/1',
              background: 'linear-gradient(135deg,rgba(124,109,250,0.1),rgba(0,212,255,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src="/Profile insta.jpg"
                alt="Shivank Maurya"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div style="font-size:6rem;display:flex;align-items:center;justify-content:center;height:100%">👨‍💻</div>';
                }}
              />
            </div>

            <GitHubFeed />
          </div>
        </div>

        {/* Timeline */}
        <div style={{ marginTop: '5rem' }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#f0f0ff', marginBottom: '2rem' }}>
            Journey
          </h3>
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom,#7c6dfa,rgba(124,109,250,0))' }} />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{ position: 'relative', paddingLeft: '1.5rem', marginBottom: '2.5rem' }}
              >
                <div style={{ position: 'absolute', left: -0.5, top: 6, width: 8, height: 8, borderRadius: '50%', background: '#7c6dfa', boxShadow: '0 0 12px #7c6dfa' }} />
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: '#7c6dfa', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{item.year}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#f0f0ff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{item.title}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(240,240,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
