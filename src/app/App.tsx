import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ContentProvider } from '../context/ContentContext';
import { AuthProvider } from '../context/AuthContext';
import { CrisisProvider } from '../context/CrisisContext';
import { HabitsProvider } from '../context/HabitsContext';
import { CoachProvider } from '../context/CoachContext';
import { CommunityProvider } from '../context/CommunityContext';
import { AppRoutes } from './routes';

export const AznoApp: React.FC = () => {
  return (
    <BrowserRouter>
      <ContentProvider>
        <AuthProvider>
          <CrisisProvider>
            <HabitsProvider>
              <CoachProvider>
                <CommunityProvider>
                  <AppRoutes />
                </CommunityProvider>
              </CoachProvider>
            </HabitsProvider>
          </CrisisProvider>
        </AuthProvider>
      </ContentProvider>
    </BrowserRouter>
  );
};

export default AznoApp;
