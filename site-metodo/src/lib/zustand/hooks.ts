import useUIStore from './uiStore'
import { ThemeOption as _ThemeOption, CurrentUser as _CurrentUser } from './types'

export const useTheme = () => {
  const theme = useUIStore((state: any) => state.theme)
  const setTheme = useUIStore((state: any) => state.setTheme)
  const toggleTheme = useUIStore((state: any) => state.toggleTheme)
  return { theme, setTheme, toggleTheme }
}

export const useSidebarState = () => {
  const sidebarOpen = useUIStore((state: any) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state: any) => state.toggleSidebar)
  const setSidebarOpen = useUIStore((state: any) => state.setSidebarOpen)
  return { sidebarOpen, toggleSidebar, setSidebarOpen }
}

export const useSessionState = () => {
  const currentUser = useUIStore((state: any) => state.currentUser)
  const setCurrentUser = useUIStore((state: any) => state.setCurrentUser)
  const clearCurrentUser = useUIStore((state: any) => state.clearCurrentUser)
  return { currentUser, setCurrentUser, clearCurrentUser }
}

export const useModalState = () => {
  const openModal = useUIStore((state: any) => state.openModal)
  const closeModal = useUIStore((state: any) => state.closeModal)
  return { openModal, closeModal }
}

export const useExcelAnalysis = () => {
  const dadosAnaliseExcel = useUIStore((state: any) => state.dadosAnaliseExcel)
  const abaPlanilhaAtiva = useUIStore((state: any) => state.abaPlanilhaAtiva)
  const setDadosAnaliseExcel = useUIStore((state: any) => state.setDadosAnaliseExcel)
  const setAbaPlanilhaAtiva = useUIStore((state: any) => state.setAbaPlanilhaAtiva)
  const clearAnaliseExcel = useUIStore((state: any) => state.clearAnaliseExcel)
  return { dadosAnaliseExcel, abaPlanilhaAtiva, setDadosAnaliseExcel, setAbaPlanilhaAtiva, clearAnaliseExcel }
}
