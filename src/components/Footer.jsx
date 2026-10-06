import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, Terminal } from 'lucide-react';
import KeyboardSocials from './KeyboardSocials';
import { FOOTER_INFO, FOOTER_ATMOSPHERE_CONFIG } from '../data/footerInfo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const shouldReduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Framer motion stagger animation for left info rows
  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <footer
      role="contentinfo"
      aria-label="Footer"
      className="relative z-10 py-12 lg:py-16 bg-[#050505] border-t border-white/10 text-neutral-400 text-xs font-mono overflow-hidden min-h-[420px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══════════════════════════════════════════════════════════════
            TOP PILL: "BUILD • CREATE • INNOVATE" (Centered)
           ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-full bg-[#0D0D0D] border border-cyan-500/25 shadow-glow-cyan-sm">
            <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-white font-semibold">
              BUILD
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-glow-cyan-sm" />
            <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-cyan-300 font-semibold">
              CREATE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-glow-cyan-sm" />
            <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-white font-semibold">
              INNOVATE
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            MAIN BODY: 2-Column Grid on Desktop (42% / 58%), Stacked on Mobile
           ═══════════════════════════════════════════════════════════════ */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[42%_58%] items-center gap-10 lg:gap-6 min-h-[380px]">
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: Info Block
             ───────────────────────────────────────────────────────────── */}
          <div className="flex flex-col items-start justify-center z-20">
            {/* Identity Header: Logo Mark + Name */}
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#0D0D0D] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-glow-cyan-sm">
                <Terminal size={14} />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                {FOOTER_INFO.name}
              </h2>
            </div>

            {/* Role Line */}
            <p className="font-mono text-xs text-neutral-400 mb-3">
              {FOOTER_INFO.role}
            </p>

            {/* Optional Availability Pill */}
            {FOOTER_INFO.availability?.enabled && (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#071317] border border-[#14444d] text-xs font-mono text-cyan-300 mb-4 shadow-[0_0_12px_rgba(34,211,238,0.12)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <span>{FOOTER_INFO.availability.label}</span>
              </div>
            )}

            {/* 1px Divider (70% width, color #162126) */}
            <div
              className="h-px bg-[#162126] mb-5 sm:mb-6"
              style={{ width: FOOTER_INFO.dividerWidth || '70%' }}
            />

            {/* 4 Info Rows: Staggered Fade-in on Viewport Enter */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              className="flex flex-col gap-3 w-full max-w-md"
            >
              {FOOTER_INFO.details.map((item) => (
                <motion.div
                  key={item.id}
                  variants={rowVariants}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#4f7f8a] sm:min-w-[85px] shrink-0">
                    {item.label}:
                  </span>
                  <span
                    className={`font-mono text-[13px] sm:text-[14px] leading-relaxed ${
                      item.isAction
                        ? 'text-cyan-300 font-semibold flex items-center gap-1.5'
                        : 'text-[#cfd9dc]'
                    }`}
                  >
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: Tilted Isometric Keyboard & Atmospheric Mist
             ───────────────────────────────────────────────────────────── */}
          <div className="relative flex justify-center lg:justify-end items-center w-full min-h-[360px] lg:min-h-[420px] overflow-visible pr-0 sm:pr-4 lg:pr-14 xl:pr-16">
            {/* 
              HAZE IN THE MIDDLE:
              Soft fog blobs between info and keyboard drifting slowly
            */}
            <div
              className="kb-haze-blob-1 pointer-events-none absolute left-[-40px] lg:left-[-60px] top-[15%] rounded-full"
              style={{
                width: FOOTER_ATMOSPHERE_CONFIG.blobs.blob1.width,
                height: FOOTER_ATMOSPHERE_CONFIG.blobs.blob1.height,
                backgroundColor: FOOTER_ATMOSPHERE_CONFIG.blobs.blob1.color,
                filter: `blur(${FOOTER_ATMOSPHERE_CONFIG.blobs.blob1.blur})`,
                zIndex: 4,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />

            <div
              className="kb-haze-blob-2 pointer-events-none absolute left-[30px] lg:left-[40px] bottom-[15%] rounded-full hidden sm:block"
              style={{
                width: FOOTER_ATMOSPHERE_CONFIG.blobs.blob2.width,
                height: FOOTER_ATMOSPHERE_CONFIG.blobs.blob2.height,
                backgroundColor: FOOTER_ATMOSPHERE_CONFIG.blobs.blob2.color,
                filter: `blur(${FOOTER_ATMOSPHERE_CONFIG.blobs.blob2.blur})`,
                zIndex: 4,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />

            {/* Faint cyan radial glow behind keyboard */}
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{
                background: FOOTER_ATMOSPHERE_CONFIG.blobs.radialGlow,
                zIndex: 2,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />

            {/* 
              The Tilted Isometric Keyboard Hero
              Shifted 40-60px left on desktop to keep right keys comfortably inside viewport
            */}
            <div className="relative z-[5] w-full flex justify-center lg:justify-end overflow-visible mr-0 lg:mr-8 xl:mr-12">
              <KeyboardSocials className="lg:justify-end overflow-visible" />
            </div>

            {/* 
              KEYBOARD SINKING INTO SHADOW OVERLAY:
              Sibling overlay with layered gradients in #050505
              Desktop: Left keys (Q, fn, alt) submerged, social keys on right clear.
              Mobile/Tablet: Shadow comes from top down.
              Pointer events none so all keys remain completely interactive.
            */}
            <div
              className="kb-shadow-overlay pointer-events-none absolute inset-0 z-10"
              style={{ pointerEvents: 'none' }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            BOTTOM ROW (Unchanged):
            Copyright on left, Built-with text + Back to Top button on right
           ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-400 text-xs font-mono text-center md:text-left">
          {/* Copyright */}
          <p className="order-2 md:order-1">
            © {currentYear} {FOOTER_INFO.name}. All rights reserved.
          </p>

          {/* Built-with text and Back to Top Button */}
          <div className="order-1 md:order-2 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <p className="flex items-center gap-2 text-neutral-400 text-xs">
              <span>Built with React, Tailwind CSS, Three.js & Motion</span>
              <span>•</span>
              <span className="text-cyan-400 font-medium">WCAG AAA Accessible</span>
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 hover:shadow-glow-cyan-sm transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Scroll back to top of page"
            >
              <span className="font-mono text-xs text-neutral-300 group-hover:text-cyan-300 transition-colors">
                BACK TO TOP
              </span>
              <ArrowUp
                size={13}
                className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
