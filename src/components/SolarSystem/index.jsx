import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Html, Billboard } from '@react-three/drei';

// ─── Skill data ───────────────────────────────────────────────────────────────
const SKILLS = [
  { name: 'JavaScript', level: 85, color: '#f7df1e', emissive: '#a89000', orbitRadius: 3.2, orbitSpeed: 0.8,  size: 0.55, certifications: [] },
  { name: 'React JS',   level: 80, color: '#61dafb', emissive: '#0099cc', orbitRadius: 4.5, orbitSpeed: 0.55, size: 0.50, certifications: ['LinkedIn'] },
  { name: 'HTML5/CSS3', level: 90, color: '#e44d26', emissive: '#883300', orbitRadius: 6.0, orbitSpeed: 0.38, size: 0.60, certifications: ['Microsoft'] },
  { name: 'UI/UX Design', level: 70, color: '#ff6b9d', emissive: '#aa0044', orbitRadius: 7.8, orbitSpeed: 0.28, size: 0.45, certifications: ['EY'] },
  { name: 'Excel',      level: 75, color: '#1d7b5e', emissive: '#0a4a36', orbitRadius: 9.5, orbitSpeed: 0.20, size: 0.42, certifications: ['Microsoft', 'Deloitte'] },
  { name: 'Node.js',    level: 55, color: '#68a063', emissive: '#2d6020', orbitRadius: 11.5, orbitSpeed: 0.14, size: 0.38, certifications: [] },
];

// ─── Single planet ────────────────────────────────────────────────────────────
function Planet({ skill, time, onSelect }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  const angle = time * skill.orbitSpeed;
  const x = Math.cos(angle) * skill.orbitRadius;
  const z = Math.sin(angle) * skill.orbitRadius;
  const y = Math.sin(angle * 0.3) * 0.5;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
      meshRef.current.rotation.y += 0.005;
    }
    if (glowRef.current) {
      glowRef.current.position.set(x, y, z);
    }
  });

  const atmFrag = `
    precision highp float;
    uniform vec3 uColor;
    uniform float uIntensity;
    varying vec3 vNormal;
    varying vec3 vView;
    void main(){
      float rim=1.0-abs(dot(normalize(vNormal),normalize(vView)));
      rim=pow(rim,2.5)*uIntensity;
      gl_FragColor=vec4(uColor*rim,rim*0.9);
    }
  `;
  const atmVert = `
    varying vec3 vNormal;
    varying vec3 vView;
    void main(){
      vNormal=normalMatrix*normal;
      vec4 mv=modelViewMatrix*vec4(position,1.0);
      vView=mv.xyz;
      gl_Position=projectionMatrix*mv;
    }
  `;

  return (
    <>
      {/* Orbit path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[skill.orbitRadius - 0.01, skill.orbitRadius + 0.01, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[skill.size * 1.6, 32, 32]} />
        <shaderMaterial
          vertexShader={atmVert}
          fragmentShader={atmFrag}
          uniforms={{
            uColor: { value: new THREE.Color(skill.color) },
            uIntensity: { value: hovered ? 2.5 : 1.5 },
          }}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Planet mesh */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onSelect(skill)}
      >
        <sphereGeometry args={[skill.size, 32, 32]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.emissive}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          roughness={0.7}
          metalness={0.1}
        />

        {/* Certification rings */}
        {skill.certifications.map((cert, i) => (
          <mesh key={cert} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
            <ringGeometry args={[
              skill.size + 0.12 + i * 0.12,
              skill.size + 0.17 + i * 0.12,
              40
            ]} />
            <meshBasicMaterial
              color={cert === 'Microsoft' ? '#00a4ef' : cert === 'EY' ? '#ffe600' : cert === 'Deloitte' ? '#86bc25' : '#0077b5'}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Hover label */}
        {hovered && (
          <Billboard>
            <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.65rem',
                color: '#fff',
                background: 'rgba(5,5,16,0.85)',
                border: `1px solid ${skill.color}`,
                borderRadius: '4px',
                padding: '0.3rem 0.6rem',
                whiteSpace: 'nowrap',
                letterSpacing: '0.08em',
              }}>
                {skill.name} · {skill.level}%
              </div>
            </Html>
          </Billboard>
        )}
      </mesh>
    </>
  );
}

// ─── Solar System Scene ───────────────────────────────────────────────────────
export function SolarSystemScene({ onSelectSkill }) {
  const { camera } = useThree();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta * 0.4;
    // Slow camera orbit
    camera.position.x = Math.sin(timeRef.current * 0.1) * 18;
    camera.position.z = Math.cos(timeRef.current * 0.1) * 18;
    camera.position.y = 6 + Math.sin(timeRef.current * 0.05) * 3;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#fff9e0" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#7c6dfa" />

      {/* Sun */}
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial
          color="#fff176"
          emissive="#ff8c00"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Sun glow */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#ff6b00" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Stars */}
      <Stars />

      {/* Skill planets */}
      {SKILLS.map((skill) => (
        <Planet
          key={skill.name}
          skill={skill}
          time={timeRef.current}
          onSelect={onSelectSkill}
        />
      ))}
    </>
  );
}

// ─── Background stars ─────────────────────────────────────────────────────────
function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 200;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 200;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    return arr;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points geometry={geo}>
      <pointsMaterial
        color="#ffffff"
        size={0.12}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}


