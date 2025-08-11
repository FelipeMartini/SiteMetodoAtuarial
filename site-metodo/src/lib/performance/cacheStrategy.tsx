/**
 * Sistema de cache estratégico para APIs
 * Melhora performance reduzindo requests redundantes
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuração otimizada do React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      // Manter em background por 10 minutos
      gcTime: 10 * 60 * 1000,
      // Retry em caso de erro
      retry: (failureCount, error: any) => {
        // Não retry em erros 4xx (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Máximo 3 tentativas para outros erros
        return failureCount < 3;
      },
      // Refetch on window focus para dados críticos
      refetchOnWindowFocus: true,
      // Background refetch para manter dados atualizados
      refetchOnMount: true,
    },
    mutations: {
      // Retry para mutations críticas
      retry: 1,
    },
  },
});

// === CONFIGURAÇÕES DE CACHE POR TIPO DE DADOS ===

/**
 * Configuração para dados estáticos (mudam pouco)
 */
export const STATIC_CACHE_CONFIG = {
  staleTime: 30 * 60 * 1000, // 30 minutos
  gcTime: 60 * 60 * 1000,    // 1 hora
  refetchOnWindowFocus: false,
};

/**
 * Configuração para dados dinâmicos (mudam frequentemente)
 */
export const DYNAMIC_CACHE_CONFIG = {
  staleTime: 1 * 60 * 1000,  // 1 minuto
  gcTime: 5 * 60 * 1000,     // 5 minutos
  refetchOnWindowFocus: true,
};

/**
 * Configuração para dados críticos (sempre atualizados)
 */
export const CRITICAL_CACHE_CONFIG = {
  staleTime: 0,              // Sempre stale, sempre refetch
  gcTime: 1 * 60 * 1000,     // 1 minuto
  refetchOnWindowFocus: true,
  refetchInterval: 30 * 1000, // Refetch a cada 30 segundos
};

// === QUERY KEYS PADRONIZADAS ===

export const QUERY_KEYS = {
  // Usuários
  users: {
    all: ['users'] as const,
    lists: () => [...QUERY_KEYS.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...QUERY_KEYS.users.lists(), { filters }] as const,
    details: () => [...QUERY_KEYS.users.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.users.details(), id] as const,
  },
  
  // Sessão/Auth
  auth: {
    all: ['auth'] as const,
    session: () => [...QUERY_KEYS.auth.all, 'session'] as const,
    permissions: () => [...QUERY_KEYS.auth.all, 'permissions'] as const,
  },
  
  // ABAC
  abac: {
    all: ['abac'] as const,
    policies: () => [...QUERY_KEYS.abac.all, 'policies'] as const,
    roles: () => [...QUERY_KEYS.abac.all, 'roles'] as const,
    roleAssignments: () => [...QUERY_KEYS.abac.all, 'role-assignments'] as const,
  },
  
  // Auditoria
  audit: {
    all: ['audit'] as const,
    logs: () => [...QUERY_KEYS.audit.all, 'logs'] as const,
    metrics: () => [...QUERY_KEYS.audit.all, 'metrics'] as const,
  },
} as const;

// === HOOKS CUSTOMIZADOS PARA CACHE ===

/**
 * Hook para dados com cache otimista
 */
export function useOptimisticCache<T>(
  queryKey: any[],
  fetcher: () => Promise<T>,
  options: any = {}
) {
  return {
    queryKey,
    queryFn: fetcher,
    ...DYNAMIC_CACHE_CONFIG,
    ...options,
  };
}

/**
 * Hook para invalidação seletiva de cache
 */
export function useInvalidateCache() {
  return {
    // Invalidar todos os dados de usuários
    invalidateUsers: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
    
    // Invalidar sessão/auth
    invalidateAuth: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.all });
    },
    
    // Invalidar ABAC
    invalidateABAC: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.abac.all });
    },
    
    // Invalidar específico por ID
    invalidateUser: (userId: string) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.users.detail(userId) 
      });
    },
    
    // Limpar todo o cache (usar com cuidado)
    clearAll: () => {
      queryClient.clear();
    },
  };
}

// === PREFETCH STRATEGIES ===

/**
 * Prefetch de dados críticos no login
 */
export function prefetchCriticalData() {
  // Prefetch session data
  queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.auth.session(),
    queryFn: () => fetch('/api/auth/session').then(res => res.json()),
    ...CRITICAL_CACHE_CONFIG,
  });
  
  // Prefetch permissions
  queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.auth.permissions(),
    queryFn: () => fetch('/api/auth/permissions').then(res => res.json()),
    ...STATIC_CACHE_CONFIG,
  });
}

/**
 * Prefetch de dados admin (apenas para admins)
 */
export function prefetchAdminData(userRole: string) {
  if (userRole === 'ADMIN' || userRole === 'MODERATOR') {
    // Prefetch users list
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.users.lists(),
      queryFn: () => fetch('/api/usuario/lista').then(res => res.json()),
      ...DYNAMIC_CACHE_CONFIG,
    });
    
    // Prefetch ABAC data
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.abac.policies(),
      queryFn: () => fetch('/api/abac/policies').then(res => res.json()),
      ...STATIC_CACHE_CONFIG,
    });
  }
}

// === COMPONENTE PROVIDER ===

interface CacheProviderProps {
  children: React.ReactNode;
}

export function CacheProvider({ children }: CacheProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position={"bottom-right" as any}
        />
      )}
    </QueryClientProvider>
  );
}
