/* Utilitários para sanitização de campos de política ABAC */
export function sanitizePolicyField(value: unknown): string | null {
  if (value === null || value === undefined) return null
  let s = String(value)
  // Normalizar espaços não quebra-linha e remover control chars
  s = s.replace(/\u00A0/g, ' ')
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  s = s.replace(/[ \t\f\v\u00A0]+/g, ' ')
  s = s.trim()
  // Evitar que JSON mal formado quebre parser: se começar com { ou [ , tentar validar JSON
  if ((s.startsWith('{') || s.startsWith('['))) {
    try { JSON.parse(s) } catch (e) { s = s.replace(/"/g, '\\"') }
  }
  return s === '' ? null : s
}

export function sanitizePolicyArray(parts: Array<unknown>): string[] {
  return parts.map(sanitizePolicyField).filter((v): v is string => v !== null)
}
