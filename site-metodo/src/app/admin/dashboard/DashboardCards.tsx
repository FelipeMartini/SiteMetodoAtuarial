"use client"
import { CardMetrica, UsuariosCard } from "./components"
import { useQuery } from "@tanstack/react-query"

function PermissoesCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['permissoes'],
    queryFn: async () => {
      const res = await fetch('/admin/dashboard/api/permissoes')
      if (!res.ok) throw new Error('Erro ao buscar permissões')
      return res.json()
    },
  })
  return (
    <CardMetrica
      titulo="Permissões"
      valor={isLoading ? '...' : data?.length ?? 0}
      icone={null}
      className="bg-gradient-to-br from-primary/90 to-background/80"
    />
  )
}

function AcessosCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['acessos'],
    queryFn: async () => {
      const res = await fetch('/admin/dashboard/api/acessos')
      if (!res.ok) throw new Error('Erro ao buscar acessos')
      return res.json()
    },
  })
  return (
    <CardMetrica
      titulo="Acessos"
      valor={isLoading ? '...' : data?.total ?? 0}
      icone={null}
      className="bg-gradient-to-br from-primary/90 to-background/80"
    />
  )
}

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
      <UsuariosCard />
      <AcessosCard />
      <PermissoesCard />
    </div>
  )
}
