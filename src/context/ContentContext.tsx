import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_TEXTS_MAP, TextDef } from '../content/texts';
import { contentRepository } from '../data/repositories/contentRepository';
import { toPersianDigits } from '../lib/persianDigits';

interface ContentContextType {
  texts: Record<string, string>;
  textDefs: TextDef[];
  t: (key: string, params?: Record<string, string | number>) => string;
  updateText: (key: string, val: string) => Promise<void>;
  resetText: (key: string) => Promise<void>;
  resetAllTexts: () => Promise<void>;
  exportJson: () => Promise<string>;
  importJson: (json: string) => Promise<{ success: boolean; count: number; error?: string }>;
  loading: boolean;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [textDefs, setTextDefs] = useState<TextDef[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const allTexts = await contentRepository.getTexts();
      const defs = await contentRepository.getTextDefs();
      setTexts(allTexts);
      setTextDefs(defs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let str = texts[key] ?? DEFAULT_TEXTS_MAP[key]?.defaultValue ?? key;
    if (params) {
      Object.entries(params).forEach(([placeholder, val]) => {
        const stringVal = typeof val === 'number' ? toPersianDigits(val) : String(val);
        str = str.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), stringVal);
      });
    }
    return str;
  };

  const updateText = async (key: string, val: string) => {
    await contentRepository.updateText(key, val);
    setTexts((prev) => ({ ...prev, [key]: val }));
  };

  const resetText = async (key: string) => {
    await contentRepository.resetText(key);
    setTexts((prev) => ({ ...prev, [key]: DEFAULT_TEXTS_MAP[key]?.defaultValue ?? '' }));
  };

  const resetAllTexts = async () => {
    await contentRepository.resetAllTexts();
    const defaults = await contentRepository.getTexts();
    setTexts(defaults);
  };

  const exportJson = async () => {
    return contentRepository.exportJson();
  };

  const importJson = async (json: string) => {
    const res = await contentRepository.importJson(json);
    if (res.success) {
      await load();
    }
    return res;
  };

  return (
    <ContentContext.Provider
      value={{
        texts,
        textDefs,
        t,
        updateText,
        resetText,
        resetAllTexts,
        exportJson,
        importJson,
        loading,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
};
