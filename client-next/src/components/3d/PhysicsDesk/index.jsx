"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const PROJECTS = [
  {
    id: 'rps',
    title: 'Rock-Paper-Scissors',
    desc: 'Classic game with modern AI opponent. Strategic, addictive, and instant fun.',
    url: 'https://codewith-shivank.github.io/Rock-Paper-Scissoer_JS/',
    tags: ['JavaScript', 'Game', 'DOM'],
    color: '#7c6dfa',
    accent: '#00d4ff',
  },
  {
    id: 'cynthia',
    title: 'Cynthia Ugwu Clone',
    desc: 'Award-winning portfolio recreation with GSAP animations and magnetic scroll effects.',
    url: 'https://codewith-shivank.github.io/Cynthia-Ugwu---Product-Designer-Clone/',
    tags: ['GSAP', 'Locomotive', 'CSS'],
    color: '#ff6b9d',
    accent: '#ff9f45',
  },
  {
    id: 'textutils',
    title: 'TextUtils App',
    desc: 'React text manipulation toolkit — word count, case conversion, spacing cleaner.',
    url: 'https://codewith-shivank.github.io/TextUtils-React/#/',
    tags: ['React', 'Utility', 'Bootstrap'],
    color: '#00ff88',
    accent: '#00d4ff',
  },
  {
    id: 'newsmonkey',
    title: 'NewsMonkey App',
    desc: 'Real-time news aggregator powered by NewsAPI. Category filtering and infinite scroll.',
    url: '#',
    tags: ['React', 'API', 'NewsAPI'],
    color: '#f7df1e',
    accent: '#ff6b9d',
  },
];

