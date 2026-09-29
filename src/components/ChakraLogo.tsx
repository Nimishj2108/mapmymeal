import React from 'react';

export const AshokaChakraSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = ''
}) => {
  // Generate 24 spokes (every 15 degrees)
  const spokes = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24;
    return (
      <line
        key={i}
        x1="50"
        y1="50"
        x2="50"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        transform={`rotate(${angle} 50 50)`}
      />
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4.5" />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      {spokes}
    </svg>
  );
};

export const MapMyMealLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; showTagline?: boolean }> = ({
  size = 'md',
  showTagline = false
}) => {
  const pinSizes = {
    sm: { w: 32, h: 32, text: 'text-base' },
    md: { w: 38, h: 38, text: 'text-lg' },
    lg: { w: 52, h: 52, text: 'text-2xl' }
  };

  const current = pinSizes[size];

  return (
    <div className="flex items-center gap-2.5">
      {/* Saffron map-pin containing bowl with leaf and chakra */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={current.w}
          height={current.h}
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Saffron Pin Body */}
          <path
            d="M50 5C27.9 5 10 22.9 10 45C10 74 50 115 50 115C50 115 90 74 90 45C90 22.9 72.1 5 50 5Z"
            fill="#FF9933"
          />
          {/* White Circular Inner Basin */}
          <circle cx="50" cy="45" r="28" fill="#FFFFFF" />
          {/* Bowl Shape in India Green */}
          <path
            d="M32 45C32 55 40 63 50 63C60 63 68 55 68 45H32Z"
            fill="#138808"
          />
          {/* Sprouting Green Leaf */}
          <path
            d="M50 45C50 36 60 32 64 30C64 36 58 44 50 45Z"
            fill="#138808"
          />
          {/* Navy Ashoka Chakra Center Dot Motif */}
          <circle cx="50" cy="42" r="4.5" fill="#000080" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-[#000080] ${current.text}`}>
            Map My Meal
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-[#FF9933]">
            SIH 2026
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-500 font-medium tracking-tight">
            Locate · Share · Reduce · Nourish
          </span>
        )}
      </div>
    </div>
  );
};
