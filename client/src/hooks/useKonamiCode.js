import { useEffect, useRef } from 'react';

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export default function useKonamiCode(onTrigger) {
  const buffer = useRef([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      buffer.current.push(e.code);
      if (buffer.current.length > KONAMI_SEQUENCE.length) {
        buffer.current.shift();
      }

      if (buffer.current.join(',') === KONAMI_SEQUENCE.join(',')) {
        buffer.current = [];
        onTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTrigger]);
}
