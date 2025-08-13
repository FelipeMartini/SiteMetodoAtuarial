// LayoutCliente - Placeholder para build
import React from 'react'

import { Header } from '@/components/Header'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { Toaster } from '@/components/ui/sonner'

export default function LayoutCliente({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className='min-h-screen flex flex-col bg-background text-foreground'>
        <Header />
        <main className='flex-1 w-full mx-auto max-w-7xl p-4'>{children}</main>
        <Toaster />
      </div>
    </AuthProvider>
  )
}
