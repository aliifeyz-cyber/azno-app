import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { AznoHero } from '../../components/ui/AznoHero';
import { Button } from '../../components/ui/Button';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { t } = useContent();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(name, email);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <AznoHero pose="confident" size={100} />
          <h1 className="text-xl font-bold text-gray-900 mt-4">{t('auth.login.title')}</h1>
          <p className="text-xs text-gray-500 mt-1">{t('auth.login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('auth.name.label')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: علی یا سارا"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ایمیل یا شماره همراه (اختیاری)
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
            />
          </div>

          <Button type="submit" fullWidth loading={loading} className="mt-2">
            {t('auth.submit.btn')}
          </Button>
        </form>

        <p className="text-[11px] text-gray-400 text-center mt-6">
          با ورود به برنامه، شرایط استفاده و حفظ حریم خصوصی ازنو را می‌پذیرید.
        </p>
      </div>
    </div>
  );
};
