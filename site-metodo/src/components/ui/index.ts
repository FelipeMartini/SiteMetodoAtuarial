// Barrel file UI - apenas componentes server-safe!
// NÃO exporte componentes que usam framer-motion ou client-only aqui!

export { Separator } from './separator'
export { Avatar, AvatarImage, AvatarFallback } from './avatar'
export { ComponenteBase } from './ComponenteBase'
export { Label } from './label'
export { Toaster } from './sonner'
export { Skeleton } from './skeleton'
export { Progress } from './progress'
export { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from './tooltip'
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'

// Componentes UX modernos
export { 
  LoadingCard,
  LoadingTable,
  LoadingList,
  LoadingStats,
  LoadingPage
} from './loading-states'
export { AsyncButton, ConfirmButton } from './feedback-buttons'
export { ConfirmDialog, InfoDialog } from './confirm-dialog'
export { PageWrapper, AsyncWrapper } from './page-wrapper'

// Adicione outros componentes server-safe conforme necessário
