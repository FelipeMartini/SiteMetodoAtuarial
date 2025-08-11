// Exemplo de uso do FeatureFlagStatus para exibir um banner se a flag 'nova_home' estiver ativa
'use client'
import { FeatureFlagStatus } from '@/components/feature-flags/FeatureFlagStatus'

export default function BannerNovaHome() {
  return (
    <FeatureFlagStatus flag='nova_home'>
      <div className='bg-green-100 text-green-900 p-4 rounded mb-4'>
        🚀 Nova Home ativada! Veja as novidades em primeira mão.
      </div>
    </FeatureFlagStatus>
  )
}
