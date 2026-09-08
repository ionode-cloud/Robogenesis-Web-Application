// High-fidelity, vector-based macOS system app icons for MacOSDock
import React from 'react';

/**
 * macOS Home Icon
 * Warm amber/orange gradient squircle with white architectural house silhouette.
 */
export function HomeIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    >
      <defs>
        <linearGradient id="home-grad-vivid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8a00" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <clipPath id="squircle-clip-home-vivid">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Radiant Sunset Orange Squircle */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#home-grad-vivid)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#fed7aa" strokeWidth="0.8" strokeOpacity="0.8" />

      {/* Top soft shine */}
      <ellipse cx="32" cy="12" rx="22" ry="7" fill="#ffffff" opacity="0.3" />

      <g clipPath="url(#squircle-clip-home-vivid)">
        {/* House Chimney */}
        <rect x="39" y="19" width="4.5" height="9" rx="1" fill="#ffffff" />

        {/* House Roof (Pitched Gable) */}
        <polygon points="32,16 15,29 17.5,32 32,20.5 46.5,32 49,29" fill="#ffffff" />

        {/* House Main Body */}
        <path
          d="M20 29 L44 29 L44 47 C44 48.5 42.5 50 41 50 L23 50 C21.5 50 20 48.5 20 47 Z"
          fill="#ffffff"
        />

        {/* House Doorway (Arch) */}
        <path
          d="M28 50 L28 39 C28 37 29.5 35 32 35 C34.5 35 36 37 36 39 L36 50 Z"
          fill="#ea580c"
        />

        {/* Circular Attic Window */}
        <circle cx="32" cy="27" r="2.5" fill="#ea580c" />
      </g>
    </svg>
  );
}

/**
 * macOS About Icon
 * Royal blue gradient squircle with glowing circular badge and clean 'i'.
 */
export function AboutIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    >
      <defs>
        <linearGradient id="about-grad-vivid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id="about-glow-vivid" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </radialGradient>
        <clipPath id="squircle-clip-about-vivid">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Royal Cobalt Sapphire Squircle */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#about-grad-vivid)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#93c5fd" strokeWidth="0.8" strokeOpacity="0.85" />

      {/* Glow Center */}
      <circle cx="32" cy="32" r="22" fill="url(#about-glow-vivid)" />

      {/* Top subtle sheen */}
      <ellipse cx="32" cy="12" rx="22" ry="7" fill="#ffffff" opacity="0.28" />

      <g clipPath="url(#squircle-clip-about-vivid)">
        {/* Outer Circular Emblem Ring */}
        <circle cx="32" cy="32" r="20" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.95" />

        {/* Info 'i' Dot */}
        <circle cx="32" cy="22" r="3" fill="#ffffff" />

        {/* Info 'i' Stem with Serifs */}
        <path
          d="M29 29 H34 V42 H37 V45 H27 V42 H30 V32 H29 Z"
          fill="#ffffff"
        />
      </g>
    </svg>
  );
}

/**
 * macOS Domains Icon
 * Cosmic ultraviolet / purple gradient squircle with connected global network nodes.
 */
export function DomainsIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    >
      <defs>
        <linearGradient id="domains-grad-vivid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="45%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
        <clipPath id="squircle-clip-domains-vivid">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Cyber Ultraviolet Purple Squircle */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#domains-grad-vivid)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#f5d0fe" strokeWidth="0.8" strokeOpacity="0.85" />

      {/* Top sheen */}
      <ellipse cx="32" cy="12" rx="22" ry="7" fill="#ffffff" opacity="0.28" />

      <g clipPath="url(#squircle-clip-domains-vivid)">
        {/* Outer Tech Network Circle */}
        <circle cx="32" cy="32" r="20" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.9" />

        {/* Latitude / Coordinate Ellipses */}
        <ellipse cx="32" cy="32" rx="20" ry="8" stroke="#ffffff" strokeWidth="1.3" strokeOpacity="0.75" />
        <ellipse cx="32" cy="32" rx="8" ry="20" stroke="#ffffff" strokeWidth="1.3" strokeOpacity="0.75" />

        {/* Central Core Pulse */}
        <circle cx="32" cy="32" r="4.2" fill="#ffffff" />

        {/* 4 Connected Domain Nodes */}
        <circle cx="32" cy="12" r="3" fill="#fdf4ff" stroke="#a855f7" strokeWidth="1" />
        <circle cx="32" cy="52" r="3" fill="#fdf4ff" stroke="#a855f7" strokeWidth="1" />
        <circle cx="12" cy="32" r="3" fill="#fdf4ff" stroke="#a855f7" strokeWidth="1" />
        <circle cx="52" cy="32" r="3" fill="#fdf4ff" stroke="#a855f7" strokeWidth="1" />
      </g>
    </svg>
  );
}


