import { StateCreator } from 'zustand'

export interface NavigationSlice {
  mobileMenuOpen: boolean
  allowedNavItems?: string[]
  hiddenNavItems?: string[]
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setAllowedNavItems: (items: string[] | undefined) => void
  setHiddenNavItems: (items: string[] | undefined) => void
}

export const createNavigationSlice = <T extends NavigationSlice>(): StateCreator<T, [], [], NavigationSlice> => (set) => ({
  mobileMenuOpen: false,
  allowedNavItems: undefined,
  hiddenNavItems: undefined,
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open } as Partial<T>),
  toggleMobileMenu: () => set(s => ({ mobileMenuOpen: !(s as any).mobileMenuOpen } as Partial<T>)),
  setAllowedNavItems: (items) => set({ allowedNavItems: items } as Partial<T>),
  setHiddenNavItems: (items) => set({ hiddenNavItems: items } as Partial<T>),
})
