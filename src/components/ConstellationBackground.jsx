import React, { useRef, useEffect } from 'react';

/**
 * ============================================================================
 * CONSTELLATION CONFIGURATION
 * ============================================================================
 * Easily tweak star density, movement speed, colors, link rules, and timings.
 */
export const CONSTELLATION_CONFIG = {
  // Density & limits
  starDensityArea: 12000, // 1 star per 12,000 px²
  maxStarsDesktop: 120, // Desktop limit
  maxStarsMobile: 45, // Mobile limit (< 768px)
  mobileBreakpoint: 768, // px threshold for mobile mode

  // Star aesthetics & kinematics
  minRadius: 0.8,
  maxRadius: 2.0,
  brightStarRatio: 0.1, // ~10% bright stars
  brightStarRadiusMult: 1.5, // Multiplier for bright stars
  baseDriftSpeed: 10, // Pixels per second (frame-rate independent)
  twinkleSpeedMin: 1.2,
  twinkleSpeedMax: 2.4,

  // Connections (The "Star Chain")
  maxLinkDistDesktop: 140, // Max link range on desktop (px)
  maxLinkDistMobile: 100, // Max link range on mobile (px)
  maxNeighborsPerStar: 3, // Constellation chains (2-3 neighbors max)

  // Connection lifecycle durations (in milliseconds)
  linkConnectingDuration: 600, // Progressive line drawing time
  linkConnectedDurationMin: 2000, // Minimum connected hold time
  linkConnectedDurationMax: 6000, // Maximum connected hold time
  linkDisconnectingDuration: 500, // Fade out time
  linkBrokenDurationMin: 1000, // Cool-down before reconnecting
  linkBrokenDurationMax: 3000,

  // Star vanish & reappear cycles
  vanishInterval: 3500, // Frequency of vanish selection (ms)
  vanishRatio: 0.08, // ~5-10% of stars chosen per interval
  vanishFadeOutDuration: 400, // Fade out duration (ms)
  vanishHoldDuration: 2000, // Duration star stays completely invisible (ms)
  vanishFadeInDuration: 600, // Fade back in duration (ms)

  // Color palette & styling
  // 'transparent' allows seamless blending over container / GlobalBackground layers.
  // Set to '#050505' if using as standalone canvas background.
  bgColor: 'transparent',
  starBaseColor: '255, 255, 255', // Pure white core
  brightStarColor: '210, 248, 255', // Ice-blue bright star core
  accentColor: '34, 211, 238', // Cyan #22d3ee accent
  lineOpacityMin: 0.15,
  lineOpacityMax: 0.4,
  glowAlphaRegular: 0.22,
  glowAlphaBright: 0.5,

  // Cursor interaction (desktop only)
  mouseRadius: 150, // Interaction radius (px)
  mouseMaxLinks: 3, // Max links directly to cursor
  mouseLineOpacity: 0.35,
};

/**
 * Standard quadratic easeInOut for natural, organic transitions
 */
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Helper to generate random number within a range [min, max]
 */
function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Unique symmetric key generator for pairs of star IDs
 */
function getLinkKey(idA, idB) {
  return idA < idB ? `${idA}_${idB}` : `${idB}_${idA}`;
}

/**
 * Lightweight 2D Spatial Grid to keep neighbor discovery O(N)
 */
class SpatialGrid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.cols = 0;
    this.rows = 0;
    this.cells = [];
  }

  resize(width, height) {
    this.cols = Math.ceil(width / this.cellSize) + 1;
    this.rows = Math.ceil(height / this.cellSize) + 1;
    const total = this.cols * this.rows;
    this.cells = Array.from({ length: total }, () => []);
  }

  clear() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].length = 0;
    }
  }

  insert(star) {
    const col = Math.floor(star.x / this.cellSize);
    const row = Math.floor(star.y / this.cellSize);
    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
      this.cells[row * this.cols + col].push(star);
    }
  }

  getPotentialNeighbors(star) {
    const col = Math.floor(star.x / this.cellSize);
    const row = Math.floor(star.y / this.cellSize);
    const neighbors = [];

    const minC = Math.max(0, col - 1);
    const maxC = Math.min(this.cols - 1, col + 1);
    const minR = Math.max(0, row - 1);
    const maxR = Math.min(this.rows - 1, row + 1);

    for (let c = minC; c <= maxC; c++) {
      for (let r = minR; r <= maxR; r++) {
        const bucket = this.cells[r * this.cols + c];
        for (let i = 0; i < bucket.length; i++) {
          const other = bucket[i];
          if (other.id !== star.id) {
            neighbors.push(other);
          }
        }
      }
    }
    return neighbors;
  }
}

