import { useState, useCallback } from 'react';

export default function useLetterbox() {
  const [active, setActive] = useState(false);

  const activate = useCallback(() => {
    setActive(true);
    setTimeout(() => setActive(false), 700);
  }, []);

  return { active, activate };
}
