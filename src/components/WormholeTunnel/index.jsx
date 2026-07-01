import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Wormhole hyperspace tunnel ───────────────────────────────────────────────
export default function WormholeTunnel({ scrollProgress = 0 }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock, mouse }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uProgress.value = scrollProgress;
    materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uMouse;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
    }

    void main() {
      vec2 uv = vUv;
      float angle = atan(uv.y - 0.5, uv.x - 0.5);
      float radius = length(uv - 0.5);
      float speed = 0.5 + uProgress * 6.0;
      float t = uTime * speed;

      // Star streaks
      float streak = 0.0;
      for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float a = angle + fi * 1.0472;
        float n = noise(vec2(cos(a)*4.0+fi, sin(a)*4.0+fi));
        float line = smoothstep(0.005,0.0,abs(mod(radius*2.0+t*(0.15+fi*0.04)+n*0.1,1.0)-0.5)-0.025*uProgress);
        streak += line * (0.4+0.6*sin(fi*1.5+uTime*0.5));
      }

      float edge = smoothstep(0.5, 0.05, radius);
      float center = 1.0 - smoothstep(0.0, 0.12, radius);

      vec3 coreCol  = vec3(0.5, 0.85, 1.0);
      vec3 midCol   = vec3(0.55, 0.2, 1.0);
      vec3 outerCol = vec3(0.04, 0.02, 0.14);

      float cm = smoothstep(0.0, 0.4, radius);
      vec3 col = mix(coreCol, midCol, cm);
      col = mix(col, outerCol, smoothstep(0.25, 0.5, radius));
      col += streak * vec3(0.8, 0.9, 1.0) * (0.25 + uProgress * 0.75);

      // Chromatic aberration at high speed
      float abbr = uProgress * 0.025;
      col.r += noise(uv*25.0+vec2(uTime+abbr,0.0)) * 0.04 * uProgress;
      col.b += noise(uv*25.0+vec2(uTime-abbr,0.0)) * 0.04 * uProgress;

      col *= edge;
      col += center * vec3(0.08, 0.25, 0.5) * (0.5+0.5*sin(uTime*2.5));

      // Scanline
      col *= 0.96 + 0.04 * sin(vUv.y * 900.0 + uTime * 12.0);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const uniforms = useRef({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        depthWrite={false}
      />
    </mesh>
  );
}
