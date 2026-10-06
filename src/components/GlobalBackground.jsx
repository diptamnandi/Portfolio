import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * GlobalBackground Component
 * - Faint cyber grid & SVG noise texture
 * - Soft accent cyan radial glow that follows the cursor
 * - Automatically disabled on touch screens and prefers-reduced-motion
 */
export default function GlobalBackground() {
  const [isSupported, setIsSupported] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for hardware-accelerated cursor following
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth springs to provide organic cursor following
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 200, restDelta: 0.001 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 200, restDelta: 0.001 });

  // Detect touch devices and reduced-motion preferences
  useEffect(() => {
    const evaluateSupport = () => {
      if (typeof window === 'undefined') return;

      const hasTouch =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(hover: none)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setIsSupported(!hasTouch && !prefersReduced);
    };

    evaluateSupport();

    const mqlMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqlHover = window.matchMedia('(hover: none)');

    const handleMediaChange = () => evaluateSupport();

    if (mqlMotion.addEventListener) {
      mqlMotion.addEventListener('change', handleMediaChange);
      mqlHover.addEventListener('change', handleMediaChange);
    } else {
      mqlMotion.addListener(handleMediaChange);
      mqlHover.addListener(handleMediaChange);
    }

    return () => {
      if (mqlMotion.removeEventListener) {
        mqlMotion.removeEventListener('change', handleMediaChange);
        mqlHover.removeEventListener('change', handleMediaChange);
      } else {
        mqlMotion.removeListener(handleMediaChange);
        mqlHover.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Track cursor pointer coordinates when supported
  useEffect(() => {
    if (!isSupported) return;

    const handlePointerMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [isSupported, isVisible, mouseX, mouseY]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Subtle Cyber Line Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* 2. Micro Dot Grid Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* 3. Subtle Procedural Noise Overlay via SVG Data-URI */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-screen bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 4. Peripheral Vignette (darkens outer edges) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#050505_100%)] opacity-70" />

      {/* 5. Soft Accent Radial Cyan Glow Following Cursor */}
      {isSupported && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            opacity: isVisible ? 1 : 0,
            scale: isVisible ? 1 : 0.8,
          }}
          transition={{
            opacity: { duration: 0.35 },
            scale: { duration: 0.35 },
          }}
          className="absolute top-0 left-0 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.1)_0%,rgba(34,211,238,0.03)_40%,transparent_70%)] blur-[80px] will-change-transform"
        />
      )}
    </div>
  );
}