/**
 * 1. macOS Finder Icon
 * The hallmark icon of macOS: split-tone blue smiling face.
 */
export function FinderIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="finder-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="40%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="finder-left" x1="16" y1="12" x2="30" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="finder-right" x1="48" y1="12" x2="34" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <clipPath id="squircle-clip-finder">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Squircle base */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#finder-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#93c5fd" strokeWidth="0.75" />

      {/* Finder Face Group with clipping */}
      <g clipPath="url(#squircle-clip-finder)">
        {/* Left half face */}
        <path
          d="M6 10 C6 10 32 10 32 10 L32 28 C30 29 27 32 29 36 C30 38 32 39 32 40 L32 58 L6 58 Z"
          fill="url(#finder-left)"
        />
        {/* Right half face */}
        <path
          d="M58 10 C58 10 32 10 32 10 L32 28 C30 29 27 32 29 36 C30 38 32 39 32 40 L32 58 L58 58 Z"
          fill="url(#finder-right)"
        />

        {/* Nose divider line */}
        <path
          d="M32 10 L32 28 C28.5 29 25 33 28 37 C29.5 39 31.5 39.8 32 40 L32 58"
          stroke="#0f172a"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left Eye */}
        <ellipse cx="20" cy="24" rx="2.8" ry="4" fill="#0f172a" />
        {/* Right Eye */}
        <ellipse cx="44" cy="24" rx="2.8" ry="4" fill="#0f172a" />

        {/* Smile Arc */}
        <path
          d="M17 44 C24 53 40 53 47 44"
          stroke="#0f172a"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Top glossy sheen */}
        <path
          d="M2 2 H62 V22 C40 18 24 18 2 22 Z"
          fill="#ffffff"
          opacity="0.2"
        />
      </g>
    </svg>
  );
}

/**
 * 2. macOS Notes Icon
 * Yellow legal notepad with warm leather header & stitch line.
 */
export function NotesIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="notes-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="notes-header" x1="32" y1="2" x2="32" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <clipPath id="squircle-clip-notes">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Main squircle body */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#notes-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#fcd34d" strokeWidth="0.75" />

      <g clipPath="url(#squircle-clip-notes)">
        {/* Leather top bar */}
        <rect x="2" y="2" width="60" height="15" fill="url(#notes-header)" />
        {/* Stitch line */}
        <line x1="4" y1="14" x2="60" y2="14" stroke="#fef3c7" strokeWidth="1" strokeDasharray="2 2" opacity="0.65" />

        {/* Paper horizontal ruled lines */}
        <line x1="12" y1="23" x2="52" y2="23" stroke="#e2e8f0" strokeWidth="1.2" />
        <line x1="12" y1="30" x2="52" y2="30" stroke="#e2e8f0" strokeWidth="1.2" />
        <line x1="12" y1="37" x2="52" y2="37" stroke="#e2e8f0" strokeWidth="1.2" />
        <line x1="12" y1="44" x2="52" y2="44" stroke="#e2e8f0" strokeWidth="1.2" />
        <line x1="12" y1="51" x2="40" y2="51" stroke="#e2e8f0" strokeWidth="1.2" />

        {/* Left vertical margin line */}
        <line x1="18" y1="17" x2="18" y2="60" stroke="#fca5a5" strokeWidth="0.8" opacity="0.7" />

        {/* Diagonal Yellow Pencil with Eraser */}
        <g transform="translate(32, 26) rotate(35)">
          <rect x="0" y="0" width="6" height="24" rx="1" fill="#f59e0b" />
          <rect x="0" y="0" width="2" height="24" fill="#fbbf24" />
          {/* Metal band */}
          <rect x="0" y="20" width="6" height="3" fill="#cbd5e1" />
          {/* Pink eraser */}
          <path d="M0 23 C0 25 6 25 6 23 Z" fill="#f43f5e" />
          {/* Wood tip */}
          <polygon points="0,0 3,-5 6,0" fill="#fde68a" />
          {/* Graphite lead */}
          <polygon points="2,-3 3,-5 4,-3" fill="#1f2937" />
        </g>
      </g>
    </svg>
  );
}

