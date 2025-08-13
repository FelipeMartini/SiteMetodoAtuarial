'use client'

import React from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { CalculosAtuariaisModerno } from '@/components/actuarial/CalculosAtuariaisModerno'

export default function CalculosAtuariaisPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cálculos Atuariais"
        description="Interface moderna para cálculos atuariais, gestão de tábuas de mortalidade e geração de relatórios."
      />
      
      <CalculosAtuariaisModerno />
    </div>
  )
}
