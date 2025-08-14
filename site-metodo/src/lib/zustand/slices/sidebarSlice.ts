import { StateCreator } from 'zustand'

export interface SidebarSlice {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
}

export const createSidebarSlice = <T extends SidebarSlice>(): StateCreator<T, [], [], SidebarSlice> => (set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !(s as any).sidebarOpen } as Partial<T>)),
  setSidebarOpen: (v: boolean) => set({ sidebarOpen: v } as Partial<T>),
})
