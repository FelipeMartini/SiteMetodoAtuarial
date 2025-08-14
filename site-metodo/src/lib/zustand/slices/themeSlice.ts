import { StateCreator } from 'zustand'
import { ThemeOption } from '../types'

export interface ThemeSlice {
  theme: ThemeOption
  setTheme: (t: ThemeOption) => void
  toggleTheme: () => void
}

// Fabrica genérica para permitir composição sem conflitos de tipo
export const createThemeSlice = <T extends ThemeSlice>(): StateCreator<T, [], [], ThemeSlice> => (set, get) => ({
  theme: 'system',
  setTheme: (t: ThemeOption) => set({ theme: t } as Partial<T>),
  toggleTheme: () => set(() => ({ theme: (get() as any).theme === 'dark' ? 'light' : 'dark' } as Partial<T>)),
})
