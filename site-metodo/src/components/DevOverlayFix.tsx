"use client"

import React from 'react'

// Estilos mínimos de overlay para desenvolvimento. Injetados apenas no cliente quando NODE_ENV=development
const css = `
/* overlay fix injetado em dev para manter nossos estilos e ainda mostrar o overlay */
body > .nextjs-portal,
body > #nextjs-portal,
body > #__nextjs-overlay-root,
body > #webpack-dev-server-client-overlay,
body > iframe[id^="webpack-dev-server-client-overlay"],
body > .react-dev-overlay,
body > .react-error-overlay,
body > .nextjs-toast-errors-parent {
  all: initial !important;
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  transform: none !important;
  z-index: 2147483647 !important;
  font-size: 16px !important;
  pointer-events: auto !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}

body > .nextjs-portal *,
body > #__nextjs-overlay-root *,
body > #webpack-dev-server-client-overlay *,
body > .react-error-overlay * {
  transform: none !important;
  position: static !important;
  box-sizing: border-box !important;
}
`

export default function DevOverlayFix() {
  React.useEffect(() => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === ''
    if (!isDev) return

    // Aplica estilos via <style> inicial (fallback)
    const style = document.createElement('style')
    style.setAttribute('data-dev-overlay-fix', '1')
    style.innerHTML = css
    document.head.appendChild(style)

    // Seletores de overlay conhecidos
    const selectors = [
      '.nextjs-portal',
      '#nextjs-portal',
      '#__nextjs-overlay-root',
      '#webpack-dev-server-client-overlay',
      '.react-dev-overlay',
      '.react-error-overlay',
      '.nextjs-toast-errors-parent',
      '.next-dev-overlay',
    ]

    function applyInlineFix(el: Element) {
      try {
        const e = el as HTMLElement
  ;(e.style as any).setProperty('position', 'fixed', 'important')
  ;(e.style as any).setProperty('inset', '0', 'important')
  ;(e.style as any).setProperty('width', '100vw', 'important')
  ;(e.style as any).setProperty('height', '100vh', 'important')
  ;(e.style as any).setProperty('z-index', '2147483647', 'important')
  ;(e.style as any).setProperty('transform', 'none', 'important')
  ;(e.style as any).setProperty('pointer-events', 'auto', 'important')
  ;(e.style as any).setProperty('font-size', '16px', 'important')
        // Força aos filhos também
        Array.from(e.querySelectorAll('*')).forEach((child) => {
          try {
            ;(((child as HTMLElement).style) as any).setProperty('transform', 'none', 'important')
            ;(((child as HTMLElement).style) as any).setProperty('position', 'static', 'important')
          } catch (err) {
            // ignore
          }
        })

        // Remover transform dos ancestrais até <body> para evitar containing blocks
        let p: Element | null = e.parentElement
        while (p && p.tagName.toLowerCase() !== 'body') {
          try {
            ;(((p as HTMLElement).style) as any).setProperty('transform', 'none', 'important')
          } catch (err) {
            // ignore
          }
          p = p.parentElement
        }
      } catch (err) {
        // ignore
      }
    }

    // Aplica imediatamente a nós já presentes
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(applyInlineFix)
    })

    // Observador para aplicar quando overlays forem injetados dinamicamente
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          m.addedNodes.forEach(node => {
            if (!(node instanceof Element)) return
            selectors.forEach(sel => {
              if (node.matches && node.matches(sel)) applyInlineFix(node)
              node.querySelectorAll && node.querySelectorAll(sel).forEach(applyInlineFix)
            })
          })
        }
      }
    })

    mo.observe(document.body, { childList: true, subtree: true })

    // Fallback: se o dev overlay estiver sendo bloqueado, criamos um overlay próprio
    function createFallbackOverlay(errMsg: string, stack?: string) {
      try {
        // Evitar duplicatas
        if (document.getElementById('__devoverlay_fallback')) return
        const overlay = document.createElement('div')
        overlay.id = '__devoverlay_fallback'
        overlay.style.position = 'fixed'
        overlay.style.inset = '0'
        overlay.style.background = 'rgba(0,0,0,0.85)'
        overlay.style.color = '#fff'
        overlay.style.zIndex = '2147483647'
        overlay.style.padding = '20px'
        overlay.style.overflow = 'auto'
        overlay.style.fontFamily = 'Menlo, monospace'
        overlay.innerHTML = `<h2 style="margin-top:0;color:#ff6b6b">Client error</h2><pre style="white-space:pre-wrap">${escapeHtml(errMsg)}\n${escapeHtml(stack||'')}</pre>`
        document.body.appendChild(overlay)
      } catch (e) {
        // ignore
      }
    }

    function escapeHtml(s: string) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    const onErr = (event: ErrorEvent) => {
      try {
        const msg = event && event.message ? `${event.message}` : 'Unknown error'
        const stack = event && (event.error && event.error.stack) ? event.error.stack : ''
        createFallbackOverlay(msg, stack)
      } catch (e) {}
    }

    const onRejection = (ev: PromiseRejectionEvent) => {
      try {
        const reason = ev.reason ? (ev.reason.stack || String(ev.reason)) : 'Unhandled rejection'
        createFallbackOverlay('Unhandled promise rejection', reason)
      } catch (e) {}
    }

    window.addEventListener('error', onErr)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      mo.disconnect()
      style.remove()
      window.removeEventListener('error', onErr)
      window.removeEventListener('unhandledrejection', onRejection)
      const fo = document.getElementById('__devoverlay_fallback')
      fo && fo.remove()
    }
  }, [])

  return null
}
