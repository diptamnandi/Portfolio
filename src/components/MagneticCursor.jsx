import React, { useEffect, useRef } from 'react';

/**
 * CONFIGURATION
 * Easily tweak magnetic radius, lerp speeds, element pull strength,
 * and accent aesthetics from this single object.
 */
export const CURSOR_CONFIG = {
  dotSize: 6, // px (diameter of zero-lag center pointer dot)
  ringSize: 28, // px (diameter of default follower ring)
  ringBorderWidth: 1.2, // px (border thickness of the ring)
  magnetRadius: 90, // px (distance threshold from pointer to element center)
  pullStrength: 0.08, // element shift factor (8% of pointer offset)
  maxPull: 8, // px (maximum translation shift for pulled elements)
  lerpSpeed: 0.18, // lerp interpolation factor per animation frame (~0.18)
  paddingX: 16, // px added to element width when morphed into envelope
  paddingY: 14, // px added to element height when morphed into envelope
  accentColor: '#22d3ee', // Tailwind cyan-400
  accentRgb: '34, 211, 238', // RGB channels for opacity blending
  activeFillOpacity: 0.1, // 10% opacity cyan fill when magnetized
  springDuration: 300, // ms for element snap-back ease on release
  rippleDuration: 400, // ms for click ripple animation
  scaleDownOnClick: 0.9, // ring scale factor on mousedown
};

/**
 * Computes border-radius for the morphed ring based on the target element's styling.
 */
function computeBorderRadius(element, targetHeight) {
  if (!element || typeof window === 'undefined') return targetHeight / 2;
  try {
    const computed = window.getComputedStyle(element);
    const parsed = parseFloat(computed.borderRadius);
    if (!isNaN(parsed) && parsed > 0) {
      // If the element has rounded corners, follow it closely with slight padding,
      // capped at half the target height (pill shape).
      return Math.min(parsed + 3, targetHeight / 2);
    }
  } catch {
    // Fallback to half-height pill shape
  }
  return targetHeight / 2;
}

/**
 * Helper to check if an element or its ancestors require the native cursor.
 */
function isNativeCursorElement(target) {
  if (!target || !target.closest) return false;
  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], [data-native-cursor]'
    )
  );
}

/**
 * MagneticCursor Component
 * 
 * Features:
 * - Zero-lag 6px cyan center dot locked directly to pointer
 * - Lerped 28px thin cyan ring following at ~0.18 per frame
 * - Dynamic magnetic morphing when within ~90px of elements with [data-magnetic]
 * - Smooth 8% element pull (max ~8px) with 300ms spring return
 * - 0.9 scale on mousedown + 400ms click ripple
 * - Automatically disabled on touch screens (@media (pointer: coarse))
 * - Reduced motion support (instant snap, no element pull)
 * - Safe native cursor for inputs/textareas
 */
