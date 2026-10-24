import React, { useState } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { getTodayJalali } from '../../lib/jalali';
import { MOTIVATIONAL_PHRASES } from '../../content/motivationalPhrases';
import { AznoHero } from '../../components/ui/AznoHero';
import { EmptyState } from '../../components/ui/EmptyState';
import { DaylioMoodBar } from './DaylioMoodBar';
import { HabitCard } from './HabitCard';
import { SlipModal } from './SlipModal';
import { MoodNoteSheet } from './MoodNoteSheet';
import { Toast } from '../../components/ui/Toast';

interface TodayScreenProps {
  onSelectHabit: (habitId: string) => void;
  onCreateHabit: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  onSelectHabit,
  onCreateHabit,
}) => {
  const { habits, todayMood, setTodayMood, checkInHabit, slipHabit, undoHabit, lastUndoable, clearUndoable } = useHabits();
  const { heroName } = useAuth();
  const { t } = useContent();

  const [activeSlipHabitId, setActiveSlipHabitId] = useState<string | null>(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  // Pick a stable motivational phrase
  const phrase = MOTIVATIONAL_PHRASES[new Date().getDate() % MOTIVATIONAL_PHRASES.length];

  const slipTarget = habits.find((h) => h.id === activeSlipHabitId);

  const doneCount = habits.filter((h) => h.statusToday === 'done').length;

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-gray-400 block">{getTodayJalali()}</span>
          <h2 className="text-base font-bold text-gray-800 mt-0.5">
            سلام، با «{heroName}» آماده‌ای؟
          </h2>
          <p className="text-xs text-[#2F7D6D] font-medium mt-1 line-clamp-1">
            {phrase}
          </p>
        </div>
        <AznoHero pose={doneCount > 0 ? 'cheer' : 'confident'} size={72} name={heroName} />
      </div>

      {/* Daylio Mood Bar */}
      <DaylioMoodBar
        currentMood={todayMood}
        onSelectMood={setTodayMood}
        onOpenNote={() => setIsNoteOpen(true)}
      />

      {/* Habit Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800">
          {t('today.title')} ({habits.length})
        </h3>
        <button
          type="button"
          onClick={onCreateHabit}
          className="text-xs font-semibold text-[#2F7D6D] hover:underline flex items-center gap-1"
        >
          <span>+ عادت جدید</span>
        </button>
      </div>

      {/* Habit List or Empty State */}
      {habits.length === 0 ? (
        <EmptyState
          title={t('today.empty.title')}
          description={t('today.empty.desc')}
          actionLabel="+ ساخت اولین عادت"
          onAction={onCreateHabit}
          heroPose="determined"
          heroName={heroName}
        />
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onCheckIn={() => checkInHabit(habit.id, 'done')}
              onSlip={() => setActiveSlipHabitId(habit.id)}
              onSkip={() => checkInHabit(habit.id, 'skipped')}
              onSelect={() => onSelectHabit(habit.id)}
            />
          ))}
        </div>
      )}

      {/* Slip Modal */}
      {slipTarget && (
        <SlipModal
          isOpen={Boolean(activeSlipHabitId)}
          habitTitle={slipTarget.title}
          onClose={() => setActiveSlipHabitId(null)}
          onSubmit={(reason, note) => {
            slipHabit(slipTarget.id, reason, note);
            setActiveSlipHabitId(null);
          }}
        />
      )}

      {/* Mood Note Sheet */}
      <MoodNoteSheet
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        onSave={() => {
          // Saved into today's log notes
        }}
      />

      {/* Undo Toast Bar */}
      <Toast
        visible={Boolean(lastUndoable)}
        message={`وضعیت «${lastUndoable?.habitTitle}» ثبت شد.`}
        actionLabel="واگرد (Undo)"
        onAction={() => {
          if (lastUndoable) {
            undoHabit(lastUndoable.habitId);
          }
        }}
        onClose={clearUndoable}
      />
    </div>
  );
};
