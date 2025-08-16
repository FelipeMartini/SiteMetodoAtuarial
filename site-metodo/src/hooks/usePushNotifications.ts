'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
}

interface PushNotificationHook extends PushNotificationState {
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  sendTestNotification: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
}

// Chave pública VAPID (deve ser movida para variável de ambiente)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
  'BEl62iUYgUivxIkv69yViEuiBIa40HI80NqIUW5nNnIFUHaqDjUrQdpf0bZCqCpoCxTJGqb3aXlGOTsEjGjw9PI';

function urlB64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(): PushNotificationHook {
  const { data: session } = useSession();
  
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    error: null,
    permission: 'default',
    subscription: null,
  });

  // Verifica suporte e estado inicial
  const checkInitialState = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Verifica suporte a service workers e push notifications
      const isSupported = 'serviceWorker' in navigator && 
                         'PushManager' in window && 
                         'Notification' in window;

      if (!isSupported) {
        setState(prev => ({ 
          ...prev, 
          isSupported: false, 
          isLoading: false,
          error: 'Push notifications não são suportadas neste navegador'
        }));
        return;
      }

      // Obtém permissão atual
      const permission = Notification.permission;

      // Registra service worker se não estiver registrado
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw-push.js', {
          scope: '/'
        });
        console.log('[Push] Service Worker registrado:', registration);
      }

      // Verifica assinatura existente
      const subscription = await registration.pushManager.getSubscription();
      
      setState(prev => ({
        ...prev,
        isSupported,
        permission,
        subscription,
        isSubscribed: !!subscription,
        isLoading: false
      }));
    } catch (error) {
      console.error('[Push] Erro ao verificar estado inicial:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  }, []);

  // Solicita permissão para notificações
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Push notifications não suportadas' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const permission = await Notification.requestPermission();
      
      setState(prev => ({ ...prev, permission, isLoading: false }));

      if (permission === 'granted') {
        console.log('[Push] Permissão concedida');
        return true;
      } else {
        setState(prev => ({ 
          ...prev, 
          error: permission === 'denied' 
            ? 'Permissão negada pelo usuário' 
            : 'Permissão não concedida'
        }));
        return false;
      }
    } catch (error) {
      console.error('[Push] Erro ao solicitar permissão:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao solicitar permissão'
      }));
      return false;
    }
  }, [state.isSupported]);

  // Subscreve a push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!session?.user || !state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: !session?.user ? 'Usuário não autenticado' : 'Push notifications não suportadas'
      }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Solicita permissão se necessário
      if (state.permission !== 'granted') {
        const hasPermission = await requestPermission();
        if (!hasPermission) return false;
      }

      // Obtém service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Cria nova assinatura
      const applicationServerKey = urlB64ToUint8Array(VAPID_PUBLIC_KEY);
      // Cast to any because lib.dom types may use ArrayBuffer while browsers return SharedArrayBuffer in some contexts
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as any,
      });

      // Envia assinatura para o servidor
      const response = await fetch('/api/push/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.getKey('p256dh') 
                ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!)))
                : '',
              auth: subscription.getKey('auth')
                ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
                : '',
            },
          },
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      console.log('[Push] Assinatura registrada:', result);

      setState(prev => ({
        ...prev,
        subscription,
        isSubscribed: true,
        isLoading: false
      }));

      return true;
    } catch (error) {
      console.error('[Push] Erro ao subscrever:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao subscrever'
      }));
      return false;
    }
  }, [session?.user, state.isSupported, state.permission, requestPermission]);

  // Cancela assinatura
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) {
      setState(prev => ({ ...prev, error: 'Nenhuma assinatura ativa' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Cancela assinatura no navegador
      const success = await state.subscription.unsubscribe();

      if (success) {
        // TODO: Notificar servidor sobre cancelamento
        // await fetch('/api/push/unsubscribe', { method: 'POST', ... });

        setState(prev => ({
          ...prev,
          subscription: null,
          isSubscribed: false,
          isLoading: false
        }));

        console.log('[Push] Assinatura cancelada');
        return true;
      } else {
        throw new Error('Falha ao cancelar assinatura no navegador');
      }
    } catch (error) {
      console.error('[Push] Erro ao cancelar assinatura:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao cancelar assinatura'
      }));
      return false;
    }
  }, [state.subscription]);

  // Envia notificação de teste
  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    if (!session?.user) {
      setState(prev => ({ ...prev, error: 'Usuário não autenticado' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: session.user.id || session.user.email, // Fallback para email se não tiver id
          notification: {
            title: 'Teste de Push Notification',
            body: 'Esta é uma notificação de teste do Método Atuarial!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            tag: 'test-notification',
            data: {
              url: '/dashboard',
              type: 'test',
              timestamp: Date.now(),
            },
          },
          priority: 'normal',
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      console.log('[Push] Notificação de teste enviada:', result);

      setState(prev => ({ ...prev, isLoading: false }));
      return result.success;
    } catch (error) {
      console.error('[Push] Erro ao enviar notificação de teste:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao enviar notificação de teste'
      }));
      return false;
    }
  }, [session?.user]);

  // Atualiza estado da assinatura
  const refreshSubscription = useCallback(async () => {
    if (!state.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setState(prev => ({
          ...prev,
          subscription,
          isSubscribed: !!subscription
        }));
      }
    } catch (error) {
      console.error('[Push] Erro ao atualizar assinatura:', error);
    }
  }, [state.isSupported]);

  // Configura listeners para mensagens do service worker
  useEffect(() => {
    if (!state.isSupported) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data || {};

      switch (type) {
        case 'PUSH_NOTIFICATION_RECEIVED':
          console.log('[Push] Notificação recebida:', data);
          break;
          
        case 'NOTIFICATION_CLICKED':
          console.log('[Push] Notificação clicada:', data);
          // Navegar para URL se necessário
          if (data.url) {
            window.location.href = data.url;
          }
          break;
          
        case 'NOTIFICATION_ACTION':
          console.log('[Push] Ação de notificação:', data);
          break;
          
        case 'NOTIFICATION_CLOSED':
          console.log('[Push] Notificação fechada:', data);
          break;
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [state.isSupported]);

  // Verifica estado inicial quando o componente monta
  useEffect(() => {
    checkInitialState();
  }, [checkInitialState]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    refreshSubscription,
  };
}
