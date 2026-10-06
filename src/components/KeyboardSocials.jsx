import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Mail } from 'lucide-react';
import { socials, getSocial, getEmailMailto } from '../data/socials';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * KEYBOARD CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════
 * Tweak isometric tilt angles, keycap lifts, backlight glow intensities,
 * neighbor flicker timings, and ambient life intervals.
 */
export const KEYBOARD_CONFIG = {
  // Isometric tilt angles matching exact specification
  tilt: {
    desktop: { rotateX: 58, rotateZ: -34 },
    mobile: { rotateX: 50, rotateZ: -26 },
  },
  // Keycap physical elevations along the 3D Z-axis
  lift: {
    resting: 10,  // px (default resting float above base)
    hover: 14,    // px (gentle rise on pointer hover)
    pressed: 3,   // px (deep tactile plunge on press)
    intro: 30,    // px (initial drop-in elevation for stagger)
  },
  // Neon cyan aesthetic accents
  glowColor: 'rgba(34, 211, 238, 0.8)',
  accentCyan: '#22d3ee',
  legendBacklit: '#8fd8e6',
  baseBody: '#0a0e10',
  deckBorder: '#1a2226',
  // Lighting and flicker dynamics
  neighborFlickerStrength: 0.4,
  neighborDelayMs: 100,
  idleLightIntervalMs: 6000,
  linkDelayMs: 250,
  animationDurationMs: 850,
};

/**
 * High-fidelity SVGs with consistent stroke 1.8 and size 20 for key legends
 */
function GithubIcon({ size = 20, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 20, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" rx="0.5" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function LeetCodeIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.815 3.931c.208.026.417.039.626.039a5.955 5.955 0 0 0 4.227-1.748l3.654-3.646c.39-.39.39-1.023 0-1.414a.996.996 0 0 0-1.414 0L9.77 17.155a3.957 3.957 0 0 1-2.809 1.163 3.934 3.934 0 0 1-2.793-1.163 3.978 3.978 0 0 1-1.163-2.817 3.978 3.978 0 0 1 1.163-2.817l3.854-4.126 5.406-5.788c.255-.273.398-.633.398-1.008 0-.773-.627-1.4-1.4-1.4z" />
      <path d="M9.833 10.924a1 1 0 0 0 0 2h10.334a1 1 0 1 0 0-2H9.833z" />
    </svg>
  );
}

function XIcon({ size = 20, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 4l16 16M4 20L20 4" />
    </svg>
  );
}

