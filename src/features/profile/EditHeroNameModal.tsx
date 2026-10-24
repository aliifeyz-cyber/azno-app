import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

interface EditHeroNameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditHeroNameModal: React.FC<EditHeroNameModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { heroName, updateHeroName } = useAuth();
  const [nameInput, setNameInput] = useState(heroName);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateHeroName(nameInput);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-200">
        <h4 className="text-sm font-bold text-gray-800 mb-2">تغییر نام همراه قهرمان</h4>
        <p className="text-xs text-gray-500 mb-4">
          می‌توانی هر نام دلخواهی برای همراهت بگذاری. این نام در تمام بخش‌های برنامه جایگزین خواهد شد.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="ازمن"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
            autoFocus
          />

          <div className="flex gap-2">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              ذخیره نام
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
