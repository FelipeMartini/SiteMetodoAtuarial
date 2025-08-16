// Util de formatação de data pt-BR centralizado
export function formatDateTime(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
  try {
    const d = (date instanceof Date) ? date : new Date(date)
    if (isNaN(d.getTime())) return 'Data inválida'
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', ...opts }).format(d)
  } catch {
    return 'Data inválida'
  }
}

export function formatDate(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
  try {
    const d = (date instanceof Date) ? date : new Date(date)
    if (isNaN(d.getTime())) return 'Data inválida'
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', ...opts }).format(d)
  } catch {
    return 'Data inválida'
  }
}

export function formatTime(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
  try {
    const d = (date instanceof Date) ? date : new Date(date)
    if (isNaN(d.getTime())) return 'Hora inválida'
    return new Intl.DateTimeFormat('pt-BR', { timeStyle: 'medium', ...opts }).format(d)
  } catch {
    return 'Hora inválida'
  }
}
