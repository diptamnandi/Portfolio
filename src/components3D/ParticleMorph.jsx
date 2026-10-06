import React, { useRef, useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  SHAPE_GENERATORS,
  getRandomScatterPositions,
  getLazyShapePositions,
  validateShape,
} from './shapes';

/**
 * ============================================================================
 * PARTICLE MORPH CONFIGURATION
 * ============================================================================
 */
export const PARTICLE_CONFIG = {
  // Debug mode: logs shape stats to console and renders on-screen HUD
  debug: true,

  // Point counts (2500 desktop, 1200 mobile for 60fps & crisp dots)
  desktopCount: 2500,
  mobileCount: 1200,
  mobileBreakpoint: 768,

  // Animation timings
  morphDuration: 1.6, // seconds
  autoMorphInterval: 8000, // ms between auto-morphs

  // Point size (Screen pixels: 1.5 - 3.5px)
  pointSize: 2.2,
  wobbleStrength: 0.035,
  scatterStrength: 1.1,

  // Mouse repulsion in 3D world space
  repulsionRadius: 1.1,
  repulsionStrength: 0.75,

  // Strict [0.0, 1.0] colors (Cyan #22d3ee, soft blue, and ice sparkle)
  colors: {
    accentCyan: [0.133, 0.828, 0.933], // #22d3ee
    softBlue: [0.2, 0.68, 0.96],
    iceAccent: [0.65, 0.94, 0.98],
  },

  // 14 Morphing Shapes
  shapes: [
    { id: 'CIRCLE', name: 'CIRCLE RING' },
    { id: 'SPHERE', name: 'FIBONACCI SPHERE' },
    { id: 'CUBE', name: 'HYPERCUBE' },
    { id: 'HEXAGON', name: 'HEXAGON PRISM' },
    { id: 'ETHEREUM', name: 'ETHEREUM DIAMOND' },
    { id: 'SEMICIRCLE', name: 'SEMICIRCLE DISC' },
    { id: 'TORUS', name: 'TORUS RING' },
    { id: 'PYRAMID', name: 'GEOMETRIC PYRAMID' },
    { id: 'DNA', name: 'DNA DOUBLE HELIX' },
    { id: 'HEART', name: '3D HEART' },
    { id: 'STAR', name: 'FIVE-POINT STAR' },
    { id: 'INFINITY', name: 'LEMNISCATE INFINITY' },
    { id: 'GALAXY', name: 'SPIRAL GALAXY' },
    { id: 'DN', name: 'DN SIGNATURE' },
  ],
};

/**
 * Vertex Shader:
 * - 100% GPU morphing between aFrom and aTo
 * - Clamped screen point size: strictly 1.2px - 3.8px
 * - Scatter envelope strictly multiplied by sin(uProgress * PI) so points land 100% on target shape
 * - Eased per-particle delay remapped to settle at uProgress = 1.0
 */
