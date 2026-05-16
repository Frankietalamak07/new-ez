import React from 'react';

export const PremiumFootScan: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0062FF" />
        <stop offset="100%" stopColor="#00E5FF" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect x="20" y="20" width="60" height="60" rx="8" fill="rgba(0,98,255,0.05)" stroke="url(#scanGrad)" strokeWidth="0.5" />
    <path d="M40 30C35 35 32 45 32 55C32 65 35 75 40 80C45 85 55 85 60 80C65 75 68 65 68 55C68 45 65 35 60 30C55 25 45 25 40 30Z" 
          fill="url(#scanGrad)" fillOpacity="0.1" stroke="url(#scanGrad)" strokeWidth="2" filter="url(#glow)" />
    <line x1="20" y1="50" x2="80" y2="50" stroke="url(#scanGrad)" strokeWidth="0.5" strokeDasharray="2 2" className="animate-pulse" />
    <circle cx="45" cy="40" r="2" fill="#00E5FF" />
    <circle cx="55" cy="45" r="2" fill="#0062FF" />
    <circle cx="50" cy="65" r="3" fill="#00E5FF" fillOpacity="0.5" />
  </svg>
);

export const PremiumAlignment: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="alignGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0062FF" />
        <stop offset="100%" stopColor="#00E5FF" />
      </linearGradient>
    </defs>
    <path d="M50 20V80" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 20V80" stroke="url(#alignGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 5" />
    {[30, 45, 60, 75].map((y, i) => (
      <rect key={i} x="42" y={y-4} width="16" height="8" rx="2" fill="white" stroke="url(#alignGrad)" strokeWidth="1" />
    ))}
    <circle cx="50" cy="15" r="5" fill="url(#alignGrad)" />
  </svg>
);

export const PremiumInsole: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="insoleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <filter id="innertop" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feOffset dx="0" dy="1" />
        <feComposite in2="SourceAlpha" operator="in" />
      </filter>
    </defs>
    <path d="M30 40C30 30 40 25 50 25C60 25 70 30 70 40V70C70 85 60 90 50 90C40 90 30 85 30 70V40Z" 
          fill="url(#insoleGrad)" stroke="#334155" strokeWidth="1" />
    <path d="M35 50C35 45 40 42 50 42C60 42 65 45 65 50V65C65 72 60 75 50 75C40 75 35 72 35 65V50Z" 
          fill="#0062FF" fillOpacity="0.1" stroke="#0062FF" strokeWidth="0.5" />
    <circle cx="50" cy="35" r="2" fill="white" fillOpacity="0.2" />
  </svg>
);

export const PremiumHeatmap: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="30" fill="url(#heatGrad)" fillOpacity="0.2" />
    <circle cx="50" cy="50" r="20" fill="url(#heatGrad2)" />
    <defs>
      <radialGradient id="heatGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(30)">
        <stop offset="0" stopColor="#FF3D00" />
        <stop offset="1" stopColor="#FF3D00" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="heatGrad2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(20)">
        <stop offset="0" stopColor="#FFD600" />
        <stop offset="1" stopColor="#FFD600" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export const PremiumPulse: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 50H35L42 30L58 70L65 50H80" stroke="#0062FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-[pulse_1.5s_infinite]" />
  </svg>
);

