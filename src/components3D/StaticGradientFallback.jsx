import React from 'react';

/**
 * Static Holographic Gradient Fallback
 * Extremely lightweight (0 Three.js dependencies), zero load delay.
 * Used for mobile, low-power devices, reduced-motion, and during initial 3D load.
 */
export default function StaticGradientFallback() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center p-6 select-none"
      aria-label="Futuristic Core Hologram Preview"
    >
      {/* Concentric ambient glowing rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer radial glow */}
        <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-cyan-950/40 via-cyan-500/20 to-transparent blur-2xl animate-pulse-slow" />

        {/* Geometric wireframe SVG overlay */}
        <svg
          viewBox="0 0 100 100"
          className="absolute w-40 h-40 sm:w-48 sm:h-48 text-cyan-400/60 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* Outer circle */}
          <circle cx="50" cy="50" r="46" strokeDasharray="3 3" opacity="0.4" />
          <circle cx="50" cy="50" r="38" opacity="0.6" />
          {/* Icosahedron projections */}
          <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" opacity="0.75" />
          <line x1="50" y1="15" x2="50" y2="85" opacity="0.5" />
          <line x1="20" y1="32" x2="80" y2="68" opacity="0.5" />
          <line x1="20" y1="68" x2="80" y2="32" opacity="0.5" />
          {/* Inner core */}
          <polygon points="50,30 65,50 50,70 35,50" fill="rgba(34,211,238,0.25)" stroke="#22d3ee" strokeWidth="1.8" />
        </svg>

        {/* Orbiting particle ring representation */}
        <div
          className="absolute w-56 h-56 rounded-full border border-dashed border-cyan-500/30 animate-spin"
          style={{ animationDuration: '24s' }}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-cyan-400/80 tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>CYBER.CORE // HOLOGRAPHIC</span>
      </div>
    </div>
  );
}
