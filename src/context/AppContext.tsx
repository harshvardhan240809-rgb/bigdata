import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AppTheme = 'dark' | 'light';
export type AppLanguage = 'en' | 'hi' | 'bn' | 'mr' | 'ta' | 'te' | 'kn' | 'ml' | 'or' | 'gu' | 'as';

interface AppContextValue {
  selectedState: string;
  selectedDistrict: string;
  theme: AppTheme;
  language: AppLanguage;
  sidebarOpen: boolean;
  pendingAlerts: number;
  setSelectedState: (value: string) => void;
  setSelectedDistrict: (value: string) => void;
  setTheme: (value: AppTheme) => void;
  setLanguage: (value: AppLanguage) => void;
  setSidebarOpen: (value: boolean) => void;
  setPendingAlerts: (value: number) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedDistrict, setSelectedDistrict] = useState('All districts');
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAlerts, setPendingAlerts] = useState(3);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.lang = language;

    const body = document.body;
    body.dataset.theme = theme;
    body.style.background =
      theme === 'light'
        ? 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)'
        : 'radial-gradient(circle at top, rgba(14, 116, 144, 0.3), transparent 24%), radial-gradient(circle at 80% 15%, rgba(59, 130, 246, 0.14), transparent 18%), radial-gradient(circle at 20% 100%, rgba(37, 99, 235, 0.16), transparent 22%), #020817';
  }, [language, theme]);

  const value = useMemo<AppContextValue>(() => ({
    selectedState,
    selectedDistrict,
    theme,
    language,
    sidebarOpen,
    pendingAlerts,
    setSelectedState,
    setSelectedDistrict,
    setTheme,
    setLanguage,
    setSidebarOpen,
    setPendingAlerts,
  }), [language, pendingAlerts, selectedDistrict, selectedState, sidebarOpen, theme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}
