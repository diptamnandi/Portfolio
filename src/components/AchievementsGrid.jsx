import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Trophy,
  Award,
  ShieldCheck,
  Users,
  ExternalLink,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from '../data/achievements';

const ICON_MAP = {
  Trophy,
  Award,
  ShieldCheck,
  Users,
};

export default function AchievementsGrid() {
  const [activeCategory, setActiveCategory] = useState('all');
  const shouldReduceMotion = useReducedMotion();

  // Filter items based on active category
  const filteredAchievements = ACHIEVEMENTS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="mt-24 pt-16 border-t border-white/10">
      {/* Sub-heading Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-cyan-400 text-xs tracking-widest uppercase mb-2">
            <span>// HONORS & RECOGNITION</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Achievements & Chapter Activities
          </h3>
          <p className="mt-2 text-sm text-neutral-400 max-w-xl leading-relaxed">
            Podium finishes in hackathons, verified technical certifications, competitive algorithmic ratings, and IEEE collegiate leadership.
          </p>
        </div>

        {/* Total Metric Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0D0D] border border-cyan-500/30 text-cyan-300 font-mono text-xs">
          <Sparkles size={14} className="text-cyan-400" />
          <span>{ACHIEVEMENTS.length} Total Milestones</span>
        </div>
      </div>

      {/* Filter Tabs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div
          role="tablist"
          aria-label="Filter achievements by category"
          className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0D0D0D] border border-white/10 w-fit"
        >
        {ACHIEVEMENT_CATEGORIES.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count =
            tab.id === 'all'
              ? ACHIEVEMENTS.length
              : ACHIEVEMENTS.filter((a) => a.category === tab.id).length;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(tab.id)}
              className={`relative px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isActive
                  ? 'text-cyan-300'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeAchievementTab"
                  className="absolute inset-0 rounded-xl bg-cyan-950/60 border border-cyan-500/40 shadow-glow-cyan-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span
                className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-cyan-500/30 text-cyan-200'
                    : 'bg-white/5 text-neutral-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
        </div>

        {activeCategory === 'certifications' && (
          <a
            href="https://drive.google.com/drive/folders/1S6RM34t2IvXinPXViv9Uo3yBkRc32Gum?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium text-cyan-300 bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-900/50 hover:shadow-glow-cyan-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>View all certificates</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Achievements Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((item) => {
            const IconComponent = ICON_MAP[item.iconType] || Trophy;

            return (
              <motion.article
                layout
                key={item.id}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.95 }
                }
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0D0D0D] border border-white/10 hover:border-cyan-500/40 hover:shadow-glow-cyan-sm hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Icon + Badge + Date */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#151515] border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-glow-cyan-sm transition-all">
                      <IconComponent size={18} />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                        <Calendar size={11} />
                        <span>{item.year || item.date}</span>
                      </span>

                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide uppercase bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Issuer */}
                  <h4 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-cyan-300 transition-colors mb-1">
                    {item.title}
                  </h4>

                  <p className="text-xs font-mono text-neutral-400 mb-3 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-cyan-400/80" />
                    <span>{item.issuer}</span>
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div>
                  {/* Technology / Topic Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4 pt-3 border-t border-white/5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[11px] font-mono text-neutral-400 bg-[#151515] border border-white/5 group-hover:border-cyan-500/20 group-hover:text-neutral-300 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Link / Credential Verification */}
                  {(item.credentialUrl || item.link) && (
                    <a
                      href={item.credentialUrl || item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors group/link focus:outline-none focus-visible:underline"
                      aria-label={`${item.title} certificate, opens in a new tab`}
                    >
                      <span>Verify Credential / Link</span>
                      <ExternalLink
                        size={12}
                        className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </a>
                  )}
                </div>

                {/* Subtle top-right cyber corner decoration */}
                <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none overflow-hidden rounded-tr-2xl">
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyan-400/60" />
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
