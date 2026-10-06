import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import ProjectCover from './ProjectCover';

export default function ProjectModal({ project, isOpen, onClose }) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // For now, simplify to just one primary cover per project to support the new generated icons
  const screenshots = [project];

  const [activeSlide, setActiveSlide] = useState(0);

  // Reset slide index when opening a new project
  useEffect(() => {
    setActiveSlide(0);
  }, [project]);

  // Focus trap & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Remember previous active element to restore focus on close
    previousActiveElement.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    // Focus trap implementation
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowRight') {
        setActiveSlide((prev) => (prev + 1) % screenshots.length);
        return;
      }

      if (e.key === 'ArrowLeft') {
        setActiveSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus the modal or close button on open
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector('button[aria-label="Close project modal"]');
      closeBtn?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, screenshots.length]);

  if (!isOpen || !project) return null;

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % screenshots.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        {/* Backdrop (Click to close) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Dialog Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0D0D0D] border border-cyan-500/30 rounded-2xl shadow-[0_0_60px_-10px_rgba(34,211,238,0.25)] overflow-hidden z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-[#111111]/80 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30">
                {project.category}
              </span>
              {project.featured && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30">
                  <Sparkles size={11} className="text-amber-400" />
                  Featured
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#151515] border border-white/10 text-neutral-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Close project modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
            {/* Title & Tagline */}
            <div>
              <h2
                id="project-modal-title"
                className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight"
              >
                {project.title}
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Screenshots Carousel */}
            {screenshots.length > 0 && (
              <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-[#151515] border border-white/10 group">
                <ProjectCover
                  project={project}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />

                {/* Carousel Controls (if multiple slides exist) */}
                {screenshots.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-white/20 text-white hover:bg-cyan-500/20 hover:border-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      aria-label="Previous screenshot"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-white/20 text-white hover:bg-cyan-500/20 hover:border-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      aria-label="Next screenshot"
                    >
                      <ChevronRight size={18} />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                      {screenshots.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveSlide(idx)}
                          className={`w-2 h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                            activeSlide === idx
                              ? 'w-5 bg-cyan-400 shadow-glow-cyan-sm'
                              : 'bg-neutral-400/60 hover:bg-neutral-200'
                          }`}
                          aria-label={`Jump to screenshot ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Problem & Solution Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Problem */}
              <div className="p-4 rounded-xl bg-[#151515]/70 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-red-400 uppercase tracking-wider">
                  <AlertCircle size={15} />
                  <span>The Challenge</span>
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  {project.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="p-4 rounded-xl bg-[#151515]/70 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  <CheckCircle size={15} />
                  <span>The Solution</span>
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Tech Stack Breakdown */}
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2.5">
                <Layers size={14} className="text-cyan-400" />
                <span>Technologies & Frameworks</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-neutral-200 bg-[#151515] border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-5 sm:p-6 border-t border-white/10 bg-[#111111]/80">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium text-neutral-200 bg-[#151515] border border-white/10 hover:border-cyan-500/50 hover:text-white transition-all"
              >
                <GithubIcon size={15} />
                <span>View Repository</span>
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold text-black bg-cyan-400 hover:bg-cyan-300 shadow-glow-cyan transition-all"
              >
                <ExternalLink size={15} />
                <span>Launch Live Demo</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
