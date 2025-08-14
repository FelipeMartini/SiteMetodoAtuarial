declare module 'date-fns' {
  export function formatDistanceToNow(date: Date | number, options?: any): string
  export function format(date: Date | number, formatStr: string, options?: any): string
}

declare module 'date-fns/locale' {
  export const ptBR: any
}