/**
 * 3. macOS Terminal Icon
 * Dark space-gray console with macOS window traffic lights and glowing prompt.
 */
export function TerminalIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    >
      <defs>
        <linearGradient id="term-grad-vivid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f3f46" />
          <stop offset="35%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>
        <linearGradient id="term-header-vivid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#52525b" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>
        <clipPath id="squircle-clip-term-vivid">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Midnight Titanium Squircle */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#term-grad-vivid)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#71717a" strokeWidth="0.8" strokeOpacity="0.8" />

      <g clipPath="url(#squircle-clip-term-vivid)">
        {/* Title bar */}
        <rect x="2" y="2" width="60" height="15" fill="url(#term-header-vivid)" />
        <line x1="2" y1="17" x2="62" y2="17" stroke="#18181b" strokeWidth="0.8" />

        {/* 3 Window traffic lights */}
        <circle cx="11" cy="9.5" r="2.5" fill="#ef4444" />
        <circle cx="18" cy="9.5" r="2.5" fill="#f59e0b" />
        <circle cx="25" cy="9.5" r="2.5" fill="#10b981" />

        {/* Code / Command Prompt `>_` */}
        <path
          d="M12 27 L21 34 L12 41"
          stroke="#4ade80"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Glowing Cursor Block */}
        <rect x="26" y="37" width="11" height="3.5" rx="0.8" fill="#4ade80" />

        {/* Secondary command line in dimmer tone */}
        <line x1="12" y1="49" x2="36" y2="49" stroke="#71717a" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  );
}

/**
 * 4. macOS App Store Icon
 * Royal blue squircle with white drafting pencil, ruler, and paintbrush forming the 'A'.
 */
export function AppStoreIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="appstore-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <radialGradient id="appstore-glare" cx="32" cy="8" r="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#appstore-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#appstore-glare)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#60a5fa" strokeWidth="0.75" />

      {/* The Iconic 'A' Tools: Ruler, Brush, Pencil */}
      <g>
        {/* Arm 1: Ruler (bottom-left to top-right) */}
        <path
          d="M17 48 L44 14"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Ruler tick marks */}
        <line x1="24" y1="39" x2="26" y2="41" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" />
        <line x1="28" y1="34" x2="30" y2="36" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" />
        <line x1="32" y1="29" x2="34" y2="31" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" />
        <line x1="36" y1="24" x2="38" y2="26" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" />

        {/* Arm 2: Paintbrush (bottom-right to top-left) */}
        <path
          d="M47 48 L20 14"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Paintbrush metal ferrule notch */}
        <circle cx="23" cy="18" r="1.5" fill="#3b82f6" />

        {/* Crossbar: Pencil (horizontal bar) */}
        <path
          d="M14 38 L50 38"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Pencil tip notch */}
        <line x1="44" y1="36" x2="44" y2="40" stroke="#93c5fd" strokeWidth="1" />
      </g>
    </svg>
  );
}

/**
 * 5. macOS Messages Icon
 * Vibrant emerald-green squircle with crisp white curved speech bubble.
 */
export function MessagesIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    >
      <defs>
        <linearGradient id="msg-grad-vivid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="45%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <clipPath id="squircle-clip-msg-vivid">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Apple Messages Spring Emerald Green Squircle */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#msg-grad-vivid)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#bbf7d0" strokeWidth="0.8" strokeOpacity="0.85" />

      {/* Top soft shine */}
      <ellipse cx="32" cy="12" rx="22" ry="7" fill="#ffffff" opacity="0.3" />

      <g clipPath="url(#squircle-clip-msg-vivid)">
        {/* Speech bubble */}
        <path
          d="M14 30 C14 20.6 22 13 32 13 C42 13 50 20.6 50 30 C50 39.4 42 47 32 47 C29.2 47 26.5 46.4 24.1 45.3 L15 48.5 L17.5 40.5 C15.3 37.5 14 33.9 14 30 Z"
          fill="#ffffff"
        />
        {/* Interior message dots */}
        <circle cx="25" cy="30" r="2.4" fill="#22c55e" />
        <circle cx="32" cy="30" r="2.4" fill="#22c55e" />
        <circle cx="39" cy="30" r="2.4" fill="#22c55e" />
      </g>
    </svg>
  );
}

