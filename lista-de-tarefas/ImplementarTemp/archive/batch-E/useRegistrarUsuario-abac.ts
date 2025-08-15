'use client'

/**
 * 🔐 HOOK DE REGISTRO DE USUÁRIO PARA SISTEMA ABAC
 * ===============================================
 * 
 * Hook React Query para registro de usuários com atributos ABAC
 * Remove referências ao sistema RBAC legado (accessLevel)
 */

import { useMutation } from '@tanstack/react-query'
import { mapServerMessageToCode } from '@/utils/authErrors'

// 🏗️ INTERFACES PARA ABAC
interface RegistroPayloadABAC {
  nome: string
  email: string
  senha: string
  // Atributos ABAC opcionais
  department?: string
  location?: string
  jobTitle?: string
}

interface RegistroUserABAC {
  id: string
  email: string
  name?: string | null
  // Atributos ABAC
  isActive: boolean
  department?: string | null
  location?: string | null
  jobTitle?: string | null
  // Contexto temporal
  validFrom?: Date | null
  validUntil?: Date | null
  // MFA
  mfaEnabled: boolean
  // Metadados
  createdAt: Date
}

type ErrorCode = string | undefined

interface RegistroResultABAC {
  ok: boolean
  user?: RegistroUserABAC
  errorCode?: ErrorCode
  mensagem?: string
  context?: {
    abacPolicies?: string[]
    requiredAttributes?: string[]
  }
}

/**
 * 🚀 FUNÇÃO DE REGISTRO COM VALIDAÇÃO ABAC
 */
async function registrarUsuarioABAC(payload: RegistroPayloadABAC): Promise<RegistroResultABAC> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Adicionar contexto ABAC se disponível
        'X-ABAC-Context': JSON.stringify({
          action: 'user:register',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      },
      body: JSON.stringify({
        name: payload.nome,
        email: payload.email,
        password: payload.senha,
        // Atributos ABAC
        department: payload.department,
        location: payload.location,
        jobTitle: payload.jobTitle
      }),
    })

    // Tipos para resposta da API
    type ApiSuccessABAC = { 
      user: RegistroUserABAC
      context?: {
        abacPolicies?: string[]
        appliedRules?: string[]
      }
    }
    type ApiErrorABAC = { 
      message?: string
      reason?: string
      context?: {
        requiredAttributes?: string[]
        missingPermissions?: string[]
      }
    }

    const rawData = await response.json().catch(() => ({}))
    const successData = rawData as ApiSuccessABAC
    const errorData = rawData as ApiErrorABAC

    if (!response.ok) {
      const errorCode = mapServerMessageToCode(errorData.message)
      
      return {
        ok: false,
        errorCode,
        mensagem: errorData.message || 'Erro no registro',
        context: {
          requiredAttributes: errorData.context?.requiredAttributes,
        }
      }
    }

    return {
      ok: true,
      user: successData.user,
      context: {
        abacPolicies: successData.context?.abacPolicies
      }
    }

  } catch (error) {
    console.error('Erro no registro ABAC:', error)
    
    return {
      ok: false,
      errorCode: 'NETWORK_ERROR',
      mensagem: 'Erro de conexão. Tente novamente.'
    }
  }
}

/**
 * 🎯 HOOK PRINCIPAL PARA REGISTRO DE USUÁRIO
 */
export function useRegistrarUsuario() {
  return useMutation({
    mutationFn: registrarUsuarioABAC,
    onSuccess: (data) => {
      if (data.ok && data.user) {
        console.log('Usuário registrado com sucesso:', {
          id: data.user.id,
          email: data.user.email,
          department: data.user.department,
          location: data.user.location,
          abacPolicies: data.context?.abacPolicies
        })
      }
    },
    onError: (error) => {
      console.error('Erro no hook de registro:', error)
    }
  })
}

/**
 * 🔧 HOOK AUXILIAR PARA VALIDAR ATRIBUTOS ABAC
 */
export function useValidarAtributosABAC() {
  return useMutation({
    mutationFn: async (atributos: Partial<RegistroPayloadABAC>) => {
      const response = await fetch('/api/auth/validate-attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atributos),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro na validação')
      }

      return data
    }
  })
}

/**
 * 🎯 HOOK PARA VERIFICAR DISPONIBILIDADE DE EMAIL
 */
export function useVerificarEmailDisponivel() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro na verificação')
      }

      return data.disponivel as boolean
    }
  })
}

export default useRegistrarUsuario

// 🏷️ EXPORTS DE TIPOS
export type {
  RegistroPayloadABAC,
  RegistroUserABAC,
  RegistroResultABAC
}
