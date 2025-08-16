import { useToast } from '@/hooks/use-toast'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastMessageOptions {
  title?: string
  description?: string
  duration?: number
}

export function useStandardToast() {
  const { toast } = useToast()

  const showToast = (type: ToastType, message: string, options?: ToastMessageOptions) => {
    const { title, description, duration: _duration } = options || {}
    
    toast({
      title: title || getDefaultTitle(type),
      description: description || message,
      variant: type === 'success' || type === 'info' ? 'default' : 'destructive'
    })
  }

  const success = (message: string, options?: ToastMessageOptions) => {
    showToast('success', message, options)
  }

  const error = (message: string, options?: ToastMessageOptions) => {
    showToast('error', message, options)
  }

  const warning = (message: string, options?: ToastMessageOptions) => {
    showToast('warning', message, options)
  }

  const info = (message: string, options?: ToastMessageOptions) => {
    showToast('info', message, options)
  }

  // Funções específicas para ações comuns
  const markAsReadSuccess = () => success('Notificação marcada como lida')
  const markAsReadError = () => error('Erro ao marcar notificação como lida')
  const createNotificationSuccess = () => success('Notificação criada com sucesso')
  const createNotificationError = () => error('Erro ao criar notificação')
  const exportSuccess = (format: string) => success(`Export ${format.toUpperCase()} realizado com sucesso`)
  const exportError = (format: string) => error(`Erro ao exportar arquivo ${format.toUpperCase()}`)

  return {
    toast: showToast,
    success,
    error,
    warning,
    info,
    // Ações específicas
    markAsReadSuccess,
    markAsReadError,
    createNotificationSuccess,
    createNotificationError,
    exportSuccess,
    exportError,
  }
}

function getDefaultTitle(type: ToastType): string {
  const titles: Record<ToastType, string> = {
    success: 'Sucesso',
    error: 'Erro',
    warning: 'Atenção',
    info: 'Informação'
  }
  return titles[type]
}
