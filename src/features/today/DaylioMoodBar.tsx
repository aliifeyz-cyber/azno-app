import React from 'react';
import { MoodSelector } from '../../components/ui/MoodSelector';

interface DaylioMoodBarProps {
  currentMood: number | null;
  onSelectMood: (mood: number) => void;
  onOpenNote?: () => void;
}

export const DaylioMoodBar: React.FC<DaylioMoodBarProps> = ({
  currentMood,
  onSelectMood,
  onOpenNote,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3.5 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-700">امروز حالت چطوره؟</span>
        {onOpenNote && (
          <button
            type="button"
            onClick={onOpenNote}
            className="text-[11px] text-[#2F7D6D] hover:underline flex items-center gap-1 font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>یادداشت حال</span>
          </button>
        )}
      </div>

      <MoodSelector
        selectedMood={currentMood || undefined}
        onSelectMood={onSelectMood}
      />
    </div>
  );
};
