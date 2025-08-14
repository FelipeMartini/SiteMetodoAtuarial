import useUIStore from './uiStore'
import { ThemeOption as _ThemeOption, CurrentUser as _CurrentUser } from './types'

export const useTheme = () => {
  const theme = useUIStore(state => state.theme)
  const setTheme = useUIStore(state => state.setTheme)
  const toggleTheme = useUIStore(state => state.toggleTheme)
  return { theme, setTheme, toggleTheme }
}

export const useSidebarState = () => {
  const sidebarOpen = useUIStore(state => state.sidebarOpen)
  const toggleSidebar = useUIStore(state => state.toggleSidebar)
  const setSidebarOpen = useUIStore(state => state.setSidebarOpen)
  return { sidebarOpen, toggleSidebar, setSidebarOpen }
}

export const useSessionState = () => {
  const currentUser = useUIStore(state => state.currentUser)
  const setCurrentUser = useUIStore(state => state.setCurrentUser)
  const clearCurrentUser = useUIStore(state => state.clearCurrentUser)
  return { currentUser, setCurrentUser, clearCurrentUser }
}

export const useModalState = () => {
  const openModal = useUIStore(state => state.openModal)
  const closeModal = useUIStore(state => state.closeModal)
  return { openModal, closeModal }
}

export const useExcelAnalysis = () => {
  const dadosAnaliseExcel = useUIStore(state => state.dadosAnaliseExcel)
  const abaPlanilhaAtiva = useUIStore(state => state.abaPlanilhaAtiva)
  const setDadosAnaliseExcel = useUIStore(state => state.setDadosAnaliseExcel)
  const setAbaPlanilhaAtiva = useUIStore(state => state.setAbaPlanilhaAtiva)
  const clearAnaliseExcel = useUIStore(state => state.clearAnaliseExcel)
  return { dadosAnaliseExcel, abaPlanilhaAtiva, setDadosAnaliseExcel, setAbaPlanilhaAtiva, clearAnaliseExcel }
}
