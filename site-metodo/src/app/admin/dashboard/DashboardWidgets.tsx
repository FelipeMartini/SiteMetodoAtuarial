'use client'
import { AtividadesRecentes } from './widgets'

export default function DashboardWidgets() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
      <AtividadesRecentes />
      {/* Adicionar outros widgets dinâmicos aqui */}
    </div>
  )
}
