"use client"

import { useState } from 'react'

export default function DebugOverlayPage() {
  const [msg, setMsg] = useState('')

  return (
    <main style={{ padding: 20 }}>
      <h1>Debug Overlay Helper</h1>
      <p>Use os botões abaixo para testar overlays e erros client-side.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button
          onClick={() => {
            setTimeout(() => {
              throw new Error('Debug overlay: triggered error')
            }, 0)
          }}
        >
          Trigger client error
        </button>
        <button
          onClick={() => {
            // Injeta um overlay DOM direto
            const existing = document.getElementById('__debug_static_overlay')
            if (existing) return
            const el = document.createElement('div')
            el.id = '__debug_static_overlay'
            el.style.position = 'fixed'
            el.style.inset = '0'
            el.style.background = 'rgba(0,0,0,0.85)'
            el.style.zIndex = '2147483647'
            el.style.color = 'white'
            el.style.padding = '20px'
            el.style.overflow = 'auto'
            el.innerHTML = '<h2>Static Debug Overlay</h2><p>This overlay was injected by /debug-overlay</p>'
            document.body.appendChild(el)
          }}
        >
          Inject static overlay
        </button>
        <button
          onClick={() => {
            const el = document.getElementById('__debug_static_overlay')
            el && el.remove()
          }}
        >
          Remove static overlay
        </button>
      </div>
      <div style={{ marginTop: 16 }}>
        <label>Mensagem de teste</label>
        <input value={msg} onChange={(e) => setMsg(e.target.value)} style={{ marginLeft: 8 }} />
      </div>
    </main>
  )
}
