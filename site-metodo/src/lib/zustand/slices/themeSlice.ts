import { StateCreator } from 'zustand'
import { ThemeOption } from '../types'

export interface ThemeSlice {
  theme: ThemeOption
  setTheme: (t: ThemeOption) => void
  toggleTheme: () => void
}

export const createThemeSlice: StateCreator<any, [], [], ThemeSlice> = (_set, _get) => ({
  theme: 'system',
  setTheme: (t: ThemeOption) => _set({ theme: t }),
  toggleTheme: () => _set((state: any) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
})
