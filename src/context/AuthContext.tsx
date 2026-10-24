import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../data/types';
import { HeroStyleKey } from '../content/azmanMessages';
import { profileRepository } from '../data/repositories/profileRepository';
import { localStorageAdapter } from '../data/storage/localStorageAdapter';

interface AuthContextType {
  profile: UserProfile;
  heroName: string;
  heroStyle: HeroStyleKey;
  loading: boolean;
  isLoggedIn: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (data: { heroName: string; heroStyle: HeroStyleKey }) => Promise<void>;
  updateHeroName: (newName: string) => Promise<void>;
  updateHeroStyle: (newStyle: HeroStyleKey) => Promise<void>;
  toggleTheme: () => Promise<void>;
  resetAllData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const p = await profileRepository.getProfile();
      setProfile(p);
      if (p.themeMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const login = async (displayName: string, email: string) => {
    if (!profile) return;
    const updated = await profileRepository.updateProfile({
      displayName: displayName.trim() || 'کاربر گرامی',
      email: email.trim(),
    });
    setProfile(updated);
  };

  const logout = async () => {
    // Return to initial uncompleted state
    await resetAllData();
  };

  const completeOnboarding = async (data: { heroName: string; heroStyle: HeroStyleKey }) => {
    if (!profile) return;
    const updated = await profileRepository.updateProfile({
      heroName: data.heroName.trim() || 'ازمن',
      heroStyle: data.heroStyle,
      onboardingCompleted: true,
    });
    setProfile(updated);
  };

  const updateHeroName = async (newName: string) => {
    if (!profile) return;
    const trimmed = newName.trim() || 'ازمن';
    const updated = await profileRepository.updateProfile({ heroName: trimmed });
    setProfile(updated);
  };

  const updateHeroStyle = async (newStyle: HeroStyleKey) => {
    if (!profile) return;
    const updated = await profileRepository.updateProfile({ heroStyle: newStyle });
    setProfile(updated);
  };

  const toggleTheme = async () => {
    if (!profile) return;
    const nextMode = profile.themeMode === 'dark' ? 'light' : 'dark';
    const updated = await profileRepository.updateProfile({ themeMode: nextMode });
    setProfile(updated);
    if (nextMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const resetAllData = async () => {
    setLoading(true);
    await localStorageAdapter.clear();
    await loadProfile();
    // Refresh page to guarantee clean state
    window.location.reload();
  };

  const heroName = profile?.heroName || 'ازمن';
  const heroStyle = profile?.heroStyle || 'friendly';

  return (
    <AuthContext.Provider
      value={{
        profile: profile!,
        heroName,
        heroStyle,
        loading,
        isLoggedIn: Boolean(profile?.onboardingCompleted),
        login,
        logout,
        completeOnboarding,
        updateHeroName,
        updateHeroStyle,
        toggleTheme,
        resetAllData,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
