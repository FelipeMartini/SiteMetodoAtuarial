// Interface para ServiceWorkerRegistration com suporte a sync
interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync: {
    register: (tag: string) => Promise<void>
  }
}
/**
 * Utilitários para gerenciar Service Worker
 * Registra e controla o Service Worker no client-side
 */

import { useState, useEffect } from 'react'

// === REGISTRO DO SERVICE WORKER ===

/**
 * Registra o Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Worker não suportado')
    return null
  }

  // Não registrar service worker em desenvolvimento por padrão; pode provocar
  // comportamento inesperado como múltiplos fetches a /api/auth/session.
  // Detectar ambiente de desenvolvimento no cliente (hostname localhost) para evitar
  // referenciar `process.env` diretamente no bundle do cliente e causar erros de tipo.
  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const disabledFlag = typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_DISABLE_SERVICE_WORKER === '1'
  if (isDev || disabledFlag) {
    console.log('Service Worker desabilitado em desenvolvimento ou por NEXT_PUBLIC_DISABLE_SERVICE_WORKER')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')

    console.log('Service Worker registrado:', registration)

    // Verificar atualizações
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão disponível
            showUpdateNotification()
          }
        })
      }
    })

    return registration
  } catch (_error) {
    console.error('Erro ao registrar Service Worker:', String(_error))
    return null
  }
}

/**
 * Desregistra o Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  try {
    // Obter todas as registrations e tentar desregistrar cada uma para ser mais resiliente
    const regs = await navigator.serviceWorker.getRegistrations()
    if (!regs || regs.length === 0) return false

    let anyUnregistered = false
    for (const r of regs) {
      try {
        // Alguns navegadores/workers podem rejeitar com AbortError (Worker disallowed)
        // Não falhamos por isso; apenas logamos e continuamos para não travar o client.
        const res = await r.unregister()
        console.log('Service Worker desregistrado (scope):', r.scope, res)
        anyUnregistered = anyUnregistered || !!res
      } catch (err: any) {
        // Ignorar AbortError e outros erros não críticos
        if (err && err.name === 'AbortError') {
          console.warn('Ignorado AbortError ao desregistrar SW (provavelmente Worker disallowed):', r.scope)
          anyUnregistered = anyUnregistered || false
          continue
        }
        console.error('Erro ao desregistrar Service Worker (scope):', r.scope, String(err))
      }
    }

    return anyUnregistered
  } catch (_error) {
    console.error('Erro ao desregistrar Service Worker:', String(_error))
    return false
  }
}

// === CONTROLE DE CACHE ===

/**
 * Limpa todo o cache do Service Worker
 */
export async function clearServiceWorkerCache(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return
  }

  const registration = await navigator.serviceWorker.getRegistration()
  if (registration && registration.active) {
    registration.active.postMessage({ type: 'CLEAR_CACHE' })
  }
}

/**
 * Força atualização do Service Worker
 */
export async function updateServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return
  }

  const registration = await navigator.serviceWorker.getRegistration()
  if (registration) {
    await registration.update()

    // Se há um worker waiting, ativa ele imediatamente
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }
}

// === NOTIFICAÇÕES ===

/**
 * Mostra notificação de atualização disponível
 */
function showUpdateNotification(): void {
  // Você pode integrar com seu sistema de toast/notification
  if (confirm('Nova versão disponível. Atualizar agora?')) {
    updateServiceWorker().then(() => {
      window.location.reload()
    })
  }
}

/**
 * Solicita permissão para notificações push
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('Notificações não suportadas')
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    return 'denied'
  }

  const permission = await Notification.requestPermission()
  return permission
}

/**
 * Registra para push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) {
    console.error('Service Worker não registrado')
    return null
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
  // NEXT_PUBLIC_VAPID_PUBLIC_KEY é injetada pelo Next no cliente; acessamos via window fallback
  applicationServerKey: (window as any).__NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    })

    // Enviar subscription para o servidor
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })

    return subscription
  } catch (_error) {
    console.error('Erro ao se inscrever para push notifications:', String(_error))
    return null
  }
}

// === STATUS DO SERVICE WORKER ===

/**
 * Verifica se o app está rodando offline
 */
export function isOffline(): boolean {
  return !navigator.onLine
}

/**
 * Hook para monitorar status online/offline
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * Hook para status do Service Worker
 */
export function useServiceWorkerStatus() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unsupported'>('loading')
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setStatus('unsupported')
      return
    }

    registerServiceWorker()
      .then(reg => {
        setRegistration(reg)
        setStatus(reg ? 'ready' : 'error')
      })
      .catch(() => {
        setStatus('error')
      })
  }, [])

  return {
    status,
    registration,
    clearCache: clearServiceWorkerCache,
    update: updateServiceWorker,
  }
}

// === BACKGROUND SYNC ===

/**
 * Adiciona ação para sync em background
 */
export async function addToBackgroundSync(url: string, options: RequestInit): Promise<void> {
  if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
    console.log('Background Sync não suportado')
    return
  }

  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) {
    console.error('Service Worker não registrado')
    return
  }

  // Armazenar request para sync posterior
  const cache = await caches.open('offline-actions')
  const request = new Request(url, options)
  await cache.put(request, new Response(JSON.stringify(options.body)))

  // Registrar para background sync (se disponível)
  try {
    if ('sync' in registration) {
      await (registration as ServiceWorkerRegistrationWithSync).sync.register('background-sync')
    }
  } catch {
    console.warn('Background Sync não disponível:')
  }
}

// === CACHE MANUAL ===

/**
 * Pré-cache recursos importantes
 */
export async function precacheResources(urls: string[]): Promise<void> {
  if (!('caches' in window)) {
    console.log('Cache API não suportada')
    return
  }

  const cache = await caches.open('manual-precache')

  try {
    await cache.addAll(urls)
    console.log('Recursos pré-cached:', urls)
  } catch (_error) {
    console.error('Erro ao pré-cachear recursos:', String(_error))
  }
}

/**
 * Verifica se recurso está em cache
 */
export async function isResourceCached(url: string): Promise<boolean> {
  if (!('caches' in window)) {
    return false
  }

  const response = await caches.match(url)
  return !!response
}

// === INICIALIZAÇÃO ===

/**
 * Inicializa todas as funcionalidades do Service Worker
 */
export async function initializeServiceWorker(): Promise<void> {
  // Registrar Service Worker
  await registerServiceWorker()

  // Solicitar permissão para notificações (se usuário logado)
  if (localStorage.getItem('user-token')) {
    await requestNotificationPermission()
  }

  // Pré-cache recursos críticos
  await precacheResources(['/', '/dashboard', '/perfil', '/manifest.json'])

  console.log('Service Worker inicializado')
}
