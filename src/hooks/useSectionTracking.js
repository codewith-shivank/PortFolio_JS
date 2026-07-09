import { useState, useEffect } from 'react';

const SECTIONS = ['hero', 'skills', 'projects', 'about', 'contact'];

const TITLES = {
  hero: 'CodeWithShivank — Web Developer',
  skills: 'Skills — CodeWithShivank',
  projects: 'Projects — CodeWithShivank',
  about: 'About — CodeWithShivank',
  contact: 'Contact — CodeWithShivank',
};

export default function useSectionTracking() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    // 1. IntersectionObserver for active section tracking (highly performant)
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section occupies the middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setCurrentSection(id);
          if (TITLES[id]) {
            document.title = TITLES[id];
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // 2. Scroll listener ONLY for shader transition progress variables
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const progress = scrollY / totalHeight;
      const rawIndex = progress * SECTIONS.length;
      const idx = Math.min(Math.floor(rawIndex), SECTIONS.length - 1);
      
      setSectionIndex(idx);
      setSectionProgress(rawIndex % 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial positions
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { currentSection, sectionIndex, sectionProgress };
}
