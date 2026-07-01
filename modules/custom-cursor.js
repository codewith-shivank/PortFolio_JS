// custom-cursor.js
// Custom cursor circle following the mouse with lerp damping using GSAP.
// Scales up and changes color on interactive hover, and hides on mobile screens.

const initCustomCursor = () => {
  const minicircle = document.querySelector(".minicircle");
  if (!minicircle) return;

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    minicircle.style.display = 'none';
    return;
  }

  minicircle.style.display = 'block';

  // Smooth mouse follow using GSAP
  window.addEventListener('mousemove', (e) => {
    gsap.to(minicircle, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: "power2.out"
    });
  });

  // Event delegation to capture mouse hovers on interactive components
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target) return;

    const interactive = target.closest('a, button, .menu-btn, .theme-toggle, [role="button"], .circle');
    if (interactive) {
      gsap.to(minicircle, {
        scale: 2.2,
        backgroundColor: '#f43f5e', // rose-red highlight
        borderColor: '#fda4af',
        duration: 0.25
      });
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (!target) return;

    const interactive = target.closest('a, button, .menu-btn, .theme-toggle, [role="button"], .circle');
    if (interactive) {
      gsap.to(minicircle, {
        scale: 1.0,
        backgroundColor: 'var(--accent-color)', // restore primary accent color
        borderColor: 'transparent',
        duration: 0.25
      });
    }
  });

  // Keep responsive on resize
  window.addEventListener('resize', () => {
    const mobileCheck = window.innerWidth <= 768;
    minicircle.style.display = mobileCheck ? 'none' : 'block';
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomCursor);
} else {
  initCustomCursor();
}
