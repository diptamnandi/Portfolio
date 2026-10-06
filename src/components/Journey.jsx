import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import Section from './Section';
import TimelineItem from './TimelineItem';
import AchievementsGrid from './AchievementsGrid';
import { JOURNEY } from '../data/journey';

export default function Journey() {
  const timelineRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Progressive scroll-linked drawing of the vertical spine line
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 80%'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 35,
    restDelta: 0.001,
  });

  return (
    <Section
      id="journey"
      number="04"
      label="TRAJECTORY & MILESTONES"
      title="The Journey & Achievements"
      subtitle="Chronological milestones in software engineering, competitive algorithmic mastery, academic foundations, and collegiate leadership."
      cyberGrid
    >
      {/* Vertical Timeline Section */}
      <div className="relative" ref={timelineRef}>
        {/* Progressive Center Spine Line */}
        {/* Mobile: left-4 sm:left-6. Desktop: center left-1/2 */}
        <div
          className="absolute top-2 bottom-6 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 w-[2px] z-10 pointer-events-none"
          aria-hidden="true"
        >
          {/* Background Inactive Track */}
          <div className="absolute inset-0 w-full bg-neutral-800/80 rounded-full" />

          {/* Active Progressive Drawn Line */}
          <motion.div
            style={{
              scaleY: shouldReduceMotion ? 1 : scaleY,
              transformOrigin: 'top',
            }}
            className="absolute inset-0 w-full bg-gradient-to-b from-cyan-400 via-cyan-300 to-cyan-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.85)]"
          />

          {/* Top Emitter Node */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-glow-cyan" />

          {/* Bottom Terminal Node */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#050505] border-2 border-cyan-400/60" />
        </div>

        {/* Timeline Items List */}
        <div className="relative pt-4">
          {JOURNEY.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Categorized Achievements Grid */}
      <AchievementsGrid />
    </Section>
  );
}
