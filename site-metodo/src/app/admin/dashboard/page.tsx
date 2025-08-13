
'use client'
import { ABACProtectedPage } from '@/lib/abac/hoc'

import DashboardCards from './DashboardCards'
import DashboardWidgets from './DashboardWidgets'
import DashboardGraficos from './DashboardGraficos'

export default function DashboardPage() {
  return (
    <ABACProtectedPage object='admin:dashboard' action='read'>
      <main className='flex flex-col gap-8 p-8 w-full'>
        <h1 className='text-3xl font-bold text-primary-foreground'>Dashboard</h1>
        <DashboardCards />
        <DashboardWidgets />
        <DashboardGraficos />
        {/* Próximos: integração TanStack Query */}
      </main>
    </ABACProtectedPage>
  )
}
