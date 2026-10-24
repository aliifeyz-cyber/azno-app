import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { AznoHero, AzmanPose } from '../../components/ui/AznoHero';
import { Button } from '../../components/ui/Button';
import { HeroStyleKey, HERO_STYLES } from '../../content/azmanMessages';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { completeOnboarding, profile } = useAuth();
  const { t } = useContent();

  const [heroNameInput, setHeroNameInput] = useState(profile?.heroName || 'ازمن');
  const [selectedStyle, setSelectedStyle] = useState<HeroStyleKey>('friendly');
  const [currentPose, setCurrentPose] = useState<AzmanPose>('cheer');
  const [loading, setLoading] = useState(false);

  const poses: { pose: AzmanPose; label: string }[] = [
    { pose: 'cheer', label: 'شادی و جشن' },
    { pose: 'confident', label: 'مطمئن و بااراده' },
    { pose: 'determined', label: 'مصمم و متمرکز' },
    { pose: 'calm', label: 'آرام و همراه' },
  ];

  const handleFinish = async () => {
    setLoading(true);
    try {
      await completeOnboarding({
        heroName: heroNameInput.trim() || 'ازمن',
        heroStyle: selectedStyle,
      });
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4 max-w-lg mx-auto">
      <div className="pt-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('onboarding.welcome.title')}</h1>
        <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
          {t('onboarding.welcome.subtitle')}
        </p>

        {/* Character showcase */}
        <div className="mt-6 flex flex-col items-center">
          <AznoHero pose={currentPose} size={130} name={heroNameInput} />

          {/* Pose preview selector */}
          <div className="flex gap-2 mt-4">
            {poses.map((p) => (
              <button
                key={p.pose}
                type="button"
                onClick={() => setCurrentPose(p.pose)}
                className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors ${
                  currentPose === p.pose
                    ? 'border-[#2F7D6D] bg-emerald-50 text-[#2F7D6D] font-bold'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1">
            {t('onboarding.name_azman.label')}
          </label>
          <input
            type="text"
            value={heroNameInput}
            onChange={(e) => setHeroNameInput(e.target.value)}
            placeholder="ازمن"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
          />
          <span className="text-[10px] text-gray-400 mt-1 block">
            می‌توانی یک اسم اختصاصی برای همراه قهرمانت انتخاب کنی یا همان «ازمن» بمونه.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-2">
            سبک همراهی «{heroNameInput || 'ازمن'}»
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(HERO_STYLES) as HeroStyleKey[]).map((key) => {
              const item = HERO_STYLES[key];
              const isSelected = selectedStyle === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedStyle(key)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#2F7D6D] bg-[#2F7D6D]/10 text-[#2F7D6D] font-bold'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs">{item.title}</div>
                  <div className="text-[10px] text-gray-500 mt-1 line-clamp-2">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-6">
        <Button onClick={handleFinish} fullWidth size="lg" loading={loading}>
          {t('onboarding.start.btn')}
        </Button>
      </div>
    </div>
  );
};
