import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createThemeSlice, ThemeSlice } from '../zustand/slices/themeSlice'
import { createSidebarSlice, SidebarSlice } from '../zustand/slices/sidebarSlice'
import { createNavigationSlice, NavigationSlice } from '../zustand/slices/navigationSlice'
import { createSessionSlice, SessionSlice } from '../zustand/slices/sessionSlice'

// Estado combinado igual ao de produção
type FullState = ThemeSlice & SidebarSlice & NavigationSlice & SessionSlice

declare const global: any

// Polyfill localStorage caso não exista (jsdom deve prover, mas garantimos)
if (typeof global.localStorage === 'undefined') {
  const store: Record<string, string> = {}
  global.localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
}

function buildPersistedStore() {
  return create<FullState>()(persist((...a) => ({
    ...createThemeSlice<FullState>()(...a),
    ...createSidebarSlice<FullState>()(...a),
    ...createNavigationSlice<FullState>()(...a),
    ...createSessionSlice<FullState>()(...a),
  }), {
    name: 'site-metodo-ui-test',
    storage: createJSONStorage(() => localStorage),
    partialize: (s: FullState) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen }),
  }))
}

describe('persistência ui store', () => {
  it('persiste apenas theme e sidebarOpen', () => {
    const store = buildPersistedStore()
    store.getState().setTheme('dark')
    store.getState().setSidebarOpen(false)
    store.getState().setAllowedNavItems(['/', '/sobre'])
    const raw = localStorage.getItem('site-metodo-ui-test')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw as string)
    expect(parsed.state).toMatchObject({ theme: 'dark', sidebarOpen: false })
    expect(parsed.state.allowedNavItems).toBeUndefined()
  })
})
