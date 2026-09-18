import React, { createContext, useContext, useState, useEffect } from 'react';
import mr from '../locales/mr.json';
import hi from '../locales/hi.json';
import en from '../locales/en.json';

const translations = { mr, hi, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('kaushalya_lang') || 'mr';
  });

  useEffect(() => {
    localStorage.setItem('kaushalya_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, fallback = '') => {
    const currentDict = translations[lang] || translations.en;
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
