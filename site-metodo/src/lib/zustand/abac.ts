import useUIStore from './uiStore'

/**
 * Aplica atributos ABAC do usuário ao estado UI.
 * Ex: atributos podem conter preferencias: { theme: 'dark', sidebarCollapsed: true }
 */
export function applyAbacAttributesToStore(store: { getState: () => any }, attrs: Record<string, unknown> | undefined) {
  if (!attrs) return

  const state = store.getState()
  const { setTheme, setSidebarOpen, setAllowedNavItems, setHiddenNavItems } = state as any

  if (typeof attrs.theme === 'string') {
    const t = attrs.theme as string
    if (t === 'dark' || t === 'light' || t === 'system') setTheme(t)
  }

  if (typeof attrs.sidebarCollapsed === 'boolean') {
    setSidebarOpen(!attrs.sidebarCollapsed)
  }

  if (Array.isArray((attrs as any).allowedNavItems)) {
    setAllowedNavItems((attrs as any).allowedNavItems.filter((x: unknown) => typeof x === 'string'))
  } else if (Array.isArray((attrs as any).hiddenNavItems)) {
    setHiddenNavItems((attrs as any).hiddenNavItems.filter((x: unknown) => typeof x === 'string'))
  }
}

// Versão que usa store global singleton
export function applyAbacAttributes(attrs: Record<string, unknown> | undefined) {
  applyAbacAttributesToStore(useUIStore, attrs)
}
