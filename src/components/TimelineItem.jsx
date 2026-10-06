import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Calendar,
  GraduationCap,
  Briefcase,
  Users,
  Trophy,
  Award,
  BookOpen,
  Code2,
  Sparkles,
} from 'lucide-react';

const ICON_MAP = {
  GraduationCap,
  Briefcase,
  Users,
  Trophy,
  Award,
  BookOpen,
  Code2,
};

export default function TimelineItem({ item, index }) {
  const shouldReduceMotion = useReducedMotion();
  const isEven = index % 2 === 0;

  const IconComponent = ICON_MAP[item.iconType] || Sparkles;

  // Responsive animations: desktop alternates left/right, mobile slides up
  const cardVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, x: 0, y: 0 }
      : {
          opacity: 0,
          x: isEven ? -35 : 35,
          y: 20,
        },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="relative mb-12 sm:mb-16 last:mb-0">
      {/* Center Spine Node Indicator */}
      {/* Mobile: positioned at left-4 sm:left-6. Desktop: positioned at center left-1/2 */}
      <div className="absolute top-6 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#050505] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-glow-cyan-sm group-hover:scale-110 transition-transform duration-300">
          <IconComponent size={16} className="text-cyan-400" />
        </div>
      </div>

      {/* Timeline Card Container */}
      <div className="relative flex flex-col md:flex-row items-center">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className={`relative w-[calc(100%-3rem)] ml-12 sm:w-[calc(100%-4.5rem)] sm:ml-16 md:w-[calc(50%-3rem)] md:ml-0 ${
            isEven ? 'md:mr-auto' : 'md:ml-auto'
          }`}
        >
          {/* Cyber Connector Lines */}
          {/* Desktop Left-Card Connector (pointing right to center spine) */}
          {isEven ? (
            <div className="hidden md:block absolute top-10 -right-8 w-8 border-t border-dashed border-cyan-500/40 pointer-events-none" />
          ) : (
            /* Desktop Right-Card Connector (pointing left to center spine) */
            <div className="hidden md:block absolute top-10 -left-8 w-8 border-t border-dashed border-cyan-500/40 pointer-events-none" />
          )}

          {/* Mobile Connector Line (pointing left to mobile spine) */}
          <div className="block md:hidden absolute top-9 -left-4 sm:-left-6 w-4 sm:w-6 border-t border-dashed border-cyan-500/40 pointer-events-none" />

          {/* Main Card */}
          <div className="group relative p-6 sm:p-7 rounded-2xl bg-[#0D0D0D] border border-white/10 hover:border-cyan-500/40 hover:shadow-glow-cyan-sm transition-all duration-300">
            {/* Top Bar: Category Pill & Period */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
              <div className="inline-flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide uppercase bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {item.role}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Calendar size={13} />
                <span>{item.period}</span>
              </div>
            </div>

            {/* Title & Organization */}
            <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors mb-1.5">
              {item.title}
            </h3>

            <div className="text-xs sm:text-sm text-neutral-400 font-medium mb-3.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
              <span>{item.organization}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-300 leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Key Highlights */}
            {item.highlights && item.highlights.length > 0 && (
              <div className="space-y-2 mb-5 pt-3 border-t border-white/5">
                {item.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-glow-cyan-sm" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Technology / Focus Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-mono text-neutral-400 bg-[#151515] border border-white/5 group-hover:border-cyan-500/20 group-hover:text-neutral-300 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Corner Decorative Accent */}
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden rounded-tr-2xl">
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/60" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
