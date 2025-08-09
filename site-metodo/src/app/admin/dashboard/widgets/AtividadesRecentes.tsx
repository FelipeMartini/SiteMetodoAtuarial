"use client"
import { useAtividades } from "../hooks/useAtividades"
import { Card } from "@/components/ui/card"

export default function AtividadesRecentes() {
  const { data, isLoading, error } = useAtividades()
  return (
    <Card className="p-4 bg-background/80 shadow rounded-xl">
      <h2 className="font-bold text-lg mb-2 text-primary">Atividades Recentes</h2>
      {isLoading ? (
        <div className="text-muted-foreground">Carregando...</div>
      ) : error ? (
        <div className="text-red-500">Erro ao carregar atividades</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {data?.map((a: any, i: number) => (
            <li key={i} className="flex justify-between text-sm text-muted-foreground">
              <span><b>{a.usuario}</b> {a.acao}</span>
              <span className="text-xs">{a.data}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
