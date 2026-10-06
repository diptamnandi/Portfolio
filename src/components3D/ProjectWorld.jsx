import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import {
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  Maximize2,
  Compass,
} from 'lucide-react';

/**
 * 3D Ambient Particle Starfield
 */
function WorldParticles({ count = 300 }) {
  const pointsRef = useRef(null);

  const coords = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3] = (Math.random() - 0.5) * 24;
      array[i3 + 1] = (Math.random() - 0.5) * 16;
      array[i3 + 2] = (Math.random() - 0.5) * 24;
    }
    return array;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={coords.length / 3}
          array={coords}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#22d3ee"
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Floating 3D Project Glass Panel in the Ring
 */
function ProjectRingPanel({ project, index, total, onSelect }) {
  const [hovered, setHovered] = useState(false);

  // Calculate cylindrical position around the ring
  const radius = 5.2;
  const angle = (index / total) * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  // Face tangent / outwards from center
  const rotY = angle;

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* 3D Glass Plane anchor */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(project)}
      >
        <planeGeometry args={[2.5, 3.2]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          wireframe={false}
        />
      </mesh>

      {/* Interactive HTML Card attached to the 3D plane */}
      <Html
        transform
        distanceFactor={6.2}
        position={[0, 0, 0.05]}
        className="pointer-events-auto select-none"
      >
        <div
          onClick={() => onSelect(project)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`w-[290px] rounded-2xl p-5 bg-[#0D0D0D]/90 backdrop-blur-xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
            hovered
              ? 'border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.35)] scale-105'
              : 'border-white/15 shadow-2xl'
          }`}
          style={{ height: '370px' }}
        >
          {/* Top thumbnail */}
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#151515] border border-white/5 mb-3.5 shrink-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />

            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-black/80 border border-cyan-500/30">
                {project.category}
              </span>
            </div>

            {project.featured && (
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-black/85 border border-amber-500/30 flex items-center gap-1">
                <Sparkles size={10} className="text-amber-400" />
                Featured
              </span>
            )}
          </div>

          {/* Project Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-display text-base font-bold text-white mb-1 leading-snug line-clamp-1">
                {project.title}
              </h4>
              <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed font-sans mb-3">
                {project.tagline}
              </p>
            </div>

            {/* Tech badges & CTA */}
            <div>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.techStack.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-300 bg-[#151515] border border-white/5"
                  >
                    {t}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-500">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="w-full py-2 px-3 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5 text-black bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-glow-cyan-sm"
              >
                <Eye size={13} />
                <span>Inspect Architecture</span>
              </button>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * Ring of all projects
 */
function ProjectRing({ projects, onSelectProject, currentIndex }) {
  const groupRef = useRef(null);

  // Smooth target rotation controlled by keyboard index
  useFrame(() => {
    if (!groupRef.current) return;
    const targetAngle = -(currentIndex / projects.length) * Math.PI * 2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetAngle,
      0.08
    );
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, idx) => (
        <ProjectRingPanel
          key={project.id}
          project={project}
          index={idx}
          total={projects.length}
          onSelect={onSelectProject}
        />
      ))}
    </group>
  );
}

/**
 * Main ProjectWorld 3D Experience
 */
export default function ProjectWorld({ projects = [], onSelectProject, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Keyboard controls for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setAutoRotate(false);
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      } else if (e.key === 'ArrowLeft') {
        setAutoRotate(false);
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (projects[currentIndex]) {
          onSelectProject(projects[currentIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projects, currentIndex, onSelectProject, onClose]);

  const activeProject = projects[currentIndex] || projects[0];

  return (
    <div
      className="relative w-full h-[620px] sm:h-[680px] rounded-2xl bg-[#050505] border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_-10px_rgba(34,211,238,0.2)] my-8 select-none"
      role="region"
      aria-label="3D Project World Exploration Mode"
    >
      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0D0D]/90 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-300 pointer-events-auto shadow-sm">
          <Compass size={14} className="text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>3D_PROJECT_ORBIT // V1.0</span>
        </div>

        {/* Exit 3D Mode Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0D0D0D]/90 backdrop-blur-md border border-white/10 hover:border-cyan-400 text-neutral-300 hover:text-white text-xs font-mono transition-colors pointer-events-auto shadow-sm"
          aria-label="Exit 3D mode and return to grid"
        >
          <span>Exit 3D</span>
          <X size={15} />
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.4, 9.2], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 8, 5]} intensity={1.4} color="#ffffff" />
        <pointLight position={[0, 0, 0]} color="#22d3ee" intensity={2} distance={8} />

        <WorldParticles count={350} />

        <ProjectRing
          projects={projects}
          onSelectProject={onSelectProject}
          currentIndex={currentIndex}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 2.3}
          maxPolarAngle={Math.PI / 1.8}
          onStart={() => setAutoRotate(false)}
        />
      </Canvas>

      {/* Bottom Accessible HUD / Controller */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Active Project Title Pill */}
        <div className="px-3.5 py-1.5 rounded-lg bg-[#0D0D0D]/90 backdrop-blur-md border border-white/10 text-xs font-mono text-neutral-300 pointer-events-auto">
          <span className="text-neutral-500 mr-2">FOCUSED:</span>
          <span className="text-cyan-400 font-semibold">{activeProject?.title}</span>
          <span className="text-neutral-500 ml-2">
            ({currentIndex + 1} of {projects.length})
          </span>
        </div>

        {/* Keyboard Accessible Navigation Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              setAutoRotate(false);
              setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
            }}
            className="p-2 rounded-lg bg-[#0D0D0D]/90 border border-white/10 text-neutral-300 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors text-xs font-mono flex items-center gap-1"
            aria-label="Previous project panel"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectProject(activeProject)}
            className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-mono font-semibold text-xs hover:bg-cyan-300 shadow-glow-cyan-sm transition-all"
            aria-label={`Open details for ${activeProject?.title}`}
          >
            Open Details
          </button>

          <button
            type="button"
            onClick={() => {
              setAutoRotate(false);
              setCurrentIndex((prev) => (prev + 1) % projects.length);
            }}
            className="p-2 rounded-lg bg-[#0D0D0D]/90 border border-white/10 text-neutral-300 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors text-xs font-mono flex items-center gap-1"
            aria-label="Next project panel"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
