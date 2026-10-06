import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CyberIcosahedron({ prefersReducedMotion }) {
  const meshRef = useRef(null);
  const wireframeRef = useRef(null);
  const innerCoreRef = useRef(null);

  useFrame((state) => {
    if (prefersReducedMotion) return;

    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.25;
      meshRef.current.rotation.y = time * 0.35;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = -time * 0.18;
      wireframeRef.current.rotation.y = -time * 0.25;
      wireframeRef.current.rotation.z = time * 0.1;
    }
    if (innerCoreRef.current) {
      const scale = 1 + Math.sin(time * 2.5) * 0.05;
      innerCoreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float
      speed={prefersReducedMotion ? 0 : 2}
      rotationIntensity={prefersReducedMotion ? 0 : 0.6}
      floatIntensity={prefersReducedMotion ? 0 : 0.8}
    >
      <group>
        {/* Outer Wireframe Cage */}
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[1.75, 1]} />
          <meshBasicMaterial
            color="#22d3ee"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Main Faceted Crystal Body */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial
            color="#091b22"
            emissive="#083344"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.9}
            flatShading
            wireframe={false}
          />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh ref={innerCoreRef}>
          <octahedronGeometry args={[0.65, 0]} />
          <meshBasicMaterial
            color="#22d3ee"
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Inner Cyan Light Core */}
        <pointLight position={[0, 0, 0]} color="#22d3ee" intensity={2} distance={5} />
      </group>
    </Float>
  );
}

function ParticleField({ count = 120, prefersReducedMotion }) {
  const pointsRef = useRef(null);

  const particles = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      coords[i3] = (Math.random() - 0.5) * 10;
      coords[i3 + 1] = (Math.random() - 0.5) * 10;
      coords[i3 + 2] = (Math.random() - 0.5) * 8;
    }
    return coords;
  }, [count]);

  useFrame((state) => {
    if (prefersReducedMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#22d3ee"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroCanvas() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      className="relative w-full h-[340px] sm:h-[420px] lg:h-[500px] flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'auto' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-4, -3, -2]} color="#06b6d4" intensity={2} />

        <CyberIcosahedron prefersReducedMotion={prefersReducedMotion} />
        <ParticleField prefersReducedMotion={prefersReducedMotion} />
      </Canvas>
    </div>
  );
}
