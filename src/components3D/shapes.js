/**
 * ============================================================================
 * SHAPES GENERATOR FOR PARTICLE MORPHING
 * ============================================================================
 * Safe, robust point-cloud generators.
 * Every generator returns Float32Array(count * 3) of valid coordinates.
 * Normalized to consistent bounding-box dimensions with zero-size guards.
 */

/**
 * Validates a generated shape Float32Array:
 * Checks length, NaN/Infinity, and bounding-box size.
 */
export function validateShape(name, array, count) {
  const expectedLen = count * 3;
  if (!array || array.length !== expectedLen) {
    console.error(
      `[ParticleMorph Error] Shape "${name}" invalid length: expected ${expectedLen}, got ${array ? array.length : 0}`
    );
    return false;
  }

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  let hasNaN = false;

  for (let i = 0; i < count; i++) {
    const x = array[i * 3];
    const y = array[i * 3 + 1];
    const z = array[i * 3 + 2];

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      hasNaN = true;
      break;
    }

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  if (hasNaN) {
    console.error(`[ParticleMorph Error] Shape "${name}" contains NaN or Infinity values!`);
    return false;
  }

  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const spanZ = maxZ - minZ;
  const maxSpan = Math.max(spanX, spanY, spanZ);

  if (maxSpan < 0.01) {
    console.error(
      `[ParticleMorph Error] Shape "${name}" collapsed into a tiny speck! maxSpan=${maxSpan.toFixed(4)}`
    );
    return false;
  }

  return true;
}

/**
 * Normalizes positions safely:
 * - Centers the bounding box at (0, 0, 0)
 * - Guards against zero size (maxDim || 1)
 * - Scales largest dimension to targetSize (2.4 world units)
 */
export function normalizeShape(positions, targetSize = 2.4) {
  const count = positions.length / 3;
  if (count === 0) return positions;

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    if (Number.isFinite(x)) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    if (Number.isFinite(y)) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    if (Number.isFinite(z)) {
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  }

  if (!Number.isFinite(minX) || !Number.isFinite(maxX)) {
    minX = -1; maxX = 1;
    minY = -1; maxY = 1;
    minZ = -1; maxZ = 1;
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;

  const sizeX = maxX - minX;
  const sizeY = maxY - minY;
  const sizeZ = maxZ - minZ;
  const maxDim = Math.max(sizeX, sizeY, sizeZ) || 1.0;
  const scale = targetSize / maxDim;

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (positions[i * 3] - cx) * scale;
    positions[i * 3 + 1] = (positions[i * 3 + 1] - cy) * scale;
    positions[i * 3 + 2] = (positions[i * 3 + 2] - cz) * scale;
  }

  return positions;
}

/**
 * 1. Fibonacci Sphere
 */
export function getSpherePositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const phiGolden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phiGolden * i;
    const r = 1.2 + (Math.random() - 0.5) * 0.05;

    positions[i3] = Math.cos(theta) * radiusAtY * r;
    positions[i3 + 1] = y * r;
    positions[i3 + 2] = Math.sin(theta) * radiusAtY * r;
  }
  return normalizeShape(positions);
}

/**
 * 2. Circle Ring (Radius 1.2, small thickness 0.08, NOT a filled disc)
 */
export function getCirclePositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const baseR = 1.2;
  const thickness = 0.08;

  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    // Slender ring perimeter with small thickness
    const r = baseR + (Math.random() - 0.5) * thickness;
    const z = (Math.random() - 0.5) * thickness;

    positions[i3] = r * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(theta);
    positions[i3 + 2] = z;
  }
  return normalizeShape(positions);
}

/**
 * 3. Cube (12 crisp edges + 6 faces)
 */
