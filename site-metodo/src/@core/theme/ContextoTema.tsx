/**
 * Contexto de Tema Unificado
 * Sistema moderno de gerenciamento de temas para a aplicação
 */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme, ThemeName, getThemeByName, getNextTheme, lightTheme } from '../../styles/themes';

interface ThemeContextProps {
  currentTheme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
  setTheme: (name: ThemeName) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);

  // Carrega tema do localStorage na inicialização
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeName(savedTheme);
      setCurrentTheme(getThemeByName(savedTheme));
    }
  }, []);

  // Salva tema no localStorage quando muda
  useEffect(() => {
    localStorage.setItem('theme', themeName);
    setCurrentTheme(getThemeByName(themeName));
  }, [themeName]);

  const toggleTheme = () => {
    const nextTheme = getNextTheme(themeName);
    setThemeName(nextTheme.name as ThemeName);
  };

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  const isDarkMode = themeName === 'dark';

  const value: ThemeContextProps = {
    currentTheme,
    themeName,
    toggleTheme,
    setTheme,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

// Alias para compatibilidade com código legado
export const useTema = useTheme;
export const useUtilsTema = useTheme;
