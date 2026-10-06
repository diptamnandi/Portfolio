import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './Icons';
import Magnetic from './Magnetic';
import ProjectCover from './ProjectCover';

export default function ProjectCard({ project, onOpenModal }) {
  const shouldReduceMotion = useReducedMotion();

  const handleCardClick = () => {
    if (onOpenModal) {
      onOpenModal(project);
    }
  };

  return (
    <motion.article
      layout={!shouldReduceMotion}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#0D0D0D] border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_35px_-8px_rgba(34,211,238,0.25)] transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
        shouldReduceMotion ? '' : 'hover:-translate-y-2'
      }`}
      tabIndex={0}
      role="button"
      aria-label={`Open details for project ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Top Image Container with Zoom Effect */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#151515] border-b border-white/5">
        <ProjectCover
          project={project}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
            shouldReduceMotion ? '' : 'group-hover:scale-110'
          }`}
        />

        {/* Gradient dark scrim over image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />

        {/* Top Badges (Category & Featured) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-cyan-300 bg-[#050505]/80 backdrop-blur-md border border-cyan-500/30 shadow-sm">
            {project.category}
          </span>

          {project.featured && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-amber-300 bg-[#050505]/85 backdrop-blur-md border border-amber-500/40 shadow-sm">
              <Sparkles size={11} className="text-amber-400" />
              Featured
            </span>
          )}
        </div>

        {/* Quick Click Hint Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 bg-[#0D0D0D]/90 border border-cyan-500/40 shadow-glow-cyan-sm">
            <Eye size={14} />
            <span>Inspect System Details</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Project Title */}
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 leading-tight flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight
              size={18}
              className="text-neutral-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2"
            />
          </h3>

          {/* Tagline */}
          <p className="text-neutral-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-5 font-sans">
            {project.tagline}
          </p>
        </div>

        <div>
          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-1.5 mb-6 pt-2 border-t border-white/5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[11px] font-mono text-neutral-300 bg-[#151515] border border-white/5 group-hover:border-cyan-500/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links (Clicks do NOT trigger modal due to stopPropagation) */}
          <div className="flex items-center gap-2.5 pt-2">
            {project.github && (
              <Magnetic className="flex-1">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium text-neutral-300 bg-[#151515] border border-white/10 hover:border-cyan-500/40 hover:text-white hover:bg-neutral-800 transition-all duration-200"
                  aria-label={`View ${project.title} GitHub repository`}
                >
                  <GithubIcon size={14} />
                  <span>GitHub</span>
                </a>
              </Magnetic>
            )}

            {project.demo && (
              <Magnetic className="flex-1">
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium text-cyan-400 bg-[#0D0D0D] border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-glow-cyan-sm transition-all duration-200"
                  aria-label={`Open ${project.title} live demo`}
                >
                  <ExternalLink size={14} />
                  <span>Live Demo</span>
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
