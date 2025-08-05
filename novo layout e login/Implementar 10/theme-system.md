# Theme System with Styled Components

## styles/themes.ts

```typescript
export interface Theme {
  name: string;
  colors: {
    // Background colors
    background: string;
    surface: string;
    surfaceVariant: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textDisabled: string;
    
    // Primary colors
    primary: string;
    primaryHover: string;
    primaryActive: string;
    onPrimary: string;
    
    // Secondary colors
    secondary: string;
    secondaryHover: string;
    secondaryActive: string;
    onSecondary: string;
    
    // Border and outline colors
    border: string;
    borderFocus: string;
    outline: string;
    
    // Status colors
    error: string;
    errorHover: string;
    onError: string;
    warning: string;
    success: string;
    info: string;
    
    // Shadows
    shadow: string;
    shadowHover: string;
  };
  
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

// Light Theme (based on the provided light image)
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#F7F8FA',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F3F4',
    
    text: '#202124',
    textSecondary: '#5F6368',
    textDisabled: '#9AA0A6',
    
    primary: '#4285F4',
    primaryHover: '#3367D6',
    primaryActive: '#2B5CE6',
    onPrimary: '#FFFFFF',
    
    secondary: '#E8E8E8',
    secondaryHover: '#D9D9D9',
    secondaryActive: '#CCCCCC',
    onSecondary: '#202124',
    
    border: '#E8EAED',
    borderFocus: '#4285F4',
    outline: '#4285F4',
    
    error: '#EA4335',
    errorHover: '#D33B2C',
    onError: '#FFFFFF',
    warning: '#FBBC04',
    success: '#34A853',
    info: '#4285F4',
    
    shadow: 'rgba(60, 64, 67, 0.3)',
    shadowHover: 'rgba(60, 64, 67, 0.15)',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Dark Theme (based on the provided dark image)
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2D2D2D',
    
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textDisabled: '#666666',
    
    primary: '#BB86FC',
    primaryHover: '#A370E8',
    primaryActive: '#8B5CF6',
    onPrimary: '#000000',
    
    secondary: '#3C3C3C',
    secondaryHover: '#4A4A4A',
    secondaryActive: '#575757',
    onSecondary: '#FFFFFF',
    
    border: '#404040',
    borderFocus: '#BB86FC',
    outline: '#BB86FC',
    
    error: '#CF6679',
    errorHover: '#B85865',
    onError: '#000000',
    warning: '#FFB74D',
    success: '#81C784',
    info: '#64B5F6',
    
    shadow: 'rgba(0, 0, 0, 0.5)',
    shadowHover: 'rgba(0, 0, 0, 0.3)',
  },
  
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  typography: lightTheme.typography,
  transitions: lightTheme.transitions,
};

// Blue Theme
export const blueTheme: Theme = {
  ...lightTheme,
  name: 'blue',
  colors: {
    ...lightTheme.colors,
    background: '#E3F2FD',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F9FD',
    
    primary: '#1976D2',
    primaryHover: '#1565C0',
    primaryActive: '#0D47A1',
    
    secondary: '#E1F5FE',
    secondaryHover: '#B3E5FC',
    secondaryActive: '#81D4FA',
  },
};

// Green Theme
export const greenTheme: Theme = {
  ...lightTheme,
  name: 'green',
  colors: {
    ...lightTheme.colors,
    background: '#E8F5E8',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F8F1',
    
    primary: '#2E7D32',
    primaryHover: '#1B5E20',
    primaryActive: '#0D5016',
    
    secondary: '#E8F5E8',
    secondaryHover: '#C8E6C9',
    secondaryActive: '#A5D6A7',
  },
};

// Purple Theme
export const purpleTheme: Theme = {
  ...lightTheme,
  name: 'purple',
  colors: {
    ...lightTheme.colors,
    background: '#F3E5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F1F9',
    
    primary: '#7B1FA2',
    primaryHover: '#6A1B9A',
    primaryActive: '#4A148C',
    
    secondary: '#F3E5F5',
    secondaryHover: '#E1BEE7',
    secondaryActive: '#CE93D8',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
} as const;

export type ThemeName = keyof typeof themes;

export default themes;
```

## contexts/ThemeContext.tsx

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme, themes, ThemeName } from '../styles/themes';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light' 
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', themeName);
  }, [themeName]);

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  };

  const value: ThemeContextType = {
    theme: themes[themeName],
    themeName,
    setTheme,
    availableThemes: Object.keys(themes) as ThemeName[],
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={themes[themeName]}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
```

## styles/GlobalStyles.tsx

```typescript
'use client';

import { createGlobalStyle } from 'styled-components';
import { Theme } from './themes';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    transition: background-color ${({ theme }) => theme.transitions.normal},
                color ${({ theme }) => theme.transitions.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surfaceVariant};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textSecondary};
  }

  /* Focus visible styles for accessibility */
  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.outline};
    outline-offset: 2px;
  }
`;

export default GlobalStyles;
```