/**
 * three-scroll.js — Scroll-triggered 3D model swapper
 * One fixed canvas, one renderer/scene, 5 models (one per section).
 * GSAP ScrollTrigger drives fade + scale transitions between models.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const init = () => {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const isMobile = window.innerWidth < 768;

  gsap.registerPlugin(ScrollTrigger);

  /* ─── Renderer ─────────────────────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 2.0));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ─── Scene & Camera ───────────────────────────────────────────────────── */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  /* ─── Lights ───────────────────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const dLight1 = new THREE.DirectionalLight(0x3b82f6, 2.0);
  dLight1.position.set(5, 5, 5);
  scene.add(dLight1);

  const dLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
  dLight2.position.set(-5, -3, 4);
  scene.add(dLight2);

  // Moving Point Light for specular highlights (disabled on mobile)
  let mouseLight;
  if (!isMobile) {
    mouseLight = new THREE.PointLight(0xffffff, 3.5, 12);
    mouseLight.position.set(0, 0, 4);
    scene.add(mouseLight);
  }

  /* ─── Model Definitions ────────────────────────────────────────────────── */
  const makeGroup = (geo, solidMat, wireMat) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, solidMat));
    if (wireMat) {
      const wm = new THREE.Mesh(geo, wireMat);
      g.add(wm);
    }
    return g;
  };

  const transparentMat = (color, opacity = 0.22, roughness = 0.08, metalness = 0.1, transmission = 0.9) =>
    new THREE.MeshPhysicalMaterial({
      color, transparent: true, opacity,
      roughness, metalness, transmission,
      ior: 1.5, thickness: 1.5, side: THREE.DoubleSide,
    });

  const wireMat = (color, opacity = 0.45) =>
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });

  const shinyMat = (color, metalness = 0.8, roughness = 0.15, opacity = 0.9) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness, transparent: true, opacity });

  /* Model 0 — Hero: Icosahedron glass + blue wireframe */
  const m0 = makeGroup(
    new THREE.IcosahedronGeometry(2.0, 1),
    transparentMat(0x3b82f6),
    wireMat(0x60a5fa, 0.45)
  );

  /* Model 1 — Skills: Torus Knot metallic gold */
  const torusKnotGeo = isMobile ?
    new THREE.TorusKnotGeometry(1.0, 0.25, 48, 8) :
    new THREE.TorusKnotGeometry(1.2, 0.35, 128, 16);
  const m1 = makeGroup(
    torusKnotGeo,
    shinyMat(0xf59e0b, 0.85, 0.12),
    wireMat(0xfde68a, 0.25)
  );

  /* Model 2 — Projects: Stylized Laptop mesh built from Box & Plane primitives */
  const buildLaptop = () => {
    const laptop = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, side: THREE.DoubleSide });
    const darkDetail = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    // Laptop Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 1.5), metalMat);
    base.position.y = -0.4;
    laptop.add(base);

    // Screen lid
    const lid = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.06), metalMat);
    lid.position.set(0, 0.25, -0.7);
    lid.rotation.x = -0.2; // tilted back
    laptop.add(lid);

    // Trackpad
    const trackpad = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.01, 0.3), darkDetail);
    trackpad.position.set(0, -0.35, 0.4);
    laptop.add(trackpad);

    // Glowing screen plane
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.08, 1.28), screenGlowMat);
    screen.position.set(0, 0.25, -0.66);
    screen.rotation.x = -0.2;
    laptop.add(screen);

    return laptop;
  };
  const m2 = buildLaptop();

  /* Model 3 — About: Octahedron frosted green glass */
  const m3 = makeGroup(
    new THREE.OctahedronGeometry(2.0, 0),
    transparentMat(0x10b981, 0.25, 0.08, 0.1, 0.85),
    wireMat(0x34d399, 0.4)
  );

  /* Model 4 — Contact: Pulsing Sphere */
  const sphereGeo = isMobile ?
    new THREE.SphereGeometry(1.3, 16, 16) :
    new THREE.SphereGeometry(1.6, 32, 32);
  const m4 = makeGroup(
    sphereGeo,
    transparentMat(0xa855f7, 0.28, 0.12, 0.05, 0.8),
    wireMat(0xd8b4fe, 0.3)
  );

  const models = [m0, m1, m2, m3, m4];
  const sections = ['.hero', '#skills', '#projects', '#about', '#contact'];
  const rotSpeeds = [
    { x: 0.002, y: 0.003 },
    { x: 0.003, y: 0.004 },
    { x: 0.0015, y: 0.0025 },
    { x: 0.002, y: 0.002 },
    { x: 0.003, y: 0.003 },
  ];

  /* Add all models to scene */
  models.forEach((m, i) => {
    scene.add(m);
    m.visible = (i === 0);
    const baseScale = isMobile ? 0.65 : 1.0;
    m.scale.setScalar(baseScale);
    m.userData.baseScale = baseScale;
  });

  let activeIndex = 0;

  const setMeshOpacity = (group, opacity) => {
    group.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });
  };

  const switchModel = (toIndex) => {
    if (toIndex === activeIndex) return;
    const from = models[activeIndex];
    const to   = models[toIndex];
    const baseScale = to.userData.baseScale;

    // Fade out current
    gsap.to(from.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 0.5, ease: 'power2.in' });
    gsap.to({ op: 1 }, {
      op: 0, duration: 0.45, ease: 'power1.in',
      onUpdate: function() { setMeshOpacity(from, this.targets()[0].op); },
      onComplete: () => { from.visible = false; },
    });

    // Prepare incoming
    to.visible = true;
    to.scale.setScalar(0.35);
    to.rotation.set(
      (Math.random() - 0.5) * 1.2,
      (Math.random() - 0.5) * 1.2,
      0
    );
    setMeshOpacity(to, 0);

    // Fade in with slight delay
    gsap.to(to.scale, {
      x: baseScale, y: baseScale, z: baseScale,
      duration: 0.7, delay: 0.3, ease: 'back.out(1.4)',
    });
    gsap.to({ op: 0 }, {
      op: 1, duration: 0.65, delay: 0.25, ease: 'power2.out',
      onUpdate: function() { setMeshOpacity(to, this.targets()[0].op); },
    });

    activeIndex = toIndex;
  };

  /* ScrollTrigger */
  sections.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      onEnter: () => switchModel(i),
      onEnterBack: () => switchModel(i),
    });
  });

  /* Mouse tilt and light tracking */
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Specular light highlights follow cursor (disabled on mobile)
    if (!isMobile && mouseLight) {
      mouseLight.position.x = mouse.x * 6;
      mouseLight.position.y = mouse.y * 6;
    }
  });

  /* Resize handler */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const s = window.innerWidth < 768 ? 0.65 : 1.0;
    models.forEach(m => {
      m.userData.baseScale = s;
      if (m.visible && activeIndex !== 4) m.scale.setScalar(s); // skip scaling pulsing sphere base on resize
    });
  });

  /* Animation loop */
  const tiltTarget = { x: 0, y: 0 };
  const clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    const active = models[activeIndex];
    const speed  = rotSpeeds[activeIndex];

    // Self-rotation
    active.traverse(child => {
      if (child.isMesh) {
        child.rotation.x += speed.x;
        child.rotation.y += speed.y;
      }
    });

    // Special pulsing animation for Contact Section sphere (model index 4)
    if (activeIndex === 4) {
      const pulse = 1.0 + Math.sin(time * 4.0) * 0.08;
      active.scale.setScalar(pulse * active.userData.baseScale);
    }

    // Smooth group tilt from mouse
    tiltTarget.x = -mouse.y * 0.35;
    tiltTarget.y =  mouse.x * 0.35;
    active.rotation.x += (tiltTarget.x - active.rotation.x) * 0.06;
    active.rotation.y += (tiltTarget.y - active.rotation.y) * 0.06;

    renderer.render(scene, camera);
  };

  animate();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 100));
} else {
  setTimeout(init, 100);
}
