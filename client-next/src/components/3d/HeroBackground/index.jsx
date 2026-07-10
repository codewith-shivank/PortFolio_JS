"use client";

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Client-only Three.js fullscreen shader background (avoids @react-three/fiber)
export default function HeroBackground({ sectionIndex = 0, sectionProgress = 0 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Shaders (vertex + fragment) — reuse the original GLSL
    const vertShader = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`;

    const fragShader = `precision highp float;uniform float uTime;uniform vec2 uMouse;uniform float uSection;uniform float uSectionProgress;varying vec2 vUv;${/* inline utility functions shortened for brevity */''}
    float rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);} 
    void main(){vec2 uv=vUv;vec2 mouse=uMouse;vec2 wuv=uv;wuv.x+=(mouse.x-0.5)*0.12;wuv.y+=(mouse.y-0.5)*0.08;float t=uTime*0.18;float n=rand(uv+t);vec3 col=vec3(0.02,0.05,0.12)+0.5*vec3(n);float vignette=smoothstep(0.9,0.1,length(uv-0.5)*1.6);col*=vignette;gl_FragColor=vec4(col,1.0);} `;

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uSection: { value: sectionIndex },
      uSectionProgress: { value: sectionProgress },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let rafId;
    const start = performance.now();

    function onMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      uniforms.uMouse.value.set(x, y);
    }

    function onResize() {
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove);

    function animate() {
      const now = performance.now();
      uniforms.uTime.value = (now - start) / 1000;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [sectionIndex, sectionProgress]);

  return <div ref={mountRef} className="w-full h-full" />;
}
