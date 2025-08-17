/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AppTheme = 'light' | 'dark';

type Ctx = {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (t: AppTheme) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = 'calorieClash.theme';

function getInitialTheme(): AppTheme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as AppTheme | null;
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* ignore */ }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(getInitialTheme);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    } catch { /* ignore */ }
  }, [theme]);

  const value = useMemo<Ctx>(
    () => ({ theme, isDark: theme === 'dark', toggleTheme: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')), setTheme }),
    [theme]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useAppTheme must be used within AppThemeProvider');
  return ctx;
}
