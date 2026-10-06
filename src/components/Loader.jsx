import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has already visited in this session
    const hasVisited = sessionStorage.getItem('dn_portfolio_initialized');
    if (hasVisited === 'true') {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Detect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Total duration: ~700ms if reduced motion, else ~1800ms (strictly < 2.5s)
    const totalDuration = prefersReducedMotion ? 650 : 1750;
    const intervalTime = 25;
    const totalSteps = totalDuration / intervalTime;
    const stepIncrement = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            sessionStorage.setItem('dn_portfolio_initialized', 'true');
            setIsVisible(false);
          }, prefersReducedMotion ? 100 : 250);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="portfolio-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white select-none px-6"
          role="status"
          aria-live="polite"
          aria-label="Portfolio initializing"
        >
          {/* Subtle cyber background grid effect */}
          <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

          {/* Glowing ambient central aura */}
          <div className="absolute w-72 h-72 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
            {/* Initializing indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="font-mono text-xs sm:text-sm text-cyan-400 tracking-[0.25em] uppercase font-semibold">
                INITIALIZING...
              </span>
            </motion.div>

            {/* Spaced Name: D I P T A M   N A N D I */}
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.45em' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-display text-lg sm:text-2xl font-bold tracking-[0.45em] text-white uppercase mb-8 pl-[0.45em] whitespace-nowrap"
            >
              D I P T A M &nbsp; N A N D I
            </motion.h1>

            {/* Progress bar container */}
            <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden border border-white/10 relative p-[1px]">
              <motion.div
                className="h-full bg-cyan-400 rounded-full shadow-glow-cyan"
                style={{ width: `${Math.min(100, Math.round(progress))}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Percentage & System Status readout */}
            <div className="w-full flex items-center justify-between mt-3 font-mono text-[11px] text-neutral-400">
              <span className="text-neutral-500 tracking-wider">
                CORE.SYS // V8.3
              </span>
              <span className="text-cyan-400 font-semibold tabular-nums">
                {Math.min(100, Math.round(progress))}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