export function getCubePositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const s = 1.2;
  const edgeCount = Math.floor(n * 0.4);

  // 12 edges
  for (let i = 0; i < edgeCount; i++) {
    const i3 = i * 3;
    const edge = Math.floor(Math.random() * 12);
    const t = (Math.random() - 0.5) * 2 * s;
    let x = 0, y = 0, z = 0;

    switch (edge) {
      case 0: x = t; y = s; z = s; break;
      case 1: x = t; y = -s; z = s; break;
      case 2: x = t; y = s; z = -s; break;
      case 3: x = t; y = -s; z = -s; break;
      case 4: x = s; y = t; z = s; break;
      case 5: x = -s; y = t; z = s; break;
      case 6: x = s; y = t; z = -s; break;
      case 7: x = -s; y = t; z = -s; break;
      case 8: x = s; y = s; z = t; break;
      case 9: x = -s; y = s; z = t; break;
      case 10: x = s; y = -s; z = t; break;
      default: x = -s; y = -s; z = t; break;
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }

  // 6 faces
  for (let i = edgeCount; i < n; i++) {
    const i3 = i * 3;
    const face = Math.floor(Math.random() * 6);
    const u = (Math.random() - 0.5) * 2 * s;
    const v = (Math.random() - 0.5) * 2 * s;

    switch (face) {
      case 0: positions[i3] = s; positions[i3 + 1] = u; positions[i3 + 2] = v; break;
      case 1: positions[i3] = -s; positions[i3 + 1] = u; positions[i3 + 2] = v; break;
      case 2: positions[i3] = u; positions[i3 + 1] = s; positions[i3 + 2] = v; break;
      case 3: positions[i3] = u; positions[i3 + 1] = -s; positions[i3 + 2] = v; break;
      case 4: positions[i3] = u; positions[i3 + 1] = v; positions[i3 + 2] = s; break;
      default: positions[i3] = u; positions[i3 + 1] = v; positions[i3 + 2] = -s; break;
    }
  }

  return normalizeShape(positions);
}

/**
 * 4. Hexagon Prism:
 * 6 vertical edges plus top and bottom hexagon outlines, points sampled along edges and faces.
 */
export function getHexagonPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const radius = 1.2;
  const height = 1.8;

  // Vertices of the 6 corners
  const corners = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    corners.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  }

  const verticalEdgeCount = Math.floor(n * 0.3);
  const horizontalRingsCount = Math.floor(n * 0.35);
  const faceCount = n - verticalEdgeCount - horizontalRingsCount;

  // 1. Six vertical pillar edges
  for (let i = 0; i < verticalEdgeCount; i++) {
    const i3 = i * 3;
    const cornerIdx = Math.floor(Math.random() * 6);
    const c = corners[cornerIdx];
    const y = (Math.random() - 0.5) * height;

    positions[i3] = c[0];
    positions[i3 + 1] = y;
    positions[i3 + 2] = c[1];
  }

  // 2. Top and bottom hexagon outlines
  for (let i = 0; i < horizontalRingsCount; i++) {
    const i3 = (verticalEdgeCount + i) * 3;
    const isTop = Math.random() > 0.5;
    const y = isTop ? height / 2 : -height / 2;
    const side = Math.floor(Math.random() * 6);
    const t = Math.random();
    const c1 = corners[side];
    const c2 = corners[(side + 1) % 6];

    positions[i3] = c1[0] + (c2[0] - c1[0]) * t;
    positions[i3 + 1] = y;
    positions[i3 + 2] = c1[1] + (c2[1] - c1[1]) * t;
  }

  // 3. Lateral faces
  for (let i = 0; i < faceCount; i++) {
    const i3 = (verticalEdgeCount + horizontalRingsCount + i) * 3;
    const side = Math.floor(Math.random() * 6);
    const t = Math.random();
    const y = (Math.random() - 0.5) * height;
    const c1 = corners[side];
    const c2 = corners[(side + 1) % 6];

    positions[i3] = c1[0] + (c2[0] - c1[0]) * t;
    positions[i3 + 1] = y;
    positions[i3 + 2] = c1[1] + (c2[1] - c1[1]) * t;
  }

  return normalizeShape(positions);
}

/**
 * 5. Ethereum Diamond (4 upper pyramid faces, 4 lower inverted faces with split)
 */
