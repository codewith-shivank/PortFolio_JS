import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const initLoader = () => {
  const canvas = document.getElementById('loader-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(80, 80);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
  camera.position.z = 3;

  const geometry = new THREE.IcosahedronGeometry(0.9, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let animFrame;
  const animate = () => {
    animFrame = requestAnimationFrame(animate);
    mesh.rotation.x += 0.015;
    mesh.rotation.y += 0.02;
    renderer.render(scene, camera);
  };
  animate();

  const fadeOutLoader = () => {
    const loaderWrapper = document.querySelector(".loader-wrapper");
    if (!loaderWrapper) return;

    if (typeof gsap !== 'undefined') {
      gsap.to(loaderWrapper, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          cancelAnimationFrame(animFrame);
          renderer.dispose();
          if (loaderWrapper.parentNode) {
            loaderWrapper.parentNode.removeChild(loaderWrapper);
          }
        }
      });
    } else {
      loaderWrapper.style.transition = 'opacity 0.8s ease';
      loaderWrapper.style.opacity = '0';
      setTimeout(() => {
        cancelAnimationFrame(animFrame);
        renderer.dispose();
        if (loaderWrapper.parentNode) {
          loaderWrapper.parentNode.removeChild(loaderWrapper);
        }
      }, 800);
    }
  };

  // Wait for the full page to load
  if (document.readyState === 'complete') {
    setTimeout(fadeOutLoader, 500);
  } else {
    window.addEventListener('load', () => setTimeout(fadeOutLoader, 500));
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoader);
} else {
  initLoader();
}
