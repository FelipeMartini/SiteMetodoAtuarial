// Slice de autenticação - gerencia estado da sessão do usuário
// Integra com NextAuth.js v5 e gerencia informações de sessão

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Tipos para o usuário autenticado
export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessLevel: number;
  isActive: boolean;
}

// Estado da sessão
export interface SessionState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  lastActivity: Date | null;
  sessionExpiry: Date | null;
}

// Dados de perfil do usuário
export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessLevel: number;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;

  // Configurações de perfil
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      system: boolean;
    };
  };
}

// Estado do slice
interface AuthState extends SessionState {
  profile: UserProfile | null;

  // Estados de operações
  updatingProfile: boolean;
  changingPassword: boolean;

  // Tentativas de login
  loginAttempts: number;
  lastLoginAttempt: Date | null;
  isLocked: boolean;

  // Configurações de segurança
  twoFactorEnabled: boolean;
  lastPasswordChange: Date | null;

  // Atividade da sessão
  activityLog: {
    timestamp: Date;
    action: string;
    ip?: string;
    userAgent?: string;
  }[];
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Inicia como true para verificar sessão
  error: null,
  lastActivity: null,
  sessionExpiry: null,

  profile: null,

  updatingProfile: false,
  changingPassword: false,

  loginAttempts: 0,
  lastLoginAttempt: null,
  isLocked: false,

  twoFactorEnabled: false,
  lastPasswordChange: null,

  activityLog: [],
};

// Async thunks para operações de autenticação
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const response = await fetch('/api/auth/session');

    if (!response.ok) {
      throw new Error('Falha ao verificar sessão');
    }

    const session = await response.json();
    return session;
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<UserProfile>) => {
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar perfil');
    }

    return response.json();
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao alterar senha');
    }

    return response.json();
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async () => {
    const response = await fetch('/api/auth/profile');

    if (!response.ok) {
      throw new Error('Falha ao carregar perfil');
    }

    return response.json();
  }
);

export const logActivity = createAsyncThunk(
  'auth/logActivity',
  async (activity: { action: string; details?: string }) => {
    const response = await fetch('/api/auth/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      throw new Error('Falha ao registrar atividade');
    }

    return response.json();
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Limpar dados da sessão
    clearSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profile = null;
      state.lastActivity = null;
      state.sessionExpiry = null;
      state.activityLog = [];
    },

    // Atualizar último tempo de atividade
    updateLastActivity: (state) => {
      state.lastActivity = new Date();
    },

    // Atualizar dados do usuário na sessão
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Gerenciar tentativas de login
    incrementLoginAttempts: (state) => {
      state.loginAttempts++;
      state.lastLoginAttempt = new Date();

      // Bloquear após 5 tentativas
      if (state.loginAttempts >= 5) {
        state.isLocked = true;
      }
    },

    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
      state.isLocked = false;
    },

    // Adicionar entrada ao log de atividade
    addActivityLog: (state, action: PayloadAction<{ action: string; details?: string }>) => {
      state.activityLog.unshift({
        timestamp: new Date(),
        action: action.payload.action,
        ...action.payload,
      });

      // Manter apenas os últimos 100 registros
      if (state.activityLog.length > 100) {
        state.activityLog = state.activityLog.slice(0, 100);
      }
    },

    // Definir expiração da sessão
    setSessionExpiry: (state, action: PayloadAction<Date>) => {
      state.sessionExpiry = action.payload;
    },

    // Toggle 2FA
    toggleTwoFactor: (state, action: PayloadAction<boolean>) => {
      state.twoFactorEnabled = action.payload;
    },

    // Limpar erros
    clearError: (state) => {
      state.error = null;
    },

    // Atualizar configurações de perfil
    updateProfilePreferences: (state, action: PayloadAction<Partial<UserProfile['preferences']>>) => {
      if (state.profile) {
        state.profile.preferences = {
          ...state.profile.preferences,
          ...action.payload,
        };
      }
    },
  },

  extraReducers: (builder) => {
    // Initialize auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.lastActivity = new Date();

          // Definir expiração da sessão (24 horas)
          state.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao inicializar autenticação';
        state.isAuthenticated = false;
        state.user = null;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.updatingProfile = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updatingProfile = false;
        state.profile = action.payload;

        // Atualizar também dados do usuário se necessário
        if (state.user) {
          state.user.name = action.payload.name;
          state.user.email = action.payload.email;
          state.user.image = action.payload.image;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updatingProfile = false;
        state.error = action.error.message || 'Erro ao atualizar perfil';
      });

    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.changingPassword = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changingPassword = false;
        state.lastPasswordChange = new Date();
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changingPassword = false;
        state.error = action.error.message || 'Erro ao alterar senha';
      });

    // Fetch profile
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.twoFactorEnabled = action.payload.twoFactorEnabled || false;
        state.lastPasswordChange = action.payload.lastPasswordChange ? new Date(action.payload.lastPasswordChange) : null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao carregar perfil';
      });

    // Log activity
    builder
      .addCase(logActivity.fulfilled, (state, action) => {
        state.activityLog.unshift({
          timestamp: new Date(),
          action: action.payload.action,
        });
      });
  },
});

// Export das actions
export const {
  clearSession,
  updateLastActivity,
  updateUser,
  incrementLoginAttempts,
  resetLoginAttempts,
  addActivityLog,
  setSessionExpiry,
  toggleTwoFactor,
  clearError,
  updateProfilePreferences,
} = authSlice.actions;

export default authSlice.reducer;
