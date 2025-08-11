/**
 * Store Zustand para gerenciamento de estado dos cálculos atuariais
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  MortalityTable,
  LifeInsuranceParams,
  AnnuityParams,
  MortalityCalculations,
  LifeInsuranceCalculations,
  AnnuityCalculations,
} from './calculations'
import { AVAILABLE_TABLES } from './sample-data'

// Tipos para o store
interface CalculationResult {
  id: string
  type: 'life-insurance' | 'annuity' | 'mortality-analysis'
  timestamp: Date
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
  description: string
}

interface ActuarialState {
  // Tabelas de mortalidade
  mortalityTables: MortalityTable[]
  selectedTable: MortalityTable | null

  // Histórico de cálculos
  calculationHistory: CalculationResult[]

  // Estado da aplicação
  isCalculating: boolean
  lastError: string | null

  // Configurações padrão
  defaultInterestRate: number
  defaultLoadingRate: number

  // Actions para tabelas de mortalidade
  addMortalityTable: (table: MortalityTable) => void
  selectMortalityTable: (tableName: string) => void
  removeMortalityTable: (tableName: string) => void
  initializeDefaultTables: () => void

  // Actions para cálculos
  calculateLifeInsurance: (params: LifeInsuranceParams) => Promise<void>
  calculateAnnuity: (params: AnnuityParams) => Promise<void>
  calculateMortalityAnalysis: (tableId: string, age: number) => Promise<void>

  clearCalculationHistory: () => void
  removeCalculation: (id: string) => void

  setDefaultInterestRate: (rate: number) => void
  setDefaultLoadingRate: (rate: number) => void

  setError: (error: string | null) => void
  clearError: () => void
}

export const useActuarialStore = create<ActuarialState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      mortalityTables: AVAILABLE_TABLES,
      selectedTable: AVAILABLE_TABLES[0] || null,
      calculationHistory: [],
      isCalculating: false,
      lastError: null,
      defaultInterestRate: 0.06,
      defaultLoadingRate: 0.15,

      // Actions para tabelas de mortalidade
      addMortalityTable: (table: MortalityTable) => {
        set(state => ({
          mortalityTables: [...state.mortalityTables, table],
          lastError: null,
        }))
      },

      selectMortalityTable: (tableName: string) => {
        const state = get()
        const table = state.mortalityTables.find(t => t.name === tableName)
        if (table) {
          set({ selectedTable: table, lastError: null })
        } else {
          set({ lastError: `Tabela ${tableName} não encontrada` })
        }
      },

      removeMortalityTable: (tableName: string) => {
        set(state => ({
          mortalityTables: state.mortalityTables.filter(t => t.name !== tableName),
          selectedTable: state.selectedTable?.name === tableName ? null : state.selectedTable,
          lastError: null,
        }))
      },

      initializeDefaultTables: () => {
        set(state => {
          if (state.mortalityTables.length === 0) {
            return {
              mortalityTables: AVAILABLE_TABLES,
              selectedTable: AVAILABLE_TABLES[0] || null,
              lastError: null,
            }
          }
          return state
        })
      },

      // Cálculo de seguro de vida
      calculateLifeInsurance: async (params: LifeInsuranceParams) => {
        set({ isCalculating: true, lastError: null })

        try {
          const presentValue = LifeInsuranceCalculations.presentValueLifeInsurance(params)
          const annualPremium = LifeInsuranceCalculations.annualPremium(params)

          const result: CalculationResult = {
            id: crypto.randomUUID(),
            type: 'life-insurance',
            timestamp: new Date(),
            description: `Seguro de Vida - ${params.mortalityTable.name} - Idade ${params.age}`,
            inputs: {
              age: params.age,
              insuranceAmount: params.insuranceAmount,
              premiumPaymentPeriod: params.premiumPaymentPeriod,
              interestRate: params.interestRate,
              mortalityTableName: params.mortalityTable.name,
              loading: params.loading,
            },
            outputs: {
              presentValue,
              annualPremium,
              monthlyPremium: annualPremium / 12,
              totalPremiums: annualPremium * params.premiumPaymentPeriod,
              netPresentValue: presentValue - annualPremium * params.premiumPaymentPeriod,
              loadingAmount: annualPremium * (params.loading || 0),
              effectiveRate: (annualPremium * params.premiumPaymentPeriod) / params.insuranceAmount,
            },
          }

          set(state => ({
            calculationHistory: [result, ...state.calculationHistory],
            isCalculating: false,
          }))
        } catch (_error) {
          set({
            isCalculating: false,
            lastError: error instanceof Error ? _error.message : 'Erro no cálculo do seguro de vida',
          })
        }
      },

      // Cálculo de anuidade
      calculateAnnuity: async (params: AnnuityParams) => {
        set({ isCalculating: true, lastError: null })

        try {
          const presentValue = AnnuityCalculations.presentValueLifeAnnuity(params)
          const temporaryValue10 = AnnuityCalculations.presentValueTemporaryAnnuity(params, 10)
          const temporaryValue20 = AnnuityCalculations.presentValueTemporaryAnnuity(params, 20)

          const result: CalculationResult = {
            id: crypto.randomUUID(),
            type: 'annuity',
            timestamp: new Date(),
            description: `Anuidade - ${params.mortalityTable.name} - Idade ${params.age}`,
            inputs: {
              age: params.age,
              annuityAmount: params.annuityAmount,
              paymentFrequency: params.paymentFrequency,
              interestRate: params.interestRate,
              mortalityTableName: params.mortalityTable.name,
              immediateStart: params.immediateStart,
            },
            outputs: {
              lifeAnnuityPV: presentValue,
              temporary10YearsPV: temporaryValue10,
              temporary20YearsPV: temporaryValue20,
              annualValue: params.annuityAmount * params.paymentFrequency,
              capitalRequired: presentValue,
              expectedPayments: presentValue / params.annuityAmount,
              lifeExpectancy: MortalityCalculations.lifeExpectancy(
                params.mortalityTable,
                params.age
              ),
            },
          }

          set(state => ({
            calculationHistory: [result, ...state.calculationHistory],
            isCalculating: false,
          }))
        } catch (_error) {
          set({
            isCalculating: false,
            lastError: error instanceof Error ? _error.message : 'Erro no cálculo da anuidade',
          })
        }
      },

      // Análise de mortalidade
      calculateMortalityAnalysis: async (tableName: string, age: number) => {
        set({ isCalculating: true, lastError: null })

        try {
          const state = get()
          const table = state.mortalityTables.find(t => t.name === tableName)

          if (!table) {
            throw new Error(`Tabela ${tableName} não encontrada`)
          }

          const lifeExpectancy = MortalityCalculations.lifeExpectancy(table, age)
          const survival5 = MortalityCalculations.survivalProbability(table, age, 5)
          const survival10 = MortalityCalculations.survivalProbability(table, age, 10)
          const survival20 = MortalityCalculations.survivalProbability(table, age, 20)
          const death5 = MortalityCalculations.deathProbability(table, age, 5)
          const death10 = MortalityCalculations.deathProbability(table, age, 10)
          const death20 = MortalityCalculations.deathProbability(table, age, 20)

          const currentEntry = table.entries.find(e => e.age === age)

          const result: CalculationResult = {
            id: crypto.randomUUID(),
            type: 'mortality-analysis',
            timestamp: new Date(),
            description: `Análise de Mortalidade - ${table.name} - Idade ${age}`,
            inputs: {
              tableName,
              age,
              gender: table.gender,
              year: table.year,
            },
            outputs: {
              currentQx: currentEntry?.qx || 0,
              currentPx: currentEntry?.px || 1 - (currentEntry?.qx || 0),
              lifeExpectancy,
              survivalProbabilities: {
                year5: survival5,
                year10: survival10,
                year20: survival20,
              },
              deathProbabilities: {
                year5: death5,
                year10: death10,
                year20: death20,
              },
              percentageSurvival: {
                year5: survival5 * 100,
                year10: survival10 * 100,
                year20: survival20 * 100,
              },
              expectedAge: age + lifeExpectancy,
            },
          }

          set(state => ({
            calculationHistory: [result, ...state.calculationHistory],
            isCalculating: false,
          }))
        } catch (_error) {
          set({
            isCalculating: false,
            lastError: error instanceof Error ? _error.message : 'Erro na análise de mortalidade',
          })
        }
      },

      // Gerenciamento do histórico
      clearCalculationHistory: () => {
        set({ calculationHistory: [], lastError: null })
      },

      removeCalculation: (id: string) => {
        set(state => ({
          calculationHistory: state.calculationHistory.filter(calc => calc.id !== id),
          lastError: null,
        }))
      },

      // Configurações
      setDefaultInterestRate: (rate: number) => {
        if (rate < 0 || rate > 1) {
          set({ lastError: 'Taxa de juros deve estar entre 0% e 100%' })
          return
        }
        set({ defaultInterestRate: rate, lastError: null })
      },

      setDefaultLoadingRate: (rate: number) => {
        if (rate < 0 || rate > 1) {
          set({ lastError: 'Taxa de carregamento deve estar entre 0% e 100%' })
          return
        }
        set({ defaultLoadingRate: rate, lastError: null })
      },

      // Gerenciamento de erros
      setError: (error: string | null) => {
        set({ lastError: error })
      },

      clearError: () => {
        set({ lastError: null })
      },
    }),
    {
      name: 'actuarial-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        mortalityTables: state.mortalityTables,
        selectedTable: state.selectedTable,
        calculationHistory: state.calculationHistory,
        defaultInterestRate: state.defaultInterestRate,
        defaultLoadingRate: state.defaultLoadingRate,
      }),
    }
  )
)

// Hooks auxiliares para facilitar o uso
export const useSelectedTable = () => useActuarialStore(state => state.selectedTable)
export const useCalculationHistory = () => useActuarialStore(state => state.calculationHistory)
export const useIsCalculating = () => useActuarialStore(state => state.isCalculating)
export const useLastError = () => useActuarialStore(state => state.lastError)
export const useMortalityTables = () => useActuarialStore(state => state.mortalityTables)
export const useDefaultRates = () =>
  useActuarialStore(state => ({
    interestRate: state.defaultInterestRate,
    loadingRate: state.defaultLoadingRate,
  }))
