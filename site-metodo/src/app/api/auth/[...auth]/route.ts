// Rota catch-all do Auth.js v5 (App Router) delegando GET/POST para authHandler
// Elimina necessidade de rotas manuais de signin/callback/providers/session
import { authHandler } from '@/auth'

export const GET = authHandler
export const POST = authHandler

// (Opcional) poderíamos exportar OPTIONS/HEAD se necessário futuramente
