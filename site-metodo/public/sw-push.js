// service-worker.js - Service Worker para Push Notifications
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// Manipula recebimento de push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification recebida:', event);

  const options = {
    title: 'Método Atuarial',
    body: 'Nova notificação disponível',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar',
        icon: '/icons/action-dismiss.png'
      }
    ],
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[SW] Payload da notificação:', payload);

      // Atualiza as opções com dados do payload
      options.title = payload.title || options.title;
      options.body = payload.body || options.body;
      options.icon = payload.icon || options.icon;
      options.badge = payload.badge || options.badge;
      options.tag = payload.tag || options.tag;
      options.requireInteraction = payload.requireInteraction || options.requireInteraction;
      options.actions = payload.actions || options.actions;
      
      if (payload.data) {
        options.data = { ...options.data, ...payload.data };
      }

      // Configurações de vibração
      if (payload.vibrate && Array.isArray(payload.vibrate)) {
        options.vibrate = payload.vibrate;
      }

      // Configurações de silêncio
      if (payload.silent) {
        options.silent = true;
      }
    } catch (error) {
      console.error('[SW] Erro ao processar payload da notificação:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(options.title, options)
      .then(() => {
        console.log('[SW] Notificação exibida com sucesso');
        
        // Log da notificação recebida (opcional)
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'PUSH_NOTIFICATION_RECEIVED',
              data: {
                title: options.title,
                body: options.body,
                timestamp: options.data.timestamp
              }
            });
          });
        });
      })
      .catch(error => {
        console.error('[SW] Erro ao exibir notificação:', error);
      })
  );
});

// Manipula cliques nas notificações
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificação clicada:', event);

  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  notification.close();

  if (action === 'dismiss') {
    console.log('[SW] Notificação dispensada pelo usuário');
    return;
  }

  // Determina URL de destino
  let targetUrl = data.url || '/';
  
  if (action === 'open' || !action) {
    // Abre a URL especificada ou a página inicial
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clients => {
        // Procura por uma janela já aberta
        for (const client of clients) {
          if (client.url.includes(self.location.origin)) {
            // Se encontrou uma janela, foca nela e navega para a URL
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              data: {
                action,
                url: targetUrl,
                notificationData: data
              }
            });
            return client.focus();
          }
        }
        
        // Se não encontrou janela aberta, abre uma nova
        return self.clients.openWindow(targetUrl);
      })
    );
  } else {
    // Ação personalizada
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'NOTIFICATION_ACTION',
            data: {
              action,
              notificationData: data,
              timestamp: Date.now()
            }
          });
        });
      })
    );
  }
});

// Manipula fechamento de notificações
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notificação fechada:', event);

  const notification = event.notification;
  const data = notification.data || {};

  // Notifica os clientes sobre o fechamento
  event.waitUntil(
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NOTIFICATION_CLOSED',
          data: {
            notificationData: data,
            timestamp: Date.now()
          }
        });
      });
    })
  );
});

// Manipula mensagens dos clientes
self.addEventListener('message', (event) => {
  console.log('[SW] Mensagem recebida do cliente:', event.data);

  const { type, data } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_SUBSCRIPTION':
      event.ports[0]?.postMessage({
        subscription: self.registration.pushManager.getSubscription()
      });
      break;
      
    case 'TEST_NOTIFICATION':
      self.registration.showNotification('Teste de Notificação', {
        body: 'Esta é uma notificação de teste do service worker',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'test-notification',
        data: data || {}
      });
      break;
      
    default:
      console.log('[SW] Tipo de mensagem desconhecido:', type);
  }
});

// Sync em background (para retry de notificações falhadas)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'push-retry') {
    event.waitUntil(
      // Implementar lógica de retry aqui se necessário
      Promise.resolve()
    );
  }
});

// Cleanup quando o service worker está para ser destruído
self.addEventListener('beforeunload', () => {
  console.log('[SW] Service Worker sendo destruído');
});

console.log('[SW] Service Worker carregado e configurado para push notifications');
