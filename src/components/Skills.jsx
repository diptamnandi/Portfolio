import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import {
  Layout,
  Server,
  Database,
  Brain,
  Terminal,
  Code2,
  Cpu,
  Box,
  Binary,
  GitBranch,
} from 'lucide-react';
import Section from './Section';
import { SKILLS_DATA } from '../data/skills';

// Category header icon mapping
const categoryIconMap = {
  Layout,
  Server,
  Database,
  Brain,
  Terminal,
};

// Skill-specific micro icon resolver for chips
function getSkillIcon(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('react') || lower.includes('three')) return Box;
  if (lower.includes('script') || lower.includes('html') || lower.includes('css')) return Code2;
  if (lower.includes('node') || lower.includes('express') || lower.includes('api')) return Server;
  if (lower.includes('sql') || lower.includes('mongo') || lower.includes('database') || lower.includes('redis')) return Database;
  if (lower.includes('python') || lower.includes('torch') || lower.includes('vision') || lower.includes('learn')) return Brain;
  if (lower.includes('git')) return GitBranch;
  if (lower.includes('docker') || lower.includes('linux') || lower.includes('bash')) return Terminal;
  if (lower.includes('algorithm') || lower.includes('c++') || lower.includes('java')) return Binary;
  return Cpu;
}

/**
 * Interactive TiltCard with 3D perspective and mouse reflection
 */
function TiltCard({ category, index }) {
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse coordinate motion values
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for rotation
  const rotateXSpring = useSpring(useTransform(y, [0, 1], [8, -8]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateYSpring = useSpring(useTransform(x, [0, 1], [-8, 8]), {
    stiffness: 260,
    damping: 24,
  });

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const Icon = categoryIconMap[category.icon] || Terminal;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={
        shouldReduceMotion
          ? {}
          : {
              rotateX: rotateXSpring,
              rotateY: rotateYSpring,
              transformStyle: 'preserve-3d',
            }
      }
      className="relative p-6 sm:p-7 rounded-2xl bg-[#0D0D0D]/90 border border-white/10 hover:border-cyan-500/40 hover:shadow-glow-cyan transition-colors duration-300 flex flex-col justify-between backdrop-blur-xl group overflow-hidden"
    >
      {/* Subtle radial sheen that shifts on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none rounded-2xl" />

      {/* Card Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#151515] border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-glow-cyan-sm transition-all duration-300">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {category.category}
              </h3>
              <span className="font-mono text-[11px] text-neutral-500">
                {category.skills.length} core technologies
              </span>
            </div>
          </div>
          <span className="font-mono text-xs text-neutral-600 group-hover:text-cyan-400/60 transition-colors">
            0{index + 1}
          </span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed min-h-[34px]">
          {category.description}
        </p>
      </div>

      {/* Skill Chips */}
      <div className="relative z-10 flex flex-wrap gap-2.5 pt-2">
        {category.skills.map((skill) => {
          const SkillIcon = getSkillIcon(skill.name);
          return (
            <div
              key={skill.name}
              className={`group/chip relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 cursor-default select-none ${
                skill.highlighted
                  ? 'bg-cyan-950/30 text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.06)]'
                  : 'bg-[#151515] text-neutral-300 border border-white/5'
              } hover:border-cyan-400 hover:text-white hover:bg-cyan-950/60 hover:shadow-glow-cyan-sm hover:-translate-y-0.5`}
            >
              <SkillIcon
                size={13}
                className="text-cyan-400/80 group-hover/chip:text-cyan-300 group-hover/chip:scale-110 transition-all shrink-0"
              />
              <span>{skill.name}</span>

              {/* Highlight dot indicator */}
              {skill.highlighted && (
                <span className="w-1 h-1 rounded-full bg-cyan-400 shadow-glow-cyan-sm" />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <Section
      id="skills"
      number="02"
      label="CAPABILITIES"
      title="Technical Skills & Architecture"
      subtitle="Categorized engineering proficiencies spanning reactive frontend, backend services, databases, AI/ML pipelines, and systems tooling."
      cyberGrid
    >
      {/* Fully Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {SKILLS_DATA.map((category, idx) => (
          <TiltCard
            key={category.category}
            category={category}
            index={idx}
          />
        ))}
      </div>
    </Section>
  );
}
