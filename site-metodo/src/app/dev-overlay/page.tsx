"use client"

import { useEffect } from "react"

export default function DevOverlayPage() {
  useEffect(() => {
    // Lança um erro intencional no client para disparar o overlay de desenvolvimento
    throw new Error("Dev overlay test - ignore in production")
  }, [])

  return (
    <main>
      <h1>Dev Overlay Test</h1>
      <p>Se você está vendo isso, o erro ainda não foi lançado — recarregue para forçar.</p>
    </main>
  )
}
