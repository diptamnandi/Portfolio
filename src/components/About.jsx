import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, MapPin, Code2, Cpu, Sparkles, Terminal } from 'lucide-react';
import Section from './Section';
import { ABOUT_DATA } from '../data/about';

const factIconMap = {
  GraduationCap,
  MapPin,
  Code2,
  Cpu,
};

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Check if user has provided any stats
  const hasStats =
    Array.isArray(ABOUT_DATA.stats) &&
    ABOUT_DATA.stats.length > 0 &&
    ABOUT_DATA.stats.some((s) => s.value && s.value.trim() !== '');

  return (
    <Section
      id="about"
      number="01"
      label="PROFILE"
      title="About Me"
      subtitle="Undergraduate Computer Science & Engineering student bridging systems theory and modern software engineering."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Two Paragraphs & Optional Stats Block */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Paragraph 1 */}
          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-sans">
            {ABOUT_DATA.paragraphs[0]}
          </p>

          {/* Paragraph 2 */}
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-sans">
            {ABOUT_DATA.paragraphs[1]}
          </p>

          {/* Optional Stats Block (Rendered ONLY if user fills in data in data/about.js) */}
          {hasStats && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="pt-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0D0D0D] border border-white/10">
                {ABOUT_DATA.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-start p-2">
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">
                      {stat.value}
                    </span>
                    <span className="font-mono text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Glass Card with Quick Facts */}
        <div className="lg:col-span-5 w-full">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="relative p-6 sm:p-7 rounded-2xl bg-[#0D0D0D]/90 border border-white/10 hover:border-cyan-500/40 hover:shadow-glow-cyan-sm backdrop-blur-xl transition-all duration-300 group"
          >
            {/* Ambient subtle card glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header Badge */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#151515] border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Terminal size={13} />
                </div>
                <span className="font-mono text-xs font-semibold text-white tracking-wider">
                  QUICK_FACTS.SYS
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30">
                <Sparkles size={10} className="text-cyan-400" />
                ACTIVE
              </span>
            </div>

            {/* Quick Facts List */}
            <div className="space-y-4">
              {ABOUT_DATA.quickFacts.map((fact) => {
                const Icon = factIconMap[fact.icon] || Code2;
                return (
                  <div
                    key={fact.label}
                    className="p-3.5 rounded-xl bg-[#151515]/70 border border-white/5 hover:border-cyan-500/30 transition-all duration-200 flex items-start gap-3.5 group/item"
                  >
                    <div className="p-2 rounded-lg bg-[#0D0D0D] border border-cyan-500/20 text-cyan-400 group-hover/item:border-cyan-400/50 group-hover/item:scale-105 transition-all shrink-0 mt-0.5">
                      <Icon size={16} />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
                        {fact.label}
                      </span>
                      <span className="text-sm font-medium text-white group-hover/item:text-cyan-200 transition-colors mt-0.5 leading-snug">
                        {fact.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
