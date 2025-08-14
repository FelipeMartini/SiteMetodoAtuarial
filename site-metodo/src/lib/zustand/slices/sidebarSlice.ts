import { StateCreator } from 'zustand'

export interface SidebarSlice {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
}

export const createSidebarSlice: StateCreator<any, [], [], SidebarSlice> = (_set, _get) => ({
  sidebarOpen: true,
  toggleSidebar: () => _set((s: any) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v: boolean) => _set({ sidebarOpen: v }),
})
