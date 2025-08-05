/**
 * Sistema de temas moderno para o projeto
 * Baseado no design system da implementação 10
 * Compatível com styled-components e design system reutilizável
 */

export interface Theme {
  name: string;
  colors: {
    // Background colors
    background: string;
    surface: string;
    surfaceVariant: string;
    backgroundSecondary: string;
    backgroundTertiary: string;

    // Text colors
    text: string;
    textSecondary: string;
    textDisabled: string;
    textTertiary: string;
    textInverted: string;

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
    borderHover: string;
    outline: string;

    // Status colors
    error: string;
    errorHover: string;
    errorBackground: string;
    onError: string;
    warning: string;
    warningBackground: string;
    success: string;
    successBackground: string;
    info: string;

    // Shadows
    shadow: string;
    shadowHover: string;
  };

  // Spacing (espaçamentos)
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };

  // Border Radius (bordas)
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };

  // Typography (tipografia)
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    fontWeight: {
      light: number;
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

  // Transitions (animações)
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };

  // Shadows (sombras)
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Light Theme
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#F7F8FA',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F3F4',
    backgroundSecondary: '#F5F5F5',
    backgroundTertiary: '#EEEEEE',

    text: '#202124',
    textSecondary: '#5F6368',
    textDisabled: '#9AA0A6',
    textTertiary: '#9CA3AF',
    textInverted: '#FFFFFF',

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
    borderHover: '#6B7280',
    outline: '#4285F4',

    error: '#EA4335',
    errorHover: '#D33B2C',
    errorBackground: '#FEE2E2',
    onError: '#FFFFFF',
    warning: '#FBBC04',
    warningBackground: '#FEF3C7',
    success: '#34A853',
    successBackground: '#D1FAE5',
    info: '#4285F4',

    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHover: 'rgba(0, 0, 0, 0.15)',
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
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50rem',
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
      '2xl': '1.75rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
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
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px rgba(0, 0, 0, 0.25)',
  },
};

// Dark Theme
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#0F0F23',
    surface: '#1A1A2E',
    surfaceVariant: '#252547',
    backgroundSecondary: '#1E1E3C',
    backgroundTertiary: '#2D2D55',

    text: '#FFFFFF',
    textSecondary: '#B8B8CC',
    textDisabled: '#8A8AAA',
    textTertiary: '#6B7280',
    textInverted: '#0F0F23',

    primary: '#6366F1',
    primaryHover: '#4F46E5',
    primaryActive: '#4338CA',
    onPrimary: '#FFFFFF',

    secondary: '#8B5CF6',
    secondaryHover: '#7C3AED',
    secondaryActive: '#6D28D9',
    onSecondary: '#FFFFFF',

    border: '#3C3C66',
    borderFocus: '#6366F1',
    borderHover: '#4F46E5',
    outline: '#6366F1',

    error: '#EF4444',
    errorHover: '#DC2626',
    errorBackground: '#991B1B',
    onError: '#FFFFFF',
    warning: '#F59E0B',
    warningBackground: '#92400E',
    success: '#10B981',
    successBackground: '#065F46',
    info: '#3B82F6',

    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowHover: 'rgba(0, 0, 0, 0.4)',
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
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50rem',
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
      '2xl': '1.75rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
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
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.2)',
    xl: '0 25px 50px rgba(0, 0, 0, 0.4)',
  },
};

// Theme Names Type
export type ThemeName = 'light' | 'dark';

// Available Themes
export const themes: Theme[] = [lightTheme, darkTheme];

// Default Theme
export const defaultTheme = lightTheme;

// Helper Functions
export const getThemeByName = (name: ThemeName): Theme => {
  return themes.find(theme => theme.name === name) || defaultTheme;
};

export const getNextTheme = (currentName: ThemeName): Theme => {
  const currentIndex = themes.findIndex(theme => theme.name === currentName);
  const nextIndex = (currentIndex + 1) % themes.length;
  return themes[nextIndex];
};

export const availableThemes = themes;
