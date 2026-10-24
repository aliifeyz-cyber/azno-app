import React from 'react';

export interface MoodItem {
  value: number; // 1 to 5 strictly
  label: string;
  emoji: string;
  color: string;
}

export const MOODS: MoodItem[] = [
  { value: 1, label: 'خیلی بد', emoji: '😣', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  { value: 2, label: 'بد', emoji: '🙁', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 3, label: 'معمولی', emoji: '😐', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 4, label: 'خوب', emoji: '🙂', color: 'bg-teal-100 text-teal-700 border-teal-300' },
  { value: 5, label: 'عالی', emoji: '😁', color: 'bg-emerald-100 text-emerald-800 border-emerald-400' },
];

interface MoodSelectorProps {
  selectedMood?: number;
  onSelectMood: (mood: number) => void;
  compact?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  compact = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-1 w-full">
      {MOODS.map((m) => {
        const isSelected = selectedMood === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onSelectMood(m.value)}
            className={`flex-1 flex flex-col items-center justify-center rounded-xl transition-all border ${
              compact ? 'py-1.5' : 'py-2.5'
            } ${
              isSelected
                ? 'border-[#2F7D6D] bg-[#2F7D6D] text-white scale-102'
                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className={compact ? 'text-lg' : 'text-2xl'}>{m.emoji}</span>
            {!compact && (
              <span className={`text-[11px] mt-1 font-medium ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                {m.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
