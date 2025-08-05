// Hook personalizado para autenticação
// Integra NextAuth com Redux e fornece funcionalidades avançadas

'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import type { RootState } from '@/lib/store';
import {
  clearSession,
  updateUser,
  incrementLoginAttempts,
  resetLoginAttempts,
  addActivityLog,
  updateProfile,
  initializeAuth
} from '@/lib/store/slices/authSlice';

interface UseAuthReturn {
  // Estados de autenticação
  user: any;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Funções de login
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithProvider: (provider: string, callbackUrl?: string) => Promise<void>;

  // Função de logout
  logout: (callbackUrl?: string) => Promise<void>;

  // Funções de perfil
  updateUserProfile: (data: any) => Promise<{ success: boolean; error?: string }>;

  // Funções de verificação
  checkPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;

  // Redirecionamentos
  redirectToLogin: (callbackUrl?: string) => void;
  redirectToDashboard: () => void;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state: RootState) => state.auth);

  // Sincronizar sessão do NextAuth com Redux
  useEffect(() => {
    if (status === 'loading') {
      // Loading será gerenciado pelos thunks
    } else {
      if (session) {
        dispatch(updateUser({
          id: (session.user as any).id || '',
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
          accessLevel: (session.user as any).accessLevel || 1,
          isActive: true
        }));

        // Log da atividade de login
        dispatch(addActivityLog({
          action: 'login',
          details: 'Sessão iniciada'
        }));
      } else {
        dispatch(clearSession());
      }
    }
  }, [session, status, dispatch]);

  // Login com credenciais
  const loginWithCredentials = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Registrar tentativa de login
      dispatch(incrementLoginAttempts());

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        let errorMessage = 'Erro ao fazer login';

        switch (result.error) {
          case 'CredentialsSignin':
            errorMessage = 'Email ou senha incorretos';
            break;
          case 'EmailNotVerified':
            errorMessage = 'Verifique seu email antes de fazer login';
            break;
          case 'AccountDisabled':
            errorMessage = 'Conta desabilitada. Entre em contato conosco';
            break;
          case 'TooManyAttempts':
            errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos';
            break;
          default:
            errorMessage = 'Erro inesperado. Tente novamente';
        }

        return { success: false, error: errorMessage };
      }

      if (result?.ok) {
        // Resetar tentativas em caso de sucesso
        dispatch(resetLoginAttempts());
        return { success: true };
      }

      return { success: false, error: 'Erro inesperado' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }, [dispatch]);

  // Login com provedor social
  const loginWithProvider = useCallback(async (
    provider: string,
    callbackUrl: string = '/area-cliente'
  ): Promise<void> => {
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error('Erro no login social:', error);
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async (callbackUrl: string = '/'): Promise<void> => {
    try {
      // Log da atividade de logout
      if (session?.user) {
        dispatch(addActivityLog({
          action: 'logout',
          details: 'Sessão finalizada'
        }));
      }

      await signOut({ callbackUrl });
      dispatch(clearSession());
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }, [dispatch, session]);

  // Atualizar perfil do usuário
  const updateUserProfile = useCallback(async (
    data: any
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Fazer requisição para API de atualização
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        dispatch(updateUser(updatedUser));

        // Log da atividade
        dispatch(addActivityLog({
          action: 'profile_update',
          details: 'Perfil atualizado'
        }));

        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Erro ao atualizar perfil' };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }, [dispatch]);

  // Verificar permissão
  const checkPermission = useCallback((permission: string): boolean => {
    if (!session?.user) return false;

    const userPermissions = (session.user as any).permissions || [];
    return userPermissions.includes(permission) || userPermissions.includes('*');
  }, [session]);

  // Verificar role
  const hasRole = useCallback((role: string): boolean => {
    if (!session?.user) return false;

    const userRole = (session.user as any).role;
    return userRole === role || userRole === 'admin';
  }, [session]);

  // Redirecionar para login
  const redirectToLogin = useCallback((callbackUrl?: string): void => {
    const url = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : '/login';
    router.push(url);
  }, [router]);

  // Redirecionar para dashboard
  const redirectToDashboard = useCallback((): void => {
    if (!session?.user) {
      redirectToLogin();
      return;
    }

    const userRole = (session.user as any).role;

    switch (userRole) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'manager':
        router.push('/manager/dashboard');
        break;
      default:
        router.push('/area-cliente');
    }
  }, [session, router, redirectToLogin]);

  return {
    // Estados
    user: session?.user || null,
    session,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading' || authState.loading,

    // Funções de login
    loginWithCredentials,
    loginWithProvider,

    // Logout
    logout,

    // Perfil
    updateUserProfile,

    // Verificações
    checkPermission,
    hasRole,

    // Redirecionamentos
    redirectToLogin,
    redirectToDashboard,
  };
}