// ─── Physics Desk Component ───────────────────────────────────────────────────
export default function PhysicsDesk() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const worldRef = useRef(null);
  const cardsRef = useRef([]);
  const rafRef = useRef(null);
  const dragRef = useRef({ active: false, body: null, mesh: null, plane: null });
  const [selectedProject, setSelectedProject] = useState(null);

  const setupPhysics = useCallback(() => {
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;

    // Floor
    const floorBody = new CANNON.Body({ mass: 0 });
    floorBody.addShape(new CANNON.Plane());
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    floorBody.position.set(0, -3, 0);
    world.addBody(floorBody);

    return world;
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const W = mountRef.current.clientWidth;
    const H = mountRef.current.clientHeight;

    // ── Three.js setup ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 2, 10);

    // Lights
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight('#ffffff', 1.5);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    const rimLight = new THREE.PointLight('#7c6dfa', 2, 30);
    rimLight.position.set(-8, 5, 2);
    scene.add(rimLight);

    // Floor (visual)
    const floorGeo = new THREE.PlaneGeometry(24, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#08081a',
      roughness: 0.9,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3;
    floor.receiveShadow = true;
    scene.add(floor);

    // Reflective line on floor
    const lineGeo = new THREE.PlaneGeometry(0.03, 20);
    const lineMat = new THREE.MeshBasicMaterial({ color: '#7c6dfa', transparent: true, opacity: 0.3 });
    for (let i = -8; i <= 8; i += 2) {
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(i, -2.98, 0);
      scene.add(line);
    }

    // ── Physics world ─────────────────────────────────────────────────────
    const world = setupPhysics();
    worldRef.current = world;

    // ── Project cards ─────────────────────────────────────────────────────
    const cards = [];

    PROJECTS.forEach((project, i) => {
      const cardW = 2.4, cardH = 3.2, cardD = 0.08;

      // Three.js mesh
      const geo = new THREE.BoxGeometry(cardW, cardH, cardD);
      const mat = new THREE.MeshStandardMaterial({
        color: '#0f0f24',
        roughness: 0.3,
        metalness: 0.6,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;

      // Card face with gradient
      const faceMat = new THREE.MeshStandardMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.05,
        roughness: 0.4,
        metalness: 0.3,
      });

      // Create card faces
      const faceMats = [mat, mat, mat, mat, faceMat, mat];
      const cardMesh = new THREE.Mesh(
        new THREE.BoxGeometry(cardW, cardH, cardD),
        faceMats
      );
      cardMesh.castShadow = true;
      cardMesh.userData.project = project;
      scene.add(cardMesh);

      // Edge glow
      const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(cardW + 0.01, cardH + 0.01, cardD + 0.01));
      const edgeMat = new THREE.LineBasicMaterial({ color: project.color, transparent: true, opacity: 0.4 });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      cardMesh.add(edges);

      // Cannon body
      const body = new CANNON.Body({ mass: 1.5, linearDamping: 0.3, angularDamping: 0.4 });
      body.addShape(new CANNON.Box(new CANNON.Vec3(cardW / 2, cardH / 2, cardD / 2)));
      body.position.set(
        (i - PROJECTS.length / 2 + 0.5) * 1.8,
        6 + i * 1.5,
        -1 + i * 0.3
      );
      // Random initial rotation
      const axis = new CANNON.Vec3(Math.random(), Math.random(), Math.random());
      axis.normalize();
      body.quaternion.setFromAxisAngle(axis, Math.random() * Math.PI);
      world.addBody(body);

      cards.push({ mesh: cardMesh, body, project });
    });
    cardsRef.current = cards;

    // ── Raycasting for drag ───────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const dragPoint = new THREE.Vector3();

    const cardMeshes = cards.map(c => c.mesh);

    const onMouseDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(cardMeshes, false);

      if (hits.length > 0) {
        const hit = hits[0];
        const card = cards.find(c => c.mesh === hit.object);
        if (card) {
          dragRef.current = {
            active: true,
            body: card.body,
            mesh: card.mesh,
            project: card.project,
          };
          card.body.type = CANNON.Body.STATIC;
          card.body.velocity.set(0, 0, 0);
          card.body.angularVelocity.set(0, 0, 0);

          dragPlane.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(new THREE.Vector3()).negate(),
            hit.point
          );
        }
      }
    };

    const onMouseMove = (e) => {
      if (!dragRef.current.active) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(dragPlane, dragPoint);

      dragRef.current.body.position.set(dragPoint.x, dragPoint.y, dragPoint.z);
      dragRef.current.body.quaternion.set(0, 0, 0, 1);
    };

    const onMouseUp = (e) => {
      if (!dragRef.current.active) return;

      // Fling velocity based on mouse speed
      const body = dragRef.current.body;
      body.type = CANNON.Body.DYNAMIC;
      body.velocity.set(
        (Math.random() - 0.5) * 4,
        Math.random() * 3,
        (Math.random() - 0.5) * 2
      );

      // Check if click (no movement) → show project
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(cardMeshes, false);
      if (hits.length > 0) {
        setSelectedProject(dragRef.current.project);
      }

      dragRef.current = { active: false, body: null, mesh: null };
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    // ── Animation loop ────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);

      world.step(1 / 60, dt, 3);

      // Sync physics → Three.js
      cards.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
      });

      // Gentle camera bob
      const t = clock.getElapsedTime();
      camera.position.y = 2 + Math.sin(t * 0.3) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const W2 = mountRef.current?.clientWidth || W;
      const H2 = mountRef.current?.clientHeight || H;
      renderer.setSize(W2, H2);
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '70vh' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Hint */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em',
        color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', textAlign: 'center',
        pointerEvents: 'none',
      }}>
        Grab · Drag · Fling
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(5,5,16,0.8)', backdropFilter: 'blur(10px)',
            }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              style={{
                width: 'min(480px, 90vw)',
                background: 'linear-gradient(135deg,rgba(10,10,26,0.98),rgba(20,15,50,0.98))',
                border: `1px solid ${selectedProject.color}44`,
                borderRadius: 20,
                padding: '2.5rem',
                boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 50px ${selectedProject.color}22`,
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {selectedProject.tags.map(t => (
                  <span key={t} style={{
                    padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.65rem',
                    fontFamily: 'Space Mono,monospace', letterSpacing: '0.05em',
                    background: `${selectedProject.color}22`, color: selectedProject.color,
                    border: `1px solid ${selectedProject.color}44`,
                  }}>{t}</span>
                ))}
              </div>
              <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'1.8rem', fontWeight:800, color:'#f0f0ff', marginBottom:'0.75rem' }}>
                {selectedProject.title}
              </h3>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.95rem', color:'rgba(240,240,255,0.6)', lineHeight:1.7, marginBottom:'1.5rem' }}>
                {selectedProject.desc}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1.5rem', borderRadius: 99,
                    background: `linear-gradient(135deg,${selectedProject.color},${selectedProject.accent})`,
                    color: '#050510', fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'0.9rem',
                    textDecoration: 'none',
                  }}
                >
                  View Project ↗
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{ background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:99, padding:'0.75rem 1.25rem', color:'rgba(255,255,255,0.5)', fontFamily:'Space Mono,monospace', fontSize:'0.8rem' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
