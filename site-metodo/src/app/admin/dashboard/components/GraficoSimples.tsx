'use client'
import { useAcessosSemana } from '../hooks/useAcessosSemana'
import { Card } from '@/components/ui/card'
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function GraficoSimples() {
  const { data, isLoading, error } = useAcessosSemana()
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Acessos',
        data: data?.data || [],
        backgroundColor: '#6366f1',
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
    <Card className='p-4 bg-background/80 shadow rounded-xl'>
      <h2 className='font-bold text-lg mb-2 text-primary'>Acessos da Semana</h2>
      {isLoading ? (
        <div className='text-muted-foreground'>Carregando...</div>
      ) : error ? (
        <div className='text-red-500'>Erro ao carregar gráfico</div>
      ) : (
        <Bar data={chartData} options={options} height={180} />
      )}
    </Card>
  )
}
