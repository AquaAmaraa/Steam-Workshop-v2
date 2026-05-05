import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredLanguage, setStoredLanguage } from '../lib/clientCookies';

const LanguageContext = createContext(null);

const dictionaries = {
  en: {
    common: {
      language: 'Language',
      english: 'English',
      mongolian: 'Mongolian',
      dashboard: 'Dashboard',
      myLearning: 'My Learning',
      signOut: 'Sign out',
      signIn: 'Sign in',
      getStarted: 'Get Started',
      activateKit: 'Activate Kit',
      kits: 'Kits',
      about: 'About',
      reviews: 'Reviews',
      contact: 'Contact',
      close: 'Close',
      completed: 'Completed',
    },
  },
  mn: {
    common: {
      language: 'Хэл',
      english: 'English',
      mongolian: 'Монгол',
      dashboard: 'Хяналтын самбар',
      myLearning: 'Миний сургалт',
      signOut: 'Гарах',
      signIn: 'Нэвтрэх',
      getStarted: 'Эхлэх',
      activateKit: 'Багц идэвхжүүлэх',
      kits: 'Багцууд',
      about: 'Бидний тухай',
      reviews: 'Сэтгэгдэл',
      contact: 'Холбоо барих',
      close: 'Хаах',
      completed: 'Дууссан',
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('mn');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = getStoredLanguage();
    if (saved === 'en' || saved === 'mn') {
      setLanguage(saved);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage: (nextLanguage) => {
      if (nextLanguage !== 'en' && nextLanguage !== 'mn') return;
      setLanguage(nextLanguage);
      setStoredLanguage(nextLanguage);
    },
    t: dictionaries[language],
    hydrated,
  }), [language, hydrated]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