export function getEthereumPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const half = Math.floor(n / 2);

  const topApex = [0, 1.8, 0];
  const midTop = [
    [1.1, 0.12, 0],
    [0, 0.12, 0.8],
    [-1.1, 0.12, 0],
    [0, 0.12, -0.8],
  ];

  const bottomApex = [0, -1.8, 0];
  const midBottom = [
    [1.1, -0.12, 0],
    [0, -0.12, 0.8],
    [-1.1, -0.12, 0],
    [0, -0.12, -0.8],
  ];

  const sampleTri = (p1, p2, p3) => {
    let u = Math.random();
    let v = Math.random();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    return [
      u * p1[0] + v * p2[0] + w * p3[0],
      u * p1[1] + v * p2[1] + w * p3[1],
      u * p1[2] + v * p2[2] + w * p3[2],
    ];
  };

  for (let i = 0; i < half; i++) {
    const i3 = i * 3;
    const face = Math.floor(Math.random() * 4);
    const pt = sampleTri(topApex, midTop[face], midTop[(face + 1) % 4]);
    positions[i3] = pt[0];
    positions[i3 + 1] = pt[1];
    positions[i3 + 2] = pt[2];
  }

  for (let i = half; i < n; i++) {
    const i3 = i * 3;
    const face = Math.floor(Math.random() * 4);
    const pt = sampleTri(bottomApex, midBottom[face], midBottom[(face + 1) % 4]);
    positions[i3] = pt[0];
    positions[i3 + 1] = pt[1];
    positions[i3 + 2] = pt[2];
  }

  return normalizeShape(positions);
}

/**
 * 6. Semicircle (Half disc in XY plane)
 */
export function getSemicirclePositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const innerR = 0.5;
  const outerR = 1.3;

  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI;
    const r = Math.sqrt(Math.random() * (outerR * outerR - innerR * innerR) + innerR * innerR);

    positions[i3] = r * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(theta) - 0.4;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.12;
  }
  return normalizeShape(positions);
}

/**
 * 7. Torus (Donut)
 */
export function getTorusPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const majorR = 1.1;
  const minorR = 0.38;

  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;

    positions[i3] = (majorR + minorR * Math.cos(v)) * Math.cos(u);
    positions[i3 + 1] = (majorR + minorR * Math.cos(v)) * Math.sin(u);
    positions[i3 + 2] = minorR * Math.sin(v);
  }
  return normalizeShape(positions);
}

/**
 * 8. Pyramid (4-Sided Geometric Pyramid)
 */
export function getPyramidPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const b = 1.1;
  const apex = [0, 1.3, 0];
  const baseCorners = [
    [b, -0.9, b],
    [-b, -0.9, b],
    [-b, -0.9, -b],
    [b, -0.9, -b],
  ];

  const sampleTri = (p1, p2, p3) => {
    let u = Math.random();
    let v = Math.random();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    return [
      u * p1[0] + v * p2[0] + w * p3[0],
      u * p1[1] + v * p2[1] + w * p3[1],
      u * p1[2] + v * p2[2] + w * p3[2],
    ];
  };

  const sideCount = Math.floor(n * 0.75);
  for (let i = 0; i < sideCount; i++) {
    const i3 = i * 3;
    const f = Math.floor(Math.random() * 4);
    const pt = sampleTri(apex, baseCorners[f], baseCorners[(f + 1) % 4]);
    positions[i3] = pt[0];
    positions[i3 + 1] = pt[1];
    positions[i3 + 2] = pt[2];
  }

  for (let i = sideCount; i < n; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 2 * b;
    positions[i3 + 1] = -0.9;
    positions[i3 + 2] = (Math.random() - 0.5) * 2 * b;
  }

  return normalizeShape(positions);
}

/**
 * 9. DNA Double Helix
 */
