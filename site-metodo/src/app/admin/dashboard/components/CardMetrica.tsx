'use client'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CardMetricaProps {
  titulo: string
  valor: string | number
  icone?: React.ReactNode
  className?: string
}

export function CardMetrica({ titulo, valor, icone, className }: CardMetricaProps) {
  return (
    <Card
      className={cn(
        'flex flex-col gap-2 p-6 bg-gradient-to-br from-primary/90 to-background/80 shadow-lg rounded-xl border-none',
        className
      )}
    >
      <div className='flex items-center gap-2 text-primary-foreground'>
        {icone && <span className='text-2xl'>{icone}</span>}
        <span className='font-bold text-lg'>{titulo}</span>
      </div>
      <span className='text-4xl font-extrabold text-primary-foreground'>{valor}</span>
    </Card>
  )
}
