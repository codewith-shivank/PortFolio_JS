import { motion, AnimatePresence } from 'framer-motion';

export function SkillPopup({ skill, onClose }) {
  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          style={{
            position: 'fixed',
            bottom: '10vh',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 500,
            width: 'min(400px, 90vw)',
            background: 'linear-gradient(135deg, rgba(10,10,26,0.95), rgba(20,15,50,0.95))',
            border: `1px solid ${skill?.color || '#7c6dfa'}44`,
            borderRadius: '16px',
            padding: '2rem',
            backdropFilter: 'blur(30px)',
            boxShadow: `0 20px 80px rgba(0,0,0,0.6), 0 0 40px ${skill?.color || '#7c6dfa'}22`,
          }}
        >
          {/* Holographic shimmer */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '16px',
            background: 'linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.03) 50%,transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', letterSpacing:'0.2em', color:'rgba(0,212,255,0.8)', textTransform:'uppercase', marginBottom:'0.3rem' }}>
                Skill Profile
              </div>
              <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'1.8rem', fontWeight:800, color:'#f0f0ff' }}>
                {skill?.name}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'50%', width:36, height:36, color:'rgba(255,255,255,0.5)', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
            >✕</button>
          </div>

          {/* Proficiency bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color:'rgba(240,240,255,0.5)', letterSpacing:'0.1em' }}>PROFICIENCY</span>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color: skill?.color }}>{skill?.level}%</span>
            </div>
            <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill?.level}%` }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16,1,0.3,1] }}
                style={{ height:'100%', background: `linear-gradient(90deg, ${skill?.color}, #ffffff44)`, borderRadius:2 }}
              />
            </div>
          </div>

          {/* Certifications */}
          {skill?.certifications?.length > 0 && (
            <div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', letterSpacing:'0.2em', color:'rgba(240,240,255,0.4)', textTransform:'uppercase', marginBottom:'0.75rem' }}>
                Certifications
              </div>
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                {skill.certifications.map(cert => (
                  <span key={cert} style={{
                    padding:'0.25rem 0.75rem', borderRadius:99,
                    background:'rgba(124,109,250,0.15)',
                    border:'1px solid rgba(124,109,250,0.25)',
                    fontFamily:'Space Mono,monospace', fontSize:'0.7rem',
                    color:'#7c6dfa',
                  }}>{cert}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default SkillPopup;
