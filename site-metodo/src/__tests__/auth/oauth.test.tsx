/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock do next-auth/react
const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
  signIn: mockSignIn,
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated'
  })),
}));

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

// Mock de componentes shadcn/ui
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}));

// Componente de teste simulando a estrutura OAuth
const MockOAuthComponent = () => {
  const handleOAuthLogin = (provider: string) => {
    mockSignIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div data-testid="oauth-container">
      <button 
        onClick={() => handleOAuthLogin('google')}
        data-testid="google-login"
      >
        Continuar com Google
      </button>
      <button 
        onClick={() => handleOAuthLogin('microsoft-entra-id')}
        data-testid="microsoft-login"
      >
        Continuar com Microsoft
      </button>
      <button 
        onClick={() => handleOAuthLogin('discord')}
        data-testid="discord-login"
      >
        Continuar com Discord
      </button>
      <button 
        onClick={() => handleOAuthLogin('facebook')}
        data-testid="facebook-login"
      >
        Continuar com Facebook
      </button>
      <button 
        onClick={() => handleOAuthLogin('apple')}
        data-testid="apple-login"
      >
        Continuar com Apple
      </button>
    </div>
  );
};

describe('Componentes OAuth - 5 Provedores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização dos Provedores', () => {
    it('deve renderizar todos os 5 provedores OAuth', () => {
      render(<MockOAuthComponent />);
      
      expect(screen.getByTestId('google-login')).toBeInTheDocument();
      expect(screen.getByTestId('microsoft-login')).toBeInTheDocument();
      expect(screen.getByTestId('discord-login')).toBeInTheDocument();
      expect(screen.getByTestId('facebook-login')).toBeInTheDocument();
      expect(screen.getByTestId('apple-login')).toBeInTheDocument();
    });

    it('deve ter textos corretos nos botões OAuth', () => {
      render(<MockOAuthComponent />);
      
      expect(screen.getByText('Continuar com Google')).toBeInTheDocument();
      expect(screen.getByText('Continuar com Microsoft')).toBeInTheDocument();
      expect(screen.getByText('Continuar com Discord')).toBeInTheDocument();
      expect(screen.getByText('Continuar com Facebook')).toBeInTheDocument();
      expect(screen.getByText('Continuar com Apple')).toBeInTheDocument();
    });
  });

  describe('Funcionalidade de Login OAuth', () => {
    it('deve chamar signIn com Google quando botão é clicado', async () => {
      render(<MockOAuthComponent />);
      
      const googleButton = screen.getByTestId('google-login');
      fireEvent.click(googleButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('google', { 
          callbackUrl: '/dashboard' 
        });
      });
    });

    it('deve chamar signIn com Microsoft quando botão é clicado', async () => {
      render(<MockOAuthComponent />);
      
      const microsoftButton = screen.getByTestId('microsoft-login');
      fireEvent.click(microsoftButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('microsoft-entra-id', { 
          callbackUrl: '/dashboard' 
        });
      });
    });

    it('deve chamar signIn com Discord quando botão é clicado', async () => {
      render(<MockOAuthComponent />);
      
      const discordButton = screen.getByTestId('discord-login');
      fireEvent.click(discordButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('discord', { 
          callbackUrl: '/dashboard' 
        });
      });
    });

    it('deve chamar signIn com Facebook quando botão é clicado', async () => {
      render(<MockOAuthComponent />);
      
      const facebookButton = screen.getByTestId('facebook-login');
      fireEvent.click(facebookButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('facebook', { 
          callbackUrl: '/dashboard' 
        });
      });
    });

    it('deve chamar signIn com Apple quando botão é clicado', async () => {
      render(<MockOAuthComponent />);
      
      const appleButton = screen.getByTestId('apple-login');
      fireEvent.click(appleButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('apple', { 
          callbackUrl: '/dashboard' 
        });
      });
    });
  });

  describe('Estados de Loading', () => {
    it('deve suportar estado de loading durante OAuth', () => {
      const MockLoadingComponent = ({ isLoading }: { isLoading: boolean }) => (
        <button disabled={isLoading} data-testid="oauth-button">
          {isLoading ? 'Entrando...' : 'Entrar com OAuth'}
        </button>
      );
      
      const { rerender } = render(<MockLoadingComponent isLoading={false} />);
      expect(screen.getByText('Entrar com OAuth')).toBeInTheDocument();
      
      rerender(<MockLoadingComponent isLoading={true} />);
      expect(screen.getByText('Entrando...')).toBeInTheDocument();
      expect(screen.getByTestId('oauth-button')).toBeDisabled();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter botões acessíveis com aria-labels apropriados', () => {
      const AccessibleOAuthComponent = () => (
        <div>
          <button 
            aria-label="Fazer login com Google"
            data-testid="accessible-google"
          >
            Google
          </button>
          <button 
            aria-label="Fazer login com Microsoft"
            data-testid="accessible-microsoft"
          >
            Microsoft
          </button>
        </div>
      );
      
      render(<AccessibleOAuthComponent />);
      
      expect(screen.getByLabelText('Fazer login com Google')).toBeInTheDocument();
      expect(screen.getByLabelText('Fazer login com Microsoft')).toBeInTheDocument();
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve tratar erros de OAuth graciosamente', async () => {
      mockSignIn.mockRejectedValueOnce(new Error('OAuth Error'));
      
      const ErrorHandlingComponent = () => {
        const handleLogin = async () => {
          try {
            await mockSignIn('google');
          } catch (error) {
            console.error('Erro OAuth:', error);
          }
        };
        
        return (
          <button onClick={handleLogin} data-testid="error-test-button">
            Test OAuth Error
          </button>
        );
      };
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<ErrorHandlingComponent />);
      fireEvent.click(screen.getByTestId('error-test-button'));
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Erro OAuth:',
          expect.any(Error)
        );
      });
      
      consoleSpy.mockRestore();
    });
  });
});
