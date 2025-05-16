"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { i18n, Language, I18nType, defaultLanguage, detectBrowserLanguage } from './index';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: I18nType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem('smartimgs-language') as Language;
    
    // If no saved language, detect browser language
    const initialLanguage = savedLanguage || detectBrowserLanguage();
    
    setLanguage(initialLanguage);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Update localStorage when language changes (but only after initial load)
    if (isLoaded) {
      localStorage.setItem('smartimgs-language', language);
      
      // Also update html lang attribute
      document.documentElement.lang = language;
    }
  }, [language, isLoaded]);

  const value = {
    language,
    setLanguage,
    t: i18n[language]
  };

  // Don't render anything until we've determined the language
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
} 