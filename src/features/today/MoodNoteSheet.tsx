import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

interface MoodNoteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  initialNote?: string;
}

export const MoodNoteSheet: React.FC<MoodNoteSheetProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNote = '',
}) => {
  const [note, setNote] = useState(initialNote);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">یادداشت احوال امروز</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="امروز چه اتفاقی افتاد؟ چه احساسی داشتی؟ نوشتن کمک می‌کنه ذهنت آروم بشه..."
            rows={4}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
            autoFocus
          />

          <div className="flex gap-2">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              بستن
            </Button>
            <Button type="submit" fullWidth>
              ذخیره یادداشت
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
