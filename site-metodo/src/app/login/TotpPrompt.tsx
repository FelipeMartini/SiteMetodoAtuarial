'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'

export default function TotpPrompt({ onVerify }: { onVerify: () => void }) {
  const [token, setToken] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    const res = await fetch('/api/auth/totp-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok || !data.ok) {
      setErro(data.error || 'Token inválido.')
      return
    }
    onVerify()
  }

  return (
    <Card className='max-w-md mx-auto mt-8'>
      <CardHeader>
        <CardTitle>Verificação em 2 Fatores</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className='flex flex-col gap-2'>
          <Input
            type='text'
            placeholder='Digite o código do app'
            value={token}
            onChange={e => setToken(e.target.value)}
            maxLength={6}
            minLength={6}
            required
            autoFocus
          />
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar'}
          </Button>
        </form>
        {erro && <Alert variant='destructive'>{erro}</Alert>}
      </CardContent>
    </Card>
  )
}
