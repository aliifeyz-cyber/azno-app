import React from 'react';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number | string;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onClick,
  count,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-[#2F7D6D] text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            active ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