export default function MagneticCursor() {
  const containerRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rippleRef = useRef(null);

  // Mutable refs to prevent React state re-renders on mousemove
  const pointerRef = useRef({ x: -100, y: -100 });
  const ringRefState = useRef({
    x: -100,
    y: -100,
    w: CURSOR_CONFIG.ringSize,
    h: CURSOR_CONFIG.ringSize,
    r: CURSOR_CONFIG.ringSize / 2,
    bgAlpha: 0,
    scale: 1,
  });

  const activeElementRef = useRef(null);
  const isVisibleRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const isNativeHoveredRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const magneticElementsCache = useRef([]);
  const rafIdRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Accessibility & Touch Detection Check
    const touchMediaQuery = window.matchMedia('(pointer: coarse)');
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const isTouch = touchMediaQuery.matches || navigator.maxTouchPoints > 0;
    if (isTouch) {
      // Touch device: keep default native cursor, do not mount custom cursor
      return;
    }

    prefersReducedMotionRef.current = motionMediaQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
    };

    if (motionMediaQuery.addEventListener) {
      motionMediaQuery.addEventListener('change', handleMotionChange);
    } else {
      motionMediaQuery.addListener(handleMotionChange);
    }

    // 2. Hide native cursor on body via scoped stylesheet
    const styleEl = document.createElement('style');
    styleEl.id = 'magnetic-cursor-style';
    styleEl.textContent = `
      body.custom-cursor-active,
      body.custom-cursor-active a,
      body.custom-cursor-active button,
      body.custom-cursor-active [role="button"] {
        cursor: none !important;
      }
      body.custom-cursor-active input,
      body.custom-cursor-active textarea,
      body.custom-cursor-active select,
      body.custom-cursor-active [contenteditable="true"],
      body.custom-cursor-active [data-native-cursor],
      body.custom-cursor-active [data-native-cursor] * {
        cursor: auto !important;
      }
    `;
    document.head.appendChild(styleEl);
    document.body.classList.add('custom-cursor-active');

    // 3. Cache magnetic elements to prevent querying on every single frame
    const updateMagneticElements = () => {
      magneticElementsCache.current = Array.from(
        document.querySelectorAll('[data-magnetic]:not([data-magnetic="false"])')
      ).filter((el) => el.isConnected && el.offsetParent !== null);
    };

    updateMagneticElements();

    // Re-index magnetic elements when layout changes
    window.addEventListener('scroll', updateMagneticElements, { passive: true });
    window.addEventListener('resize', updateMagneticElements, { passive: true });

    // MutationObserver to catch dynamically mounted modals or tabs
    const observer = new MutationObserver(() => {
      updateMagneticElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Helper to release pulled element smoothly
    const releaseElement = (element) => {
      if (!element) return;
      const pullTarget =
        element.querySelector('[data-magnetic-pull="true"]') || element;
      pullTarget.style.transition = `transform ${CURSOR_CONFIG.springDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      pullTarget.style.transform = 'translate3d(0px, 0px, 0px)';
    };

    // 4. Pointer Events Handling
    const handlePointerMove = (e) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;

      // Update dot position immediately for true ZERO-LAG pointer lock
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${(
          e.clientX -
          CURSOR_CONFIG.dotSize / 2
        ).toFixed(1)}px, ${(
          e.clientY -
          CURSOR_CONFIG.dotSize / 2
        ).toFixed(1)}px, 0px)`;
      }

      // Check if pointer is over native text elements
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const isNative = isNativeCursorElement(target);
      isNativeHoveredRef.current = isNative;

      // Show cursor container if previously hidden
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        // Seed initial ring position to pointer so it doesn't fly in from (-100, -100)
        ringRefState.current.x = e.clientX;
        ringRefState.current.y = e.clientY;
      }

      if (containerRef.current) {
        containerRef.current.style.opacity = isNative ? '0' : '1';
      }
    };

    const handlePointerDown = (e) => {
      isMouseDownRef.current = true;

      // Click ripple effect
      if (rippleRef.current && !isNativeHoveredRef.current) {
        const rx = e.clientX;
        const ry = e.clientY;
        const rippleEl = rippleRef.current;
        rippleEl.animate(
          [
            {
              transform: `translate3d(${rx - CURSOR_CONFIG.ringSize / 2}px, ${
                ry - CURSOR_CONFIG.ringSize / 2
              }px, 0px) scale(1)`,
              opacity: 0.85,
              borderColor: CURSOR_CONFIG.accentColor,
            },
            {
              transform: `translate3d(${rx - CURSOR_CONFIG.ringSize}px, ${
                ry - CURSOR_CONFIG.ringSize
              }px, 0px) scale(2.2)`,
              opacity: 0,
              borderColor: CURSOR_CONFIG.accentColor,
            },
          ],
          {
            duration: CURSOR_CONFIG.rippleDuration,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'none',
          }
        );
      }
    };

    const handlePointerUp = () => {
      isMouseDownRef.current = false;
    };

    const handlePointerLeave = () => {
      isVisibleRef.current = false;
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
      }
      if (activeElementRef.current) {
        releaseElement(activeElementRef.current);
        activeElementRef.current = null;
      }
    };

    const handlePointerEnter = () => {
      isVisibleRef.current = true;
      if (containerRef.current && !isNativeHoveredRef.current) {
        containerRef.current.style.opacity = '1';
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handlePointerLeave();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.documentElement.addEventListener('pointerenter', handlePointerEnter);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 5. Main Single requestAnimationFrame Loop
    const tick = () => {
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const isReduced = prefersReducedMotionRef.current;
      const lerpFactor = isReduced ? 1 : CURSOR_CONFIG.lerpSpeed;

      let targetX = px;
      let targetY = py;
      let targetW = CURSOR_CONFIG.ringSize;
      let targetH = CURSOR_CONFIG.ringSize;
      let targetRadius = CURSOR_CONFIG.ringSize / 2;
      let targetBgAlpha = 0;
      let targetScale = isMouseDownRef.current
        ? CURSOR_CONFIG.scaleDownOnClick
        : 1;

      let closestElement = null;
      let closestRect = null;
      let minDistance = CURSOR_CONFIG.magnetRadius;
      let closestCenter = { cx: 0, cy: 0 };

      // Find the single closest magnetic element within the magnet radius
      if (isVisibleRef.current && !isNativeHoveredRef.current) {
        const elements = magneticElementsCache.current;
        const total = elements.length;

        for (let i = 0; i < total; i++) {
          const el = elements[i];
          const rect = el.getBoundingClientRect();

          // Quick viewport culling
          if (
            rect.bottom < 0 ||
            rect.top > window.innerHeight ||
            rect.right < 0 ||
            rect.left > window.innerWidth
          ) {
            continue;
          }

          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = px - cx;
          const dy = py - cy;
          const dist = Math.hypot(dx, dy);

          if (dist < minDistance) {
            minDistance = dist;
            closestElement = el;
            closestRect = rect;
            closestCenter = { cx, cy };
          }
        }
      }

      // Handle magnetic attraction state
      if (closestElement && closestRect) {
        targetX = closestCenter.cx;
        targetY = closestCenter.cy;
        targetW = closestRect.width + CURSOR_CONFIG.paddingX;
        targetH = closestRect.height + CURSOR_CONFIG.paddingY;
        targetRadius = computeBorderRadius(closestElement, targetH);
        targetBgAlpha = CURSOR_CONFIG.activeFillOpacity;

        // Apply element pull towards pointer (8% offset, capped at ~8px)
        const offsetX = px - closestCenter.cx;
        const offsetY = py - closestCenter.cy;

        const shiftX = isReduced
          ? 0
          : Math.max(
              -CURSOR_CONFIG.maxPull,
              Math.min(CURSOR_CONFIG.maxPull, offsetX * CURSOR_CONFIG.pullStrength)
            );
        const shiftY = isReduced
          ? 0
          : Math.max(
              -CURSOR_CONFIG.maxPull,
              Math.min(CURSOR_CONFIG.maxPull, offsetY * CURSOR_CONFIG.pullStrength)
            );

        const pullTarget =
          closestElement.querySelector('[data-magnetic-pull="true"]') ||
          closestElement;
        pullTarget.style.transition = 'none';
        pullTarget.style.transform = `translate3d(${shiftX.toFixed(
          2
        )}px, ${shiftY.toFixed(2)}px, 0px)`;

        // If previously active element was different, release it
        if (
          activeElementRef.current &&
          activeElementRef.current !== closestElement
        ) {
          releaseElement(activeElementRef.current);
        }
        activeElementRef.current = closestElement;
      } else {
        // Leaving magnetic zone
        if (activeElementRef.current) {
          releaseElement(activeElementRef.current);
          activeElementRef.current = null;
        }
      }

      // Smooth lerp calculations for the follower ring
      const ring = ringRefState.current;
      ring.x += (targetX - ring.x) * lerpFactor;
      ring.y += (targetY - ring.y) * lerpFactor;
      ring.w += (targetW - ring.w) * lerpFactor;
      ring.h += (targetH - ring.h) * lerpFactor;
      ring.r += (targetRadius - ring.r) * lerpFactor;
      ring.bgAlpha += (targetBgAlpha - ring.bgAlpha) * lerpFactor;
      ring.scale += (targetScale - ring.scale) * (isReduced ? 1 : 0.25);

      // Render updated ring transforms
      if (ringRef.current) {
        const posX = ring.x - ring.w / 2;
        const posY = ring.y - ring.h / 2;

        ringRef.current.style.transform = `translate3d(${posX.toFixed(
          2
        )}px, ${posY.toFixed(2)}px, 0px) scale(${ring.scale.toFixed(3)})`;
        ringRef.current.style.width = `${ring.w.toFixed(2)}px`;
        ringRef.current.style.height = `${ring.h.toFixed(2)}px`;
        ringRef.current.style.borderRadius = `${ring.r.toFixed(2)}px`;
        ringRef.current.style.backgroundColor = `rgba(${CURSOR_CONFIG.accentRgb}, ${ring.bgAlpha.toFixed(
          3
        )})`;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    // 6. Complete unmount and listener cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (activeElementRef.current) {
        releaseElement(activeElementRef.current);
      }

      window.removeEventListener('scroll', updateMagneticElements);
      window.removeEventListener('resize', updateMagneticElements);
      observer.disconnect();

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.documentElement.removeEventListener(
        'pointerleave',
        handlePointerLeave
      );
      document.documentElement.removeEventListener(
        'pointerenter',
        handlePointerEnter
      );
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (motionMediaQuery.removeEventListener) {
        motionMediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        motionMediaQuery.removeListener(handleMotionChange);
      }

      document.body.classList.remove('custom-cursor-active');
      const attachedStyle = document.getElementById('magnetic-cursor-style');
      if (attachedStyle) attachedStyle.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden transition-opacity duration-200"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* Click ripple animation ring */}
      <div
        ref={rippleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-cyan-400 opacity-0 will-change-transform"
        style={{
          width: `${CURSOR_CONFIG.ringSize}px`,
          height: `${CURSOR_CONFIG.ringSize}px`,
        }}
      />

      {/* Morphing lerped cyan ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
          width: `${CURSOR_CONFIG.ringSize}px`,
          height: `${CURSOR_CONFIG.ringSize}px`,
          border: `${CURSOR_CONFIG.ringBorderWidth}px solid ${CURSOR_CONFIG.accentColor}`,
          borderRadius: `${CURSOR_CONFIG.ringSize / 2}px`,
          backgroundColor: 'transparent',
          boxSizing: 'border-box',
          boxShadow: `0 0 16px -2px rgba(${CURSOR_CONFIG.accentRgb}, 0.25)`,
        }}
      />

      {/* Zero-lag cyan dot locked directly to pointer */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] will-change-transform rounded-full shadow-[0_0_8px_#22d3ee]"
        style={{
          width: `${CURSOR_CONFIG.dotSize}px`,
          height: `${CURSOR_CONFIG.dotSize}px`,
          backgroundColor: CURSOR_CONFIG.accentColor,
        }}
      />
    </div>
  );
}
