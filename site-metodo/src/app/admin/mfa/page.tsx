'use client'

import { Suspense } from 'react'
import MfaConfiguracao from '@/components/mfa/MfaConfiguracao'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function MfaPage() {
  return (
  <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingSpinner />}>
        <MfaConfiguracao />
      </Suspense>
    </div>
  )
}
