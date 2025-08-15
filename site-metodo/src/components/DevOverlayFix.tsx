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
    if (process.env.NODE_ENV !== 'development') return

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
        e.style.setProperty('position', 'fixed', 'important')
        e.style.setProperty('inset', '0', 'important')
        e.style.setProperty('width', '100vw', 'important')
        e.style.setProperty('height', '100vh', 'important')
        e.style.setProperty('z-index', '2147483647', 'important')
        e.style.setProperty('transform', 'none', 'important')
        e.style.setProperty('pointer-events', 'auto', 'important')
        e.style.setProperty('font-size', '16px', 'important')
        // Força aos filhos também
        Array.from(e.querySelectorAll('*')).forEach((child) => {
          try {
            (child as HTMLElement).style.setProperty('transform', 'none', 'important')
            (child as HTMLElement).style.setProperty('position', 'static', 'important')
          } catch (err) {
            // ignore
          }
        })

        // Remover transform dos ancestrais até <body> para evitar containing blocks
        let p: Element | null = e.parentElement
        while (p && p.tagName.toLowerCase() !== 'body') {
          try {
            (p as HTMLElement).style.setProperty('transform', 'none', 'important')
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

    return () => {
      mo.disconnect()
      style.remove()
    }
  }, [])

  return null
}
