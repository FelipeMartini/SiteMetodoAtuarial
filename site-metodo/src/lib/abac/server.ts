import { checkPermissionDetailed, ABACContext, AuthResult } from './enforcer-abac-puro'

/**
 * Wrapper server-side para checagem ABAC com metadados.
 * Use em Server Components ou API routes para obter o AuthResult detalhado
 * e passar para componentes client-side que podem usar o resultado para
 * evitar uma segunda checagem imediata no cliente.
 */
export async function serverCheckPermissionDetailed(
  subject: string,
  object: string,
  action: string,
  context: ABACContext = {}
): Promise<AuthResult> {
  return await checkPermissionDetailed(subject, object, action, context)
}

export type { ABACContext, AuthResult }
