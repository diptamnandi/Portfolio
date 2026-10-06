import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, ArrowDown } from 'lucide-react';
import { SocialIcon } from './Icons';
import { getSocial } from '../data/socials';
import { PERSONAL_INFO } from '../data/portfolioData';
import StaticGradientFallback from '../components3D/StaticGradientFallback';
import Magnetic from './Magnetic';

// Lazy-load procedural 3D ParticleMorph in a dedicated chunk
const ParticleMorph = lazy(() => import('../components3D/ParticleMorph'));

const ROLES = [
  'Developer',
  'AI/ML Enthusiast',
  'Full Stack Engineer',
  'Web3 Explorer',
];

export default function Hero({ isReady = true }) {
  const shouldReduceMotion = useReducedMotion();

  // Typewriter effect state
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedRole(ROLES[roleIndex]);
      const interval = setInterval(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }, 2500);
      return () => clearInterval(interval);
    }

    const currentFullRole = ROLES[roleIndex];
    let timer;

    if (!isDeleting) {
      // Typing forward
      if (displayedRole.length < currentFullRole.length) {
        timer = setTimeout(() => {
          setDisplayedRole(currentFullRole.slice(0, displayedRole.length + 1));
        }, 90);
      } else {
        // Pause at complete word
        timer = setTimeout(() => setIsDeleting(true), 1700);
      }
    } else {
      // Deleting
      if (displayedRole.length > 0) {
        timer = setTimeout(() => {
          setDisplayedRole(currentFullRole.slice(0, displayedRole.length - 1));
        }, 45);
      } else {
        // Move to next role
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedRole, isDeleting, roleIndex, shouldReduceMotion]);

  // Framer Motion staggered entrance container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <section
      id="home"
      aria-label="Introduction & Overview"
      className="relative min-h-[92vh] flex items-center justify-center pt-16 sm:pt-20 pb-16 overflow-hidden cyber-grid scroll-mt-20"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* 
            Mobile-First Stacking Order:
            order-2 lg:order-1 -> Text content sits below on mobile, on the left on desktop.
            order-1 lg:order-2 -> 3D canvas sits ABOVE the text on mobile, on the right on desktop.
          */}

          {/* Left Column: Personal Intro, Typewriter & CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Status / Availability Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0D0D] border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6 shadow-glow-cyan-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span>Available for SDE Internships</span>
            </motion.div>

            {/* "Hi, I'm" Greeting & Large Display Name with Subtle Gradient */}
            <motion.div variants={itemVariants} className="space-y-1 mb-4">
              <span className="font-mono text-cyan-400 text-sm sm:text-base tracking-wider font-semibold">
                Hi, I'm
              </span>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-neutral-100 to-cyan-300 bg-clip-text text-transparent">
                  {PERSONAL_INFO.name}
                </span>
              </h1>
            </motion.div>

            {/* Typewriter Rotating Role Line */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 text-lg sm:text-2xl font-mono text-neutral-300 mb-5 min-h-[36px]"
            >
              <span className="text-cyan-400 font-bold">&gt;</span>
              <span className="text-white font-medium">
                {displayedRole}
              </span>
              <span className="animate-pulse text-cyan-400 font-bold -ml-1">|</span>
            </motion.div>

            {/* One-Line Pitch */}
            <motion.p
              variants={itemVariants}
              className="text-neutral-400 text-sm sm:text-base max-w-xl leading-relaxed mb-8 font-sans"
            >
              B.Tech Computer Science student engineering resilient systems, distributed backends,
              and interactive 3D web applications with minimal aesthetic precision.
            </motion.p>

            {/* Two CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 mb-9 w-full sm:w-auto"
            >
              {/* Primary CTA: View Projects */}
              <Magnetic className="w-full sm:w-auto">
                <a
                  href="#projects"
                  onClick={(e) => handleSmoothScroll(e, 'projects')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-mono font-semibold text-black bg-cyan-400 hover:bg-cyan-300 shadow-glow-cyan transition-all duration-300 group"
                >
                  <span>View Projects</span>
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </Magnetic>

              {/* Secondary CTA: Contact Me */}
              <Magnetic className="w-full sm:w-auto">
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, 'contact')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-mono font-medium text-white bg-[#0D0D0D] border border-white/10 hover:border-cyan-500/40 hover:bg-[#151515] transition-all duration-300"
                >
                  <span>Contact Me</span>
                </a>
              </Magnetic>
            </motion.div>

            {/* Social Icon Links */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 text-neutral-400"
            >
              <span className="text-xs font-mono uppercase text-neutral-400 tracking-wider mr-1">
                Links:
              </span>
              {['github', 'linkedin', 'instagram', 'linktree'].map((id) => {
                const social = getSocial(id);
                if (!social || !social.url) return null;
                return (
                  <Magnetic key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-neutral-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-glow-cyan-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 flex items-center justify-center"
                      aria-label={`${social.label} Profile`}
                    >
                      <SocialIcon iconName={social.icon} size={16} />
                    </a>
                  </Magnetic>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Column (Stacked Above on Mobile): 3D Frameless Particle Hologram */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2 lg:col-span-5 flex items-center justify-center w-full"
          >
            <div className="relative w-full max-w-[420px] sm:max-w-lg lg:max-w-xl aspect-square flex items-center justify-center">
              {/* Show nothing while loading (zero box or flash) */}
              <Suspense fallback={null}>
                <ParticleMorph isReady={isReady} />
              </Suspense>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <a
            href="#about"
            onClick={(e) => handleSmoothScroll(e, 'about')}
            className="flex flex-col items-center text-neutral-400 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            aria-label="Scroll to About section"
          >
            <span className="text-[11px] font-mono tracking-widest uppercase mb-1">
              Scroll
            </span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
