// Slice de gerenciamento de usuários
// Baseado nos padrões ArchitectUI para administração de usuários

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Tipos de dados para usuários
export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  accessLevel: number; // 1: Usuário, 2: Editor, 3: Admin, 4: Super Admin, 5: Owner
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Filtros para busca de usuários
export interface UserFilters {
  search: string;
  accessLevel: number | null;
  isActive: boolean | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

// Ordenação
export interface UserSort {
  field: keyof User;
  direction: 'asc' | 'desc';
}

// Estado do slice
interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;

  // Paginação
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  itemsPerPage: number;

  // Filtros e busca
  filters: UserFilters;
  sortBy: UserSort;

  // Usuário selecionado para edição
  selectedUser: User | null;

  // Modal states
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;

  // Bulk operations
  selectedUsers: string[];
  bulkActionLoading: boolean;
}

const initialState: UserManagementState = {
  users: [],
  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 0,
  totalUsers: 0,
  itemsPerPage: 10,

  filters: {
    search: '',
    accessLevel: null,
    isActive: null,
    dateRange: {
      start: null,
      end: null,
    },
  },

  sortBy: {
    field: 'createdAt',
    direction: 'desc',
  },

  selectedUser: null,

  showCreateModal: false,
  showEditModal: false,
  showDeleteModal: false,

  selectedUsers: [],
  bulkActionLoading: false,
};

// Async thunks para operações com API
export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async (params: { page?: number; filters?: Partial<UserFilters>; sort?: UserSort }) => {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar usuários');
    }

    return response.json();
  }
);

export const createUser = createAsyncThunk(
  'userManagement/createUser',
  async (userData: Partial<User>) => {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Falha ao criar usuário');
    }

    return response.json();
  }
);

export const updateUser = createAsyncThunk(
  'userManagement/updateUser',
  async ({ id, userData }: { id: string; userData: Partial<User> }) => {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar usuário');
    }

    return response.json();
  }
);

export const deleteUser = createAsyncThunk(
  'userManagement/deleteUser',
  async (id: string) => {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Falha ao excluir usuário');
    }

    return id;
  }
);

export const bulkUpdateUsers = createAsyncThunk(
  'userManagement/bulkUpdateUsers',
  async ({ userIds, updateData }: { userIds: string[]; updateData: Partial<User> }) => {
    const response = await fetch('/api/admin/users/bulk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds, updateData }),
    });

    if (!response.ok) {
      throw new Error('Falha na atualização em lote');
    }

    return response.json();
  }
);

export const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    // Filtros e busca
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.currentPage = 1; // Reset página ao filtrar
    },

    setAccessLevelFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.accessLevel = action.payload;
      state.currentPage = 1;
    },

    setActiveFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filters.isActive = action.payload;
      state.currentPage = 1;
    },

    setDateRangeFilter: (state, action: PayloadAction<{ start: Date | null; end: Date | null }>) => {
      state.filters.dateRange = action.payload;
      state.currentPage = 1;
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },

    // Ordenação
    setSortBy: (state, action: PayloadAction<UserSort>) => {
      state.sortBy = action.payload;
    },

    // Paginação
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },

    // Modal management
    openCreateModal: (state) => {
      state.showCreateModal = true;
      state.selectedUser = null;
    },

    openEditModal: (state, action: PayloadAction<User>) => {
      state.showEditModal = true;
      state.selectedUser = action.payload;
    },

    openDeleteModal: (state, action: PayloadAction<User>) => {
      state.showDeleteModal = true;
      state.selectedUser = action.payload;
    },

    closeModals: (state) => {
      state.showCreateModal = false;
      state.showEditModal = false;
      state.showDeleteModal = false;
      state.selectedUser = null;
    },

    // Seleção em lote
    toggleUserSelection: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const index = state.selectedUsers.indexOf(userId);

      if (index > -1) {
        state.selectedUsers.splice(index, 1);
      } else {
        state.selectedUsers.push(userId);
      }
    },

    selectAllUsers: (state) => {
      state.selectedUsers = state.users.map(user => user.id);
    },

    clearUserSelection: (state) => {
      state.selectedUsers = [];
    },

    // Error handling
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / state.itemsPerPage);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar usuários';
      });

    // Create user
    builder
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.totalUsers++;
        state.showCreateModal = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao criar usuário';
      });

    // Update user
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.showEditModal = false;
        state.selectedUser = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao atualizar usuário';
      });

    // Delete user
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.totalUsers--;
        state.showDeleteModal = false;
        state.selectedUser = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message || 'Erro ao excluir usuário';
      });

    // Bulk update
    builder
      .addCase(bulkUpdateUsers.pending, (state) => {
        state.bulkActionLoading = true;
      })
      .addCase(bulkUpdateUsers.fulfilled, (state, action) => {
        state.bulkActionLoading = false;
        // Update users in state
        action.payload.forEach((updatedUser: User) => {
          const index = state.users.findIndex(user => user.id === updatedUser.id);
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        });
        state.selectedUsers = [];
      })
      .addCase(bulkUpdateUsers.rejected, (state, action) => {
        state.bulkActionLoading = false;
        state.error = action.error.message || 'Erro na atualização em lote';
      });
  },
});

// Export das actions
export const {
  setSearch,
  setAccessLevelFilter,
  setActiveFilter,
  setDateRangeFilter,
  clearFilters,
  setSortBy,
  setCurrentPage,
  setItemsPerPage,
  openCreateModal,
  openEditModal,
  openDeleteModal,
  closeModals,
  toggleUserSelection,
  selectAllUsers,
  clearUserSelection,
  clearError,
} = userManagementSlice.actions;

export default userManagementSlice.reducer;