/**
 * 6. macOS Siri / Apple Intelligence Icon
 * Cosmic dark squircle with multi-color glowing neon orb (magenta/cyan/violet).
 */
export function SiriIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="siri-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
        <radialGradient id="siri-glow-magenta" cx="24" cy="24" r="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#ec4899" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="siri-glow-cyan" cx="40" cy="40" r="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <clipPath id="squircle-clip-siri">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#siri-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#3f3f46" strokeWidth="0.75" />

      <g clipPath="url(#squircle-clip-siri)">
        {/* Soft atmospheric glow circles */}
        <circle cx="26" cy="26" r="18" fill="url(#siri-glow-magenta)" />
        <circle cx="38" cy="38" r="18" fill="url(#siri-glow-cyan)" />

        {/* Central Siri Swirl Core */}
        <circle cx="32" cy="32" r="16" fill="none" stroke="#ec4899" strokeWidth="3.5" opacity="0.8" />
        <circle cx="32" cy="32" r="12" fill="none" stroke="#06b6d4" strokeWidth="3" opacity="0.85" />

        {/* Glowing Swirl Rings */}
        <path
          d="M19 32 C19 24 45 20 45 32 C45 44 19 40 19 32 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.8"
        />
        <path
          d="M24 22 C36 18 40 44 28 42 C16 40 20 22 24 22 Z"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          opacity="0.75"
        />

        {/* Bright luminous core flare */}
        <circle cx="32" cy="32" r="4.5" fill="#ffffff" />
        <circle cx="32" cy="32" r="7" fill="#ffffff" opacity="0.35" />
      </g>
    </svg>
  );
}

/**
 * 7. macOS Activity Monitor Icon
 * Dark graphite squircle with subtle technical grid and glowing neon-green pulse wave.
 */
export function ActivityMonitorIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="act-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>
        <clipPath id="squircle-clip-act">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#act-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#334155" strokeWidth="0.75" />

      <g clipPath="url(#squircle-clip-act)">
        {/* Technical coordinate grid */}
        <line x1="8" y1="20" x2="56" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="8" y1="32" x2="56" y2="32" stroke="#334155" strokeWidth="1" opacity="0.6" />
        <line x1="8" y1="44" x2="56" y2="44" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="20" y1="8" x2="20" y2="56" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="32" y1="8" x2="32" y2="56" stroke="#334155" strokeWidth="1" opacity="0.6" />
        <line x1="44" y1="8" x2="44" y2="56" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />

        {/* Outer Circular Tachometer Dial */}
        <circle cx="32" cy="32" r="23" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />

        {/* Outer Neon Glow Path */}
        <path
          d="M6 32 L22 32 L26 18 L31 46 L36 24 L40 37 L43 32 L58 32"
          stroke="#4ade80"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />

        {/* Crisp Pulse Core */}
        <path
          d="M6 32 L22 32 L26 18 L31 46 L36 24 L40 37 L43 32 L58 32"
          stroke="#4ade80"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 32 L22 32 L26 18 L31 46 L36 24 L40 37 L43 32 L58 32"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulse point spark */}
        <circle cx="31" cy="46" r="2.5" fill="#ffffff" />
      </g>
    </svg>
  );
}

/**
 * 8. macOS Wallet / Keychain Icon
 * Deep navy squircle with stacked metallic cards, gold chip, and shield emblem.
 */
export function WalletIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="wallet-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="card-blue" x1="16" y1="12" x2="48" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="card-front" x1="12" y1="22" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <clipPath id="squircle-clip-wallet">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#wallet-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#475569" strokeWidth="0.75" />

      <g clipPath="url(#squircle-clip-wallet)">
        {/* Back Card (Cyan/Blue) */}
        <rect x="14" y="14" width="36" height="24" rx="4" fill="url(#card-blue)" opacity="0.9" />
        <rect x="18" y="18" width="8" height="6" rx="1" fill="#fde047" opacity="0.7" />

        {/* Front Card (Graphite / Titanium) */}
        <rect x="10" y="24" width="44" height="28" rx="5" fill="url(#card-front)" stroke="#64748b" strokeWidth="1" />

        {/* Gold EMV Chip */}
        <rect x="16" y="32" width="9" height="7" rx="1.5" fill="#eab308" />
        <line x1="16" y1="35.5" x2="25" y2="35.5" stroke="#ca8a04" strokeWidth="0.6" />
        <line x1="20.5" y1="32" x2="20.5" y2="39" stroke="#ca8a04" strokeWidth="0.6" />

        {/* Security Shield / Crest */}
        <path
          d="M44 32 C44 32 40 31 38 31 C36 31 32 32 32 32 C32 38 36 43 38 45 C40 43 44 38 44 32 Z"
          fill="#f59e0b"
          opacity="0.9"
        />
        <path
          d="M38 33 L38 43 C39.5 41.5 42.5 37.8 42.5 33 Z"
          fill="#fbbf24"
        />

        {/* Card Number Line Hints */}
        <line x1="16" y1="44" x2="30" y2="44" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 9. macOS Maps Icon
 * Topographical map terrain with route ribbons and 3D red Apple map pin.
 */
