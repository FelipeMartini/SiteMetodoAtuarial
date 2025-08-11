// Exemplo de navigationConfig tipado
export interface NavigationItem {
  label: string
  path: string
  icon?: string
  children?: NavigationItem[]
}
const navigationConfig: NavigationItem[] = []
export default navigationConfig
