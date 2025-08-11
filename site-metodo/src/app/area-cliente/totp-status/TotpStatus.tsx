'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

export default function TotpStatus() {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/totp-status').then(async res => {
      const data = await res.json()
      setEnabled(data.enabled)
    })
  }, [])

  const handleDisable = async () => {
    setErro(null)
    setOk(null)
    const res = await fetch('/api/auth/totp-disable', { method: 'POST' })
    const data = await res.json()
    if (!res.ok || !data.ok) {
      setErro(data.error || 'Erro ao desativar MFA.')
      return
    }
    setOk('MFA desativado com sucesso.')
    setEnabled(false)
  }

  if (enabled === null) return null

  return (
    <div className='my-4'>
      {enabled ? (
        <>
          <Alert variant='default'>
            MFA TOTP está <b>ATIVO</b> para sua conta.
          </Alert>
          <Button onClick={handleDisable} variant='destructive' className='mt-2'>
            Desativar MFA
          </Button>
        </>
      ) : (
        <Alert variant='default'>
          MFA TOTP está <b>INATIVO</b> para sua conta.
        </Alert>
      )}
      {erro && <Alert variant='destructive'>{erro}</Alert>}
      {ok && <Alert variant='default'>{ok}</Alert>}
    </div>
  )
}
