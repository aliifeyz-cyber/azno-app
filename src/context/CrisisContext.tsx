import React, { createContext, useContext, useState, useEffect } from 'react';
import { CrisisContact } from '../content/fallbackCrisisContacts';
import { crisisRepository } from '../data/repositories/crisisRepository';

interface CrisisContextType {
  contacts: CrisisContact[];
  loading: boolean;
}

const CrisisContext = createContext<CrisisContextType | null>(null);

export const CrisisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<CrisisContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const c = await crisisRepository.getContacts();
        setContacts(c);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <CrisisContext.Provider value={{ contacts, loading }}>
      {children}
    </CrisisContext.Provider>
  );
};

export const useCrisis = () => {
  const ctx = useContext(CrisisContext);
  if (!ctx) throw new Error('useCrisis must be used within CrisisProvider');
  return ctx;
};
