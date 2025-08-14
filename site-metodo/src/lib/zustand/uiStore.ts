"use client"

import { create, StateCreator } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { createThemeSlice, ThemeSlice } from './slices/themeSlice'
import { createSidebarSlice, SidebarSlice } from './slices/sidebarSlice'
import { createModalSlice, ModalSlice } from './slices/modalSlice'
import { createSessionSlice, SessionSlice } from './slices/sessionSlice'
import { ThemeOption as _ThemeOption, CurrentUser as _CurrentUser } from './types'

// Compondo slices para criar uma store modular e fácil de testar
export type UIState = ThemeSlice & SidebarSlice & ModalSlice & SessionSlice

// Cria a store combinando os slices e aplicando persistência apenas ao que for necessário
export const useUIStore = create<UIState>()(
  persist(
    ((set, get) => ({
      // ...theme slice
      ...createThemeSlice(set as any, get as any, undefined as any),
      // ...sidebar slice
      ...createSidebarSlice(set as any, get as any, undefined as any),
      // ...modal slice
      ...createModalSlice(set as any, get as any, undefined as any),
      // ...session slice
      ...createSessionSlice(set as any, get as any, undefined as any),
    })) as StateCreator<UIState, [], [], UIState>,
    {
      name: 'site-metodo-ui',
      storage: createJSONStorage(() => localStorage),
      // Persistimos apenas preferências de UI e estado de sidebar/tema
      partialize: (state: UIState) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
)

export default useUIStore