export function MapsIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="map-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#dcfce7" />
        </linearGradient>
        <clipPath id="squircle-clip-map">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#map-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#86efac" strokeWidth="0.75" />

      <g clipPath="url(#squircle-clip-map)">
        {/* Ocean / Bay Water */}
        <path d="M40 2 C44 14 52 20 62 22 L62 2 Z" fill="#93c5fd" />
        <path d="M48 62 C52 50 56 46 62 44 L62 62 Z" fill="#93c5fd" />

        {/* Park Green Areas */}
        <path d="M2 38 C14 36 22 46 20 62 L2 62 Z" fill="#86efac" />
        <path d="M12 2 C16 12 26 14 30 2 Z" fill="#86efac" />

        {/* Highway Freeway Ribbon */}
        <path
          d="M2 18 C20 18 28 32 46 44 L62 50"
          stroke="#fde047"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M2 18 C20 18 28 32 46 44 L62 50"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Connecting Secondary Road */}
        <path
          d="M32 2 C32 24 16 38 2 46"
          stroke="#fed7aa"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 3D Apple Red Location Pin */}
        <g>
          {/* Ground pin shadow */}
          <ellipse cx="34" cy="42" rx="4" ry="2" fill="#1e293b" opacity="0.3" />
          {/* Pin Body */}
          <path
            d="M34 22 C29.6 22 26 25.6 26 30 C26 36 34 43 34 43 C34 43 42 36 42 30 C42 25.6 38.4 22 34 22 Z"
            fill="#ef4444"
          />
          {/* Pin center white dot */}
          <circle cx="34" cy="29" r="3.2" fill="#ffffff" />
        </g>
      </g>
    </svg>
  );
}

/**
 * 10. macOS Photos Icon
 * Porcelain white squircle with 8 translucent rainbow petals arranged radially.
 */
export function PhotosIcon({ className = '', style = {} }) {
  const petals = [
    { angle: 0, color: '#facc15' },   // Yellow (Top)
    { angle: 45, color: '#fb923c' },  // Orange
    { angle: 90, color: '#f87171' },  // Coral / Red
    { angle: 135, color: '#f43f5e' }, // Magenta
    { angle: 180, color: '#c084fc' }, // Purple
    { angle: 225, color: '#60a5fa' }, // Blue
    { angle: 270, color: '#38bdf8' }, // Cyan
    { angle: 315, color: '#4ade80' }, // Green
  ];

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="photos-grad-vivid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#photos-grad-vivid)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#cbd5e1" strokeWidth="0.8" strokeOpacity="0.8" />

      {/* 8 Radial Rainbow Petals */}
      <g transform="translate(32, 32)">
        {petals.map((petal, index) => (
          <g key={index} transform={`rotate(${petal.angle})`}>
            <path
              d="M0 -3 C-4.5 -7 -5 -16 0 -19 C5 -16 4.5 -7 0 -3 Z"
              fill={petal.color}
              opacity="0.88"
            />
          </g>
        ))}
        {/* Soft center hub */}
        <circle cx="0" cy="0" r="3" fill="#ffffff" />
      </g>
    </svg>
  );
}

/**
 * 11. macOS Safari Icon
 * Authentic compass dial with concentric tick marks and 3D faceted red/white needle.
 */
