/**
 * ABAC public facade
 *
 * Re-exporta as funções do enforcer e documenta a recomendação:
 * - `checkABACPermission` é a fonte da verdade e retorna um objeto com metadata (AuthResult).
 * - `hasPermission` também retorna o AuthResult (útil quando precisa de metadata).
 * - `canAccess` e `isAdmin` eram wrappers booleanos; foram consolidados.
 *
 * Uso recomendado:
 * - No backend (rotas/API/middleware) chame `checkABACPermission` ou `hasPermission` para ter metadata quando necessário.
 * - Para componentes UI que rodam no browser, use `src/lib/abac/client.ts` -> `checkClientPermission` (boolean) que chama a rota `/api/abac/check` e tem cache local.
 */

export { checkABACPermission, checkPermissionDetailed, addABACPolicy, removeABACPolicy, getAllABACPolicies, reloadABACPolicies } from './enforcer-abac-puro'
import type { ABACContext, AuthResult } from './enforcer-abac-puro'

export type { ABACContext, AuthResult }
