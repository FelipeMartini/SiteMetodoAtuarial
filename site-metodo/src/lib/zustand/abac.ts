import useUIStore from './uiStore'

/**
 * Aplica atributos ABAC do usuário ao estado UI.
 * Ex: atributos podem conter preferencias: { theme: 'dark', sidebarCollapsed: true }
 */
export function applyAbacAttributesToStore(store: { getState: () => any }, attrs: Record<string, unknown> | undefined) {
  if (!attrs) return

  const state = store.getState()
  const { setTheme, setSidebarOpen, setAllowedNavItems, setHiddenNavItems } = state as any
  const currentTheme = state.theme
  const currentSidebarOpen = state.sidebarOpen

  if (typeof attrs.theme === 'string') {
    const t = attrs.theme as string
    if ((t === 'dark' || t === 'light' || t === 'system') && t !== currentTheme) {
      setTheme(t)
    }
  }

  if (typeof attrs.sidebarCollapsed === 'boolean') {
    const target = !attrs.sidebarCollapsed
    if (target !== currentSidebarOpen) setSidebarOpen(target)
  }

  if (Array.isArray((attrs as any).allowedNavItems)) {
    const list = (attrs as any).allowedNavItems.filter((x: unknown) => typeof x === 'string')
    setAllowedNavItems(list)
  } else if (Array.isArray((attrs as any).hiddenNavItems)) {
    const list = (attrs as any).hiddenNavItems.filter((x: unknown) => typeof x === 'string')
    setHiddenNavItems(list)
  }
}

// Versão que usa store global singleton
export function applyAbacAttributes(attrs: Record<string, unknown> | undefined) {
  applyAbacAttributesToStore(useUIStore, attrs)
}
