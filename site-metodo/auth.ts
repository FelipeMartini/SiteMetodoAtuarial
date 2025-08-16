
// Re-exports do arquivo canônico de auth para compatibilidade com imports antigos
export { handlers, authOptions, signIn, signOut } from './src/lib/auth'

// Importar o helper de sessão canônico e expor um shim compatível
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

