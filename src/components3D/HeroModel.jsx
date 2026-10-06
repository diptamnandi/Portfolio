import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import StaticGradientFallback from './StaticGradientFallback';

/**
 * Procedural Futuristic Core
 * Features:
 * - Wireframe icosahedron inside a translucent glowing sphere
 * - Inner high-emissive energy core
 * - Mouse-tracking subtle tilt
 * - Hover scale effect
 * - Constant slow auto-rotation
 */
function FuturisticCore({ isHovered, setIsHovered }) {
  const groupRef = useRef(null);
  const icosahedronRef = useRef(null);
  const sphereRef = useRef(null);
  const innerCoreRef = useRef(null);

  const currentScale = useRef(1.0);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. Hover Scale interpolation (Smooth lerp between 1.0 and 1.12)
    const targetScale = isHovered ? 1.12 : 1.0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.08);
    groupRef.current.scale.setScalar(currentScale.current);

    // 2. Subtle Mouse Tilt (Smoothly lerp rotation to cursor position)
    const targetRotX = -state.pointer.y * 0.35;
    const targetRotY = state.pointer.x * 0.45;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);

    // 3. Independent internal rotations
    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.x = time * 0.22;
      icosahedronRef.current.rotation.y = time * 0.32;
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.y = -time * 0.15;
    }

    if (innerCoreRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.08;
      innerCoreRef.current.scale.setScalar(pulse);
      innerCoreRef.current.rotation.z = time * 0.4;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.7}>
      <group
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerOut={() => setIsHovered(false)}
      >
        {/* Outer Translucent Glowing Sphere */}
        <mesh ref={sphereRef}>
          <sphereGeometry args={[1.85, 32, 32]} />
          <meshStandardMaterial
            color="#083344"
            emissive="#22d3ee"
            emissiveIntensity={0.35}
            transparent
            opacity={0.22}
            roughness={0.15}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>

        {/* Outer Wireframe Latitude Ring on Sphere */}
        <mesh>
          <sphereGeometry args={[1.88, 16, 16]} />
          <meshBasicMaterial
            color="#22d3ee"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>

        {/* Procedural Wireframe Icosahedron Inside the Sphere */}
        <mesh ref={icosahedronRef}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#06b6d4"
            emissiveIntensity={0.85}
            wireframe
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* Inner Solid Faceted Energy Crystal */}
        <mesh ref={innerCoreRef}>
          <octahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial
            color="#042f2e"
            emissive="#22d3ee"
            emissiveIntensity={1.4}
            roughness={0.1}
            metalness={0.5}
            flatShading
          />
        </mesh>

        {/* Point light in accent color emitting from core */}
        <pointLight position={[0, 0, 0]} color="#22d3ee" intensity={2.5} distance={6} />
      </group>
    </Float>
  );
}

/**
 * Orbiting Particle Field with ~800 points
 */
function ParticleField({ count = 800 }) {
  const pointsRef = useRef(null);

  const particles = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical distribution around the core
      const radius = 2.4 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      coords[i3] = radius * Math.sin(phi) * Math.cos(theta);
      coords[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      coords[i3 + 2] = radius * Math.cos(phi);
    }
    return coords;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = time * 0.025;
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
        size={0.038}
        color="#22d3ee"
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Main HeroModel Component
 * Features:
 * - Lazy loaded with Suspense
 * - Cap devicePixelRatio at 1.5
 * - IntersectionObserver pauses rendering when offscreen
 * - Fallback for prefers-reduced-motion and low-power devices
 */
export default function HeroModel() {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isLowPowerOrReducedMotion, setIsLowPowerOrReducedMotion] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsLowPowerOrReducedMotion(true);
    }

    const motionHandler = (e) => setIsLowPowerOrReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionHandler);

    // 2. Pause rendering when offscreen using IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      mediaQuery.removeEventListener('change', motionHandler);
      observer.disconnect();
    };
  }, []);

  // If user requests reduced motion or device is in low-power fallback mode
  if (isLowPowerOrReducedMotion) {
    return (
      <div ref={containerRef} className="relative w-full h-[300px] sm:h-[380px] lg:h-[460px]">
        <StaticGradientFallback />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300px] sm:h-[380px] lg:h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Futuristic Core Model"
    >
      <Suspense fallback={<StaticGradientFallback />}>
        <Canvas
          dpr={[1, 1.5]} // Cap devicePixelRatio at 1.5 for maximum efficiency
          frameloop={isInView ? 'always' : 'never'} // Pause rendering when offscreen
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 6, 5]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-4, -3, -3]} color="#06b6d4" intensity={2} />

          <FuturisticCore isHovered={isHovered} setIsHovered={setIsHovered} />
          <ParticleField count={800} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export { StaticGradientFallback };
