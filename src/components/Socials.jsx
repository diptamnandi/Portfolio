import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Section from './Section';
import { socials, getEmailMailto } from '../data/socials';
import { SocialIcon } from './Icons';
import Magnetic from './Magnetic';

export default function Socials() {
  const shouldReduceMotion = useReducedMotion();

  // Strictly filter entries that have a valid, non-empty URL
  const activeSocials = socials.filter(
    (item) => typeof item.url === 'string' && item.url.trim().length > 0
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
      },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Section
      id="socials"
      number="05"
      label="COMMUNICATION & NETWORKS"
      title="Connected Platforms"
      subtitle="Explore my open source repositories, competitive contest profiles, developer discussions, and professional network."
      cyberGrid
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {activeSocials.map((social) => {
          const isEmail = social.id === 'email';
          const href = isEmail ? getEmailMailto() : social.url;

          return (
            <motion.div key={social.id} variants={cardVariants} className="h-full">
              <Magnetic as="div" className="w-full h-full">
                <a
                  href={href}
                  target={isEmail ? undefined : '_blank'}
                  rel={isEmail ? undefined : 'noopener noreferrer'}
                  aria-label={`${social.label}: ${social.tagline} (opens ${isEmail ? 'mail client' : 'in new tab'})`}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0D0D0D]/90 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_28px_rgba(34,211,238,0.2)] hover:-translate-y-1.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 w-full h-full"
                >
                  {/* Subtle Ambient Radial Glow on Hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden"
                    aria-hidden="true"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
                  </div>

                  <div>
                    {/* Top Row: Icon Container & External Arrow */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {/* Rotating Glass Icon Box */}
                      <div className="w-12 h-12 rounded-xl bg-[#151515] border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:text-cyan-300 group-hover:shadow-glow-cyan-sm transition-all duration-300">
                        <div className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-12 group-hover:scale-115">
                          <SocialIcon iconName={social.icon} size={22} />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                          <ArrowUpRight
                            size={15}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Platform Name & Category */}
                    <div className="mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 block mb-1">
                        {social.category || 'Platform'}
                      </span>
                      <h3 className="text-lg font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                        {social.label}
                      </h3>
                    </div>

                    {/* Handle Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#151515] border border-white/5 text-xs font-mono text-neutral-300 mb-3.5 group-hover:border-cyan-500/30 transition-colors">
                      <span className="text-cyan-400 select-none">›</span>
                      <span className="truncate">{social.handle}</span>
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors">
                      {social.tagline}
                    </p>
                  </div>

                  {/* Bottom Subtle Beam Accent */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500 group-hover:text-cyan-400/90 transition-colors">
                    <span>{isEmail ? 'Direct Mail' : 'Visit Profile'}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </div>

                  {/* Corner Cyber Accent */}
                  <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none overflow-hidden rounded-tr-2xl">
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyan-400/60" />
                  </div>
                </a>
              </Magnetic>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
