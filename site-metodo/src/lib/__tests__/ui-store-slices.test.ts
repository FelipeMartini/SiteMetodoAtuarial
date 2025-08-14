import { act } from 'react'
import { create } from 'zustand'
import { createThemeSlice, ThemeSlice } from '../zustand/slices/themeSlice'
import { createSidebarSlice, SidebarSlice } from '../zustand/slices/sidebarSlice'
import { createNavigationSlice, NavigationSlice } from '../zustand/slices/navigationSlice'
import { createExcelAnalysisSlice, ExcelAnalysisSlice } from '../zustand/slices/excelSlice'
import { createSessionSlice, SessionSlice } from '../zustand/slices/sessionSlice'
import { applyAbacAttributesToStore } from '../zustand/abac'

// Estado combinado mínimo para testes isolados (evita dependência de persist)
type TestState = ThemeSlice & SidebarSlice & NavigationSlice & SessionSlice & ExcelAnalysisSlice

function buildTestStore() {
  return create<TestState>()((...a) => ({
    ...createThemeSlice<TestState>()(...a),
    ...createSidebarSlice<TestState>()(...a),
    ...createNavigationSlice<TestState>()(...a),
  ...createSessionSlice<TestState>()(...a),
  ...createExcelAnalysisSlice<TestState>()(...a),
  }))
}

describe('ui store slices', () => {
  it('alterna tema corretamente', () => {
    const store = buildTestStore()
    expect(store.getState().theme).toBe('system')
    act(() => store.getState().setTheme('dark'))
    expect(store.getState().theme).toBe('dark')
    act(() => store.getState().toggleTheme())
    expect(store.getState().theme).toBe('light')
  })

  it('controla sidebar', () => {
    const store = buildTestStore()
    expect(store.getState().sidebarOpen).toBe(true)
    act(() => store.getState().toggleSidebar())
    expect(store.getState().sidebarOpen).toBe(false)
    act(() => store.getState().setSidebarOpen(true))
    expect(store.getState().sidebarOpen).toBe(true)
  })

  it('controla menu mobile', () => {
    const store = buildTestStore()
    expect(store.getState().mobileMenuOpen).toBe(false)
    act(() => store.getState().toggleMobileMenu())
    expect(store.getState().mobileMenuOpen).toBe(true)
  })

  it('aplica atributos ABAC em nav items allowed', () => {
    const store = buildTestStore()
    act(() => {
      store.getState().setCurrentUser({ id: '1', email: 'a@b.com', attributes: { theme: 'dark', allowedNavItems: ['/', '/sobre'] } })
  applyAbacAttributesToStore(store, store.getState().currentUser?.attributes)
    })
    const st = store.getState()
    expect(st.theme).toBe('dark')
    expect(st.allowedNavItems).toEqual(['/', '/sobre'])
  })

  it('sanitiza currentUser (sem campos extras)', () => {
    const store = buildTestStore()
    // @ts-expect-error campo extra deve ser descartado
    act(() => store.getState().setCurrentUser({ id: 'x', email: 'e@e.com', attributes: { foo: 'bar' }, token: 'secret' }))
    const u = store.getState().currentUser
    expect(u && (u as any).token).toBeUndefined()
  })

  it('gerencia análise de Excel (dados e aba ativa)', () => {
    const store = buildTestStore()
    expect(store.getState().dadosAnaliseExcel).toBeNull()
    act(() => store.getState().setDadosAnaliseExcel({ planilhas: [{ nome: 'Plan1', colunas: ['A'], linhas: [{ numero: 1, celulas: [{ coluna: 'A', valor: 'X' }] }] }] }))
    expect(store.getState().dadosAnaliseExcel?.planilhas[0].nome).toBe('Plan1')
    act(() => store.getState().setAbaPlanilhaAtiva('Plan1'))
    expect(store.getState().abaPlanilhaAtiva).toBe('Plan1')
    act(() => store.getState().clearAnaliseExcel())
    expect(store.getState().dadosAnaliseExcel).toBeNull()
    expect(store.getState().abaPlanilhaAtiva).toBeNull()
  })
})