const vertexShader = `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPointSize;
  uniform float uPixelRatio;
  uniform float uWobbleStrength;
  uniform float uScatterStrength;
  uniform float uRepulsionRadius;
  uniform float uRepulsionStrength;
  uniform vec3 uMouseWorld;
  uniform float uMouseActive;
  uniform float uPulse;

  uniform vec3 uColorCyan;
  uniform vec3 uColorBlue;
  uniform vec3 uColorIce;

  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aDelay;
  attribute float aRandom;
  attribute vec3 aRandomVec;
  attribute float aSize;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // 1. Remap per-particle progress so every particle starts >= 0 and finishes EXACTLY at progress 1.0
    float delaySpread = 0.25;
    float delay = aDelay * delaySpread;
    float p = clamp((uProgress - delay) / (1.0 - delaySpread), 0.0, 1.0);

    // Cubic easeInOut
    float t = p;
    float easedP = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;

    // 2. Mid-morph scatter: strictly multiplied by sin(uProgress * PI)
    // Because sin(0.0) == 0.0 and sin(PI) == 0.0, scatter is strictly 0 at both start and finish!
    float scatterEnvelope = sin(uProgress * 3.14159265);
    vec3 midPoint = mix(aFrom, aTo, 0.5);
    vec3 scatterDir = normalize(midPoint + aRandomVec * 1.4 + vec3(0.001));
    vec3 scatterOffset = scatterDir * (scatterEnvelope * uScatterStrength * (0.6 + 0.6 * aRandom));

    // Base morphed position: at uProgress = 1.0, easedP is 1.0 and scatterOffset is 0.0 -> lands 100% on aTo!
    vec3 morphedPos = mix(aFrom, aTo, easedP) + scatterOffset;

    // 3. Subtle idle breathing wobble in vertex shader
    vec3 wobble = vec3(
      sin(morphedPos.y * 3.2 + uTime * 1.3 + aRandom * 6.28) * cos(morphedPos.z * 2.5 + uTime * 0.9),
      cos(morphedPos.z * 2.8 + uTime * 1.1 + aRandom * 6.28) * sin(morphedPos.x * 2.5 + uTime * 1.0),
      sin(morphedPos.x * 3.0 + uTime * 1.2 + aRandom * 6.28) * cos(morphedPos.y * 2.5 + uTime * 0.8)
    ) * uWobbleStrength;

    vec3 finalLocalPos = morphedPos + wobble;

    // 4. 3D cursor repulsion in world space
    vec4 worldPosition = modelMatrix * vec4(finalLocalPos, 1.0);
    if (uMouseActive > 0.5) {
      vec3 toPoint = worldPosition.xyz - uMouseWorld;
      float distToMouse = length(toPoint);
      if (distToMouse < uRepulsionRadius && distToMouse > 0.001) {
        float repelFactor = pow(1.0 - distToMouse / uRepulsionRadius, 2.0);
        worldPosition.xyz += normalize(toPoint) * (repelFactor * uRepulsionStrength);
      }
    }

    if (uPulse > 0.001) {
      worldPosition.xyz *= (1.0 + uPulse * 0.08);
    }

    vec4 mvPosition = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * mvPosition;

    // 5. Clamped screen point size (1.2px to 3.8px)
    float baseSize = uPointSize * uPixelRatio * (5.0 / -mvPosition.z) * aSize;
    gl_PointSize = clamp(baseSize * (1.0 + uPulse * 0.25), 1.2, 3.8);

    // 6. Color blending in strictly [0, 1] range
    vec3 pointColor = mix(uColorCyan, uColorBlue, smoothstep(0.4, 0.85, aRandom));
    if (aRandom > 0.86) {
      pointColor = mix(pointColor, uColorIce, 0.65);
    }
    pointColor = clamp(pointColor + vec3(scatterEnvelope * 0.12), 0.0, 1.0);

    vColor = pointColor;
    vAlpha = clamp(0.68 + 0.22 * sin(uTime * 1.8 + aRandom * 6.28), 0.5, 0.92);
  }
`;

/**
 * Fragment Shader:
 * - Anti-aliased circular points via gl_PointCoord discard
 */
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float edge = smoothstep(0.5, 0.15, dist);
    float alpha = edge * vAlpha;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

/**
 * Morphing Points Mesh Component (Inside Three.js Canvas)
 */
