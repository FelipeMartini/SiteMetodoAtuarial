"use client"

import { useEffect } from 'react'

export default function AuditLogsRedirect() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // redireciona o usuário para a nova central de observabilidade
      window.location.replace('/admin/observabilidade?type=auditoria')
    }
  }, [])

  return (
    <div className="p-6 text-sm">
      <p className="mb-2 font-medium">Logs de auditoria migrados para a central unificada.</p>
      <p>Nova rota: <a className="underline" href="/admin/observabilidade?type=auditoria">/admin/observabilidade</a></p>
    </div>
  )
}
