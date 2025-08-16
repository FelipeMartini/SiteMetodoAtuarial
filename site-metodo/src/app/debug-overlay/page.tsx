"use client"

import { useEffect, useRef, useState } from 'react'

export default function DebugOverlayPage() {
  const [msg, setMsg] = useState('')
  const lastErrorRef = useRef<string | null>(null)

  useEffect(() => {
    // Cria overlay persistente para capturar erros e mantê-los visíveis
    const id = '__debug_persistent_overlay'
    let overlay = document.getElementById(id) as HTMLDivElement | null
    function makeOverlay() {
      if (overlay) return overlay
      overlay = document.createElement('div')
      overlay.id = id
      overlay.style.position = 'fixed'
      overlay.style.inset = '0'
      overlay.style.background = 'rgba(0,0,0,0.9)'
      overlay.style.zIndex = '2147483647'
      overlay.style.color = 'white'
      overlay.style.padding = '20px'
      overlay.style.overflow = 'auto'
      overlay.style.fontFamily = 'monospace, monospace'
      overlay.style.fontSize = '12px'
      overlay.style.display = 'none'

      const closeBtn = document.createElement('button')
      closeBtn.textContent = 'Close overlay'
      closeBtn.style.position = 'absolute'
      closeBtn.style.right = '12px'
      closeBtn.style.top = '12px'
        closeBtn.onclick = () => {
          if (overlay) overlay.style.display = 'none'
        }

      const content = document.createElement('pre')
      content.id = '__debug_persistent_overlay_content'
      content.style.whiteSpace = 'pre-wrap'
      content.style.marginTop = '40px'

      overlay.appendChild(closeBtn)
      overlay.appendChild(content)
      document.body.appendChild(overlay)
      return overlay
    }

    function showOverlay(text: string) {
      const ov = makeOverlay()
      const content = document.getElementById('__debug_persistent_overlay_content')
      if (content) content.textContent = text
      ov.style.display = 'block'
    }

    // Injetar painel de controle global e esconder o resto do site
    const controlId = '__debug_control_panel'
    let control = document.getElementById(controlId) as HTMLDivElement | null
    const styleId = '__debug_hide_site_css'
    function makeControl() {
      if (control) return control
      control = document.createElement('div')
      control.id = controlId
      control.style.position = 'fixed'
      control.style.left = '12px'
      control.style.top = '12px'
      control.style.zIndex = '2147483647'
      control.style.background = '#111'
      control.style.color = 'white'
      control.style.padding = '8px'
      control.style.borderRadius = '8px'
      control.style.fontFamily = 'sans-serif'
      control.style.fontSize = '13px'
      control.style.display = 'block'

      const b1 = document.createElement('button')
      b1.textContent = 'Trigger client error'
      b1.onclick = () => {
        setTimeout(() => {
          throw new Error('Debug overlay: triggered error')
        }, 0)
      }
      const b2 = document.createElement('button')
      b2.textContent = 'Inject static overlay'
      b2.onclick = () => {
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
      }
      const b3 = document.createElement('button')
      b3.textContent = 'Remove static overlay'
      b3.onclick = () => {
        const el = document.getElementById('__debug_static_overlay')
    if (el) el.remove()
      }
      const b4 = document.createElement('button')
      b4.textContent = 'Show last error'
      b4.onclick = () => {
        const last = (document.getElementById('__debug_persistent_overlay_content') as HTMLElement)
        if (last && last.textContent) {
          const ov = document.getElementById('__debug_persistent_overlay')
          if (ov) ov.style.display = 'block'
        } else {
          alert('Nenhum erro capturado ainda')
        }
      }

      // estilos rápidos para botões
      [b1, b2, b3, b4].forEach((b) => {
        b.style.margin = '4px'
        b.style.padding = '6px 8px'
        b.style.background = '#222'
        b.style.color = 'white'
        b.style.border = '1px solid #333'
        b.style.borderRadius = '6px'
        b.style.cursor = 'pointer'
      })

      control.appendChild(b1)
      control.appendChild(b2)
      control.appendChild(b3)
      control.appendChild(b4)
      document.body.appendChild(control)

      // Injetar CSS que esconde todo o resto do site, exceto painéis e overlays
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        /* esconder tudo para focalizar no debug */
        body > * { display: none !important; }
        #${controlId}, #__debug_persistent_overlay, #__debug_static_overlay { display: block !important; all: initial !important; }
        #${controlId} button { all: unset; display: inline-block; margin: 4px; padding: 6px 8px; background: #222; color: #fff; border-radius: 6px; cursor: pointer; }
      `
      document.head.appendChild(style)
      return control
    }

    makeControl()

    function onErrorHandler(ev: any | ErrorEvent) {
      const text = ev?.error?.stack || (ev?.message ? `${ev.message}\n${ev?.stack || ''}` : String(ev))
      lastErrorRef.current = text
      showOverlay(`Client error captured:\n\n${text}`)
    }

    function onRejection(ev: PromiseRejectionEvent) {
      const text = ev?.reason?.stack || String(ev?.reason)
      lastErrorRef.current = text
      showOverlay(`Unhandled rejection captured:\n\n${text}`)
    }

    window.addEventListener('error', onErrorHandler)
    window.addEventListener('unhandledrejection', onRejection)

    return () => {
      window.removeEventListener('error', onErrorHandler)
      window.removeEventListener('unhandledrejection', onRejection)
      const el = document.getElementById(id)
    if (el) el.remove()
      const ctrl = document.getElementById(controlId)
    if (ctrl) ctrl.remove()
      const s = document.getElementById(styleId)
    if (s) s.remove()
    }
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1>Debug Overlay Helper</h1>
      <p>Use os botões abaixo para testar overlays e erros client-side.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            // dispara um erro capturado pelo listener e mostra overlay persistente
            setTimeout(() => {
              // throw dentro de setTimeout cria um erro não capturado pelo React e cai no window.onerror
              // eslint-disable-next-line no-throw-literal
              throw new Error('Debug overlay: triggered error')
            }, 0)
          }}
        >
          Trigger client error
        </button>
        <button
          onClick={() => {
            // Injeta um overlay DOM direto (estático)
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
            if (el) el.remove()
          }}
        >
          Remove static overlay
        </button>
        <button
          onClick={() => {
            // mostra o último erro capturado novamente (se existir)
            const last = (document.getElementById('__debug_persistent_overlay_content') as HTMLElement)
            if (last && last.textContent) {
              const ov = document.getElementById('__debug_persistent_overlay')
              if (ov) ov.style.display = 'block'
            } else {
              alert('Nenhum erro capturado ainda')
            }
          }}
        >
          Show last captured error
        </button>
      </div>
      <div style={{ marginTop: 16 }}>
        <label>Mensagem de teste</label>
        <input value={msg} onChange={(e) => setMsg(e.target.value)} style={{ marginLeft: 8 }} />
      </div>
    </main>
  )
}
