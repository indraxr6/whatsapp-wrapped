import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries } from './dictionaries';
import type { Language } from './dictionaries';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('ui_language') as Language;
    if (saved && (saved === 'en' || saved === 'id')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ui_language', lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>) => {
    const dict = dictionaries[language];
    let str = (dict as any)[key] ?? (dictionaries['en'] as any)[key] ?? key;
    
    if (replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        str = str.replace(`{{${k}}}`, String(v));
      }
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
