import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, ArrowUpRight } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import Magnetic from './Magnetic';

const NAV_ITEMS = [
  { name: 'Home', id: 'home', href: '#home' },
  { name: 'About', id: 'about', href: '#about' },
  { name: 'Skills', id: 'skills', href: '#skills' },
  { name: 'Projects', id: 'projects', href: '#projects' },
  { name: 'Journey', id: 'journey', href: '#journey' },
  { name: 'Socials', id: 'socials', href: '#socials' },
  { name: 'Contact', id: 'contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Active section tracking via IntersectionObserver
  const activeId = useScrollSpy(
    NAV_ITEMS.map((item) => item.id),
    { rootMargin: '-20% 0px -55% 0px' }
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${targetId}`);
      if (targetId === 'contact') {
        setTimeout(() => {
          document.getElementById('contact-name')?.focus();
        }, 500);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-cyan-500/20 py-3 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.9)]'
          : 'bg-[#050505]/40 backdrop-blur-md border-b border-white/5 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo with Magnetic attraction */}
          <Magnetic>
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className="flex items-center gap-2.5 text-white font-mono text-sm sm:text-base font-semibold group focus:outline-none"
              aria-label="Diptam Nandi Portfolio Home"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-glow-cyan-sm transition-all duration-300">
                <Terminal size={15} />
              </div>
              <span className="tracking-wide">
                diptam<span className="text-cyan-400">.nandi</span>
              </span>
            </a>
          </Magnetic>

          {/* Desktop Navigation Pill Bar with Magnetic Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-1 bg-[#0D0D0D]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Magnetic key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative block px-3.5 py-1.5 text-xs font-mono tracking-wide rounded-full transition-colors duration-200 ${
                      isActive
                        ? 'text-cyan-300 font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    {/* Sliding animated active background pill */}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 rounded-full bg-cyan-950/60 border border-cyan-500/40 shadow-glow-cyan-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </a>
                </Magnetic>
              );
            })}
          </nav>

          {/* Desktop CTA Button with Magnetic attraction */}
          <div className="hidden md:flex items-center gap-3">
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium text-cyan-400 bg-[#0D0D0D] border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-glow-cyan-sm transition-all duration-300"
              >
                <span>Transmit</span>
                <ArrowUpRight size={14} />
              </a>
            </Magnetic>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-[#0D0D0D] border border-white/10 text-neutral-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-[65px] bg-black/70 backdrop-blur-sm z-40 md:hidden"
              aria-hidden="true"
            />

            {/* Slide-down Drawer Menu */}
            <motion.div
              id="mobile-drawer"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="relative z-50 md:hidden bg-[#0D0D0D]/95 backdrop-blur-2xl border-b border-cyan-500/25 px-6 py-6 shadow-2xl overflow-hidden"
            >
              <nav className="flex flex-col space-y-3">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activeId === item.id;
                  return (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.id)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center justify-between p-2.5 rounded-lg font-mono text-sm transition-all ${
                        isActive
                          ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30'
                          : 'text-neutral-300 hover:text-white hover:bg-neutral-800/40'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
                        {item.name}
                      </span>
                      <span className="text-[11px] text-cyan-400/50">0{idx + 1}</span>
                    </motion.a>
                  );
                })}

                <div className="pt-3 border-t border-white/10">
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, 'contact')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs font-mono font-semibold text-black bg-cyan-400 hover:bg-cyan-300 shadow-glow-cyan transition-all"
                  >
                    <span>Connect with Diptam</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
