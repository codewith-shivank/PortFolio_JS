"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Howl } from 'howler';

// ─── Generate particle positions that spell out letters ──────────────────────
function generateLetterParticles(text, count = 4000) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.font = 'bold 140px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 400, 100);

  const imageData = ctx.getImageData(0, 0, 800, 200);
  const pixels = imageData.data;
  const letterPositions = [];

  for (let y = 0; y < 200; y += 2) {
    for (let x = 0; x < 800; x += 2) {
      const idx = (y * 800 + x) * 4;
      if (pixels[idx + 3] > 128) {
        letterPositions.push({
          x: (x / 800 - 0.5) * 6,
          y: -(y / 200 - 0.5) * 2,
          z: 0,
        });
      }
    }
  }

  // Sample down or pad to exactly `count` particles
  const sampled = [];
  for (let i = 0; i < count; i++) {
    const src = letterPositions[Math.floor(Math.random() * letterPositions.length)];
    sampled.push(src || { x: 0, y: 0, z: 0 });
  }

  return sampled;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Loader({ onComplete }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // Generate letter positions
    const COUNT = 4000;
    const letterPos = generateLetterParticles('Shivank', COUNT);

    // Geometry
    const geometry = new THREE.BufferGeometry();
    const positions  = new Float32Array(COUNT * 3);
    const finalPositions = new Float32Array(COUNT * 3);
    const delays    = new Float32Array(COUNT);
    const randoms   = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      // Burst start: random sphere
      const r = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Target: letter shape
      finalPositions[i * 3]     = letterPos[i].x;
      finalPositions[i * 3 + 1] = letterPos[i].y;
      finalPositions[i * 3 + 2] = letterPos[i].z;

      delays[i]  = Math.random();
      randoms[i * 3]     = (Math.random() - 0.5) * 2;
      randoms[i * 3 + 1] = (Math.random() - 0.5) * 2;
      randoms[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aFinalPos', new THREE.BufferAttribute(finalPositions, 3));
    geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

    // Shader material (inline since vite-plugin-glsl import order matters)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute vec3 aFinalPos;
        attribute float aDelay;
        attribute vec3 aRandom;
        uniform float uProgress;
        uniform float uTime;
        varying float vAlpha;
        varying vec3 vColor;

        void main() {
          float t = clamp((uProgress - aDelay * 0.5) / 0.5, 0.0, 1.0);
          float eased = t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t+2.0,3.0)/2.0;

          vec3 pos = mix(position, aFinalPos, eased);
          pos += aRandom * (1.0 - eased) * 0.05 * sin(uTime * 3.0 + aDelay * 10.0);

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = mix(1.5, 4.0, eased) * (300.0 / -mvPos.z);

          vAlpha = mix(0.0, 1.0, eased * 2.0 - 0.5);
          vColor = mix(vec3(0.3,0.5,1.0), vec3(0.9,0.95,1.0), eased);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float soft = 1.0 - smoothstep(0.25, 0.5, d);
          gl_FragColor = vec4(vColor, vAlpha * soft);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Subtle ambient particles
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPos = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      ambientPos[i*3]   = (Math.random() - 0.5) * 14;
      ambientPos[i*3+1] = (Math.random() - 0.5) * 8;
      ambientPos[i*3+2] = (Math.random() - 0.5) * 6 - 2;
    }
    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));
    const ambientMat = new THREE.PointsMaterial({
      color: 0x4466ff, size: 0.02, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(ambientGeo, ambientMat));

    // ── Howler.js cinematic load sound (generated tone fallback) ──────────
    // Using a short synthetic cinematic chord via AudioContext if no file
    try {
      const ac = new AudioContext();
      const playChord = () => {
        [130, 196, 261, 330].forEach((freq, i) => {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ac.currentTime);
          gain.gain.linearRampToValueAtTime(0.06 - i * 0.01, ac.currentTime + 0.3 + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 3.5);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(ac.currentTime + i * 0.08);
          osc.stop(ac.currentTime + 4);
        });
      };
      setTimeout(playChord, 200);
    } catch (e) { /* audio not supported */ }

    // ── Animation loop ────────────────────────────────────────────────────
    let animProgress = 0;
    let startTime = null;
    let rafId;
    const DURATION = 3200; // ms

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      animProgress = Math.min(elapsed / DURATION, 1);

      material.uniforms.uProgress.value = animProgress;
      material.uniforms.uTime.value = elapsed / 1000;

      // Slow camera drift
      camera.position.x = Math.sin(elapsed / 4000) * 0.2;
      camera.position.y = Math.cos(elapsed / 5000) * 0.1;

      setProgress(Math.round(animProgress * 100));
      renderer.render(scene, camera);

      if (animProgress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        // Hold assembled state briefly, then exit
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 800);
        }, 600);
      }
    };

    rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loader-wrapper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#050510' }}
        >
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />

          {/* Progress indicator */}
          <motion.div
            className="loader-progress-text"
            style={{ position: 'relative', zIndex: 10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              color: 'rgba(124,109,250,0.8)',
              display: 'block',
              textAlign: 'center',
              marginTop: '50vh',
              paddingTop: '2rem',
            }}>
              INITIALIZING · {progress}%
            </span>
          </motion.div>

          {/* Scanline overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            pointerEvents: 'none',
            zIndex: 5,
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
