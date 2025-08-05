// Slice de opções de tema - baseado no padrão ArchitectUI
// Gerencia configurações visuais do dashboard como cores, tema escuro/claro, etc.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Estado inicial do tema
interface ThemeOptionsState {
  // Configurações básicas de tema
  isDarkMode: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
  primaryColor: string;

  // Configurações de layout
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  headerFixed: boolean;
  footerFixed: boolean;

  // Configurações de componentes
  enableAnimations: boolean;
  enableBackgroundImage: boolean;
  backgroundImageOpacity: number;

  // Configurações de sidebar
  sidebarBackgroundColor: string;
  sidebarTextColor: 'light' | 'dark';
  sidebarShadow: boolean;

  // Configurações de header
  headerBackgroundColor: string;
  headerTextColor: 'light' | 'dark';
  headerShadow: boolean;

  // Configurações de página
  enablePageTitleIcon: boolean;
  enablePageTitleSubheading: boolean;
  enablePageTabsAlt: boolean;
}

const initialState: ThemeOptionsState = {
  // Valores padrão inspirados no ArchitectUI
  isDarkMode: false,
  colorScheme: 'light',
  primaryColor: '#3b82f6', // blue-500

  sidebarCollapsed: false,
  sidebarWidth: 280,
  headerFixed: true,
  footerFixed: false,

  enableAnimations: true,
  enableBackgroundImage: false,
  backgroundImageOpacity: 0.1,

  sidebarBackgroundColor: '#ffffff',
  sidebarTextColor: 'dark',
  sidebarShadow: true,

  headerBackgroundColor: '#ffffff',
  headerTextColor: 'dark',
  headerShadow: true,

  enablePageTitleIcon: true,
  enablePageTitleSubheading: true,
  enablePageTabsAlt: false,
};

export const themeOptionsSlice = createSlice({
  name: 'themeOptions',
  initialState,
  reducers: {
    // Toggle do modo escuro
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      state.colorScheme = state.isDarkMode ? 'dark' : 'light';

      // Ajustar cores automaticamente baseado no modo
      if (state.isDarkMode) {
        state.sidebarBackgroundColor = '#1f2937'; // gray-800
        state.headerBackgroundColor = '#111827'; // gray-900
        state.sidebarTextColor = 'light';
        state.headerTextColor = 'light';
      } else {
        state.sidebarBackgroundColor = '#ffffff';
        state.headerBackgroundColor = '#ffffff';
        state.sidebarTextColor = 'dark';
        state.headerTextColor = 'dark';
      }
    },

    // Definir esquema de cores
    setColorScheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.colorScheme = action.payload;
      state.isDarkMode = action.payload === 'dark';
    },

    // Definir cor primária
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },

    // Toggle da sidebar
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    // Definir largura da sidebar
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    },

    // Toggle do header fixo
    toggleHeaderFixed: (state) => {
      state.headerFixed = !state.headerFixed;
    },

    // Toggle do footer fixo
    toggleFooterFixed: (state) => {
      state.footerFixed = !state.footerFixed;
    },

    // Toggle das animações
    toggleAnimations: (state) => {
      state.enableAnimations = !state.enableAnimations;
    },

    // Toggle da imagem de fundo
    toggleBackgroundImage: (state) => {
      state.enableBackgroundImage = !state.enableBackgroundImage;
    },

    // Definir opacidade da imagem de fundo
    setBackgroundImageOpacity: (state, action: PayloadAction<number>) => {
      state.backgroundImageOpacity = Math.max(0, Math.min(1, action.payload));
    },

    // Configurações da sidebar
    setSidebarBackgroundColor: (state, action: PayloadAction<string>) => {
      state.sidebarBackgroundColor = action.payload;
    },

    setSidebarTextColor: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.sidebarTextColor = action.payload;
    },

    toggleSidebarShadow: (state) => {
      state.sidebarShadow = !state.sidebarShadow;
    },

    // Configurações do header
    setHeaderBackgroundColor: (state, action: PayloadAction<string>) => {
      state.headerBackgroundColor = action.payload;
    },

    setHeaderTextColor: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.headerTextColor = action.payload;
    },

    toggleHeaderShadow: (state) => {
      state.headerShadow = !state.headerShadow;
    },

    // Configurações de página
    togglePageTitleIcon: (state) => {
      state.enablePageTitleIcon = !state.enablePageTitleIcon;
    },

    togglePageTitleSubheading: (state) => {
      state.enablePageTitleSubheading = !state.enablePageTitleSubheading;
    },

    togglePageTabsAlt: (state) => {
      state.enablePageTabsAlt = !state.enablePageTabsAlt;
    },

    // Reset para configurações padrão
    resetTheme: () => initialState,
  },
});

// Export das actions
export const {
  toggleDarkMode,
  setColorScheme,
  setPrimaryColor,
  toggleSidebar,
  setSidebarWidth,
  toggleHeaderFixed,
  toggleFooterFixed,
  toggleAnimations,
  toggleBackgroundImage,
  setBackgroundImageOpacity,
  setSidebarBackgroundColor,
  setSidebarTextColor,
  toggleSidebarShadow,
  setHeaderBackgroundColor,
  setHeaderTextColor,
  toggleHeaderShadow,
  togglePageTitleIcon,
  togglePageTitleSubheading,
  togglePageTabsAlt,
  resetTheme,
} = themeOptionsSlice.actions;

export default themeOptionsSlice.reducer;
