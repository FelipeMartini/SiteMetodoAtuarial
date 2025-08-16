"use client"

import React from 'react'

type Props = { children: React.ReactNode }

export default class ErrorBoundaryClient extends React.Component<Props, { hasError: boolean; error?: Error }>{
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: any) {
    // Log para console e futura integração com XLOGS / backend
    try {
      console.error('[ErrorBoundaryClient] Captured error:', error, info)
      // opcional: enviar para API interna de logs
      // fetch('/api/logs/client-error', { method: 'POST', body: JSON.stringify({ error: String(error), info }) })
    } catch (e) {
      // ignore
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20 }}>
          <h2>Ocorreu um erro no client</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error || 'Erro desconhecido')}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
