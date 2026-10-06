import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reusable Section wrapper with animated heading, cyber aesthetic,
 * semantic markup, and prefers-reduced-motion awareness.
 */
export default function Section({
  id,
  number,
  label,
  title,
  subtitle,
  children,
  className = '',
  cyberGrid = false,
}) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.section
      id={id}
      aria-label={title || label || id}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`py-24 relative border-t border-white/5 scroll-mt-20 ${
        cyberGrid ? 'cyber-grid' : ''
      } ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || label) && (
          <div className="flex flex-col items-start mb-14">
            {label && (
              <div className="inline-flex items-center gap-2 font-mono text-cyan-400 text-xs tracking-widest uppercase mb-2">
                <span>
                  // {number ? `${number}. ` : ''}
                  {label}
                </span>
              </div>
            )}

            {title && (
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="w-16 h-1 bg-cyan-400 mt-4 rounded-full shadow-glow-cyan-sm" />
          </div>
        )}

        {/* Section Body */}
        <div>{children}</div>
      </div>
    </motion.section>
  );
}
