/**
 * Componente ErrorBoundary para captura de erros em componentes filhos.
 * Exibe mensagem amigável e permite recuperação sem travar toda a aplicação.
 * Utilizar em volta de componentes críticos ou páginas principais.
 */
import React from "react";

interface EstadoErrorBoundary {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, EstadoErrorBoundary> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Aqui pode-se logar o erro para serviço externo
    // Exemplo: Sentry, Datadog, etc.
    // console.error('Erro capturado pelo ErrorBoundary');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: 'center', color: '#d32f2f', background: '#fff3f3', borderRadius: 12 }}>
          <h2>Ocorreu um erro inesperado.</h2>
          <p>Por favor, tente novamente ou entre em contato com o suporte.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>
            {this.state.error?.toString()}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// Exemplo de uso:
// <ErrorBoundary>
//   <ComponenteCritico />
// </ErrorBoundary>
