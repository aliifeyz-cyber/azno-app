import React, { useState } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useContent } from '../../context/ContentContext';
import { HabitType } from '../../data/types';
import { Button } from '../../components/ui/Button';

interface CreateHabitScreenProps {
  onBack: () => void;
  onCreated: (habitId: string) => void;
}

const CATEGORIES = ['سلامت و تندرستی', 'ورزش و تحرک', 'تمرکز و یادگیری', 'ذهن و آرامش', 'ترک عادت'];

export const CreateHabitScreen: React.FC<CreateHabitScreenProps> = ({
  onBack,
  onCreated,
}) => {
  const { createHabit } = useHabits();
  const { t } = useContent();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<HabitType>('build');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [trigger, setTrigger] = useState('');
  const [microStep, setMicroStep] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [escalationEnabled, setEscalationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const newHabit = await createHabit({
        title: title.trim(),
        type,
        category,
        currentStepTitle: 'گام ۱: تثبیت شروع',
        currentStepIndex: 0,
        targetDays: 7,
        trigger: trigger.trim() || undefined,
        microStep: microStep.trim() || undefined,
        reminderTime,
        showNameInReminder: true,
        // Rule: quit habits never escalate
        escalationEnabled: type === 'quit' ? false : escalationEnabled,
        steps: [
          {
            id: 's1',
            title: 'گام ۱: تثبیت شروع',
            targetDays: 7,
            startDate: new Date().toISOString().split('T')[0],
            status: 'active',
          },
        ],
      });
      onCreated(newHabit.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium"
        >
          <span>→ بازگشت</span>
        </button>
        <h2 className="text-base font-bold text-gray-800">ساخت عادت جدید</h2>
        <div className="w-12" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        {/* Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">نوع عادت</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('build')}
              className={`p-3 rounded-xl border text-center transition-all ${
                type === 'build'
                  ? 'border-[#2F7D6D] bg-emerald-50 text-[#2F7D6D] font-bold'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-xs">ساخت عادت مثبت</div>
              <div className="text-[10px] text-gray-500 mt-0.5">مثل ورزش، مطالعه یا آب نوشیدن</div>
            </button>

            <button
              type="button"
              onClick={() => setType('quit')}
              className={`p-3 rounded-xl border text-center transition-all ${
                type === 'quit'
                  ? 'border-rose-400 bg-rose-50 text-rose-700 font-bold'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-xs">ترک عادت ناپسند</div>
              <div className="text-[10px] text-gray-500 mt-0.5">مثل سیگار، قند مصنوعی یا اسکرول شبانه</div>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            عنوان عادت <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'build' ? 'مثال: مطالعه روزانه کتاب' : 'مثال: عدم مصرف دخانیات'}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">دسته‌بندی</label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                  category === cat
                    ? 'border-[#2F7D6D] bg-[#2F7D6D] text-white font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger (Habit Stacking) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            محرک یا لنگر رفتاری (اختیاری)
          </label>
          <input
            type="text"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            placeholder="مثال: بلافاصله بعد از نوشیدن قهوه صبح..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
          />
          <span className="text-[10px] text-gray-400 mt-0.5 block">
            اتصال عادت به یک کار روتین فعلی موفقیت را دوبرابر می‌کند.
          </span>
        </div>

        {/* Micro-Step */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            ریزگام شروع (شروع آن‌قدر آسان که نتوانید نه بگویید)
          </label>
          <input
            type="text"
            value={microStep}
            onChange={(e) => setMicroStep(e.target.value)}
            placeholder="مثال: فقط ۲ صفحه کتاب یا ۲ دقیقه پیاده‌روی"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
          />
        </div>

        {/* Reminder Time */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              زمان یادآوری
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
            />
          </div>

          {type === 'build' && (
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={escalationEnabled}
                  onChange={(e) => setEscalationEnabled(e.target.checked)}
                  className="rounded text-[#2F7D6D] focus:ring-0"
                />
                <span className="text-xs text-gray-700">یادآوری تشدیدشونده</span>
              </label>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" fullWidth loading={loading}>
            {t('habit.create.btn')}
          </Button>
        </div>
      </form>
    </div>
  );
};
