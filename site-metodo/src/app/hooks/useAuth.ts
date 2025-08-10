"use client";
import { useSession } from "next-auth/react";

/**
 * Hook de autenticação unificado para uso client-side.
 * Usa diretamente o next-auth/react para evitar conflicts.
 */
export function useAuth() {
	const { data: session, status, update } = useSession();
	
	let authStatus: "loading" | "authenticated" | "unauthenticated" = "loading";
	if (status === "loading") authStatus = "loading";
	else if (session?.user) authStatus = "authenticated";
	else authStatus = "unauthenticated";
	
	return {
		data: session, // Retorna a sessão completa, não apenas session.user
		status: authStatus,
		isLoading: status === "loading",
		isError: false,
		error: null,
		refetch: update,
	};
}
