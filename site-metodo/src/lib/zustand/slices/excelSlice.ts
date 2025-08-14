// Slice de estado para análise de arquivos Excel
// Mantém última análise realizada e aba ativa selecionada.
import { StateCreator } from 'zustand'
import type { DadosAnaliseExcel } from '@/types/analise-excel'

export interface ExcelAnalysisSlice {
  dadosAnaliseExcel: DadosAnaliseExcel | null
  abaPlanilhaAtiva: string | null
  setDadosAnaliseExcel: (dados: DadosAnaliseExcel | null) => void
  setAbaPlanilhaAtiva: (aba: string | null) => void
  clearAnaliseExcel: () => void
}

export const createExcelAnalysisSlice = <T extends ExcelAnalysisSlice>(): StateCreator<T, [], [], ExcelAnalysisSlice> => (set) => ({
  dadosAnaliseExcel: null,
  abaPlanilhaAtiva: null,
  setDadosAnaliseExcel: (dados) => set({ dadosAnaliseExcel: dados } as Partial<T>),
  setAbaPlanilhaAtiva: (aba) => set({ abaPlanilhaAtiva: aba } as Partial<T>),
  clearAnaliseExcel: () => set({ dadosAnaliseExcel: null, abaPlanilhaAtiva: null } as Partial<T>),
})