/**
 * ConstellationBackground Component
 * Pure HTML5 Canvas 2D animated constellation field.
 * Renders as a fixed, full-viewport layer behind all content.
 */
export default function ConstellationBackground({ className = '', style = {} }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId = null;
    let lastTime = performance.now();
    let vanishTimer = 0;
    let resizeDebounceTimer = null;
    let isRunning = true;

    // Viewport dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width < CONSTELLATION_CONFIG.mobileBreakpoint;
    let maxLinkDist = isMobile
      ? CONSTELLATION_CONFIG.maxLinkDistMobile
      : CONSTELLATION_CONFIG.maxLinkDistDesktop;

    // Spatial grid for efficient neighbor queries
    const grid = new SpatialGrid(CONSTELLATION_CONFIG.maxLinkDistDesktop);
    grid.resize(width, height);

    // Mouse coordinates (null when off-screen or on touch devices)
    const mouse = { x: -1000, y: -1000, active: false };

    // Device capability detection
    const isTouchDevice = () => {
      if (typeof window === 'undefined') return false;
      return (
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(hover: none)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };
    const touchEnabled = isTouchDevice();

    // Prefers-reduced-motion media query
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionMediaQuery.matches;

    // Stars & links collections
    let stars = [];
    const linksMap = new Map();
    let nextStarId = 1;

    // Helper: calculate appropriate star count for current dimensions
    const calculateStarCount = (w, h) => {
      const area = w * h;
      const count = Math.round(area / CONSTELLATION_CONFIG.starDensityArea);
      const cap = isMobile
        ? CONSTELLATION_CONFIG.maxStarsMobile
        : CONSTELLATION_CONFIG.maxStarsDesktop;
      return Math.min(cap, Math.max(16, count));
    };

    // Helper: create a new star object
    const createStar = (presetX, presetY) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomRange(0.3, 1.0) * CONSTELLATION_CONFIG.baseDriftSpeed;
      const isBright = Math.random() < CONSTELLATION_CONFIG.brightStarRatio;
      const radius = isBright
        ? randomRange(CONSTELLATION_CONFIG.minRadius, CONSTELLATION_CONFIG.maxRadius) *
          CONSTELLATION_CONFIG.brightStarRadiusMult
        : randomRange(CONSTELLATION_CONFIG.minRadius, CONSTELLATION_CONFIG.maxRadius);

      return {
        id: nextStarId++,
        x: presetX !== undefined ? presetX : Math.random() * width,
        y: presetY !== undefined ? presetY : Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius,
        isBright,
        baseOpacity: isBright ? randomRange(0.8, 1.0) : randomRange(0.45, 0.8),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: randomRange(
          CONSTELLATION_CONFIG.twinkleSpeedMin,
          CONSTELLATION_CONFIG.twinkleSpeedMax
        ),
        // Vanish & reappear state machine
        vanishState: 'idle', // 'idle' | 'vanishing' | 'hidden' | 'reappearing'
        vanishElapsed: 0,
        opacityFactor: 1.0,
      };
    };

    // Initialize or resize star population
    const syncStarPopulation = () => {
      const targetCount = calculateStarCount(width, height);
      if (stars.length < targetCount) {
        const needed = targetCount - stars.length;
        for (let i = 0; i < needed; i++) {
          stars.push(createStar());
        }
      } else if (stars.length > targetCount) {
        // Remove excess stars and their links
        const removed = stars.slice(targetCount);
        stars = stars.slice(0, targetCount);
        const removedIds = new Set(removed.map((s) => s.id));
        for (const [key, link] of linksMap.entries()) {
          if (removedIds.has(link.starA.id) || removedIds.has(link.starB.id)) {
            linksMap.delete(key);
          }
        }
      }
    };

    // Setup canvas resolution taking devicePixelRatio into account (capped at 2)
    const resizeCanvas = () => {
      const prevW = width;
      const prevH = height;
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < CONSTELLATION_CONFIG.mobileBreakpoint;
      maxLinkDist = isMobile
        ? CONSTELLATION_CONFIG.maxLinkDistMobile
        : CONSTELLATION_CONFIG.maxLinkDistDesktop;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale before reapplying
      ctx.scale(dpr, dpr);

      grid.resize(width, height);

      // Rescale existing star positions smoothly without abrupt teleporting
      if (prevW > 0 && prevH > 0) {
        const scaleX = width / prevW;
        const scaleY = height / prevH;
        for (let i = 0; i < stars.length; i++) {
          stars[i].x *= scaleX;
          stars[i].y *= scaleY;
        }
      }

      syncStarPopulation();
    };

    // Initial setup
    resizeCanvas();
    syncStarPopulation();

    // Populate initial stable constellation links
    const initializeLinks = () => {
      linksMap.clear();
      grid.clear();
      for (let i = 0; i < stars.length; i++) grid.insert(stars[i]);

      const degrees = new Map();
      for (let i = 0; i < stars.length; i++) {
        const starA = stars[i];
        let degA = degrees.get(starA.id) || 0;
        if (degA >= CONSTELLATION_CONFIG.maxNeighborsPerStar) continue;

        const candidates = grid
          .getPotentialNeighbors(starA)
          .filter((s) => s.id !== starA.id)
          .map((s) => ({
            star: s,
            dist: Math.hypot(s.x - starA.x, s.y - starA.y),
          }))
          .filter((c) => c.dist <= maxLinkDist)
          .sort((a, b) => a.dist - b.dist);

        for (let c = 0; c < candidates.length && degA < CONSTELLATION_CONFIG.maxNeighborsPerStar; c++) {
          const cand = candidates[c];
          const degB = degrees.get(cand.star.id) || 0;
          if (degB < CONSTELLATION_CONFIG.maxNeighborsPerStar) {
            const key = getLinkKey(starA.id, cand.star.id);
            if (!linksMap.has(key)) {
              linksMap.set(key, {
                starA,
                starB: cand.star,
                state: 'connected',
                timer: 0,
                duration: randomRange(
                  CONSTELLATION_CONFIG.linkConnectedDurationMin,
                  CONSTELLATION_CONFIG.linkConnectedDurationMax
                ),
                progress: 1,
                fadeAlpha: 1,
              });
              degA++;
              degrees.set(starA.id, degA);
              degrees.set(cand.star.id, degB + 1);
            }
          }
        }
      }
    };

    initializeLinks();

    // ========================================================================
    // UPDATE LOGIC (Stars, Vanish Cycles, Link State Machine)
    // ========================================================================
    const update = (dt) => {
      const dtMs = dt * 1000;

      // 1. Vanish & Reappear Scheduler
      vanishTimer += dtMs;
      if (vanishTimer >= CONSTELLATION_CONFIG.vanishInterval) {
        vanishTimer = 0;
        const idleStars = stars.filter((s) => s.vanishState === 'idle');
        const countToVanish = Math.max(
          1,
          Math.round(stars.length * CONSTELLATION_CONFIG.vanishRatio)
        );

        if (idleStars.length > 0) {
          // Shuffle selection
          for (let i = idleStars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [idleStars[i], idleStars[j]] = [idleStars[j], idleStars[i]];
          }
          const chosen = idleStars.slice(0, countToVanish);
          for (let i = 0; i < chosen.length; i++) {
            chosen[i].vanishState = 'vanishing';
            chosen[i].vanishElapsed = 0;
          }
        }
      }

      // 2. Update Stars Kinematics & States
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Handle Vanish State Lifecycle
        if (s.vanishState === 'vanishing') {
          s.vanishElapsed += dtMs;
          const t = Math.min(1, s.vanishElapsed / CONSTELLATION_CONFIG.vanishFadeOutDuration);
          s.opacityFactor = 1 - easeInOutQuad(t);

          // Continue gentle drift
          s.x += s.vx * dt;
          s.y += s.vy * dt;

          if (s.vanishElapsed >= CONSTELLATION_CONFIG.vanishFadeOutDuration) {
            s.vanishState = 'hidden';
            s.vanishElapsed = 0;
            s.opacityFactor = 0;
          }
        } else if (s.vanishState === 'hidden') {
          s.vanishElapsed += dtMs;
          s.opacityFactor = 0;
          // Remain at identical position while invisible
          if (s.vanishElapsed >= CONSTELLATION_CONFIG.vanishHoldDuration) {
            s.vanishState = 'reappearing';
            s.vanishElapsed = 0;
          }
        } else if (s.vanishState === 'reappearing') {
          s.vanishElapsed += dtMs;
          const t = Math.min(1, s.vanishElapsed / CONSTELLATION_CONFIG.vanishFadeInDuration);
          s.opacityFactor = easeInOutQuad(t);

          // Resume gentle drift
          s.x += s.vx * dt;
          s.y += s.vy * dt;

          if (s.vanishElapsed >= CONSTELLATION_CONFIG.vanishFadeInDuration) {
            s.vanishState = 'idle';
            s.vanishElapsed = 0;
            s.opacityFactor = 1.0;
          }
        } else {
          // Normal idle drifting
          s.opacityFactor = 1.0;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
        }

        // Screen boundary wrap-around
        if (s.x < 0) s.x += width;
        else if (s.x > width) s.x -= width;
        if (s.y < 0) s.y += height;
        else if (s.y > height) s.y -= height;
      }

      // 3. Update Existing Links Lifecycle State Machine
      const activeDegreeMap = new Map();

      for (const [key, link] of linksMap.entries()) {
        const dx = Math.abs(link.starB.x - link.starA.x);
        const dy = Math.abs(link.starB.y - link.starA.y);

        // Edge wrapping check: if stars wrapped to opposite sides, distance exceeds maxLinkDist
        const outOfRange = dx > maxLinkDist || dy > maxLinkDist || Math.hypot(dx, dy) > maxLinkDist;

        if (outOfRange) {
          if (link.state === 'connecting' || link.state === 'connected') {
            link.state = 'disconnecting';
            link.timer = 0;
            link.duration = CONSTELLATION_CONFIG.linkDisconnectingDuration;
          } else if (link.state === 'broken') {
            linksMap.delete(key);
            continue;
          }
        }

        // State Machine Step
        if (link.state === 'connecting') {
          link.timer += dtMs;
          const t = Math.min(1, link.timer / link.duration);
          link.progress = easeInOutQuad(t);

          if (link.timer >= link.duration) {
            link.state = 'connected';
            link.timer = 0;
            link.duration = randomRange(
              CONSTELLATION_CONFIG.linkConnectedDurationMin,
              CONSTELLATION_CONFIG.linkConnectedDurationMax
            );
            link.progress = 1.0;
          }
        } else if (link.state === 'connected') {
          link.timer += dtMs;
          if (link.timer >= link.duration) {
            link.state = 'disconnecting';
            link.timer = 0;
            link.duration = CONSTELLATION_CONFIG.linkDisconnectingDuration;
          }
        } else if (link.state === 'disconnecting') {
          link.timer += dtMs;
          const t = Math.min(1, link.timer / link.duration);
          link.fadeAlpha = 1.0 - easeInOutQuad(t);

          if (link.timer >= link.duration) {
            link.state = 'broken';
            link.timer = 0;
            link.duration = randomRange(
              CONSTELLATION_CONFIG.linkBrokenDurationMin,
              CONSTELLATION_CONFIG.linkBrokenDurationMax
            );
            link.fadeAlpha = 0;
          }
        } else if (link.state === 'broken') {
          link.timer += dtMs;
          if (outOfRange) {
            linksMap.delete(key);
            continue;
          }

          if (link.timer >= link.duration) {
            // Reconnect if both stars are visible and in range
            if (link.starA.opacityFactor > 0.35 && link.starB.opacityFactor > 0.35) {
              link.state = 'connecting';
              link.timer = 0;
              link.duration = CONSTELLATION_CONFIG.linkConnectingDuration;
              link.progress = 0;
              link.fadeAlpha = 1.0;
            } else {
              linksMap.delete(key);
              continue;
            }
          }
        }

        // Count degree for non-broken links to preserve constellation chain aesthetics
        if (link.state !== 'broken') {
          activeDegreeMap.set(link.starA.id, (activeDegreeMap.get(link.starA.id) || 0) + 1);
          activeDegreeMap.set(link.starB.id, (activeDegreeMap.get(link.starB.id) || 0) + 1);
        }
      }

      // 4. Update Spatial Grid & Seek New Neighbor Connections
      grid.clear();
      for (let i = 0; i < stars.length; i++) {
        grid.insert(stars[i]);
      }

      for (let i = 0; i < stars.length; i++) {
        const starA = stars[i];
        if (starA.opacityFactor < 0.35) continue;

        let degA = activeDegreeMap.get(starA.id) || 0;
        if (degA >= CONSTELLATION_CONFIG.maxNeighborsPerStar) continue;

        const candidates = grid
          .getPotentialNeighbors(starA)
          .filter((starB) => {
            if (starB.id === starA.id || starB.opacityFactor < 0.35) return false;
            const degB = activeDegreeMap.get(starB.id) || 0;
            if (degB >= CONSTELLATION_CONFIG.maxNeighborsPerStar) return false;
            const key = getLinkKey(starA.id, starB.id);
            if (linksMap.has(key)) return false;
            return true;
          })
          .map((starB) => {
            const dx = starB.x - starA.x;
            const dy = starB.y - starA.y;
            return {
              star: starB,
              dist: Math.hypot(dx, dy),
              key: getLinkKey(starA.id, starB.id),
            };
          })
          .filter((c) => c.dist <= maxLinkDist)
          .sort((a, b) => a.dist - b.dist);

        for (let c = 0; c < candidates.length && degA < CONSTELLATION_CONFIG.maxNeighborsPerStar; c++) {
          const cand = candidates[c];
          const degB = activeDegreeMap.get(cand.star.id) || 0;
          if (degB < CONSTELLATION_CONFIG.maxNeighborsPerStar) {
            linksMap.set(cand.key, {
              starA,
              starB: cand.star,
              state: 'connecting',
              timer: 0,
              duration: CONSTELLATION_CONFIG.linkConnectingDuration,
              progress: 0,
              fadeAlpha: 1.0,
            });
            degA++;
            activeDegreeMap.set(starA.id, degA);
            activeDegreeMap.set(cand.star.id, degB + 1);
          }
        }
      }
    };

    // ========================================================================
    // RENDER LOGIC (Canvas Drawing, Polish, Twinkle, Glow)
    // ========================================================================
    const draw = (currentTime) => {
      // Clear viewport
      if (CONSTELLATION_CONFIG.bgColor && CONSTELLATION_CONFIG.bgColor !== 'transparent') {
        ctx.fillStyle = CONSTELLATION_CONFIG.bgColor;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      const timeSec = currentTime / 1000;

      // 1. Draw Constellation Chain Lines
      for (const link of linksMap.values()) {
        if (link.state === 'broken') continue;

        const dx = link.starB.x - link.starA.x;
        const dy = link.starB.y - link.starA.y;
        const dist = Math.hypot(dx, dy);
        if (dist > maxLinkDist) continue;

        const distFade = Math.max(0, 1 - dist / maxLinkDist);
        const baseAlpha =
          CONSTELLATION_CONFIG.lineOpacityMin +
          (CONSTELLATION_CONFIG.lineOpacityMax - CONSTELLATION_CONFIG.lineOpacityMin) * distFade;
        const starFade = Math.min(link.starA.opacityFactor, link.starB.opacityFactor);
        const stateFade = link.state === 'disconnecting' ? link.fadeAlpha : 1.0;
        const finalAlpha = baseAlpha * distFade * starFade * stateFade;

        if (finalAlpha <= 0.005) continue;

        // Progressive draw endpoint calculation
        const currentX2 = link.starA.x + dx * link.progress;
        const currentY2 = link.starA.y + dy * link.progress;

        // Slight gradient along connection
        const grad = ctx.createLinearGradient(link.starA.x, link.starA.y, currentX2, currentY2);
        const alphaA = finalAlpha * (link.starA.isBright ? 1.0 : 0.85);
        const alphaB = finalAlpha * (link.starB.isBright ? 1.0 : 0.85);

        grad.addColorStop(0, `rgba(${CONSTELLATION_CONFIG.accentColor}, ${alphaA})`);
        grad.addColorStop(1, `rgba(${CONSTELLATION_CONFIG.accentColor}, ${alphaB})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(link.starA.x, link.starA.y);
        ctx.lineTo(currentX2, currentY2);
        ctx.stroke();
      }

      // 2. Draw Interactive Cursor Lines (Desktop Only)
      if (mouse.active && !touchEnabled) {
        const mouseCandidates = [];
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          if (s.opacityFactor <= 0.1) continue;
          const d = Math.hypot(s.x - mouse.x, s.y - mouse.y);
          if (d <= CONSTELLATION_CONFIG.mouseRadius) {
            mouseCandidates.push({ star: s, dist: d });
          }
        }
        mouseCandidates.sort((a, b) => a.dist - b.dist);
        const topCursorLinks = mouseCandidates.slice(0, CONSTELLATION_CONFIG.mouseMaxLinks);

        for (let i = 0; i < topCursorLinks.length; i++) {
          const { star, dist } = topCursorLinks[i];
          const distFade = 1 - dist / CONSTELLATION_CONFIG.mouseRadius;
          const lineAlpha =
            CONSTELLATION_CONFIG.mouseLineOpacity * distFade * star.opacityFactor;

          const mouseGrad = ctx.createLinearGradient(star.x, star.y, mouse.x, mouse.y);
          mouseGrad.addColorStop(0, `rgba(${CONSTELLATION_CONFIG.accentColor}, ${lineAlpha})`);
          mouseGrad.addColorStop(1, `rgba(${CONSTELLATION_CONFIG.accentColor}, ${lineAlpha * 0.15})`);

          ctx.strokeStyle = mouseGrad;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // 3. Draw Stars (with Twinkle, Glow & Cursor Brightening)
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (s.opacityFactor <= 0.005) continue;

        // Sine-wave twinkle opacity pulse
        const twinkle = 0.75 + 0.25 * Math.sin(s.twinklePhase + timeSec * s.twinkleSpeed);
        let opacity = s.baseOpacity * twinkle * s.opacityFactor;

        // Proximity brightening near cursor
        if (mouse.active && !touchEnabled) {
          const distToMouse = Math.hypot(s.x - mouse.x, s.y - mouse.y);
          if (distToMouse < CONSTELLATION_CONFIG.mouseRadius) {
            const prox = 1 - distToMouse / CONSTELLATION_CONFIG.mouseRadius;
            opacity = Math.min(1.0, opacity + prox * 0.45);
          }
        }

        if (s.isBright) {
          // Bright star soft radial halo
          const haloGrad = ctx.createRadialGradient(
            s.x,
            s.y,
            0,
            s.x,
            s.y,
            s.radius * 3.8
          );
          haloGrad.addColorStop(0, `rgba(${CONSTELLATION_CONFIG.accentColor}, ${CONSTELLATION_CONFIG.glowAlphaBright * opacity})`);
          haloGrad.addColorStop(0.45, `rgba(${CONSTELLATION_CONFIG.accentColor}, ${0.15 * opacity})`);
          haloGrad.addColorStop(1, 'rgba(34, 211, 238, 0)');

          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 3.8, 0, Math.PI * 2);
          ctx.fill();

          // Bright star core
          ctx.fillStyle = `rgba(${CONSTELLATION_CONFIG.brightStarColor}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard star subtle outer halo
          ctx.fillStyle = `rgba(${CONSTELLATION_CONFIG.accentColor}, ${CONSTELLATION_CONFIG.glowAlphaRegular * opacity})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Standard star core
          ctx.fillStyle = `rgba(${CONSTELLATION_CONFIG.starBaseColor}, ${opacity * 0.9})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // ========================================================================
    // ANIMATION LOOP & LIFECYCLE
    // ========================================================================
    const loop = (currentTime) => {
      if (!isRunning) return;

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      update(dt);
      draw(currentTime);

      animationFrameId = requestAnimationFrame(loop);
    };

    const startAnimation = () => {
      if (prefersReducedMotion) {
        // Accessibility: Render a static snapshot with no active loop
        draw(performance.now());
      } else if (!animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    const stopAnimation = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    startAnimation();

    // ========================================================================
    // EVENT LISTENERS (Resize, Visibility, Mouse, Accessibility)
    // ========================================================================

    // Debounced resize handler
    const handleResize = () => {
      clearTimeout(resizeDebounceTimer);
      resizeDebounceTimer = setTimeout(() => {
        resizeCanvas();
        if (prefersReducedMotion) {
          draw(performance.now());
        }
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Tab visibility handling (pause when tab hidden, resume cleanly)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        lastTime = performance.now();
        startAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mouse pointer movement & leave handlers
    const handlePointerMove = (e) => {
      if (touchEnabled) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    if (!touchEnabled) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    }

    // Prefers-reduced-motion change listener
    const handleMotionPreferenceChange = (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        stopAnimation();
        draw(performance.now());
      } else {
        startAnimation();
      }
    };
    if (motionMediaQuery.addEventListener) {
      motionMediaQuery.addEventListener('change', handleMotionPreferenceChange);
    } else {
      motionMediaQuery.addListener(handleMotionPreferenceChange);
    }

    // Cleanup on component unmount
    return () => {
      isRunning = false;
      stopAnimation();
      clearTimeout(resizeDebounceTimer);

      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (!touchEnabled) {
        window.removeEventListener('pointermove', handlePointerMove);
        document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      }

      if (motionMediaQuery.removeEventListener) {
        motionMediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      } else {
        motionMediaQuery.removeListener(handleMotionPreferenceChange);
      }

      stars = [];
      linksMap.clear();
      grid.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-[-1] ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
