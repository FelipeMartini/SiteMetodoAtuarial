// Store Redux Toolkit para o dashboard administrativo
// Baseado nos padrões do ArchitectUI React Theme

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import themeOptionsReducer from './slices/themeOptionsSlice';
import userManagementReducer from './slices/userManagementSlice';
import dashboardReducer from './slices/dashboardSlice';
import authReducer from './slices/authSlice';

// Configuração da store Redux Toolkit
export const store = configureStore({
  reducer: {
    themeOptions: themeOptionsReducer,
    userManagement: userManagementReducer,
    dashboard: dashboardReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora actions específicas para evitar warnings desnecessários
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignora campos de data nos estados
        ignoredPaths: ['auth.lastActivity', 'auth.sessionExpiry', 'dashboard.lastUpdated'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks tipados para useSelector e useDispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
