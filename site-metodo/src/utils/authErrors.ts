// Enum de códigos/mensagens padronizadas de erro relacionados a autenticação/registro
export enum AuthErrorCode {
  EMAIL_JA_EXISTE = 'EMAIL_JA_EXISTE',
  DADOS_INVALIDOS = 'DADOS_INVALIDOS',
  ERRO_INTERNO = 'ERRO_INTERNO',
}

export function mapServerMessageToCode(message?: string) {
  if (!message) return undefined
  if (/já existe/i.test(message)) return AuthErrorCode.EMAIL_JA_EXISTE
  if (/inválid|invalido/i.test(message)) return AuthErrorCode.DADOS_INVALIDOS
  if (/interno/i.test(message)) return AuthErrorCode.ERRO_INTERNO
  return undefined
}

export function mensagemAmigavel(code?: AuthErrorCode, fallback?: string): string {
  switch (code) {
    case AuthErrorCode.EMAIL_JA_EXISTE:
      return 'Já existe um usuário cadastrado com este email.'
    case AuthErrorCode.DADOS_INVALIDOS:
      return 'Verifique os dados informados.'
    case AuthErrorCode.ERRO_INTERNO:
      return 'Ocorreu um erro interno. Tente novamente.'
    default:
      return fallback || 'Falha ao processar sua requisição.'
  }
}
