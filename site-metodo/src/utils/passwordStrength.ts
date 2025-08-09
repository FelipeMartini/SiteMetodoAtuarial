// Funções simples para calcular força da senha (heurística leve)
export interface PasswordStrength {
  score: number // 0..4
  label: string
  suggestions: string[]
}

export function calcularForcaSenha(s: string): PasswordStrength {
  let score = 0
  const suggestions: string[] = []
  if (s.length >= 6) score++ ; else suggestions.push('Use ao menos 6 caracteres')
  if (s.length >= 10) score++ ; else suggestions.push('Use 10+ caracteres para mais segurança')
  if (/[A-Z]/.test(s) && /[a-z]/.test(s)) score++ ; else suggestions.push('Misture maiúsculas e minúsculas')
  if (/\d/.test(s) && /[^A-Za-z0-9]/.test(s)) score++ ; else suggestions.push('Inclua número e símbolo')
  const labels = ['Muito fraca','Fraca','Ok','Forte','Excelente']
  return { score, label: labels[score] || 'Muito fraca', suggestions }
}
