'use client';

/**
 * Página de Acesso Não Autorizado
 */

import { useAuth } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UnauthorizedPage() {
  const { isAuthenticated, isGuest } = useAuth();

  // Função para navegação (compatível com Next.js 15)
  const navigate = (url: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Acesso Não Autorizado
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {isGuest 
                ? 'Você precisa estar logado para acessar esta página.'
                : 'Você não possui permissões suficientes para acessar este recurso.'
              }
            </p>
          </div>

          <div className="space-y-3">
            {isGuest ? (
              <>
                <Button
                  onClick={() => navigate('/auth/login')}
                  className="w-full"
                >
                  <span className="mr-2">🔑</span>
                  Fazer Login
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  <span className="mr-2">🏠</span>
                  Voltar ao Início
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  <span className="mr-2">⬅️</span>
                  Voltar
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  <span className="mr-2">🏠</span>
                  Ir para Início
                </Button>
              </>
            )}
          </div>

          {isAuthenticated && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Dica:</strong> Se você acredita que deveria ter acesso a este recurso, 
                entre em contato com o administrador do sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
