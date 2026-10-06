import React from 'react';
import { Mail, Award, Code2 } from 'lucide-react';

export function GithubIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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

export function LinkedinIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function InstagramIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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

export function XIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 4l16 16M4 20L20 4" />
    </svg>
  );
}

export function LeetCodeIcon({ size = 18, className = "" }) {
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

export function LinkIcon({ size = 18, className = "" }) {
  // Lucide-style Link icon (stroke 1.8).
  // Ready to be swapped with the official Linktree mark whenever supplied.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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
 * Universal dynamic icon resolver for social platforms
 */
export function SocialIcon({ iconName, size = 18, className = "" }) {
  switch (iconName?.toLowerCase()) {
    case 'github':
      return <GithubIcon size={size} className={className} />;
    case 'linkedin':
      return <LinkedinIcon size={size} className={className} />;
    case 'instagram':
      return <InstagramIcon size={size} className={className} />;
    case 'twitter':
    case 'x':
      return <XIcon size={size} className={className} />;
    case 'leetcode':
    case 'code':
      return <LeetCodeIcon size={size} className={className} />;
    case 'link':
    case 'linktree':
      return <LinkIcon size={size} className={className} />;
    case 'mail':
    case 'email':
      return <Mail size={size} className={className} />;
    case 'award':
      return <Award size={size} className={className} />;
    default:
      return <Code2 size={size} className={className} />;
  }
}

