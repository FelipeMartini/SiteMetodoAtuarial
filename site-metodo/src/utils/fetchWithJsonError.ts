// Helper fetchWithJsonError: padroniza erros e parsing JSON
export async function fetchWithJsonError(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init)
  let data: any = null
  try { data = await res.json() } catch { /* ignore */ }
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Erro HTTP ${res.status}`
    const err: any = new Error(msg)
    err.status = res.status
    err.details = data?.detalhes || data
    throw err
  }
  return data
}