export function SafariIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="safari-bezel" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <radialGradient id="safari-dial" cx="32" cy="32" r="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
        <clipPath id="squircle-clip-safari">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Squircle base */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#safari-bezel)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#94a3b8" strokeWidth="0.75" />

      <g clipPath="url(#squircle-clip-safari)">
        {/* Blue Compass Dial Circle */}
        <circle cx="32" cy="32" r="26" fill="url(#safari-dial)" stroke="#ffffff" strokeWidth="1" />

        {/* Outer and Inner Compass Groove Rings */}
        <circle cx="32" cy="32" r="22" stroke="#ffffff" strokeWidth="0.6" opacity="0.4" />
        <circle cx="32" cy="32" r="16" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />

        {/* 16 Compass Tick Marks */}
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => {
          const isMajor = deg % 90 === 0;
          const isSemi = deg % 45 === 0;
          return (
            <line
              key={deg}
              x1="32"
              y1={isMajor ? '8' : isSemi ? '9' : '10'}
              x2="32"
              y2={isMajor ? '13' : '12'}
              stroke="#ffffff"
              strokeWidth={isMajor ? '1.5' : '1'}
              strokeLinecap="round"
              opacity={isMajor ? 0.95 : 0.6}
              transform={`rotate(${deg} 32 32)`}
            />
          );
        })}

        {/* 3D Faceted Needle Angled at 45° (North-West to South-East) */}
        <g transform="rotate(-45 32 32)">
          {/* Red North Half - Left Facet */}
          <polygon points="32,8 32,32 29,32" fill="#ef4444" />
          {/* Red North Half - Right Facet */}
          <polygon points="32,8 35,32 32,32" fill="#dc2626" />

          {/* White South Half - Left Facet */}
          <polygon points="32,56 32,32 29,32" fill="#f8fafc" />
          {/* White South Half - Right Facet */}
          <polygon points="32,56 35,32 32,32" fill="#cbd5e1" />

          {/* Needle Center Pin */}
          <circle cx="32" cy="32" r="2.8" fill="#ffffff" />
          <circle cx="32" cy="32" r="1.5" fill="#ef4444" />
        </g>
      </g>
    </svg>
  );
}

/**
 * macOS Products Icon (Hardware / Systems)
 * Radiant golden amber / topaz squircle with 3D isometric hardware container.
 */
export function ProductsIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    >
      <defs>
        <linearGradient id="prod-grad-vivid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <clipPath id="squircle-clip-prod-vivid">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Radiant Amber Topaz Squircle */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#prod-grad-vivid)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#fef08a" strokeWidth="0.8" strokeOpacity="0.9" />

      {/* Top soft shine */}
      <ellipse cx="32" cy="12" rx="22" ry="7" fill="#ffffff" opacity="0.32" />

      <g clipPath="url(#squircle-clip-prod-vivid)">
        {/* 3D Hardware Box Package */}
        <path d="M32 15 L49 24.5 L32 34 L15 24.5 Z" fill="#ffffff" />
        <path d="M15 24.5 L32 34 L32 50 L15 40.5 Z" fill="#fef3c7" />
        <path d="M32 34 L49 24.5 L49 40.5 L32 50 Z" fill="#fde68a" />
        {/* Center fold crease & seal */}
        <path d="M32 15 L32 34" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="32" cy="34" r="3.2" fill="#b45309" />
        <circle cx="32" cy="34" r="1.5" fill="#ffffff" />
      </g>
    </svg>
  );
}

/**
 * macOS Kinetic Hand Icon
 */
export function HandIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="hand-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#hand-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#bae6fd" strokeWidth="0.75" />
      <ellipse cx="32" cy="12" rx="22" ry="8" fill="#ffffff" opacity="0.25" />

      {/* Cybernetic Hand Silhouette */}
      <path
        d="M24 24 V18 C24 16.5 25.5 15 27 15 C28.5 15 30 16.5 30 18 V26
           M30 18 V15 C30 13.5 31.5 12 33 12 C34.5 12 36 13.5 36 15 V26
           M36 19 V16 C36 14.5 37.5 13 39 13 C40.5 13 42 14.5 42 16 V27
           M42 24 C42 23 43 22 44 22 C45 22 46 23 46 24 V34 C46 42 40 48 32 48 C24 48 20 42 20 36 V28 C20 26.5 21.5 25 23 25 C24 25 24 26 24 27 V30"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.2)"
      />
      <circle cx="32" cy="38" r="3" fill="#ffffff" />
      <circle cx="32" cy="38" r="1.5" fill="#0284c7" />
    </svg>
  );
}

/**
 * macOS Head Icon (A.R.I.A)
 */
