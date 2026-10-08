import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

export type DualPalette = 'corporate-blue' | 'classic-blue' | 'slate-blue';

export interface PaletteInfo {
  id: DualPalette;
  name: string;
  tag: string;
  primaryColor: string;
  secondaryColor: string;
  primaryName: string;
  secondaryName: string;
  gradientClass: string;
  gradientTextClass: string;
  borderClass: string;
  badgeClass: string;
  glowClass: string;
}

export const DUAL_PALETTES: Record<DualPalette, PaletteInfo> = {
  'corporate-blue': {
    id: 'corporate-blue',
    name: 'Royal Blue & Deep Navy',
    tag: 'Enterprise Executive',
    primaryColor: '#2563eb',
    secondaryColor: '#1e3a8a',
    primaryName: 'Royal Blue',
    secondaryName: 'Deep Navy',
    gradientClass: 'from-blue-600 to-blue-900',
    gradientTextClass: 'from-blue-600 to-blue-900',
    borderClass: 'border-blue-600/30',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    glowClass: 'shadow-blue-500/10',
  },
  'classic-blue': {
    id: 'classic-blue',
    name: 'Cobalt & Sapphire Blue',
    tag: 'Classic Corporate',
    primaryColor: '#1d4ed8',
    secondaryColor: '#0284c7',
    primaryName: 'Cobalt Blue',
    secondaryName: 'Sapphire',
    gradientClass: 'from-blue-700 to-sky-600',
    gradientTextClass: 'from-blue-700 to-sky-600',
    borderClass: 'border-blue-700/30',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    glowClass: 'shadow-blue-600/10',
  },
  'slate-blue': {
    id: 'slate-blue',
    name: 'Midnight Navy & Vibrant Blue',
    tag: 'Zero-Trust Blue',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    primaryName: 'Navy Blue',
    secondaryName: 'Vibrant Blue',
    gradientClass: 'from-blue-800 to-blue-500',
    gradientTextClass: 'from-blue-800 to-blue-500',
    borderClass: 'border-blue-800/30',
    badgeClass: 'bg-blue-50 text-blue-900 border-blue-300',
    glowClass: 'shadow-blue-700/10',
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  palette: DualPalette;
  paletteInfo: PaletteInfo;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setPalette: (palette: DualPalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('agentaccess_theme');
      // Always default to clean white & blue light theme
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [palette, setPaletteState] = useState<DualPalette>(() => {
    try {
      const saved = localStorage.getItem('agentaccess_palette') as DualPalette;
      return saved && DUAL_PALETTES[saved] ? saved : 'corporate-blue';
    } catch {
      return 'corporate-blue';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('agentaccess_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('agentaccess_palette', palette);
      const info = DUAL_PALETTES[palette] || DUAL_PALETTES['corporate-blue'];
      document.documentElement.setAttribute('data-palette', palette);
      document.documentElement.style.setProperty('--dual-primary', info.primaryColor);
      document.documentElement.style.setProperty('--dual-secondary', info.secondaryColor);
    } catch {}
  }, [palette]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setPalette = (newPalette: DualPalette) => {
    setPaletteState(newPalette);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        palette,
        paletteInfo: DUAL_PALETTES[palette] || DUAL_PALETTES['corporate-blue'],
        toggleTheme,
        setTheme,
        setPalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
