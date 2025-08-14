"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeOption = 'light' | 'dark' | 'system'

interface UIState {
  theme: ThemeOption
  sidebarOpen: boolean
  // Estado corrente do usuário no client (somente informações não sensíveis)
  currentUser?: {
    id: string
    email: string
    attributes?: Record<string, unknown>
  }
  openModal: (id: string) => void
  closeModal: (id: string) => void
  toggleTheme: () => void
  setTheme: (t: ThemeOption) => void
  toggleSidebar: () => void
  setCurrentUser: (u?: { id: string; email: string; attributes?: Record<string, unknown> }) => void
  clearCurrentUser: () => void
}

// Store com persistência local (client-side) – mantém tipagem estrita
export const useUIStore = create<UIState>()(
  persist<UIState>(
    (set: (partial: Partial<UIState> | ((state: UIState) => Partial<UIState>)) => void) => ({
      theme: 'system',
      sidebarOpen: true,
  currentUser: undefined,
      openModal: (_id: string) => {
        // Implementação simples: poderia ser expandida para controladores de modais
        // deixamos placeholder para evitar any
        // eslint-disable-next-line no-console
        console.log('openModal', _id)
      },
      closeModal: (_id: string) => {
        // eslint-disable-next-line no-console
        console.log('closeModal', _id)
      },
      toggleTheme: () => set((state: UIState) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (t: ThemeOption) => set({ theme: t }),
      toggleSidebar: () => set((state: UIState) => ({ sidebarOpen: !state.sidebarOpen })),
  setCurrentUser: (u?: { id: string; email: string; attributes?: Record<string, unknown> }) => set({ currentUser: u }),
  clearCurrentUser: () => set({ currentUser: undefined }),
    }),
    {
      name: 'site-metodo-ui',
  // Retorna apenas os campos que queremos persistir (Partial é aceito pelo middleware)
  // cast mínimo para compatibilidade com a definição de tipos do persist
  partialize: ((state: UIState) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen })) as unknown as (state: UIState) => UIState,
    }
  )
)

export default useUIStore
