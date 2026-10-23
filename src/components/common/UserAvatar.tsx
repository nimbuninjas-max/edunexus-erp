import React from 'react';

interface UserAvatarProps {
  id?: string;
  name?: string;
  size?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  id = 'STU-101',
  name = 'Student',
  size = 'w-12 h-12',
  className = ''
}) => {
  const palettes = [
    { bg: '#0E5A4F', shirt: '#E5DEC9', skin: '#F2C19E', hair: '#1A2421', accent: '#D4A359' },
    { bg: '#184E68', shirt: '#F5F0E6', skin: '#E8B48F', hair: '#231B18', accent: '#8AB0A9' },
    { bg: '#5C3A21', shirt: '#EAE2D3', skin: '#F4C6A8', hair: '#1C1A17', accent: '#C87D55' },
    { bg: '#2B4C3F', shirt: '#F7F3EB', skin: '#DFA682', hair: '#161F1C', accent: '#9CC5BE' },
    { bg: '#3E3659', shirt: '#F5F0E6', skin: '#F0BFA0', hair: '#221C29', accent: '#D5CBB8' }
  ];
  const num = parseInt(String(id).replace(/\D/g, '') || '1', 10);
  const pal = palettes[num % palettes.length];
  const isFemale = ['STU-102', 'STU-104', 'STU-106', 'STU-108', 'TCH-02', 'TCH-04'].includes(id);

  return (
    <div
      className={`${size} rounded-xl overflow-hidden border border-[#C5D6D1] shrink-0 relative shadow-2xs select-none ${className}`}
      style={{ backgroundColor: pal.bg }}
      title={name}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <circle cx="32" cy="32" r="30" fill={pal.bg} />
        <circle cx="52" cy="14" r="8" fill={pal.accent} fillOpacity="0.18" />
        {/* Shoulders & School Uniform Collar */}
        <path d="M12 64 C12 47, 52 47, 52 64 Z" fill={pal.shirt} />
        <path d="M24 49 L32 59 L40 49" fill="#072E29" />
        <path d="M30 53 L34 53 L33 64 L31 64 Z" fill="#8B2626" />
        {/* Neck */}
        <rect x="27" y="39" width="10" height="10" rx="4" fill={pal.skin} />
        {/* Back Hair for female */}
        {isFemale && <path d="M16 26 C14 42, 50 42, 48 26 Z" fill={pal.hair} />}
        {/* Head */}
        <circle cx="32" cy="28" r="12.5" fill={pal.skin} />
        {/* Hair */}
        {isFemale ? (
          <path d="M19 26 C19 13, 45 13, 45 26 C41 20, 23 20, 19 26 Z" fill={pal.hair} />
        ) : (
          <path d="M19 25 C19 13, 45 13, 45 25 C42 19, 22 19, 19 25 Z" fill={pal.hair} />
        )}
        {/* Eyes & Smile */}
        <circle cx="27.5" cy="27.5" r="1.5" fill="#1C2A27" />
        <circle cx="36.5" cy="27.5" r="1.5" fill="#1C2A27" />
        <path d="M28 33.5 Q32 36.5 36 33.5" stroke="#1C2A27" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};