function InstagramIcon({ size = 20, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function LinkKeyIcon({ size = 18, strokeWidth = 1.8, className = '' }) {
  // Lucide-style Link icon (stroke 1.8), swappable with official Linktree SVG mark
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/**
 * Resolver for interactive platform icons with consistent stroke 1.8 and size 20.
 */
function PlatformKeyIcon({ id, size = 20, className = '' }) {
  const strokeWidth = 1.8;

  switch (id) {
    case 'github':
      return <GithubIcon size={size} strokeWidth={strokeWidth} className={className} />;
    case 'linkedin':
      return <LinkedinIcon size={size} strokeWidth={strokeWidth} className={className} />;
    case 'leetcode':
    case 'code':
      return <LeetCodeIcon size={size} className={className} />;
    case 'x':
      return <XIcon size={size} strokeWidth={strokeWidth} className={className} />;
    case 'instagram':
      return <InstagramIcon size={size} strokeWidth={strokeWidth} className={className} />;
    case 'email':
      return <Mail size={size} strokeWidth={strokeWidth} className={className} />;
    case 'link':
    case 'linktree':
      return <LinkKeyIcon size={size} strokeWidth={strokeWidth} className={className} />;
    default:
      return null;
  }
}

/**
 * Restartable GPU-accelerated CSS lighting animation helper.
 * Strips `.lit`, sets `--s` scale variable, forces synchronous browser reflow,
 * and re-applies `.lit` without React re-render overhead.
 * Also elevates parent key base so the glow cuts through any shadow overlay.
 */
function triggerKeyLight(element, intensity = 1.0) {
  if (!element) return;
  element.style.setProperty('--s', intensity.toFixed(2));
  element.classList.remove('lit');
  
  // Elevate parent key base above sibling shadow overlay
  const baseEl = element.parentElement;
  if (baseEl) {
    baseEl.classList.remove('lit');
    void baseEl.offsetWidth;
    baseEl.classList.add('lit');
    setTimeout(() => {
      baseEl?.classList.remove('lit');
    }, 850);
  }

  // Synchronous reflow forces CSS animation restart
  void element.offsetWidth;
  element.classList.add('lit');
}

/**
 * KeyboardSocials Component
 * 
 * An isometric, tilted laptop chiclet keyboard featuring:
 * - 3 rows with 6-column CSS grid (or responsive 3-column on narrow screens)
 * - Row 1: Six dim decorative keys (Q W E R T Y)
 * - Row 2: Six backlit interactive social keys (GitHub, LinkedIn, LeetCode, X, Instagram, Email)
 * - Row 3: fn, alt, Linktree spacebar key ("All my links"), and cmd
 * - True CSS 3D preserve-3d preservation across all ancestors
 * - Backlit cyan icon illumination with neighbor flicker & idle auto-light
 * - Flat counter-rotated tooltips showing platform and handle (e.g. "GitHub • diptamnandi")
 */
export default function KeyboardSocials({ className = '' }) {
  const containerRef = useRef(null);
  const deckRef = useRef(null);
  const hasIntroRunRef = useRef(false);
  const isHoveredRef = useRef(false);
  const lastInteractionTimeRef = useRef(Date.now());
  const isKeyboardInViewRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // References to face DOM elements for programmatic lighting & neighbor flicker
  const interactiveFaceRefs = useRef([]);
  const linktreeFaceRef = useRef(null);
  const decorativeFaceRefs = useRef([]);
  const allFaceRefs = useRef([]);

  // Responsive narrow detection (<38px key threshold)
  const [isNarrowLayout, setIsNarrowLayout] = useState(false);

  /**
   * 1. Read links from `data/socials.js` in the exact required order for Row 2:
   * GitHub, LinkedIn, LeetCode, X, Instagram, Email (by ID, skipping missing URLs).
   */
  const row2Keys = useMemo(() => {
    const ROW2_IDS = ['github', 'linkedin', 'leetcode', 'x', 'instagram', 'email'];
    return ROW2_IDS.map((id) => {
      const social = getSocial(id);
      if (!social) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
          console.warn(`[KeyboardSocials] Missing social entry for id: "${id}" in data/socials.js`);
        }
        return null;
      }
      if (!social.url || typeof social.url !== 'string' || social.url.trim().length === 0) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
          console.warn(`[KeyboardSocials] Social entry "${id}" has no valid url/href!`);
        }
        return null;
      }
      return social;
    }).filter(Boolean);
  }, []);

  /**
   * Linktree key for Row 3 (replacing spacebar)
   */
  const linktreeKey = useMemo(() => {
    const social = getSocial('linktree');
    if (!social) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        console.warn(`[KeyboardSocials] Missing social entry for "linktree" in data/socials.js`);
      }
      return null;
    }
    if (!social.url || typeof social.url !== 'string' || social.url.trim().length === 0) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        console.warn(`[KeyboardSocials] Linktree social entry has no valid url/href!`);
      }
      return null;
    }
    return social;
  }, []);

  /**
   * List of all active interactive keys (Row 2 + Linktree)
   */
  const allInteractiveKeys = useMemo(() => {
    return linktreeKey ? [...row2Keys, linktreeKey] : row2Keys;
  }, [row2Keys, linktreeKey]);

  /**
   * Helper to get face element by index (0-5: row2, 6: linktree)
   */
  const getFaceElement = useCallback((idx) => {
    if (idx === 6) return linktreeFaceRef.current;
    return interactiveFaceRefs.current[idx];
  }, []);

  /**
   * Trigger key press lighting and neighbor flicker.
   */
  const handleKeyActivation = useCallback((index, element) => {
    lastInteractionTimeRef.current = Date.now();
    if (!element) return;

    // Direct key lights up at full 100% intensity (--s = 1.0)
    triggerKeyLight(element, 1.0);

    // If reduced motion is requested, do not run neighbor flicker
    if (prefersReducedMotionRef.current) return;

    const delay = KEYBOARD_CONFIG.neighborDelayMs;
    const strength = KEYBOARD_CONFIG.neighborFlickerStrength;

    if (index < 6) {
      // Row 2 neighbor flicker
      setTimeout(() => {
        if (index - 1 >= 0) {
          triggerKeyLight(interactiveFaceRefs.current[index - 1], strength);
        }
        if (index + 1 < row2Keys.length) {
          triggerKeyLight(interactiveFaceRefs.current[index + 1], strength);
        }
      }, delay);

      setTimeout(() => {
        if (index - 2 >= 0) {
          triggerKeyLight(interactiveFaceRefs.current[index - 2], strength);
        }
        if (index + 2 < row2Keys.length) {
          triggerKeyLight(interactiveFaceRefs.current[index + 2], strength);
        }
      }, delay * 2);
    } else if (index === 6) {
      // Linktree pressed: flicker immediate row2 keys above (e.g. LeetCode, X)
      setTimeout(() => {
        if (interactiveFaceRefs.current[2]) triggerKeyLight(interactiveFaceRefs.current[2], strength);
        if (interactiveFaceRefs.current[3]) triggerKeyLight(interactiveFaceRefs.current[3], strength);
      }, delay);
    }
  }, [row2Keys.length]);

  /**
   * Key interaction handler:
   * Triggers the realistic tactile plunge, 850ms neon cyan lighting animation,
   * and physical neighbor flicker immediately on pointerdown or click.
   * Does NOT call preventDefault so the native <a href> handles navigation flawlessly.
   */
  const handleKeyInteraction = useCallback((index) => {
    const faceEl = getFaceElement(index);
    handleKeyActivation(index, faceEl);
  }, [getFaceElement, handleKeyActivation]);

  /**
   * Dev-only hover diagnostic helper:
   * Logs document.elementFromPoint at the key center on hover
   */
  const handleKeyHover = useCallback((keyItem, index) => {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      const faceEl = getFaceElement(index);
      const baseEl = faceEl?.parentElement;
      if (baseEl) {
        const rect = baseEl.getBoundingClientRect();
        const cx = Math.round(rect.left + rect.width / 2);
        const cy = Math.round(rect.top + rect.height / 2);
        const el = document.elementFromPoint(cx, cy);
        const isOk = baseEl.contains(el);
        if (isOk) {
          console.log(
            `%c[HOVER OK] ${keyItem.label} -> unblocked (center element: <${el.tagName.toLowerCase()} class="${el.className}">)`,
            'color: #22d3ee; font-weight: bold;'
          );
        } else {
          console.warn(
            `%c[HOVER BLOCKED] ${keyItem.label} -> BLOCKED by <${el?.tagName?.toLowerCase() || 'null'} class="${el?.className || ''}">`,
            'color: #f87171; font-weight: bold;'
          );
        }
      }
    }
  }, [getFaceElement]);

  /**
   * Keyboard accessibility for Enter & Space keys
   */
  const handleKeyDown = useCallback((e, keyItem, index) => {
    const faceEl = getFaceElement(index);
    const baseEl = faceEl?.parentElement;

    if (e.key === 'Enter') {
      // Enter naturally triggers <a> navigation, fire tactile plunge and lighting
      baseEl?.classList.add('down');
      handleKeyActivation(index, faceEl);
      setTimeout(() => {
        baseEl?.classList.remove('down');
      }, 150);
    } else if (e.key === ' ') {
      // Space key typically scrolls in browsers; prevent scroll and trigger navigation
      e.preventDefault();
      baseEl?.classList.add('down');
      handleKeyActivation(index, faceEl);
      setTimeout(() => {
        baseEl?.classList.remove('down');
      }, 150);

      if (keyItem.id === 'email') {
        window.location.href = getEmailMailto();
      } else {
        window.open(keyItem.url, '_blank', 'noopener,noreferrer');
      }
    }
  }, [getFaceElement, handleKeyActivation]);

  /**
   * Setup observers:
   * 1. Motion preference check
   * 2. IntersectionObserver for viewport entrance & intro stagger drop
   * 3. Deck width ResizeObserver to switch to 3-column grid if keys drop below 38px
   * 4. Ambient idle auto-lighting interval every ~6s
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Accessibility motion check
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = motionMediaQuery.matches;

    const onMotionChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
    };
    if (motionMediaQuery.addEventListener) {
      motionMediaQuery.addEventListener('change', onMotionChange);
    } else {
      motionMediaQuery.addListener(onMotionChange);
    }

    // 2. Track activity to prevent auto-light while user is interacting
    const onUserActivity = () => {
      lastInteractionTimeRef.current = Date.now();
    };
    window.addEventListener('pointermove', onUserActivity, { passive: true });
    window.addEventListener('keydown', onUserActivity, { passive: true });

    // 3. ResizeObserver: measure deck width to prevent keys dropping below 38px
    const deckElement = deckRef.current;
    let resizeObserver = null;
    if (deckElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          // In a 6-col grid with 7px gaps and 24px padding, keys drop below 38px when width < 270px
          setIsNarrowLayout(width < 270);
        }
      });
      resizeObserver.observe(deckElement);
    }

    // 4. Viewport IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isIntersecting = entry.isIntersecting;
        isKeyboardInViewRef.current = isIntersecting;

        // Intro stagger: run once when footer scrolls into view
        if (isIntersecting && !hasIntroRunRef.current) {
          hasIntroRunRef.current = true;

          if (!prefersReducedMotionRef.current) {
            // Stagger drop from intro lift to resting elevation (4px for decorative, 10px for interactive)
            const faces = allFaceRefs.current.filter(Boolean);
            faces.forEach((faceEl, i) => {
              const isDecorative = faceEl.closest('.kb-decorative-key, .kb-key-base:not(.kb-interactive-key)');
              const isLinktree = faceEl.closest('.col-span-2');
              const restingZ = isDecorative ? 4 : (isLinktree ? 6 : 11);
              faceEl.style.transform = `translateZ(${KEYBOARD_CONFIG.lift.intro}px)`;
              faceEl.style.transition = 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)';

              setTimeout(() => {
                faceEl.style.transform = `translateZ(${restingZ}px)`;
                setTimeout(() => {
                  faceEl.style.transform = '';
                  faceEl.style.transition = '';
                }, 450);
              }, i * 35);
            });
          }
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 5. Idle ambient auto-lighting every ~6 seconds
    const idleInterval = setInterval(() => {
      if (document.hidden) return;
      if (!isKeyboardInViewRef.current) return;
      if (isHoveredRef.current) return;
      if (prefersReducedMotionRef.current) return;

      const idleDuration = Date.now() - lastInteractionTimeRef.current;
      // Only fire if user has been idle for at least 3 seconds
      if (idleDuration >= 3000) {
        const activeFaces = [
          ...interactiveFaceRefs.current.filter(Boolean),
          linktreeFaceRef.current,
        ].filter(Boolean);

        if (activeFaces.length > 0) {
          const randomIndex = Math.floor(Math.random() * activeFaces.length);
          triggerKeyLight(activeFaces[randomIndex], 0.7);
        }
      }
    }, KEYBOARD_CONFIG.idleLightIntervalMs);

    return () => {
      observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      clearInterval(idleInterval);
      window.removeEventListener('pointermove', onUserActivity);
      window.removeEventListener('keydown', onUserActivity);
      if (motionMediaQuery.removeEventListener) {
        motionMediaQuery.removeEventListener('change', onMotionChange);
      } else {
        motionMediaQuery.removeListener(onMotionChange);
      }
    };
  }, []);

  // Dev-only diagnostic helper: attach to window.debugKeyboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugKeyboard = () => {
        const keys = Array.from(document.querySelectorAll('.kb-interactive-key'));
        console.group('%c🎹 Keyboard Socials Diagnostic (Hit-Testing & Targets)', 'color: #22d3ee; font-weight: bold;');
        
        let allOk = true;
        keys.forEach((k, idx) => {
          const rect = k.getBoundingClientRect();
          const cx = Math.round(rect.left + rect.width / 2);
          const cy = Math.round(rect.top + rect.height / 2);
          const el = document.elementFromPoint(cx, cy);
          const isOk = k.contains(el);
          const label = k.getAttribute('aria-label') || `Key #${idx}`;
          const href = k.getAttribute('href') || '(missing href)';

          if (isOk) {
            console.log(
              `%c✓ [OK] ${label} -> ${href} (Element: <${el.tagName.toLowerCase()} class="${el.className}">)`,
              'color: #4ade80;'
            );
          } else {
            allOk = false;
            console.error(
              `%c✗ [BLOCKED] ${label} -> ${href} (Blocked by: <${el?.tagName?.toLowerCase() || 'null'} class="${el?.className || ''}">)`,
              'color: #f87171; font-weight: bold;'
            );
          }
        });

        if (allOk) {
          console.log('%c🎉 All 7 interactive keys are perfectly clickable and unobstructed!', 'color: #22d3ee; font-weight: bold;');
        }
        console.groupEnd();
      };
    }
  }, []);

  // Dim decorative keys for Row 1
  const row1Keys = ['Q', 'W', 'E', 'R', 'T', 'Y'];
  const COL_CLASSES = [
    'col-start-1',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
  ];

  return (
    <div
      ref={containerRef}
      className={`kb-perspective-wrapper pointer-events-none relative w-full flex items-center justify-center py-4 select-none overflow-visible ${className}`}
      data-magnetic="false"
      aria-label="Interactive isometric keyboard social links"
    >
      {/* 
        Tilted Deck
        Wrapper with perspective: 760px.
        Tilted element with rotateX(58deg) rotateZ(-34deg).
        Preserve-3d on EVERY ancestor down to the key face.
      */}
      <div
        ref={deckRef}
        className="kb-tilted-deck pointer-events-auto w-full max-w-[380px] lg:max-w-[460px] p-2.5 sm:p-3"
        onPointerEnter={() => { isHoveredRef.current = true; }}
        onPointerLeave={() => { isHoveredRef.current = false; }}
        data-magnetic="false"
      >
        <div
          className={`kb-grid grid ${
            isNarrowLayout ? 'kb-grid-narrow grid-cols-3' : 'grid-cols-6 grid-rows-3'
          } gap-x-[7px] gap-y-[10px] w-full`}
        >
          {!isNarrowLayout ? (
            <>
              {/* ═════════════════════════════════════════════════════════
                  PART 1 (DOM FIRST): ALL DECORATIVE KEYS
                  Rendered first in DOM to eliminate 3D hit-test occlusion
                  over interactive keys. Lift capped at 4px.
                 ═════════════════════════════════════════════════════════ */}

              {/* Row 1: Six Dim Decorative Keys (Q W E R T Y) */}
              {row1Keys.map((char, i) => (
                <div
                  key={`r1-${char}`}
                  className={`kb-key-base kb-decorative-key aspect-square pointer-events-none ${COL_CLASSES[i]} row-start-1`}
                  aria-hidden="true"
                  tabIndex={-1}
                  data-magnetic="false"
                  style={{ pointerEvents: 'none' }}
                >
                  <div
                    ref={(el) => {
                      decorativeFaceRefs.current[i] = el;
                      allFaceRefs.current[i] = el;
                    }}
                    className="kb-key-face pointer-events-none"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="kb-key-tint" />
                    <span className="font-mono text-[11px] sm:text-xs font-semibold text-[#3a484d] select-none tracking-wider pointer-events-none">
                      {char}
                    </span>
                  </div>
                </div>
              ))}

              {/* Row 3 Decorative Key: fn (col 1) */}
              <div
                className="kb-key-base kb-decorative-key aspect-square pointer-events-none col-start-1 row-start-3"
                aria-hidden="true"
                tabIndex={-1}
                data-magnetic="false"
                style={{ pointerEvents: 'none' }}
              >
                <div
                  ref={(el) => {
                    allFaceRefs.current[12] = el;
                  }}
                  className="kb-key-face pointer-events-none"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="kb-key-tint" />
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#3a484d] tracking-tight pointer-events-none">
                    fn
                  </span>
                </div>
              </div>

              {/* Row 3 Decorative Key: alt (col 2) */}
              <div
                className="kb-key-base kb-decorative-key aspect-square pointer-events-none col-start-2 row-start-3"
                aria-hidden="true"
                tabIndex={-1}
                data-magnetic="false"
                style={{ pointerEvents: 'none' }}
              >
                <div
                  ref={(el) => {
                    allFaceRefs.current[13] = el;
                  }}
                  className="kb-key-face pointer-events-none"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="kb-key-tint" />
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#3a484d] tracking-tight pointer-events-none">
                    alt
                  </span>
                </div>
              </div>

              {/* Row 3 Decorative Key: cmd ⌘ (cols 5-6) */}
              <div
                className="kb-key-base kb-decorative-key col-span-2 col-start-5 row-start-3 aspect-[2.3/1] pointer-events-none"
                aria-hidden="true"
                tabIndex={-1}
                data-magnetic="false"
                style={{ pointerEvents: 'none' }}
              >
                <div
                  ref={(el) => {
                    allFaceRefs.current[15] = el;
                  }}
                  className="kb-key-face pointer-events-none"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="kb-key-tint" />
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#3a484d] tracking-tight pointer-events-none">
                    cmd ⌘
                  </span>
                </div>
              </div>

              {/* ═════════════════════════════════════════════════════════
                  PART 2 (DOM SECOND): ALL SEVEN INTERACTIVE KEYS
                  Rendered after decorative keys in DOM to guarantee top-level
                  stacking, hit testing, and no occlusion.
                 ═════════════════════════════════════════════════════════ */}

              {/* Row 2: Six Interactive Social Keys (GitHub, LinkedIn, LeetCode, X, Instagram, Email) */}
              {row2Keys.map((keyItem, index) => {
                const globalIndex = 6 + index;
                const isEmail = keyItem.id === 'email';
                const ariaLabel = isEmail
                  ? `${keyItem.label}, opens email client`
                  : `${keyItem.label}, opens in a new tab`;
                const colClass = COL_CLASSES[index] || `col-start-${index + 1}`;

                return (
                  <a
                    key={keyItem.id}
                    href={keyItem.url}
                    target={isEmail ? undefined : '_blank'}
                    rel={isEmail ? undefined : 'noopener noreferrer'}
                    aria-label={ariaLabel}
                    className={`kb-key-base kb-interactive-key group aspect-square block cursor-pointer row-start-2 ${colClass}`}
                    data-magnetic="false"
                    tabIndex={0}
                    style={{ pointerEvents: 'auto' }}
                    onPointerDown={() => handleKeyInteraction(index)}
                    onClick={() => handleKeyInteraction(index)}
                    onPointerEnter={() => handleKeyHover(keyItem, index)}
                    onKeyDown={(e) => handleKeyDown(e, keyItem, index)}
                  >
                    <div
                      ref={(el) => {
                        interactiveFaceRefs.current[index] = el;
                        allFaceRefs.current[globalIndex] = el;
                      }}
                      className="kb-key-face"
                    >
                      {/* Flashing cyan overlay tint */}
                      <div className="kb-key-tint" />

                      {/* Backlit Icon Legend */}
                      <span className="kb-key-icon-target flex items-center justify-center text-[#8fd8e6] transition-colors duration-150">
                        <PlatformKeyIcon id={keyItem.id} />
                      </span>

                      {/* 
                        Flat Counter-Rotated Tooltip
                        Shows platform name and handle: "GitHub • diptamnandi"
                      */}
                      <div className="kb-tooltip-flat" aria-hidden="true">
                        <div className="flex flex-col items-center">
                          <div className="px-2.5 py-1 rounded-md bg-[#0a0e10]/95 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 shadow-[0_4px_16px_rgba(0,0,0,0.85),0_0_12px_rgba(34,211,238,0.3)] tracking-wider whitespace-nowrap">
                            {keyItem.label} • {keyItem.handle}
                          </div>
                          <div className="w-0 h-0 border-x-[4px] border-x-transparent border-t-[5px] border-t-cyan-400/50" />
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}

              {/* Row 3 Interactive Key: LINKTREE Key (Replaces Spacebar, cols 3-4) */}
              {linktreeKey && (
                <a
                  href={linktreeKey.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${linktreeKey.label}, opens in a new tab`}
                  className="kb-key-base kb-interactive-key group col-span-2 col-start-3 row-start-3 aspect-[2.35/1] block cursor-pointer"
                  data-magnetic="false"
                  tabIndex={0}
                  style={{ pointerEvents: 'auto' }}
                  onPointerDown={() => handleKeyInteraction(6)}
                  onClick={() => handleKeyInteraction(6)}
                  onPointerEnter={() => handleKeyHover(linktreeKey, 6)}
                  onKeyDown={(e) => handleKeyDown(e, linktreeKey, 6)}
                >
                  <div
                    ref={(el) => {
                      linktreeFaceRef.current = el;
                      allFaceRefs.current[14] = el;
                    }}
                    className="kb-key-face"
                  >
                    <div className="kb-key-tint" />
                    <span className="kb-key-icon-target flex items-center justify-center gap-1.5 text-[#8fd8e6] transition-colors duration-150">
                      <PlatformKeyIcon id="linktree" size={14} />
                      <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-tight text-neutral-300 group-hover:text-cyan-300 transition-colors">
                        All my links
                      </span>
                    </span>

                    {/* Flat Counter-Rotated Tooltip */}
                    <div className="kb-tooltip-flat" aria-hidden="true">
                      <div className="flex flex-col items-center">
                        <div className="px-2.5 py-1 rounded-md bg-[#0a0e10]/95 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 shadow-[0_4px_16px_rgba(0,0,0,0.85),0_0_12px_rgba(34,211,238,0.3)] tracking-wider whitespace-nowrap">
                          {linktreeKey.label} • {linktreeKey.handle}
                        </div>
                        <div className="w-0 h-0 border-x-[4px] border-x-transparent border-t-[5px] border-t-cyan-400/50" />
                      </div>
                    </div>
                  </div>
                </a>
              )}
            </>
          ) : (
            <>
              {/* Narrow 3-col fallback: Decorative keys first */}
              {row1Keys.slice(0, 3).map((char, i) => (
                <div
                  key={`r1-narrow-${char}`}
                  className="kb-key-base kb-decorative-key aspect-square pointer-events-none"
                  aria-hidden="true"
                  tabIndex={-1}
                  data-magnetic="false"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="kb-key-face pointer-events-none" style={{ pointerEvents: 'none' }}>
                    <div className="kb-key-tint" />
                    <span className="font-mono text-[11px] font-semibold text-[#3a484d] select-none">
                      {char}
                    </span>
                  </div>
                </div>
              ))}

              <div
                className="kb-key-base kb-decorative-key aspect-square pointer-events-none"
                aria-hidden="true"
                tabIndex={-1}
                data-magnetic="false"
                style={{ pointerEvents: 'none' }}
              >
                <div className="kb-key-face pointer-events-none" style={{ pointerEvents: 'none' }}>
                  <div className="kb-key-tint" />
                  <span className="font-mono text-[10px] font-semibold text-[#3a484d]">fn</span>
                </div>
              </div>

              {/* Narrow 3-col fallback: Interactive keys second */}
              {row2Keys.map((keyItem, index) => {
                const isEmail = keyItem.id === 'email';
                return (
                  <a
                    key={`narrow-${keyItem.id}`}
                    href={keyItem.url}
                    target={isEmail ? undefined : '_blank'}
                    rel={isEmail ? undefined : 'noopener noreferrer'}
                    aria-label={keyItem.label}
                    className="kb-key-base kb-interactive-key group aspect-square block cursor-pointer"
                    data-magnetic="false"
                    tabIndex={0}
                    style={{ pointerEvents: 'auto' }}
                    onPointerDown={() => handleKeyInteraction(index)}
                    onClick={() => handleKeyInteraction(index)}
                    onPointerEnter={() => handleKeyHover(keyItem, index)}
                    onKeyDown={(e) => handleKeyDown(e, keyItem, index)}
                  >
                    <div className="kb-key-face">
                      <div className="kb-key-tint" />
                      <span className="kb-key-icon-target flex items-center justify-center text-[#8fd8e6]">
                        <PlatformKeyIcon id={keyItem.id} />
                      </span>
                    </div>
                  </a>
                );
              })}

              {linktreeKey && (
                <a
                  href={linktreeKey.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${linktreeKey.label}, opens in a new tab`}
                  className="kb-key-base kb-interactive-key group col-span-2 aspect-[2.1/1] block cursor-pointer"
                  data-magnetic="false"
                  tabIndex={0}
                  style={{ pointerEvents: 'auto' }}
                  onPointerDown={() => handleKeyInteraction(6)}
                  onClick={() => handleKeyInteraction(6)}
                  onPointerEnter={() => handleKeyHover(linktreeKey, 6)}
                  onKeyDown={(e) => handleKeyDown(e, linktreeKey, 6)}
                >
                  <div className="kb-key-face">
                    <div className="kb-key-tint" />
                    <span className="kb-key-icon-target flex items-center justify-center gap-1.5 text-[#8fd8e6]">
                      <PlatformKeyIcon id="linktree" size={14} />
                      <span className="text-[10px] font-mono font-semibold tracking-tight text-neutral-300">
                        Links
                      </span>
                    </span>
                  </div>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
