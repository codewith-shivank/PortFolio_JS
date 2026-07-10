import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Magnetic wrapper using Framer Motion
 * Moves child element slightly towards the mouse pointer when within range
 */
export default function Magnetic({ children }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Calculate distance
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    // Magnetic pull range (pixels)
    const hoverRange = 75;

    if (distance < hoverRange) {
      // Pull element 30% of the distance
      setPosition({ x: distanceX * 0.3, y: distanceY * 0.3 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
}
