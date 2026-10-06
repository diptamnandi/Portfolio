import React, { useState, useMemo, Suspense, lazy, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Orbit, Sparkles } from 'lucide-react';
import Section from './Section';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { PROJECTS, PROJECT_CATEGORIES } from '../data/projects';

// Lazy-load 3D ProjectWorld: Only downloaded & mounted when user activates 3D mode
const ProjectWorld = lazy(() => import('../components3D/ProjectWorld'));

function WorldLoadingFallback() {
  return (
    <div
      className="relative w-full h-[620px] rounded-2xl bg-[#050505] border border-cyan-500/20 flex flex-col items-center justify-center p-6 my-8"
      aria-label="Loading 3D project ring..."
    >
      <div className="relative flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-cyan-500/20 animate-pulse-slow flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full border border-dashed border-cyan-500/40 animate-spin"
            style={{ animationDuration: '8s' }}
          />
        </div>
        <div className="absolute text-cyan-400 font-mono text-xs tracking-widest uppercase">
          ORBIT.3D
        </div>
      </div>
      <p className="mt-4 font-mono text-xs text-neutral-500 tracking-wider">
        CONSTRUCTING 3D PROJECT WORLD...
      </p>
    </div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);

  // Filter & sort so featured projects show first
  const displayProjects = useMemo(() => {
    const filtered =
      activeCategory === 'All'
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === activeCategory);

    // Featured projects show first
    return [...filtered].sort(
      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    );
  }, [activeCategory]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?open=')) {
      const id = hash.split('?open=')[1];
      const project = PROJECTS.find(p => p.id === id);
      if (project) {
        setSelectedProject(project);
        setIsModalOpen(true);
      }
    }
  }, []);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Section
      id="projects"
      number="03"
      label="ENGINEERING ARTIFACTS"
      title="Featured Projects & Systems"
      subtitle="Selected works across Web, Deep Learning, Distributed Systems, IoT, and Hackathons. Switch between standard Grid or 3D Spatial Orbit."
    >
      {/* Category Tabs & 3D Mode Toggle Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-white/5">
        {/* Category Filter Tabs with Animated Underline */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PROJECT_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`relative px-3.5 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-colors duration-200 focus:outline-none ${
                  isActive
                    ? 'text-cyan-300 font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                <span>{category}</span>

                {/* Animated Underline */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-glow-cyan-sm rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: Grid vs Explore in 3D */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0D0D0D] border border-white/10 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIs3DMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              !is3DMode
                ? 'bg-[#151515] text-white font-medium shadow-sm border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
            aria-label="Switch to Grid View"
          >
            <LayoutGrid size={14} className={!is3DMode ? 'text-cyan-400' : ''} />
            <span>Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setIs3DMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              is3DMode
                ? 'bg-cyan-950/60 text-cyan-300 font-medium shadow-glow-cyan-sm border border-cyan-500/40'
                : 'text-neutral-400 hover:text-cyan-400'
            }`}
            aria-label="Switch to Explore in 3D Mode"
          >
            <Orbit size={14} className={is3DMode ? 'text-cyan-400 animate-spin' : ''} style={{ animationDuration: '10s' }} />
            <span>Explore in 3D</span>
          </button>
        </div>
      </div>

      {/* Conditional Rendering: 3D Ring Orbit vs Responsive 2D Grid */}
      {is3DMode ? (
        <Suspense fallback={<WorldLoadingFallback />}>
          <ProjectWorld
            projects={displayProjects}
            onSelectProject={handleOpenModal}
            onClose={() => setIs3DMode(false)}
          />
        </Suspense>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          <AnimatePresence>
            {displayProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenModal={handleOpenModal}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State Fallback */}
      {!is3DMode && displayProjects.length === 0 && (
        <div className="py-16 text-center text-neutral-500 font-mono text-sm">
          No projects found in this category.
        </div>
      )}

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Section>
  );
}
