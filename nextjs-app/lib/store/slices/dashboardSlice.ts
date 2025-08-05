// Slice do dashboard - gerencia dados e estatísticas do painel administrativo
// Baseado nos padrões ArchitectUI

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Tipos de dados para o dashboard
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalLogins: number;
  newUsersThisMonth: number;

  // Estatísticas por nível de acesso
  usersByAccessLevel: {
    level: number;
    count: number;
    label: string;
  }[];

  // Dados de crescimento temporal
  userGrowthData: {
    date: string;
    users: number;
    activeUsers: number;
  }[];

  // Atividade recente
  recentActivity: {
    id: string;
    type: 'login' | 'register' | 'update' | 'delete';
    userId: string;
    userName: string;
    timestamp: Date;
    details?: string;
  }[];

  // Top usuários
  topUsers: {
    id: string;
    name: string;
    email: string;
    accessLevel: number;
    lastLogin: Date | null;
    loginCount: number;
  }[];
}

// Sistema de notificações
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Configurações do dashboard
export interface DashboardConfig {
  refreshInterval: number; // em minutos
  autoRefresh: boolean;
  showNotifications: boolean;
  compactMode: boolean;

  // Widgets visíveis
  visibleWidgets: {
    stats: boolean;
    userGrowth: boolean;
    recentActivity: boolean;
    topUsers: boolean;
    accessLevelChart: boolean;
  };
}

// Estado do slice
interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Notificações
  notifications: Notification[];
  unreadNotifications: number;

  // Configurações
  config: DashboardConfig;

  // Estado da UI
  sidebarOpen: boolean;
  activeTab: string;

  // Filtros de período para gráficos
  dateRange: {
    start: Date;
    end: Date;
  };
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  lastUpdated: null,

  notifications: [],
  unreadNotifications: 0,

  config: {
    refreshInterval: 5, // 5 minutos
    autoRefresh: true,
    showNotifications: true,
    compactMode: false,
    visibleWidgets: {
      stats: true,
      userGrowth: true,
      recentActivity: true,
      topUsers: true,
      accessLevelChart: true,
    },
  },

  sidebarOpen: true,
  activeTab: 'overview',

  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    end: new Date(),
  },
};

// Async thunks para operações com API
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (dateRange?: { start: Date; end: Date }) => {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('startDate', dateRange.start.toISOString());
      params.append('endDate', dateRange.end.toISOString());
    }

    const response = await fetch(`/api/admin/dashboard/stats?${params}`);

    if (!response.ok) {
      throw new Error('Falha ao carregar estatísticas do dashboard');
    }

    return response.json();
  }
);

export const fetchNotifications = createAsyncThunk(
  'dashboard/fetchNotifications',
  async () => {
    const response = await fetch('/api/admin/notifications');

    if (!response.ok) {
      throw new Error('Falha ao carregar notificações');
    }

    return response.json();
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'dashboard/markNotificationAsRead',
  async (notificationId: string) => {
    const response = await fetch(`/api/admin/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Falha ao marcar notificação como lida');
    }

    return notificationId;
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Configurações gerais
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },

    setDateRange: (state, action: PayloadAction<{ start: Date; end: Date }>) => {
      state.dateRange = action.payload;
    },

    // Configurações do dashboard
    updateConfig: (state, action: PayloadAction<Partial<DashboardConfig>>) => {
      state.config = { ...state.config, ...action.payload };
    },

    toggleWidget: (state, action: PayloadAction<keyof DashboardConfig['visibleWidgets']>) => {
      const widget = action.payload;
      state.config.visibleWidgets[widget] = !state.config.visibleWidgets[widget];
    },

    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.config.refreshInterval = action.payload;
    },

    toggleAutoRefresh: (state) => {
      state.config.autoRefresh = !state.config.autoRefresh;
    },

    toggleCompactMode: (state) => {
      state.config.compactMode = !state.config.compactMode;
    },

    // Notificações
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };

      state.notifications.unshift(notification);
      state.unreadNotifications++;

      // Manter apenas as últimas 50 notificações
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadNotifications = Math.max(0, state.unreadNotifications - 1);
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadNotifications = 0;
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadNotifications--;
        }
        state.notifications.splice(index, 1);
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    // Atualizar timestamp da última atualização
    updateLastUpdated: (state) => {
      state.lastUpdated = new Date();
    },
  },

  extraReducers: (builder) => {
    // Fetch dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar estatísticas';
      });

    // Fetch notifications
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadNotifications = action.payload.filter((n: Notification) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao carregar notificações';
      });

    // Mark notification as read
    builder
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadNotifications--;
        }
      });
  },
});

// Export das actions
export const {
  setSidebarOpen,
  setActiveTab,
  setDateRange,
  updateConfig,
  toggleWidget,
  setRefreshInterval,
  toggleAutoRefresh,
  toggleCompactMode,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearError,
  updateLastUpdated,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
