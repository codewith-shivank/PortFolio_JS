import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Simplified AI chatbot with TTS ──────────────────────────────────────────

const AVATAR_KNOWLEDGE = {
  name: 'Shivank Maurya',
  role: 'Full Stack Web Developer',
  location: 'Toronto, Canada',
  skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'UI/UX Design', 'Excel', 'Node.js'],
  projects: ['Rock-Paper-Scissors', 'Cynthia Ugwu Clone', 'TextUtils App', 'NewsMonkey App'],
  contact: 'https://www.linkedin.com/in/shivank-maurya-21257a303/',
  youtube: 'https://www.youtube.com/@CodeWithShivank12',
  github: 'https://github.com/codewith-shivank',
};

function generateResponse(input) {
  const q = input.toLowerCase();
  if (q.includes('skill') || q.includes('know') || q.includes('tech')) {
    return `Shivank is proficient in ${AVATAR_KNOWLEDGE.skills.join(', ')}. His strongest skills are JavaScript (85%), HTML5/CSS3 (90%), and React (80%).`;
  }
  if (q.includes('project') || q.includes('work') || q.includes('built')) {
    return `Shivank has built ${AVATAR_KNOWLEDGE.projects.join(', ')}. Check them out in the Projects section — you can actually grab and throw them!`;
  }
  if (q.includes('contact') || q.includes('hire') || q.includes('reach')) {
    return `You can reach Shivank on LinkedIn at linkedin.com/in/shivank-maurya-21257a303 or through the contact form below!`;
  }
  if (q.includes('where') || q.includes('location') || q.includes('from')) {
    return `Shivank is based in ${AVATAR_KNOWLEDGE.location} and is available for full-time and freelance work.`;
  }
  if (q.includes('youtube') || q.includes('channel') || q.includes('video')) {
    return `Shivank runs a YouTube channel @CodeWithShivank12 where he shares web development tutorials. Subscribe for weekly content!`;
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return `Hey there! I'm Shivank's AI guide. Ask me anything about his skills, projects, or how to get in touch!`;
  }
  if (q.includes('experience') || q.includes('background')) {
    return `Shivank is a 12th passout student with a PCM background who taught himself web development. He started in 2023 with HTML/CSS/JS, mastered React in 2024, and is now expanding into full-stack development.`;
  }
  return `That's a great question! Shivank is a passionate web developer based in Toronto. Feel free to ask about his skills, projects, or how to work with him.`;
}

function speak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.05;
  utter.pitch = 1.0;
  utter.volume = 0.9;

  // Try to get a nice voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes('Google') && v.lang === 'en-US')
    || voices.find(v => v.lang === 'en-US' && !v.name.includes('Zira'))
    || voices[0];
  if (preferred) utter.voice = preferred;

  utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