export function HeadIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="head-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#head-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#e9d5ff" strokeWidth="0.75" />
      <ellipse cx="32" cy="12" rx="22" ry="8" fill="#ffffff" opacity="0.25" />

      {/* Cybernetic Head Contour */}
      <circle cx="32" cy="28" r="14" fill="rgba(255,255,255,0.15)" stroke="#ffffff" strokeWidth="2.5" />
      <path d="M24 40 L26 49 C26 50.5 28 52 32 52 C36 52 38 50.5 38 49 L40 40 Z" fill="#ffffff" />
      {/* Visor / Ocular Beam */}
      <rect x="24" y="24" width="16" height="5" rx="2.5" fill="#38bdf8" />
      <circle cx="32" cy="26.5" r="1.5" fill="#ffffff" />
    </svg>
  );
}

/**
 * macOS Brain Icon (Neural Mesh)
 */
export function BrainIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="brain-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#84cc16" />
          <stop offset="50%" stopColor="#65a30d" />
          <stop offset="100%" stopColor="#4d7c0f" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#brain-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#d9f99d" strokeWidth="0.75" />
      <ellipse cx="32" cy="12" rx="22" ry="8" fill="#ffffff" opacity="0.25" />

      {/* Synaptic Nodes & Mesh */}
      <path
        d="M26 22 C22 22 18 26 18 32 C18 37 21 41 25 44 C26 47 29 48 32 48 C35 48 38 47 39 44 C43 41 46 37 46 32 C46 26 42 22 38 22 C37 18 34 16 32 16 C30 16 27 18 26 22 Z"
        stroke="#ffffff"
        strokeWidth="2"
        fill="rgba(255,255,255,0.2)"
      />
      <line x1="32" y1="18" x2="32" y2="46" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="26" cy="30" r="2.5" fill="#ffffff" />
      <circle cx="38" cy="30" r="2.5" fill="#ffffff" />
      <circle cx="32" cy="38" r="2.5" fill="#ffffff" />
    </svg>
  );
}

/**
 * macOS Coin Icon (VaultShield Token)
 */
export function CoinIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="coin-bg" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#coin-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#fef08a" strokeWidth="0.75" />
      <ellipse cx="32" cy="12" rx="22" ry="8" fill="#ffffff" opacity="0.3" />

      {/* Gold Coin with Shield */}
      <circle cx="32" cy="32" r="19" stroke="#ffffff" strokeWidth="2.5" fill="rgba(255,255,255,0.15)" />
      <circle cx="32" cy="32" r="15" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" />
      <path
        d="M32 20 L40 24 V32 C40 37 36 41 32 43 C28 41 24 37 24 32 V24 Z"
        fill="#ffffff"
      />
      <path
        d="M32 23 L37 26 V31 C37 35 34 38 32 39.5 C30 38 27 35 27 31 V26 Z"
        fill="#ca8a04"
      />
    </svg>
  );
}

/**
 * macOS Web Development Icon (Globe / Modern Stack)
 */
export function WebDevIcon({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        <linearGradient id="webdev-grad-vivid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="45%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <radialGradient id="webdev-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <clipPath id="squircle-clip-webdev">
          <rect x="2" y="2" width="60" height="60" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Radiant Cyan Squircle */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#webdev-grad-vivid)" />
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" stroke="#a5f3fc" strokeWidth="0.8" strokeOpacity="0.85" />

      {/* Radial Glow */}
      <circle cx="32" cy="32" r="22" fill="url(#webdev-glow)" />

      {/* Top soft sheen */}
      <ellipse cx="32" cy="12" rx="22" ry="7" fill="#ffffff" opacity="0.32" />

      <g clipPath="url(#squircle-clip-webdev)">
        {/* Browser Window Chrome */}
        <rect x="13" y="16" width="38" height="32" rx="5" fill="#ffffff" fillOpacity="0.18" stroke="#ffffff" strokeWidth="1.8" />
        <line x1="13" y1="24" x2="51" y2="24" stroke="#ffffff" strokeWidth="1.4" />
        <circle cx="18" cy="20" r="1.5" fill="#ffffff" />
        <circle cx="23" cy="20" r="1.5" fill="#ffffff" />
        <circle cx="28" cy="20" r="1.5" fill="#ffffff" />

        {/* Code Brackets < / > */}
        <path d="M25 31 L20 36 L25 41" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M39 31 L44 36 L39 41" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="34" y1="30" x2="30" y2="42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}


