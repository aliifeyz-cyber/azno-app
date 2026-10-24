import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../features/auth/LoginScreen';
import { OnboardingScreen } from '../features/onboarding/OnboardingScreen';
import { TodayScreen } from '../features/today/TodayScreen';
import { CreateHabitScreen } from '../features/habits/CreateHabitScreen';
import { HabitDetailScreen } from '../features/habits/HabitDetailScreen';
import { CoachScreen } from '../features/coach/CoachScreen';
import { CommunityScreen } from '../features/community/CommunityScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';

// Bottom Navigation Bar
const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      path: '/',
      label: 'امروز',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? '2' : '1.75'} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      path: '/coach',
      label: 'مربی',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? '2' : '1.75'} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      path: '/community',
      label: 'همسفران',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? '2' : '1.75'} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      path: '/profile',
      label: 'پروفایل',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? '2' : '1.75'} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-[#2F7D6D]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.icon(isActive)}
              <span className={`text-[11px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Main Layout with Bottom Nav
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">{children}</main>
      <BottomNavBar />
    </div>
  );
};

// Habit Detail wrapper to extract params
const HabitDetailRouteWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return <HabitDetailScreen habitId={id || ''} onBack={() => navigate('/')} />;
};

export const AppRoutes: React.FC = () => {
  const { profile, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Route protection
  if (!profile.onboardingCompleted) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen onComplete={() => navigate('/')} />} />
        <Route path="/login" element={<LoginScreen onSuccess={() => navigate('/onboarding')} />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* 4 Main Shell Tabs */}
      <Route
        path="/"
        element={
          <MainLayout>
            <TodayScreen
              onSelectHabit={(id) => navigate(`/habits/${id}`)}
              onCreateHabit={() => navigate('/habits/new')}
            />
          </MainLayout>
        }
      />
      <Route
        path="/today"
        element={<Navigate to="/" replace />}
      />
      <Route
        path="/coach"
        element={
          <MainLayout>
            <CoachScreen />
          </MainLayout>
        }
      />
      <Route
        path="/community"
        element={
          <MainLayout>
            <CommunityScreen />
          </MainLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <MainLayout>
            <ProfileScreen />
          </MainLayout>
        }
      />

      {/* Habit Sub-routes */}
      <Route
        path="/habits/new"
        element={
          <MainLayout>
            <CreateHabitScreen
              onBack={() => navigate('/')}
              onCreated={(id) => navigate(`/habits/${id}`)}
            />
          </MainLayout>
        }
      />
      <Route
        path="/habits/:id"
        element={
          <MainLayout>
            <HabitDetailRouteWrapper />
          </MainLayout>
        }
      />

      {/* Auth & Onboarding fallbacks */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/onboarding" element={<Navigate to="/" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
