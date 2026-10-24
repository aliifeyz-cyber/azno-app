import React from 'react';

export type AzmanPose = 'confident' | 'cheer' | 'determined' | 'calm';

interface AznoHeroProps {
  pose?: AzmanPose;
  size?: number;
  className?: string;
  name?: string;
}

export const AznoHero: React.FC<AznoHeroProps> = ({
  pose = 'confident',
  size = 120,
  className = '',
  name,
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      title={name || 'ازمن'}
      aria-label={name || 'ازمن'}
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-none"
      >
        {/* White sticker contour background */}
        <ellipse cx="80" cy="80" rx="72" ry="72" fill="#FFFFFF" />

        {/* --- CAPE: Teal #2F7D6D --- */}
        {pose === 'cheer' && (
          <path
            d="M 50 78 C 30 110, 42 142, 62 140 C 72 139, 88 139, 98 140 C 118 142, 130 110, 110 78 Z"
            fill="#2F7D6D"
            stroke="#1D5348"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}
        {pose === 'confident' && (
          <path
            d="M 54 80 C 34 100, 30 135, 52 140 C 68 142, 92 142, 108 140 C 122 130, 118 100, 106 80 Z"
            fill="#2F7D6D"
            stroke="#1D5348"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}
        {pose === 'determined' && (
          <path
            d="M 50 82 C 28 98, 25 138, 55 142 C 70 144, 90 144, 105 142 C 135 138, 132 98, 110 82 Z"
            fill="#2F7D6D"
            stroke="#1D5348"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}
        {pose === 'calm' && (
          <path
            d="M 56 82 C 46 102, 48 136, 65 138 C 76 139, 84 139, 95 138 C 112 136, 114 102, 104 82 Z"
            fill="#2F7D6D"
            stroke="#1D5348"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}

        {/* --- LEGS --- */}
        <line x1="72" y1="126" x2="72" y2="146" stroke="#2D3748" strokeWidth="5" strokeLinecap="round" />
        <line x1="88" y1="126" x2="88" y2="146" stroke="#2D3748" strokeWidth="5" strokeLinecap="round" />

        {/* --- BODY --- */}
        <line x1="80" y1="78" x2="80" y2="126" stroke="#2D3748" strokeWidth="5" strokeLinecap="round" />

        {/* --- SPARK EMBLEM ON CHEST (Yellow-Gold #F59E0B) --- */}
        <g transform="translate(80, 95)">
          <path
            d="M 0 -8 L 2.5 -2.5 L 8 0 L 2.5 2.5 L 0 8 L -2.5 2.5 L -8 0 L -2.5 -2.5 Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="1"
          />
        </g>

        {/* --- ARMS ACCORDING TO POSE --- */}
        {pose === 'cheer' && (
          <g stroke="#2D3748" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            {/* Arms up cheering */}
            <path d="M 76 86 Q 58 75 48 54" />
            <path d="M 84 86 Q 102 75 112 54" />
          </g>
        )}
        {pose === 'confident' && (
          <g stroke="#2D3748" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            {/* One hand on hip, one friendly wave */}
            <path d="M 76 86 L 62 102 L 72 108" />
            <path d="M 84 86 Q 106 82 110 68" />
          </g>
        )}
        {pose === 'determined' && (
          <g stroke="#2D3748" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            {/* Hands on hips, elbows flared out */}
            <path d="M 76 86 L 56 100 L 72 108" />
            <path d="M 84 86 L 104 100 L 88 108" />
          </g>
        )}
        {pose === 'calm' && (
          <g stroke="#2D3748" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            {/* Hands gently folded in front */}
            <path d="M 76 86 Q 66 102 80 106" />
            <path d="M 84 86 Q 94 102 80 106" />
          </g>
        )}

        {/* --- HEAD (Round minimalist circle) --- */}
        <circle cx="80" cy="52" r="24" fill="#FFFFFF" stroke="#2D3748" strokeWidth="5" />

        {/* --- FACE DETAILS --- */}
        {pose === 'calm' ? (
          <>
            {/* Peaceful curved eyes (closed smiling) */}
            <path d="M 70 50 Q 73 47 76 50" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 84 50 Q 87 47 90 50" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Tiny gentle smile */}
            <path d="M 77 58 Q 80 61 83 58" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Two dot eyes */}
            <circle cx="73" cy="50" r="3" fill="#2D3748" />
            <circle cx="87" cy="50" r="3" fill="#2D3748" />
            {/* Tiny smile */}
            {pose === 'cheer' ? (
              <path d="M 75 58 Q 80 65 85 58 Z" fill="#2D3748" />
            ) : (
              <path d="M 76 58 Q 80 62 84 58" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" fill="none" />
            )}
          </>
        )}
      </svg>
    </div>
  );
};
