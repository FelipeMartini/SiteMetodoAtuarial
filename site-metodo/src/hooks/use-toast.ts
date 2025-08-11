import { toast } from 'sonner'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const useToast = () => {
  return {
    toast: ({ title, description, variant }: ToastProps) => {
      if (variant === 'destructive') {
        toast.error(title, {
          description,
        })
      } else {
        toast.success(title, {
          description,
        })
      }
    },
  }
}
