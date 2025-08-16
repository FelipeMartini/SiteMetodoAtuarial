"use client"

import { useEffect } from 'react'

export default function AuditoriaPageClient() {
  useEffect(() => {
    if (typeof window !== 'undefined') window.location.replace('/admin/observabilidade?type=auditoria')
  }, [])
  return null
}
