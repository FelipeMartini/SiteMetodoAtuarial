'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface CalculationParams {
  idade: number
  sexo: 'M' | 'F'
  capital?: number
  taxaJuros?: number
  anos?: number
  valorRenda?: number
  anosPassados?: number
}

interface CalculationResult {
  id: string
  tipo: string
  parametros: CalculationParams
  resultado: {
    valor: number
    metodologia: string
    tabelaMortalidade: string
    dataCalculo: string
    parametrosUtilizados: CalculationParams
  }
  dataCalculo: string
  tabua?: {
    nome: string
    ano: number
    fonte: string
  }
  user?: {
    name: string
    email: string
  }
}

interface MortalityTable {
  id: string
  nome: string
  ano: number
  fonte: string
  sexo: string
  status: string
  descricao?: string
  observacao?: string
  dataImportacao: string
  _count: {
    taxas: number
    calculos: number
  }
  taxas?: Array<{
    idade: number
    qx: number
    lx?: number
    dx?: number
    ex?: number
    px?: number
  }>
}

export function useCalculosAtuariais() {
  const queryClient = useQueryClient()

  // Query para buscar histórico de cálculos
  const {
    data: calculos = [],
    isLoading: isLoadingCalculos,
    error: calculosError
  } = useQuery({
    queryKey: ['calculos-atuariais'],
    queryFn: async (): Promise<CalculationResult[]> => {
      const response = await fetch('/api/admin/calculos-atuariais')
      if (!response.ok) {
        throw new Error('Erro ao buscar cálculos')
      }
      const data = await response.json()
      return data.calculos
    }
  })

  // Query para buscar tábuas de mortalidade
  const {
    data: tabuas = [],
    isLoading: isLoadingTabuas,
    error: tabuasError
  } = useQuery({
    queryKey: ['tabuas-mortalidade'],
    queryFn: async (): Promise<MortalityTable[]> => {
      const response = await fetch('/api/admin/tabuas-mortalidade')
      if (!response.ok) {
        throw new Error('Erro ao buscar tábuas')
      }
      const data = await response.json()
      return data.tabuas
    }
  })

  // Mutation para realizar cálculos
  const calculoMutation = useMutation({
    mutationFn: async ({ tipo, parametros, tabuaId }: {
      tipo: string
      parametros: CalculationParams
      tabuaId?: string
    }): Promise<CalculationResult> => {
      const response = await fetch('/api/admin/calculos-atuariais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo, parametros, tabuaId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao realizar cálculo')
      }

      const data = await response.json()
      return data.calculo
    },
    onSuccess: () => {
      // Invalidar e refetch do histórico de cálculos
      queryClient.invalidateQueries({ queryKey: ['calculos-atuariais'] })
    },
  })

  // Mutation para criar tábua de mortalidade
  const criarTabuaMutation = useMutation({
    mutationFn: async (tabuaData: {
      nome: string
      ano: number
      fonte: string
      sexo: string
      descricao?: string
      observacao?: string
      taxas?: Array<{
        idade: number
        qx: number
        lx?: number
        dx?: number
        ex?: number
        px?: number
      }>
    }): Promise<MortalityTable> => {
      const response = await fetch('/api/admin/tabuas-mortalidade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tabuaData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao criar tábua')
      }

      const data = await response.json()
      return data.tabua
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabuas-mortalidade'] })
    },
  })

  // Funções de conveniência para diferentes tipos de cálculo
  const calcularSeguroVida = (params: CalculationParams, tabuaId?: string) => {
    return calculoMutation.mutateAsync({
      tipo: 'seguro_vida',
      parametros: params,
      tabuaId
    })
  }

  const calcularRendaVitalicia = (params: CalculationParams, tabuaId?: string) => {
    return calculoMutation.mutateAsync({
      tipo: 'renda_vitalicia',
      parametros: params,
      tabuaId
    })
  }

  const calcularReservaMatematica = (params: CalculationParams, tabuaId?: string) => {
    return calculoMutation.mutateAsync({
      tipo: 'reserva_matematica',
      parametros: params,
      tabuaId
    })
  }

  const calcularExpectativaVida = (params: CalculationParams, tabuaId?: string) => {
    return calculoMutation.mutateAsync({
      tipo: 'expectativa_vida',
      parametros: params,
      tabuaId
    })
  }

  const calcularProbabilidadeSobrevivencia = (params: CalculationParams, tabuaId?: string) => {
    return calculoMutation.mutateAsync({
      tipo: 'probabilidade_sobrevivencia',
      parametros: params,
      tabuaId
    })
  }

  return {
    // Dados
    calculos,
    tabuas,
    
    // Estados de loading
    isLoadingCalculos,
    isLoadingTabuas,
    isCalculating: calculoMutation.isPending,
    isCriandoTabua: criarTabuaMutation.isPending,
    
    // Erros
    calculosError,
    tabuasError,
    calculoError: calculoMutation.error,
    tabuaError: criarTabuaMutation.error,
    
    // Funções
    calcularSeguroVida,
    calcularRendaVitalicia,
    calcularReservaMatematica,
    calcularExpectativaVida,
    calcularProbabilidadeSobrevivencia,
    criarTabua: criarTabuaMutation.mutateAsync,
    
    // Estado das mutations
    calculoMutation,
    criarTabuaMutation,
  }
}

export type { CalculationParams, CalculationResult, MortalityTable }
