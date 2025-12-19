import React from 'react';

export const CyberTorii: React.FC<{ className?: string, size?: number }> = ({ className = "", size = 64 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="glow-torii" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="torii-gradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      <g filter="url(#glow-torii)">
        {/* Top Bar (Kasagi) - Perfectly Straight & Symmetrical */}
        <path d="M5 20 L95 20 L100 12 L0 12 Z" fill="url(#torii-gradient)" />
        
        {/* Second Bar (Shimaki) */}
        <rect x="15" y="28" width="70" height="6" fill="url(#torii-gradient)" />
        
        {/* Center Plaque (Gakuzuka) */}
        <path d="M46 15 L54 15 L54 32 L46 32 Z" fill="currentColor" />

        {/* Vertical Pillars (Hashira) - Straight */}
        <circle cx="28" cy="92" r="5" fill="currentColor" />
        <circle cx="72" cy="92" r="5" fill="currentColor" />
        <path d="M23 28 L23 92 L33 92 L33 28 Z" fill="url(#torii-gradient)" />
        <path d="M67 28 L67 92 L77 92 L77 28 Z" fill="url(#torii-gradient)" />
        
        {/* Base stones */}
        <rect x="20" y="92" width="16" height="4" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="64" y="92" width="16" height="4" rx="1" fill="currentColor" opacity="0.7" />
      </g>
    </svg>
  );
};