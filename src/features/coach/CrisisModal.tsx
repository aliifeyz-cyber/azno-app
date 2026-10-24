import React from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { useAuth } from '../../context/AuthContext';
import { AznoHero } from '../../components/ui/AznoHero';
import { Button } from '../../components/ui/Button';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  const { contacts } = useCrisis();
  const { heroName } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-200">
        <div className="flex flex-col items-center text-center mb-5">
          <AznoHero pose="calm" size={90} name={heroName} />
          <h3 className="text-lg font-bold text-gray-900 mt-2">تو تنها نیستی؛ همراهتیم</h3>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            سلامت و جان تو ارزشمندترین دارایی است. اگر احساس می‌کنی فشار روحی بیش از حد توان شده، لطفاً همین حالا با یکی از خطوط پشتیبانی رایگان و شبانه‌روزی زیر تماس بگیر:
          </p>
        </div>

        {/* Contacts list */}
        <div className="space-y-2.5 mb-5">
          {contacts.map((c) => (
            <a
              key={c.id}
              href={`tel:${c.number}`}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-gray-800 block">{c.name}</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">{c.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#2F7D6D] bg-white px-2.5 py-1 rounded-xl border border-gray-200 dir-ltr">
                  {c.number}
                </span>
                <span className="text-xs bg-[#2F7D6D] text-white px-2.5 py-1 rounded-xl font-medium">
                  تماس
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="text-[10px] text-gray-400 text-center mb-4 leading-normal">
          این شماره‌ها مراجع رسمی و تاییدشده هستند و تماس با آن‌ها در سراسر کشور رایگان و محرمانه است.
        </p>

        <Button variant="outline" fullWidth onClick={onClose}>
          متشکرم، برمی‌گردم به برنامه
        </Button>
      </div>
    </div>
  );
};
