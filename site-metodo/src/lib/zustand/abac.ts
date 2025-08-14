import useUIStore from './uiStore'

/**
 * Aplica atributos ABAC do usuário ao estado UI.
 * Ex: atributos podem conter preferencias: { theme: 'dark', sidebarCollapsed: true }
 */
export function applyAbacAttributes(attrs: Record<string, unknown> | undefined) {
  if (!attrs) return

  const setTheme = useUIStore.getState().setTheme
  const setSidebarOpen = useUIStore.getState().setSidebarOpen

  if (typeof attrs.theme === 'string') {
    const t = attrs.theme as string
    if (t === 'dark' || t === 'light' || t === 'system') setTheme(t)
  }

  if (typeof attrs.sidebarCollapsed === 'boolean') {
    setSidebarOpen(!attrs.sidebarCollapsed)
  }
}
