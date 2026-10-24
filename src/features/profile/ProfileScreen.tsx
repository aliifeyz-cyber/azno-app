import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { HERO_STYLES, HeroStyleKey } from '../../content/azmanMessages';
import { AznoHero } from '../../components/ui/AznoHero';
import { Button } from '../../components/ui/Button';
import { EditHeroNameModal } from './EditHeroNameModal';
import { AdminContentModal } from '../admin/AdminContentModal';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    heroName,
    heroStyle,
    updateHeroStyle,
    toggleTheme,
    resetAllData,
  } = useAuth();
  const { t } = useContent();

  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isAdminTextsOpen, setIsAdminTextsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-4">
      <h2 className="text-base font-bold text-gray-800">{t('profile.title')}</h2>

      {/* User Info Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#2F7D6D] flex items-center justify-center font-bold text-base border border-emerald-200">
            {profile.displayName.slice(0, 1)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{profile.displayName}</h3>
            <span className="text-[11px] text-gray-400 block">{profile.email || 'کاربر مهمان'}</span>
          </div>
        </div>

        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-[#2F7D6D] border border-emerald-200 font-semibold">
          پلن رایگان (پایه)
        </span>
      </div>

      {/* Companion Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-800">همراه قهرمان شما</h4>
          <button
            type="button"
            onClick={() => setIsEditNameOpen(true)}
            className="text-xs text-[#2F7D6D] font-semibold hover:underline"
          >
            تغییر نام
          </button>
        </div>

        <div className="flex items-center gap-4 py-2">
          <AznoHero pose="confident" size={80} name={heroName} />
          <div>
            <div className="text-base font-bold text-gray-900">«{heroName}»</div>
            <p className="text-xs text-gray-500 mt-0.5">
              استیکر قهرمان با شنل فیروزه‌ای (#2F7D6D) و نشان جرقه
            </p>
            <span className="text-[11px] text-[#2F7D6D] mt-1 inline-block font-medium">
              سبک گفتگو: {HERO_STYLES[heroStyle]?.title}
            </span>
          </div>
        </div>

        {/* Change Companion Style */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-700 block mb-2">
            انتخاب سبک رفتار و لحن «{heroName}»:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(HERO_STYLES) as HeroStyleKey[]).map((key) => {
              const item = HERO_STYLES[key];
              const isSelected = heroStyle === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => updateHeroStyle(key)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#2F7D6D] bg-emerald-50 text-[#2F7D6D] font-bold'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs">{item.title}</div>
                  <div className="text-[9px] text-gray-400 mt-0.5 line-clamp-1">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings & Appearance */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        <h4 className="text-xs font-bold text-gray-800">تنظیمات و ظاهر</h4>

        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-xs font-medium text-gray-800 block">حالت شب (تاریک)</span>
            <span className="text-[10px] text-gray-400">بهینه‌سازی برای مطالعه شبانه</span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              profile.themeMode === 'dark' ? 'bg-[#2F7D6D]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-none transform transition-transform ${
                profile.themeMode === 'dark' ? '-translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Developer & Content Tools */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        <h4 className="text-xs font-bold text-gray-800">مدیریت محتوا و توسعه‌دهنده</h4>

        <button
          type="button"
          onClick={() => setIsAdminTextsOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-[#2F7D6D] bg-gray-50 hover:bg-emerald-50/50 transition-colors text-right"
        >
          <div>
            <span className="text-xs font-bold text-gray-800 block">
              پنل مدیریت متن‌های اپلیکیشن
            </span>
            <span className="text-[10px] text-gray-500 block mt-0.5">
              ویرایش تمامی متون، درون‌ریزی و برون‌بری JSON بدون نیاز به آپدیت
            </span>
          </div>
          <span className="text-xs text-[#2F7D6D] font-bold">ورود ←</span>
        </button>

        {showResetConfirm ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center space-y-2">
            <p className="text-xs text-rose-800 font-semibold">
              تمام اطلاعات آزمایشی پاک شده و به حالت اولیه بازمی‌گردد. آیا تایید می‌کنید؟
            </p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" variant="ghost" onClick={() => setShowResetConfirm(false)}>
                انصراف
              </Button>
              <Button size="sm" variant="danger" onClick={resetAllData}>
                بله، بازنشانی کن
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full text-center py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium border border-rose-100"
          >
            بازنشانی داده‌های آزمایشی به حالت اولیه
          </button>
        )}
      </div>

      <div className="text-center pt-2 text-[10px] text-gray-400">
        نسخه وب ازنو ۱.۰.۰ • توسعه یافته با Vite + React + Tailwind
      </div>

      {/* Modals */}
      <EditHeroNameModal
        isOpen={isEditNameOpen}
        onClose={() => setIsEditNameOpen(false)}
      />

      <AdminContentModal
        isOpen={isAdminTextsOpen}
        onClose={() => setIsAdminTextsOpen(false)}
      />
    </div>
  );
};
