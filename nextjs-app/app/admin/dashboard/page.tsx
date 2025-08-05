'use client';

import React from 'react';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import AdminDashboard from './AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <ErrorBoundary>
      <AdminDashboard />
    </ErrorBoundary>
  );
}
