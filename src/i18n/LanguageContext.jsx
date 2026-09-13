import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';

const STORAGE_KEY = 'jttc-lang';

export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ne', label: 'नेपाली', short: 'ने' },
];

function detectInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ne') return saved;
  } catch {
    /* ignore */
  }
  try {
    if (navigator.language && navigator.language.toLowerCase().startsWith('ne')) return 'ne';
  } catch {
    /* ignore */
  }
  return 'en';
}

const LanguageContext = createContext(null);

/**
 * Bilingual engine (English + Nepali). Exposes:
 *  - `lang`          current language code ('en' | 'ne')
 *  - `setLang(code)` switch + persist language
 *  - `t(path)`       translate a UI string path, e.g. t('nav.home')
 *  - `isNe`          shortcut flag
 */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitial);

  const setLang = useCallback((code) => {
    if (code !== 'en' && code !== 'ne') return;
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.style.fontFeatureSettings = "'kern' 1";
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = useCallback(
    (path) => {
      const enDict = translations.en;
      const neDict = translations.ne;
      const key = path.split('.');
      let val = (neDict || enDict)[key[0]];
      for (let i = 1; i < key.length && val != null; i += 1) {
        val = val ? val[key[i]] : undefined;
      }
      if (val != null && typeof val === 'string') return val;
      // fallback to English
      val = enDict[key[0]];
      for (let i = 1; i < key.length && val != null; i += 1) {
        val = val ? val[key[i]] : undefined;
      }
      return typeof val === 'string' ? val : path;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t, isNe: lang === 'ne' }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}