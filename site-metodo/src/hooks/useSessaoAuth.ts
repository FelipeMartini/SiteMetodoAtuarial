import { useEffect, useState } from 'react';


export interface SessaoUsuario {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
		accessLevel?: number;
		emailVerified?: string | Date | null;
		isActive?: boolean;
		id?: string;
		[key: string]: unknown;
	};
	expires?: string;
}

export function useSessaoAuth() {
		const [session, setSession] = useState<SessaoUsuario | null>(null);
		const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

		useEffect(() => {
			let ativo = true;
			async function fetchSession() {
				setStatus('loading');
				try {
					const res = await fetch('/api/auth/session');
					if (!res.ok) throw new Error('Erro ao buscar sessão');
					const data: SessaoUsuario = await res.json();
					if (ativo) {
						if (data && data.user) {
							setSession(data);
							setStatus('authenticated');
						} else {
							setSession(null);
							setStatus('unauthenticated');
						}
					}
				} catch {
					if (ativo) {
						setSession(null);
						setStatus('unauthenticated');
					}
				}
			}
			fetchSession();
			return () => { ativo = false; };
		}, []);

		return { data: session, status };
}
// Arquivo legado removido: useSessaoAuth não é mais necessário com padrão Auth.js v5.