function MorphingPoints({
  count,
  targetIndex,
  isMorphingRef,
  morphProgressRef,
  onMorphComplete,
  isHovered,
  touchEnabled,
  prefersReducedMotion,
  onFpsUpdate,
}) {
  const pointsRef = useRef(null);
  const groupRef = useRef(null);
  const materialRef = useRef(null);
  const tiltTarget = useRef({ x: 0, y: 0 });

  // FPS measurement variables
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0.0 },
      uTime: { value: 0.0 },
      uPointSize: { value: PARTICLE_CONFIG.pointSize },
      uPixelRatio: {
        value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1,
      },
      uWobbleStrength: { value: PARTICLE_CONFIG.wobbleStrength },
      uScatterStrength: { value: PARTICLE_CONFIG.scatterStrength },
      uRepulsionRadius: { value: PARTICLE_CONFIG.repulsionRadius },
      uRepulsionStrength: { value: PARTICLE_CONFIG.repulsionStrength },
      uMouseWorld: { value: new THREE.Vector3(-1000, -1000, -1000) },
      uMouseActive: { value: 0.0 },
      uPulse: { value: 0.0 },
      uColorCyan: { value: new THREE.Color(...PARTICLE_CONFIG.colors.accentCyan) },
      uColorBlue: { value: new THREE.Color(...PARTICLE_CONFIG.colors.softBlue) },
      uColorIce: { value: new THREE.Color(...PARTICLE_CONFIG.colors.iceAccent) },
    }),
    []
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const delays = new Float32Array(count);
    const randoms = new Float32Array(count);
    const randomVecs = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Initial scatter cloud and first shape
    const initialPositions = getRandomScatterPositions(count);
    const firstShapePositions = getLazyShapePositions(PARTICLE_CONFIG.shapes[0].id, count);

    for (let i = 0; i < count; i++) {
      const r = Math.random();
      randoms[i] = r;
      delays[i] = r * 0.7 + (i / count) * 0.3;
      sizes[i] = 0.8 + Math.random() * 0.4;

      const i3 = i * 3;
      const rx = (Math.random() - 0.5) * 2;
      const ry = (Math.random() - 0.5) * 2;
      const rz = (Math.random() - 0.5) * 2;
      const len = Math.hypot(rx, ry, rz) || 1;
      randomVecs[i3] = rx / len;
      randomVecs[i3 + 1] = ry / len;
      randomVecs[i3 + 2] = rz / len;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(initialPositions), 3));
    geo.setAttribute('aFrom', new THREE.BufferAttribute(new Float32Array(initialPositions), 3));
    geo.setAttribute('aTo', new THREE.BufferAttribute(new Float32Array(firstShapePositions), 3));
    geo.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute('aRandomVec', new THREE.BufferAttribute(randomVecs, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    // Ensure draw range and bounding sphere are explicitly set
    geo.setDrawRange(0, count);
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 10.0);

    return geo;
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      if (materialRef.current) materialRef.current.dispose();
    };
  }, [geometry]);

  const pulseRef = useRef(0.0);
  const lastTargetIndexRef = useRef(0);

  // Transition trigger: Copy visible state into aFrom, write new shape into aTo
  useEffect(() => {
    if (lastTargetIndexRef.current === targetIndex) return;
    lastTargetIndexRef.current = targetIndex;

    const targetShape = PARTICLE_CONFIG.shapes[targetIndex];
    if (!targetShape || !geometry) return;

    const aFromAttr = geometry.getAttribute('aFrom');
    const aToAttr = geometry.getAttribute('aTo');
    if (!aFromAttr || !aToAttr) return;

    const fromArr = aFromAttr.array;
    const toArr = aToAttr.array;
    const currentProg = morphProgressRef.current;

    // Copy current visible positions into aFrom
    if (currentProg >= 1.0) {
      fromArr.set(toArr);
    } else {
      for (let i = 0; i < count * 3; i++) {
        fromArr[i] = fromArr[i] + (toArr[i] - fromArr[i]) * currentProg;
      }
    }
    aFromAttr.needsUpdate = true;

    // Fetch and set new target shape into aTo
    const nextPositions = getLazyShapePositions(targetShape.id, count);
    toArr.set(nextPositions);
    aToAttr.needsUpdate = true;

    // Reset progress and trigger animation
    morphProgressRef.current = 0.0;
    pulseRef.current = 1.0;
    isMorphingRef.current = true;

    if (PARTICLE_CONFIG.debug) {
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;
      let hasNaN = false;

      for (let i = 0; i < count; i++) {
        const x = nextPositions[i * 3];
        const y = nextPositions[i * 3 + 1];
        const z = nextPositions[i * 3 + 2];
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) hasNaN = true;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
        if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
      }
      console.log(
        `%c[ParticleMorph Debug] Morphing to "${targetShape.name}": length=${nextPositions.length}, X=[${minX.toFixed(2)}, ${maxX.toFixed(2)}], Y=[${minY.toFixed(2)}, ${maxY.toFixed(2)}], Z=[${minZ.toFixed(2)}, ${maxZ.toFixed(2)}], hasNaN=${hasNaN}`,
        'color: #22d3ee; font-weight: bold;'
      );
    }
  }, [targetIndex, geometry, count, isMorphingRef, morphProgressRef]);

  // Frame Loop: Update GPU progress, time uniform, lerp tilt
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Live FPS calculation for debug overlay
    frameCountRef.current++;
    const now = performance.now();
    if (now - lastFpsTimeRef.current >= 500) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsTimeRef.current));
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
      if (onFpsUpdate) onFpsUpdate(fps);
    }

    // 2. Advance morph progress
    if (isMorphingRef.current) {
      if (prefersReducedMotion) {
        morphProgressRef.current = 1.0;
        isMorphingRef.current = false;
        if (materialRef.current) materialRef.current.uniforms.uProgress.value = 1.0;
        onMorphComplete();
      } else {
        morphProgressRef.current += delta / PARTICLE_CONFIG.morphDuration;
        if (morphProgressRef.current >= 1.0) {
          morphProgressRef.current = 1.0;
          isMorphingRef.current = false;
          if (materialRef.current) materialRef.current.uniforms.uProgress.value = 1.0;
          onMorphComplete();
        }
      }
    }

    if (pulseRef.current > 0.001) {
      pulseRef.current = Math.max(0.0, pulseRef.current - delta * 3.5);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = Math.min(1.0, morphProgressRef.current);
      materialRef.current.uniforms.uPulse.value = pulseRef.current;
      materialRef.current.uniforms.uTime.value = prefersReducedMotion ? 0 : time;

      if (isHovered && !touchEnabled && !prefersReducedMotion) {
        const mouse2D = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
        mouse2D.unproject(state.camera);
        const dir = mouse2D.sub(state.camera.position).normalize();
        const dist = -state.camera.position.z / dir.z;
        const worldPos = state.camera.position.clone().add(dir.multiplyScalar(dist));

        materialRef.current.uniforms.uMouseWorld.value.copy(worldPos);
        materialRef.current.uniforms.uMouseActive.value = 1.0;
      } else {
        materialRef.current.uniforms.uMouseActive.value = 0.0;
      }
    }

    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.rotation.y += delta * 0.14;

      if (!touchEnabled) {
        tiltTarget.current.x = -state.pointer.y * 0.18;
        tiltTarget.current.y = state.pointer.x * 0.22;
      } else {
        tiltTarget.current.x = 0;
        tiltTarget.current.y = 0;
      }

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        tiltTarget.current.x,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        tiltTarget.current.y * 0.4,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          depthTest={true}
          blending={THREE.NormalBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

/**
 * Main ParticleMorph Component
 */
export default function ParticleMorph({ isReady = true, className = '' }) {
  const [pointCount, setPointCount] = useState(() => {
    if (typeof window === 'undefined') return PARTICLE_CONFIG.desktopCount;
    return window.innerWidth < PARTICLE_CONFIG.mobileBreakpoint
      ? PARTICLE_CONFIG.mobileCount
      : PARTICLE_CONFIG.desktopCount;
  });

  const [activeShapeIndex, setActiveShapeIndex] = useState(0);
  const [targetShapeIndex, setTargetShapeIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Debug states
  const [liveFps, setLiveFps] = useState(60);
  const [isTestAllActive, setIsTestAllActive] = useState(false);

  const containerRef = useRef(null);
  const isMorphingRef = useRef(false);
  const morphProgressRef = useRef(0.0);
  const queuedNextRef = useRef(false);
  const autoMorphTimerRef = useRef(null);
  const testAllIntervalRef = useRef(null);
  const initialFormedRef = useRef(false);

  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  };
  const touchEnabled = isTouchDevice();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < PARTICLE_CONFIG.mobileBreakpoint;
      const target = isMobile ? PARTICLE_CONFIG.mobileCount : PARTICLE_CONFIG.desktopCount;
      if (target !== pointCount) {
        setPointCount(target);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pointCount]);

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleMorphComplete = useCallback(() => {
    setActiveShapeIndex(targetShapeIndex);
    if (queuedNextRef.current) {
      queuedNextRef.current = false;
      const nextIdx = (targetShapeIndex + 1) % PARTICLE_CONFIG.shapes.length;
      setTargetShapeIndex(nextIdx);
    }
  }, [targetShapeIndex]);

  const handleNextShape = useCallback(() => {
    if (!hasInteracted) setHasInteracted(true);
    if (isMorphingRef.current) {
      queuedNextRef.current = true;
      return;
    }
    const nextIdx = (targetShapeIndex + 1) % PARTICLE_CONFIG.shapes.length;
    setTargetShapeIndex(nextIdx);
  }, [targetShapeIndex, hasInteracted]);

  useEffect(() => {
    if (isReady && !initialFormedRef.current) {
      initialFormedRef.current = true;
      const timer = setTimeout(() => {
        setTargetShapeIndex(0);
        isMorphingRef.current = true;
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  // Auto-morph every ~8 seconds when idle
  useEffect(() => {
    if (prefersReducedMotion || isTestAllActive) return;

    const resetTimer = () => {
      if (autoMorphTimerRef.current) clearInterval(autoMorphTimerRef.current);
      autoMorphTimerRef.current = setInterval(() => {
        if (!isHovered && !isMorphingRef.current) {
          handleNextShape();
        }
      }, PARTICLE_CONFIG.autoMorphInterval);
    };

    resetTimer();
    return () => clearInterval(autoMorphTimerRef.current);
  }, [isHovered, handleNextShape, prefersReducedMotion, isTestAllActive]);

  // "Test All Shapes" 2-second cycle mode
  useEffect(() => {
    if (isTestAllActive) {
      testAllIntervalRef.current = setInterval(() => {
        handleNextShape();
      }, 2000);
    } else {
      if (testAllIntervalRef.current) clearInterval(testAllIntervalRef.current);
    }
    return () => {
      if (testAllIntervalRef.current) clearInterval(testAllIntervalRef.current);
    };
  }, [isTestAllActive, handleNextShape]);

  const toggleTestAll = (e) => {
    e.stopPropagation();
    setIsTestAllActive((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNextShape();
    }
  };

  const currentShape = PARTICLE_CONFIG.shapes[targetShapeIndex] || PARTICLE_CONFIG.shapes[0];

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      onClick={handleNextShape}
      onKeyDown={handleKeyDown}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      aria-label={`Interactive 3D particle hologram: ${currentShape.name}. Press Enter or click to transform.`}
      className={`relative w-full h-[380px] sm:h-[460px] lg:h-[540px] flex flex-col items-center justify-center cursor-pointer select-none outline-none ${className}`}
      style={{
        background: 'transparent',
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          frameloop={isInView && !isTabHidden ? 'always' : 'never'}
          camera={{ position: [0, 0, 5.0], fov: 45 }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
          className="w-full h-full pointer-events-auto"
        >
          <MorphingPoints
            count={pointCount}
            targetIndex={targetShapeIndex}
            isMorphingRef={isMorphingRef}
            morphProgressRef={morphProgressRef}
            onMorphComplete={handleMorphComplete}
            isHovered={isHovered}
            touchEnabled={touchEnabled}
            prefersReducedMotion={prefersReducedMotion}
            onFpsUpdate={setLiveFps}
          />
        </Canvas>
      </Suspense>

      {/* Floating Monospace Telemetry & Shape Label */}
      <div className="absolute bottom-2 sm:bottom-4 flex flex-col items-center gap-1.5 pointer-events-none select-none z-10 transition-opacity duration-300">
        <div className="flex items-center gap-2 px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-cyan-300/90 uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
          </span>
          <span>{currentShape.name}</span>
        </div>

        {!hasInteracted && (
          <span className="font-mono text-[9px] text-neutral-400 tracking-wider">
            click to transform
          </span>
        )}
      </div>

      {/* On-Screen Debug HUD (config.debug = true) */}
      {PARTICLE_CONFIG.debug && (
        <div className="absolute top-2 right-2 pointer-events-auto flex flex-col items-end gap-1.5 z-20">
          <div className="px-2.5 py-1 rounded bg-black/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 shadow-md backdrop-blur-sm">
            <div>
              SHAPE: <span className="text-white font-semibold">{currentShape.name}</span> ({targetShapeIndex + 1}/{PARTICLE_CONFIG.shapes.length})
            </div>
            <div>
              FPS: <span className="text-emerald-400 font-semibold">{liveFps}</span> | PTS: {pointCount}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTestAll}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all shadow-md border ${
              isTestAllActive
                ? 'bg-cyan-400 text-black border-cyan-300 shadow-glow-cyan-sm'
                : 'bg-black/80 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20'
            }`}
          >
            {isTestAllActive ? '⏸ Stop Auto-Cycle' : '⚡ Test All Shapes (2s)'}
          </button>
        </div>
      )}
    </div>
  );
}
