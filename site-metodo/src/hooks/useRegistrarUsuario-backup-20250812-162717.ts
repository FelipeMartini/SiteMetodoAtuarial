// use client
// Hook de registro de usuário encapsulando react-query mutate
import { useMutation } from '@tanstack/react-query'
import { mapServerMessageToCode } from '@/utils/authErrors'

interface RegistroPayload {
  nome: string
  email: string
  senha: string
}
type RegistroUser = { id: string; email: string; name?: string | null; accessLevel?: number }
type ErrorCode = string | undefined
interface RegistroResult {
  ok: boolean
  user?: RegistroUser
  errorCode?: ErrorCode
  mensagem?: string
}

async function registrar(payload: RegistroPayload): Promise<RegistroResult> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: payload.nome, email: payload.email, password: payload.senha }),
  })
  type ApiSuccess = { user: RegistroUser }
  type ApiError = { message?: string }
  const raw = (await res.json().catch(() => ({}) as unknown)) as unknown
  const dataSuccess = raw as ApiSuccess
  const dataError = raw as ApiError
  if (!res.ok) {
    const code = mapServerMessageToCode(dataError.message)
    return { ok: false, errorCode: code, mensagem: dataError.message }
  }
  return { ok: true, user: dataSuccess.user }
}

export function useRegistrarUsuario() {
  return useMutation({ mutationFn: registrar })
}
