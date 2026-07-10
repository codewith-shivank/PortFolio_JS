import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Lenis Smooth Scroll Provider
 * Wraps the app with silky-smooth scrolling
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Expose lenis instance globally for GSAP ScrollTrigger integration
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return children;
}
