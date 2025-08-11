/**
 * Service Worker para cache offline e performance
 * Melhora experiência do usuário em conexões instáveis
 */

// === CONFIGURAÇÕES DE CACHE ===

const CACHE_NAME = 'metodo-atuarial-v1';
const STATIC_CACHE_NAME = 'metodo-static-v1';
const DYNAMIC_CACHE_NAME = 'metodo-dynamic-v1';
const API_CACHE_NAME = 'metodo-api-v1';

// Recursos estáticos para cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/_next/static/css/',
  '/_next/static/js/',
  '/fonts/',
];

// URLs de API para cache seletivo
const CACHEABLE_API_ROUTES = [
  '/api/auth/session',
  '/api/auth/permissions',
  '/api/usuario/perfil',
  '/api/abac/policies',
];

// TTL para diferentes tipos de cache (em milliseconds)
const CACHE_TTL = {
  static: 7 * 24 * 60 * 60 * 1000,    // 7 dias
  dynamic: 24 * 60 * 60 * 1000,       // 1 dia
  api: 5 * 60 * 1000,                 // 5 minutos
} as const;

// === ESTRATÉGIAS DE CACHE ===

/**
 * Cache First - para recursos estáticos
 */
async function cacheFirst(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  const cache = await caches.open(STATIC_CACHE_NAME);
  cache.put(request, networkResponse.clone());
  
  return networkResponse;
}

/**
 * Network First - para dados dinâmicos
 */
async function networkFirst(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback para cache se network falhar
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Retorna resposta offline
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Dados não disponíveis offline' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Stale While Revalidate - para APIs com atualizações frequentes
 */
async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Buscar nova versão em background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cachedResponse);
  
  // Retornar cached se disponível, senão aguardar network
  return cachedResponse || await fetchPromise;
}

// === EVENT LISTENERS ===

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Força ativação imediata
        return (self as any).skipWaiting();
      })
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Remove caches antigos
          if (
            cacheName !== STATIC_CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE_NAME &&
            cacheName !== API_CACHE_NAME
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Toma controle de todas as páginas
      return (self as any).clients.claim();
    })
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignora requests de outras origens
  if (url.origin !== location.origin) {
    return;
  }
  
  // Determina estratégia baseada na URL
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else if (isAPIRoute(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// === BACKGROUND SYNC ===

self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncOfflineActions()
    );
  }
});

async function syncOfflineActions(): Promise<void> {
  const cache = await caches.open('offline-actions');
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.delete(request);
      }
    } catch (error) {
      console.log('Sync failed for:', request.url);
    }
  }
}

// === PUSH NOTIFICATIONS ===

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-badge.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/icon-open.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    (self as any).registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      (self as any).clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// === UTILIDADES ===

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/fonts/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js')
  );
}

function isAPIRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') &&
    CACHEABLE_API_ROUTES.some(route => pathname.startsWith(route))
  );
}

function isCacheExpired(response: Response): boolean {
  const cacheControl = response.headers.get('cache-control');
  if (!cacheControl) return true;
  
  const maxAge = cacheControl.match(/max-age=(\d+)/);
  if (!maxAge) return true;
  
  const responseTime = response.headers.get('date');
  if (!responseTime) return true;
  
  const age = Date.now() - new Date(responseTime).getTime();
  return age > parseInt(maxAge[1]) * 1000;
}

// === LIMPEZA DE CACHE ===

self.addEventListener('message', (event: MessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    (self as any).skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

// Limpeza automática de cache expirado
setInterval(async () => {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response && isCacheExpired(response)) {
        await cache.delete(request);
      }
    }
  }
}, 60 * 60 * 1000); // A cada hora
