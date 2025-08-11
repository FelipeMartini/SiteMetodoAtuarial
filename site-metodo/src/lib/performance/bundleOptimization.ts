/**
 * Configuração de otimização de bundle e imports
 * Reduz o tamanho do bundle e melhora a performance
 */

import React from 'react'

// === OTIMIZAÇÕES DE IMPORT ===

// Ao invés de importar todo o lodash, importe funções específicas
// ❌ import _ from 'lodash'
// ✅ import { debounce, throttle } from 'lodash-es'

// Ao invés de importar todo o date-fns, importe apenas o necessário
// ❌ import * as dateFns from 'date-fns'
// ✅ import { format, parseISO } from 'date-fns'

// Para React icons, use imports específicos
// ❌ import { FaUser, FaHome } from 'react-icons/fa'
// ✅ import FaUser from 'react-icons/fa/FaUser'
// ✅ import FaHome from 'react-icons/fa/FaHome'

// === CONFIGURAÇÃO DE DYNAMIC IMPORTS ===

/**
 * Função utilitária para dynamic imports com retry
 */
export function dynamicImportWithRetry<T>(
  importFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch(error => {
        if (retries > 0) {
          setTimeout(() => {
            dynamicImportWithRetry(importFn, retries - 1, delay)
              .then(resolve)
              .catch(reject)
          }, delay)
        } else {
          reject(error)
        }
      })
  })
}

/**
 * Preload de módulos críticos
 */
export function preloadModule(modulePath: string) {
  const link = document.createElement('link')
  link.rel = 'modulepreload'
  link.href = modulePath
  document.head.appendChild(link)
}

/**
 * Lazy loading com preload inteligente
 */
export function lazyWithPreload<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  shouldPreload = false
) {
  const LazyComponent = React.lazy(importFn)

  if (shouldPreload) {
    // Preload após o componente ser definido
    setTimeout(importFn, 100)
  }

  return LazyComponent
}

// === TREE SHAKING HELPERS ===

/**
 * Marca funções como side-effect-free para tree shaking
 */
export const PURE = /*#__PURE__*/ Symbol('PURE')

/**
 * Wrapper para bibliotecas que não fazem tree shaking automaticamente
 */
export function createTreeShakableExport<T>(
  module: T,
  exportMap: Record<string, keyof T>
): Partial<T> {
  const result: Partial<T> = {}

  Object.entries(exportMap).forEach(([exportName, moduleKey]) => {
    if (module[moduleKey]) {
      ;(result as any)[exportName] = module[moduleKey]
    }
  })

  return result
}

// === CÓDIGO SPLITTING STRATEGIES ===

/**
 * Configurações de code splitting por rota
 */
export const ROUTE_CHUNKS = {
  // Chunk para área pública (homepage, login, etc)
  public: ['/', '/login', '/criar-conta', '/sobre', '/contato'],

  // Chunk para área do cliente
  client: ['/area-cliente', '/area-cliente/perfil'],

  // Chunk para área administrativa (carregamento sob demanda)
  admin: ['/admin', '/admin/dashboard', '/admin/usuarios'],

  // Chunk para funcionalidades específicas
  calculations: ['/area-cliente/calculos-atuariais'],

  // Chunk para auditoria e logs
  audit: ['/admin/auditoria', '/admin/logs'],
} as const

/**
 * Determina qual chunk uma rota deve usar
 */
export function getChunkForRoute(pathname: string): keyof typeof ROUTE_CHUNKS | 'default' {
  for (const [chunkName, routes] of Object.entries(ROUTE_CHUNKS)) {
    if (routes.some(route => pathname.startsWith(route))) {
      return chunkName as keyof typeof ROUTE_CHUNKS
    }
  }
  return 'default'
}
