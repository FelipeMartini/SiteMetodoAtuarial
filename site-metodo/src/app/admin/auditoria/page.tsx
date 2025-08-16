import { redirect } from 'next/navigation'

export default function LegacyAuditoriaRedirect() {
  redirect('/admin/observabilidade?type=auditoria')
}
