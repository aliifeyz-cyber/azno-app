import React from 'react';
import { Habit } from '../../data/types';
import { toPersianDigits } from '../../lib/persianDigits';

interface HabitCardProps {
  habit: Habit;
  onCheckIn: () => void;
  onSlip: () => void;
  onSkip: () => void;
  onSelect: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onCheckIn,
  onSlip,
  onSkip,
  onSelect,
}) => {
  const isDone = habit.statusToday === 'done';
  const isSlipped = habit.statusToday === 'slipped';
  const isSkipped = habit.statusToday === 'skipped';

  return (
    <div
      className={`bg-white rounded-2xl border p-4 transition-all ${
        isDone
          ? 'border-emerald-300 bg-emerald-50/30'
          : isSlipped
          ? 'border-amber-300 bg-amber-50/30'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between cursor-pointer" onClick={onSelect}>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-gray-800">{habit.title}</h4>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                habit.type === 'quit'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-emerald-50 text-[#2F7D6D] border border-emerald-200'
              }`}
            >
              {habit.type === 'quit' ? 'ترک عادت' : 'ساخت عادت'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>{habit.category}</span>
            <span>•</span>
            <span>
              استریک: <strong className="text-gray-800 font-semibold">{toPersianDigits(habit.currentStreak)} روز</strong>
            </span>
          </div>

          {habit.microStep && (
            <div className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
              <span className="text-[#2F7D6D]">▸</span>
              <span>ریزگام: {habit.microStep}</span>
            </div>
          )}
        </div>

        {/* Step progress tag if available */}
        {habit.currentStepTitle && (
          <div className="text-left">
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
              {toPersianDigits(habit.doneDaysInStep)} / {toPersianDigits(habit.targetDays)} روز
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        {habit.statusToday === 'none' ? (
          <>
            <button
              type="button"
              onClick={onCheckIn}
              className="flex-1 py-2 px-3 bg-[#2F7D6D] text-white hover:bg-[#256658] active:bg-[#1D5348] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>{habit.type === 'quit' ? 'امروز پاک بودم' : 'انجام دادم'}</span>
            </button>

            {habit.type === 'quit' && (
              <button
                type="button"
                onClick={onSlip}
                className="py-2 px-3 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-medium transition-colors"
              >
                لغزش داشتم
              </button>
            )}

            <button
              type="button"
              onClick={onSkip}
              className="py-2 px-3 text-gray-400 hover:text-gray-600 rounded-xl text-xs transition-colors"
              title="رد کردن امروز"
            >
              رد کردن
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {isDone && (
                <span className="text-[#2F7D6D] flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ثبت شد (انجام موفق)</span>
                </span>
              )}
              {isSlipped && (
                <span className="text-amber-600 flex items-center gap-1">
                  <span>لغزش ثبت شد (مسیر ادامه داره)</span>
                </span>
              )}
              {isSkipped && (
                <span className="text-gray-500 flex items-center gap-1">
                  <span>امروز رد شد (روز استراحت)</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onSelect}
              className="text-[11px] text-gray-500 hover:text-gray-700 underline"
            >
              مشاهده جزئیات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
