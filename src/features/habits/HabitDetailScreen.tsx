import React, { useState } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useAuth } from '../../context/AuthContext';
import { toPersianDigits } from '../../lib/persianDigits';
import { Button } from '../../components/ui/Button';

interface HabitDetailScreenProps {
  habitId: string;
  onBack: () => void;
}

export const HabitDetailScreen: React.FC<HabitDetailScreenProps> = ({
  habitId,
  onBack,
}) => {
  const { habits, deleteHabit } = useHabits();
  const { heroName } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const habit = habits.find((h) => h.id === habitId);

  if (!habit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">عادت مورد نظر یافت نشد.</p>
        <Button onClick={onBack} size="sm" className="mt-4">
          بازگشت
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteHabit(habit.id);
    onBack();
  };

  const progressPercentage = Math.min(
    100,
    Math.round((habit.doneDaysInStep / (habit.targetDays || 1)) * 100)
  );

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium"
        >
          <span>→ بازگشت به امروز</span>
        </button>
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full ${
            habit.type === 'quit'
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-emerald-50 text-[#2F7D6D] border border-emerald-200'
          }`}
        >
          {habit.type === 'quit' ? 'ترک عادت' : 'ساخت عادت'}
        </span>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900">{habit.title}</h2>
        <p className="text-xs text-gray-500 mt-1">{habit.category}</p>

        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
            <span className="text-[11px] text-gray-500 block">استریک فعلی</span>
            <span className="text-xl font-bold text-[#2F7D6D] mt-0.5 block">
              {toPersianDigits(habit.currentStreak)} <span className="text-xs font-normal">روز</span>
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
            <span className="text-[11px] text-gray-500 block">بهترین رکورد</span>
            <span className="text-xl font-bold text-gray-800 mt-0.5 block">
              {toPersianDigits(habit.bestStreak)} <span className="text-xs font-normal">روز</span>
            </span>
          </div>
        </div>

        {/* Step Progress */}
        {habit.currentStepTitle && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-gray-800">{habit.currentStepTitle}</span>
              <span className="text-gray-500">
                {toPersianDigits(habit.doneDaysInStep)} از {toPersianDigits(habit.targetDays)} روز
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2F7D6D] h-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Trigger and Micro-step */}
        {(habit.trigger || habit.microStep) && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
            {habit.trigger && (
              <div>
                <span className="text-gray-400 block text-[10px]">محرک یا لنگر:</span>
                <span className="text-gray-700">{habit.trigger}</span>
              </div>
            )}
            {habit.microStep && (
              <div>
                <span className="text-gray-400 block text-[10px]">ریزگام تعیین‌شده:</span>
                <span className="text-gray-700">{habit.microStep}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Logs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-xs font-bold text-gray-800 mb-3">تاریخچه ثبت‌ها ({toPersianDigits(habit.logs.length)})</h3>
        {habit.logs.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">هنوز ثبتی انجام نشده است.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {[...habit.logs].reverse().map((log, index) => {
              const statusMap = {
                done: { label: 'انجام شد', color: 'text-emerald-700 bg-emerald-50' },
                slipped: { label: 'لغزش', color: 'text-amber-700 bg-amber-50' },
                skipped: { label: 'رد شد', color: 'text-gray-500 bg-gray-100' },
                none: { label: 'ثبت نشده', color: 'text-gray-400 bg-gray-50' },
              }[log.status];

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{log.date}</span>
                    {log.note && <span className="text-[10px] text-gray-500 line-clamp-1">{log.note}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {log.mood && (
                      <span className="text-xs" title={`حال‌وهوا: ${log.mood}`}>
                        {['😣', '🙁', '😐', '🙂', '😁'][log.mood - 1]}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${statusMap.color}`}>
                      {statusMap.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Danger Zone: Delete Habit */}
      <div className="pt-2">
        {showDeleteConfirm ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
            <p className="text-xs font-bold text-rose-800 mb-2">
              آیا از حذف این عادت اطمینان داری؟ این عمل غیرقابل بازگشت است.
            </p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                انصراف
              </Button>
              <Button size="sm" variant="danger" onClick={handleDelete}>
                بله، حذف کن
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => setShowDeleteConfirm(true)}
            className="text-rose-500 hover:bg-rose-50"
          >
            حذف این عادت
          </Button>
        )}
      </div>
    </div>
  );
};
