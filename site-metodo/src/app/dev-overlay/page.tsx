"use client"

import { useEffect } from "react"

export default function DevOverlayPage() {
  useEffect(() => {
    // Lança um erro intencional no client para disparar o overlay de desenvolvimento.
    // Usamos setTimeout para garantir que o erro seja não-capturado por boundaries React
    const t = setTimeout(() => {
      throw new Error("Dev overlay test - ignore in production (timeout)")
    }, 0)

    return () => clearTimeout(t)
  }, [])

  return (
    <main>
      <h1>Dev Overlay Test</h1>
      <p>Se você está vendo isso, o erro ainda não foi lançado — recarregue para forçar.</p>
      <button
        onClick={() => {
          // Erro acionado manualmente — útil quando o overlay automático não aparece
          setTimeout(() => {
            throw new Error('Dev overlay test - manual trigger')
          }, 0)
        }}
        style={{ padding: '8px 12px', marginTop: 12 }}
      >
        Trigger error
      </button>
    </main>
  )
}
