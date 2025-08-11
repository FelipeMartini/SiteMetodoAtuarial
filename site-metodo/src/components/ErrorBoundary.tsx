// ErrorBoundary padrão para React 18+ (adaptado para Next.js)
import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log para monitoramento
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='p-8 text-center text-destructive'>
          <h2 className='text-2xl font-bold mb-4'>Ocorreu um erro inesperado.</h2>
          <p className='mb-2'>
            Por favor, tente recarregar a página ou entre em contato com o suporte.
          </p>
          <pre className='text-xs text-muted-foreground whitespace-pre-wrap break-all max-w-full overflow-x-auto'>
            {this.state.error?.message}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
