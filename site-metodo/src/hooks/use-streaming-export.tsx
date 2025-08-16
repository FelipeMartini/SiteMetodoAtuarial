'use client';

import { useState, useCallback } from 'react'
import { useStandardToast } from '@/utils/toast'

export type ExportFormat = 'csv' | 'json' | 'xlsx'

export interface ExportConfig {
  endpoint: string
  filename?: string
  filters?: Record<string, unknown>
}

export interface ExportState {
  isExporting: boolean
  progress: number
  error: string | null
}

export function useStreamingExport() {
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    error: null
  })
  
  const { exportSuccess, exportError } = useStandardToast()

  const exportData = useCallback(async (
    format: ExportFormat,
    config: ExportConfig
  ) => {
    setState({ isExporting: true, progress: 0, error: null })

    try {
      const params = new URLSearchParams()
      params.append('export', format)
      
      // Adiciona filtros se existirem
      if (config.filters) {
        Object.entries(config.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (value instanceof Date) {
              params.append(key, value.toISOString())
            } else {
              params.append(key, String(value))
            }
          }
        })
      }

      const response = await fetch(`${config.endpoint}?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Simula progresso para downloads grandes
      setState(prev => ({ ...prev, progress: 50 }))

      const blob = await response.blob()
      
      setState(prev => ({ ...prev, progress: 80 }))

      // Download do arquivo
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      const filename = config.filename || 
        `export-${new Date().toISOString().split('T')[0]}.${format}`
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setState(prev => ({ ...prev, progress: 100 }))
      
      // Reset estado após sucesso
      setTimeout(() => {
        setState({ isExporting: false, progress: 0, error: null })
      }, 1000)
      
      exportSuccess(format)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setState({ 
        isExporting: false, 
        progress: 0, 
        error: errorMessage 
      })
      exportError(format)
    }
  }, [exportSuccess, exportError])

  const reset = useCallback(() => {
    setState({ isExporting: false, progress: 0, error: null })
  }, [])

  return {
    ...state,
    exportData,
    reset
  }
}

export interface ExportProgressProps {
  progress: number
  isVisible: boolean
  onCancel?: () => void
}

export function ExportProgress({ progress, isVisible, onCancel }: ExportProgressProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
        <h3 className="text-lg font-medium mb-4">Exportando dados...</h3>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{progress}% concluído</span>
          {onCancel && (
            <button 
              onClick={onCancel}
              className="text-red-600 hover:text-red-800"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
