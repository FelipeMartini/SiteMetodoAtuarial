// Util de formatação de data pt-BR centralizado
export function formatDateTime(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
  const d = (date instanceof Date) ? date : new Date(date)
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', ...opts }).format(d)
}

export function formatDate(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
  const d = (date instanceof Date) ? date : new Date(date)
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', ...opts }).format(d)
}
