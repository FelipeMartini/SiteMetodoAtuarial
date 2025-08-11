'use client'
import { GraficoSimples } from './components/GraficoSimples'

export default function DashboardGraficos() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
      <GraficoSimples />
      {/* Adicionar outros gráficos integrados ao TanStack Query */}
    </div>
  )
}
