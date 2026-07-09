import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContextMenu() {
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
    { icon: '⭐', label: 'Click 5 times to draw constellation', action: null },
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