export function getDnaPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const helixRadius = 0.9;
  const height = 2.6;
  const turns = 3.0;

  const strandsCount = Math.floor(n * 0.7);
  const rungsCount = n - strandsCount;

  for (let i = 0; i < strandsCount; i++) {
    const i3 = i * 3;
    const strand = i % 2 === 0 ? 0 : Math.PI;
    const t = (i / strandsCount) * 2 - 1;
    const y = t * (height / 2);
    const angle = t * Math.PI * turns + strand;

    positions[i3] = helixRadius * Math.cos(angle);
    positions[i3 + 1] = y;
    positions[i3 + 2] = helixRadius * Math.sin(angle);
  }

  const numRungs = 18;
  for (let i = 0; i < rungsCount; i++) {
    const i3 = (strandsCount + i) * 3;
    const rungIdx = Math.floor(Math.random() * numRungs);
    const t = (rungIdx / Math.max(1, numRungs - 1)) * 2 - 1;
    const y = t * (height / 2);
    const angle = t * Math.PI * turns;

    const s = Math.random() * 2 - 1;
    positions[i3] = s * helixRadius * Math.cos(angle);
    positions[i3 + 1] = y;
    positions[i3 + 2] = s * helixRadius * Math.sin(angle);
  }

  return normalizeShape(positions);
}

/**
 * 10. Heart (3D Parametric Heart)
 */
export function getHeartPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const t = Math.random() * Math.PI * 2;
    const x = 1.6 * Math.pow(Math.sin(t), 3);
    const y =
      1.3 * Math.cos(t) -
      0.5 * Math.cos(2 * t) -
      0.2 * Math.cos(3 * t) -
      0.1 * Math.cos(4 * t);

    const thickness = Math.max(0.1, 0.6 * (1 - Math.abs(x) / 1.7));
    const z = (Math.random() - 0.5) * 2 * thickness;

    positions[i3] = x * 0.75;
    positions[i3 + 1] = y * 0.75;
    positions[i3 + 2] = z * 0.75;
  }

  return normalizeShape(positions);
}

/**
 * 11. Star (5-Pointed 3D Faceted Star)
 */
export function getStarPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const rOut = 1.35;
  const rIn = 0.55;
  const numPoints = 5;

  const vertices = [];
  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (i * Math.PI) / numPoints - Math.PI / 2;
    const r = i % 2 === 0 ? rOut : rIn;
    vertices.push([r * Math.cos(angle), r * Math.sin(angle)]);
  }

  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const seg = Math.floor(Math.random() * (numPoints * 2));
    const v1 = vertices[seg];
    const v2 = vertices[(seg + 1) % (numPoints * 2)];

    const sqrtR1 = Math.sqrt(Math.random());
    const r2 = Math.random();

    const x = sqrtR1 * (1 - r2) * v1[0] + sqrtR1 * r2 * v2[0];
    const y = sqrtR1 * (1 - r2) * v1[1] + sqrtR1 * r2 * v2[1];

    const dist = Math.hypot(x, y);
    const zDepth = (1 - dist / rOut) * 0.45;
    const z = (Math.random() > 0.5 ? 1 : -1) * (zDepth * Math.random());

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }

  return normalizeShape(positions);
}

/**
 * 12. Infinity Symbol (Lemniscate of Bernoulli 3D Tube)
 */
export function getInfinityPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const a = 1.4;
  const tubeRadius = 0.18;

  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const t = Math.random() * Math.PI * 2;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    const cx = (a * Math.SQRT2 * Math.cos(t)) / denom;
    const cy = (a * Math.SQRT2 * Math.sin(t) * Math.cos(t)) / denom;

    const phi = Math.random() * Math.PI * 2;
    const r = Math.random() * tubeRadius;

    positions[i3] = cx + r * Math.cos(phi) * 0.6;
    positions[i3 + 1] = cy + r * Math.sin(phi) * 0.6;
    positions[i3 + 2] = r * Math.cos(phi);
  }

  return normalizeShape(positions);
}

/**
 * 13. Spiral Galaxy:
 * 3 logarithmic spiral arms with small random spread, thin in Z.
 */
