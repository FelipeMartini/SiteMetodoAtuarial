"use client"
import { Card } from "@/components/ui/card"
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useUsuarios } from "../hooks/useUsuarios"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface UsuarioResumo { role: string }
export function GraficoUsuarios() {
  const { data, isLoading, error } = useUsuarios()
  // Simulação: contar usuários por role
  const roles = ["admin", "editor", "viewer"]
  const contagem = roles.map(role => data?.filter((u: UsuarioResumo) => u.role === role).length || 0)
  const chartData = {
    labels: roles,
    datasets: [
      {
        label: 'Usuários por Permissão',
        data: contagem,
        backgroundColor: '#10b981',
        borderRadius: 8,
      },
    ],
  }
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#e5e7eb' } },
    },
  }
  return (
    <Card className="p-4 bg-background/80 shadow rounded-xl">
      <h2 className="font-bold text-lg mb-2 text-primary">Usuários por Permissão</h2>
      {isLoading ? (
        <div className="text-muted-foreground">Carregando...</div>
      ) : error ? (
        <div className="text-red-500">Erro ao carregar gráfico</div>
      ) : (
        <Bar data={chartData} options={options} height={180} />
      )}
    </Card>
  )
}
