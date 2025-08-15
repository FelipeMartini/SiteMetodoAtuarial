
// Re-export canônico para compatibilidade com rotas que importavam do root
export { handlers } from './src/lib/auth'

// Importar o helper de sessão canônico, mas expor um shim `auth` que
// funciona tanto como helper (sem argumentos) quanto como wrapper de
// middleware (quando passado um handler). Isso mantém compatibilidade
// com imports antigos em `middleware.ts` que fazem `auth(handler)`.
import { auth as compatAuth } from './src/lib/auth'

export { compatAuth as compatAuthHelper }

export function auth(handler?: any) {
	// Se recebemos um handler, apenas retornamos o handler (shim mínimo)
	if (typeof handler === 'function') {
		return handler
	}
	// Se chamado sem argumentos, delegar ao helper compat (que retorna sessão)
	return compatAuth()
}

