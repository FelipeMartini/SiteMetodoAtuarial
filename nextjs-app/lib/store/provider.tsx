// Provider Redux para o aplicativo Next.js
// Componente que envolve o app e fornece o store Redux

'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './index';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
