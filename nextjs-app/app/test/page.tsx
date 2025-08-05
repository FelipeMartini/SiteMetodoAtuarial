// Página de teste simples
export default function TestPage() {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h1 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              ✅ Sistema Funcionando!
            </h1>

            <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
              Dashboard Administrativo implementado com sucesso!
            </p>

            <div style={{ textAlign: 'center' }}>
              <p>🎯 <strong>Funcionalidades Implementadas:</strong></p>
              <ul style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <li>✅ Redux Store com 4 slices completos</li>
                <li>✅ Sistema de autenticação Auth.js</li>
                <li>✅ Dashboard administrativo</li>
                <li>✅ Gestão completa de usuários</li>
                <li>✅ Configurador de temas</li>
                <li>✅ 13 APIs RESTful</li>
                <li>✅ Banco de dados estruturado</li>
                <li>✅ Google OAuth configurado</li>
              </ul>
            </div>

            <a
              href="/api/auth/signin/google"
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'none',
                textAlign: 'center',
                marginBottom: '1rem'
              }}
            >
              🚀 Testar Login Google
            </a>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <a
                href="/"
                style={{ color: '#4f46e5', textDecoration: 'none' }}
              >
                ← Voltar ao início
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
