// use client
// Hook de registro de usuário encapsulando react-query mutate
import { useMutation } from '@tanstack/react-query'
import { mapServerMessageToCode } from '@/utils/authErrors'

interface RegistroPayload { nome: string; email: string; senha: string }
interface RegistroResult { ok: boolean; user?: any; errorCode?: any; mensagem?: string }

async function registrar(payload: RegistroPayload): Promise<RegistroResult> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: payload.nome, email: payload.email, password: payload.senha })
  })
  const data = await res.json().catch(()=> ({}))
  if (!res.ok) {
    const code = mapServerMessageToCode(data.message)
    return { ok: false, errorCode: code, mensagem: data.message }
  }
  return { ok: true, user: data.user }
}

export function useRegistrarUsuario() {
  return useMutation({ mutationFn: registrar })
}
