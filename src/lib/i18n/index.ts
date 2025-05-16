import { en } from './en';
import { zh } from './zh';

export const i18n = {
  en,
  zh,
};

export type Language = keyof typeof i18n;
export type I18nType = typeof i18n.en;

export const defaultLanguage: Language = 'en';
export const languages: Record<Language, string> = {
  en: 'English',
  zh: '中文',
};

// Function to detect browser language
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }
  
  // Get browser language
  const browserLang = navigator.language.split('-')[0];
  
  // Check if the language is supported
  if (browserLang in i18n) {
    return browserLang as Language;
  }
  
  return defaultLanguage;
} 