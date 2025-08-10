"use client"
import { useSession } from "next-auth/react"

export function useCurrentUser() {
  const { data: session, status, update } = useSession()
  
  return {
    data: session ? { user: session.user } : null,
    isLoading: status === "loading",
    isError: false,
    error: null,
    refetch: update,
    isFetching: status === "loading",
  }
}
