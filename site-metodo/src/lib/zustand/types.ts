export type ThemeOption = 'light' | 'dark' | 'system'

export type CurrentUser = {
  id: string
  email: string
  attributes?: Record<string, unknown>
}
