"use client"
import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Me { id: string; name?: string | null; email?: string | null }

export default function PerfilPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/auth/session')
      if (!res.ok) throw new Error('Sessão inválida')
      return res.json() as Promise<{ user?: Me }>
    }
  })
  const [nome, setNome] = useState('')
  React.useEffect(()=> { if (data?.user?.name) setNome(data.user.name) }, [data?.user?.name])

  const mut = useMutation({
    mutationFn: async () => {
      if (!data?.user?.id) return
      const res = await fetch(`/api/usuarios/${data.user.id}`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ name: nome }) })
      return res.json()
    }
  })

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Perfil</h1>
      {isLoading && <p>Carregando...</p>}
      {data?.user && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input value={nome} onChange={e=> setNome(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={data.user.email || ''} disabled className="mt-1" />
          </div>
          <Button onClick={()=> mut.mutate()} disabled={mut.isPending}>{mut.isPending ? 'Salvando...' : 'Salvar alterações'}</Button>
          {mut.data && !mut.data.ok && <p className="text-sm text-red-600">Falha ao salvar</p>}
          {mut.data && mut.data.ok && <p className="text-sm text-green-600">Atualizado!</p>}
        </div>
      )}
    </div>
  )
}
