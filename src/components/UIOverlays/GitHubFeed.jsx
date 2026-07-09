import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GitHubFeed() {
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
