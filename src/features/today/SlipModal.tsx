import React, { useState } from 'react';
import { AznoHero } from '../../components/ui/AznoHero';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';

interface SlipModalProps {
  isOpen: boolean;
  habitTitle: string;
  onClose: () => void;
  onSubmit: (reason: string, note: string) => void;
}

const SLIP_REASONS = [
  'استرس یا اضطراب بالا',
  'خستگی و کمبود خواب',
  'موقعیت یا محیط وسوسه‌انگیز',
  'فشار اجتماعی یا دوستان',
  'فراموشی یا برنامه‌ریزی نامناسب',
  'بی‌انگیزگی موقت',
];

export const SlipModal: React.FC<SlipModalProps> = ({
  isOpen,
  habitTitle,
  onClose,
  onSubmit,
}) => {
  const { heroName } = useAuth();
  const { t } = useContent();
  const [selectedReason, setSelectedReason] = useState(SLIP_REASONS[0]);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedReason, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-200">
        <div className="flex flex-col items-center text-center mb-4">
          <AznoHero pose="calm" size={90} name={heroName} />
          <h3 className="text-base font-bold text-gray-900 mt-2">{t('slip.modal.title')}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {t('slip.modal.subtitle', { habit: habitTitle })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              چه عاملی باعث این لغزش شد؟
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SLIP_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedReason(r)}
                  className={`px-3 py-2 text-xs rounded-xl border text-right transition-colors ${
                    selectedReason === r
                      ? 'border-[#2F7D6D] bg-emerald-50 text-[#2F7D6D] font-bold'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              یادداشت کوتاه برای بار بعد (اختیاری)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثلاً: دفعه بعد وقتی خسته‌ام اول نیم ساعت چرت می‌زنم..."
              rows={2}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" fullWidth>
              ثبت تجربه و ادامه
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
