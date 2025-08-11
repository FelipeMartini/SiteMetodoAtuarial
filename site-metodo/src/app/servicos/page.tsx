'use client'

import dynamic from 'next/dynamic'
const Servicos = dynamic(() => import('@/components/Servicos'), {
  ssr: false,
  loading: () => <div>Carregando serviços...</div>,
})

export default function Page() {
  return <Servicos />
}
