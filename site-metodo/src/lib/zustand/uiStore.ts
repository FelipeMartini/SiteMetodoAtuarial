"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createThemeSlice, ThemeSlice } from './slices/themeSlice'
import { createSidebarSlice, SidebarSlice } from './slices/sidebarSlice'
import { createModalSlice, ModalSlice } from './slices/modalSlice'
import { createSessionSlice, SessionSlice } from './slices/sessionSlice'
import { createNavigationSlice, NavigationSlice } from './slices/navigationSlice'
import { createExcelAnalysisSlice, ExcelAnalysisSlice } from './slices/excelSlice'

// Compondo slices para criar uma store modular e fácil de testar
export type UIState = ThemeSlice & SidebarSlice & ModalSlice & SessionSlice & NavigationSlice & ExcelAnalysisSlice

// Implementação SSR-safe baseada no padrão da pesquisa Medium/GitHub
const createUIStore = () => create<UIState>()(
  persist((set, get) => ({
    ...createThemeSlice<UIState>()(set, get, undefined as any),
    ...createSidebarSlice<UIState>()(set, get, undefined as any),
    ...createModalSlice<UIState>()(set, get, undefined as any),
    ...createSessionSlice<UIState>()(set, get, undefined as any),
    ...createNavigationSlice<UIState>()(set, get, undefined as any),
    // Estado de análise de Excel (não persistido para evitar grandes volumes em localStorage)
    ...createExcelAnalysisSlice<UIState>()(set, get, undefined as any),
  }),
  {
    name: 'site-metodo-ui',
    storage: createJSONStorage(() => localStorage),
    // Persistimos apenas preferências estáveis
    partialize: (state: UIState) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    // CORREÇÃO HIDRATAÇÃO: skipHydration evita mismatch inicial
    skipHydration: true,
  })
)

const useUIStore = createUIStore()

// Export both default and named export to satisfy different import styles across the repo
export { useUIStore }
export default useUIStore
