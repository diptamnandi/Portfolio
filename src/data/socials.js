/**
 * Developer Social Links & Platform Profiles
 * Single Source of Truth for all social links across the portfolio.
 */

export const socials = [
  {
    id: "github",
    label: "GitHub",
    handle: "diptamnandi",
    url: "https://github.com/diptamnandi",
    icon: "github",
    tagline: "View my repositories",
    category: "Code & Repositories",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "diptam-nandi",
    url: "https://www.linkedin.com/in/diptam-nandi-b39452300/",
    icon: "linkedin",
    tagline: "Let's connect",
    category: "Professional Network",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    handle: "h4uuCKKtBL",
    url: "https://leetcode.com/u/h4uuCKKtBL/",
    icon: "code",
    tagline: "Solved problems",
    category: "Problem Solving",
  },
  {
    id: "x",
    label: "X",
    handle: "@DiptamNand60",
    url: "https://x.com/DiptamNand60",
    icon: "x",
    tagline: "Follow my thoughts",
    category: "Tech Discussions",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@diptam_nandi",
    url: "https://www.instagram.com/diptam_nandi/",
    icon: "instagram",
    tagline: "Behind the scenes",
    category: "Creative & Life",
  },
  {
    id: "email",
    label: "Email",
    handle: "diptamnandi76@gmail.com",
    url: "mailto:diptamnandi76@gmail.com",
    icon: "mail",
    tagline: "Send me a message",
    category: "Direct Transmission",
  },
  {
    id: "linktree",
    label: "Linktree",
    handle: "linktr.ee/diptamnandi",
    url: "https://linktr.ee/diptamnandi",
    icon: "link",
    tagline: "Everything in one place",
    category: "Unified Hub",
  },
];

/**
 * Dev-validated social resolver.
 * Logs a console warning in development mode if an invalid/missing social ID is requested.
 */
export function getSocial(id) {
  const item = socials.find((s) => s.id === id);
  if (!item && typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.warn(`[socials] Warning: Requested social ID "${id}" is missing from data/socials.js`);
  }
  return item;
}

/**
 * Obfuscated email link builder (Anti-Scraper protection)
 */
export function getEmailMailto() {
  const user = 'diptamnandi76';
  const domain = 'gmail.com';
  return `mailto:${user}@${domain}`;
}

// Backward-compatibility alias
export const SOCIAL_LINKS = socials;
