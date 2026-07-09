import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AchievementToast({ achievement, onDone }) {
  useEffect(() => {
    if (!achievement) return;
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [achievement, onDone]);

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