export function getGalaxyPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const coreCount = Math.floor(n * 0.2);
  const armCount = n - coreCount;
  const numArms = 3;

  // Dense central core
  for (let i = 0; i < coreCount; i++) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 2.0) * 0.35;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = (Math.random() - 0.5) * 0.08;
    positions[i3 + 2] = r * Math.cos(phi);
  }

  // 3 Logarithmic spiral arms
  for (let i = 0; i < armCount; i++) {
    const i3 = (coreCount + i) * 3;
    const arm = Math.floor(Math.random() * numArms);
    const armOffset = (arm * Math.PI * 2) / numArms;

    const r = 0.35 + Math.pow(Math.random(), 0.75) * 1.25;
    const spiralAngle = r * 3.2 + armOffset;
    const scatter = (Math.random() - 0.5) * 0.16 * r;
    const theta = spiralAngle + scatter;
    const z = (Math.random() - 0.5) * (0.09 * (1.6 - r));

    positions[i3] = r * Math.cos(theta);
    positions[i3 + 1] = z;
    positions[i3 + 2] = r * Math.sin(theta);
  }

  return normalizeShape(positions);
}

/**
 * 14. Text / Logo: "DN" (Crisp procedural vector strokes)
 */
export function getTextLogoPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  const half = Math.floor(n / 2);

  // 'D'
  for (let i = 0; i < half; i++) {
    const i3 = i * 3;
    const isStem = Math.random() < 0.45;
    let x = 0, y = 0;
    if (isStem) {
      x = -0.85 + (Math.random() - 0.5) * 0.06;
      y = (Math.random() - 0.5) * 1.8;
    } else {
      const angle = (Math.random() - 0.5) * Math.PI;
      x = -0.85 + Math.cos(angle) * 0.65;
      y = Math.sin(angle) * 0.9;
    }
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  // 'N'
  for (let i = half; i < n; i++) {
    const i3 = i * 3;
    const stroke = Math.random();
    let x = 0, y = 0;
    if (stroke < 0.35) {
      x = 0.25 + (Math.random() - 0.5) * 0.06;
      y = (Math.random() - 0.5) * 1.8;
    } else if (stroke < 0.7) {
      x = 1.05 + (Math.random() - 0.5) * 0.06;
      y = (Math.random() - 0.5) * 1.8;
    } else {
      const t = Math.random();
      x = 0.25 + t * 0.8;
      y = 0.9 - t * 1.8;
    }
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  return normalizeShape(positions);
}

/**
 * Scatter Cloud (initial entrance)
 */
export function getRandomScatterPositions(count) {
  const n = count || 2500;
  const positions = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const r = 0.4 + Math.pow(Math.random(), 0.5) * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);
  }
  return normalizeShape(positions, 2.4);
}

/**
 * Master Shape Generator Map
 */
export const SHAPE_GENERATORS = {
  SPHERE: getSpherePositions,
  CIRCLE: getCirclePositions,
  CUBE: getCubePositions,
  HEXAGON: getHexagonPositions,
  ETHEREUM: getEthereumPositions,
  SEMICIRCLE: getSemicirclePositions,
  TORUS: getTorusPositions,
  PYRAMID: getPyramidPositions,
  DNA: getDnaPositions,
  HEART: getHeartPositions,
  STAR: getStarPositions,
  INFINITY: getInfinityPositions,
  GALAXY: getGalaxyPositions,
  DN: getTextLogoPositions,
};

/**
 * Global synchronous shape cache with validation
 */
const SHAPE_CACHE = new Map();

export function getLazyShapePositions(shapeId, count) {
  const safeCount = Number.isInteger(count) && count > 0 ? count : 2500;
  const key = `${shapeId}_${safeCount}`;

  if (SHAPE_CACHE.has(key)) {
    return SHAPE_CACHE.get(key);
  }

  const generator = SHAPE_GENERATORS[shapeId] || SHAPE_GENERATORS.SPHERE;
  const positions = generator(safeCount);

  // Validate shape buffer
  validateShape(shapeId, positions, safeCount);

  SHAPE_CACHE.set(key, positions);
  return positions;
}
