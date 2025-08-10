"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * Hook de autenticação unificado para uso client-side.
 * Fornece status, dados do usuário e erro, usando internamente useCurrentUser (React Query).
 * status: 'loading' | 'authenticated' | 'unauthenticated'
 */
export function useAuth() {
	const { data, isLoading, isError, error, refetch, isFetching } = useCurrentUser();
	let status: "loading" | "authenticated" | "unauthenticated" = "loading";
	if (isLoading || isFetching) status = "loading";
	else if (data?.user) status = "authenticated";
	else status = "unauthenticated";
	return {
		data: data?.user ?? null,
		status,
		isLoading,
		isError,
		error,
		refetch,
	};
}