// ─── Avatar Component ─────────────────────────────────────────────────────────
export default function Avatar({ currentSection }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'avatar', text: `👋 Hey! I'm Shivank's AI guide. Ask me anything!` },
  ]);
  const [input, setInput] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const mouthRef = useRef(null);
  const chatEndRef = useRef(null);
  const [proactiveShown, setProactiveShown] = useState(false);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Proactive greeting per section
  useEffect(() => {
    if (!open) return;
    const proactives = {
      hero: "Welcome! This is Shivank's immersive portfolio. Scroll down to explore!",
      skills: "You're in the Skills solar system! Each planet represents a skill. Click them to learn more.",
      projects: "These are Shivank's projects — you can actually grab and fling them! Try it.",
      about: "This is the About section. Want to know more about Shivank's background?",
      contact: "Ready to work together? Use the form below or ask me how to get in touch!",
    };
    if (proactives[currentSection] && !proactiveShown) {
      setTimeout(() => {
        const msg = proactives[currentSection];
        addAvatarMessage(msg);
        setProactiveShown(true);
      }, 800);
    }
  }, [currentSection, open]);

  const addAvatarMessage = useCallback((text) => {
    setMessages(prev => [...prev, { role: 'avatar', text }]);
    setSpeaking(true);
    setMouthOpen(true);

    speak(text, () => {
      setSpeaking(false);
      setMouthOpen(false);
    });

    // Mouth animation
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setMouthOpen(prev => !prev);
      if (count > 20) clearInterval(interval);
    }, 180);
    setTimeout(() => clearInterval(interval), text.length * 60);
  }, []);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    setTimeout(() => {
      const response = generateResponse(userMsg);
      addAvatarMessage(response);
    }, 400);
  }, [input, addAvatarMessage]);

  // Section-based avatar suggestions
  const suggestions = {
    hero: ['What can you do?', 'Tell me about Shivank', 'Available for hire?'],
    skills: ['What skills does he have?', 'Best at what?', 'Any certifications?'],
    projects: ['What projects are here?', 'Best project?', 'Tech stack used?'],
    about: ['Background?', 'Education?', 'Experience?'],
    contact: ['How to hire him?', 'Email contact?', 'Response time?'],
  }[currentSection] || [];

  return (
    <>
      {/* Avatar bubble button */}
      <motion.button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: open ? '420px' : '2rem',
          zIndex: 600,
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: '2px solid rgba(124,109,250,0.5)',
          background: 'linear-gradient(135deg,#1a0a3a,#0a1a3a)',
          boxShadow: '0 8px 32px rgba(124,109,250,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          overflow: 'hidden',
        }}
        animate={{ right: open ? '420px' : '2rem' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Animated avatar face */}
        <svg viewBox="0 0 40 40" width="40" height="40">
          {/* Head */}
          <circle cx="20" cy="18" r="12" fill="#c8a882" />
          {/* Hair */}
          <ellipse cx="20" cy="8" rx="12" ry="5" fill="#1a1a1a" />
          <rect x="8" y="8" width="24" height="8" fill="#1a1a1a" rx="2" />
          {/* Eyes */}
          <ellipse cx="16" cy="17" rx="2" ry={speaking ? 1.5 : 2} fill="#1a1a1a" />
          <ellipse cx="24" cy="17" rx="2" ry={speaking ? 1.5 : 2} fill="#1a1a1a" />
          {/* Eye shine */}
          <circle cx="17" cy="16" r="0.6" fill="white" />
          <circle cx="25" cy="16" r="0.6" fill="white" />
          {/* Mouth */}
          <path
            d={mouthOpen
              ? 'M 15 22 Q 20 27 25 22'
              : 'M 15 22 Q 20 25 25 22'
            }
            stroke="#5a3520"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Speaking indicator */}
          {speaking && (
            <circle cx="32" cy="8" r="3" fill="#00ff88" opacity="0.9">
              <animate attributeName="r" values="3;4;3" dur="0.5s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 599,
              width: 400,
              height: 500,
              background: 'linear-gradient(160deg,rgba(10,10,26,0.97),rgba(15,10,35,0.97))',
              border: '1px solid rgba(124,109,250,0.25)',
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 20px 80px rgba(0,0,0,0.6), 0 0 40px rgba(124,109,250,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7c6dfa,#00d4ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>🤖</div>
              <div>
                <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'0.9rem', color:'#f0f0ff' }}>Shivank's AI Guide</div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#00ff88', animation:'livePulse 1.5s infinite' }} />
                  <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color:'rgba(0,255,136,0.8)', letterSpacing:'0.1em' }}>ONLINE</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:'1.1rem' }}
              >✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '0.6rem 0.9rem',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg,#7c6dfa,#5b4fcf)'
                      : 'rgba(255,255,255,0.05)',
                    border: msg.role === 'avatar' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    fontSize: '0.85rem',
                    color: '#f0f0ff',
                    lineHeight: 1.5,
                    fontFamily: 'Inter,sans-serif',
                  }}
                >
                  {msg.text}
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); setTimeout(() => sendMessage(), 100); }}
                    style={{
                      padding: '0.25rem 0.6rem', borderRadius: 99,
                      background: 'rgba(124,109,250,0.1)', border: '1px solid rgba(124,109,250,0.25)',
                      color: '#7c6dfa', fontFamily: 'Space Mono,monospace', fontSize: '0.65rem',
                      letterSpacing: '0.02em', whiteSpace: 'nowrap',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding:'0.75rem 1rem', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:'0.5rem' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
                style={{
                  flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
                  padding:'0.5rem 0.75rem', color:'#f0f0ff', fontFamily:'Inter,sans-serif', fontSize:'0.85rem',
                  outline:'none',
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  width:38, height:38, borderRadius:10, border:'none',
                  background:'linear-gradient(135deg,#7c6dfa,#5b4fcf)',
                  color:'white', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >↑</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
