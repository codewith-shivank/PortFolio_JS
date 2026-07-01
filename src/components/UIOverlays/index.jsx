import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── GitHub Live Feed ─────────────────────────────────────────────────────────
function GitHubFeed() {
  const [commits, setCommits] = useState([]);
  const [visitors, setVisitors] = useState(Math.floor(Math.random() * 4) + 2);

  useEffect(() => {
    // Fetch real GitHub events
    fetch('https://api.github.com/users/codewith-shivank/events?per_page=10')
      .then(r => r.json())
      .then(events => {
        const pushEvents = events
          .filter(e => e.type === 'PushEvent')
          .flatMap(e => e.payload.commits?.map(c => ({
            repo: e.repo?.name?.split('/')[1] || 'portfolio',
            message: c.message.slice(0, 50),
            time: new Date(e.created_at).toLocaleDateString(),
          })) || []);
        setCommits(pushEvents.slice(0, 6));
      })
      .catch(() => {
        setCommits([
          { repo: 'portfolio', message: 'feat: add WebGL particle loader', time: 'Today' },
          { repo: 'portfolio', message: 'feat: physics desk with Cannon-es', time: 'Today' },
          { repo: 'portfolio', message: 'feat: AI avatar + TTS integration', time: 'Today' },
        ]);
      });

    // Simulate visitor count fluctuation
    const interval = setInterval(() => {
      setVisitors(v => Math.max(1, v + (Math.random() > 0.5 ? 1 : -1)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      padding: '1.25rem',
      marginTop: '1.5rem',
    }}>
      {/* Live visitor count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#00ff88', boxShadow:'0 0 6px #00ff88' }}>
            <div style={{ width:'100%', height:'100%', borderRadius:'50%', background:'#00ff88', animation:'livePulse 1.5s infinite' }} />
          </div>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color:'#00ff88', letterSpacing:'0.1em' }}>
            {visitors} {visitors === 1 ? 'person' : 'people'} viewing now
          </span>
        </div>
        <div style={{ marginLeft:'auto', fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'rgba(255,255,255,0.3)' }}>
          Live
        </div>
      </div>

      {/* GitHub commit ticker */}
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:'0.5rem' }}>
        Recent GitHub Activity
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', overflow:'hidden', maxHeight:160 }}>
        {commits.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}
          >
            <span style={{ color:'#00d4ff', flexShrink:0, fontSize:'0.75rem' }}>→</span>
            <div>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color:'rgba(255,255,255,0.5)', display:'block' }}>
                [{c.repo}] {c.time}
              </span>
              <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'rgba(255,255,255,0.75)' }}>
                {c.message}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Right-click context menu ─────────────────────────────────────────────────
export function ContextMenu() {
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0 });

  useEffect(() => {
    const onContextMenu = (e) => {
      e.preventDefault();
      setMenu({ visible: true, x: e.clientX, y: e.clientY });
    };
    const onClose = () => setMenu(m => ({ ...m, visible: false }));
    window.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('click', onClose);
    window.addEventListener('scroll', onClose);
    return () => {
      window.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('click', onClose);
      window.removeEventListener('scroll', onClose);
    };
  }, []);

  const items = [
    { icon: '📋', label: 'Copy Contact Email', action: () => navigator.clipboard?.writeText('codewithshivank@gmail.com') },
    { icon: '💼', label: 'View LinkedIn', action: () => window.open('https://www.linkedin.com/in/shivank-maurya-21257a303/', '_blank') },
    { icon: '🐙', label: 'View GitHub', action: () => window.open('https://github.com/codewith-shivank', '_blank') },
    { divider: true },
    { icon: '🕹️', label: 'Try Konami Code (↑↑↓↓←→←→BA)', action: null },
    { icon: '⭐', label: 'Click 5 stars to draw constellation', action: null },
    { icon: '🔍', label: 'View Page Source', action: () => window.open('view-source:' + window.location.href, '_blank') },
  ];

  return (
    <AnimatePresence>
      {menu.visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="context-menu"
          style={{
            left: Math.min(menu.x, window.innerWidth - 220),
            top: Math.min(menu.y, window.innerHeight - 260),
          }}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="context-menu-divider" />
            ) : (
              <button
                key={i}
                className="context-menu-item"
                onClick={item.action || undefined}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', opacity: item.action ? 1 : 0.5 }}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Achievement toast ────────────────────────────────────────────────────────
export function AchievementToast({ achievement, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [achievement]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="achievement-toast"
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <span className="achievement-toast__icon">{achievement.icon}</span>
          <div>
            <div className="achievement-toast__label">Achievement Unlocked</div>
            <div className="achievement-toast__title">{achievement.title}</div>
            {achievement.desc && (
              <div style={{ fontSize:'0.75rem', color:'rgba(240,240,255,0.5)', marginTop:'0.2rem', fontFamily:'Inter,sans-serif' }}>
                {achievement.desc}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { GitHubFeed };
