import React, { useState } from 'react';
import ConstellationBackground from './components/ConstellationBackground';
import GlobalBackground from './components/GlobalBackground';
import MagneticCursor from './components/MagneticCursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Socials from './components/Socials';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('dn_portfolio_initialized') !== 'true';
  });

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-300 isolate">
      {/* Magnetic Custom Hardware-Accelerated Cursor */}
      <MagneticCursor />

      {/* Full-Screen Animated Constellation Canvas Background */}
      <ConstellationBackground />

      {/* Global Interactive Background: Grid, Noise & Cursor Radial Glow */}
      <GlobalBackground />

      {/* Intro Screen Loader (skips on repeat visits in same session) */}
      <Loader onComplete={() => setLoading(false)} />

      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-400 focus:text-black focus:font-mono focus:text-xs focus:rounded-md shadow-glow-cyan"
      >
        Skip to main content
      </a>

      {/* Sticky Glassmorphism Navigation Header */}
      <Navbar />

      {/* Primary Semantic Main Content Container */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero isReady={!loading} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Socials />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
