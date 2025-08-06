
// Botão moderno usando styled-components, Tailwind e shadcn/ui, com suporte ao tema

import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button'; // shadcn/ui
import styled, { DefaultTheme } from 'styled-components';

// Tipos para as props do botão
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BotaoStyledProps {
  $variant?: Variant;
  $size?: Size;
  $fullWidth?: boolean;
  theme: DefaultTheme;
}

// Estilização adicional usando styled-components para integração com tema
const BotaoStyled = styled(ShadcnButton) <BotaoStyledProps>`
  ${({ $fullWidth }) => $fullWidth ? 'width: 100%;' : ''}
  ${({ theme, $variant }) => $variant === 'primary' ? `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.onPrimary};
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryHover};
    }
  ` : ''}
  ${({ theme, $variant }) => $variant === 'secondary' ? `
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.onSecondary};
    &:hover:not(:disabled) {
      background-color: ${theme.colors.secondaryHover};
    }
  ` : ''}
  // ... outros estilos conforme variantes
`;

/**
 * Componente Botao
 * Modernizado para usar styled-components, Tailwind e shadcn/ui
 * Suporte ao tema claro/escuro via ThemeProvider
 * Comentários explicativos em cada parte
 */
interface BotaoProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Botao: React.FC<BotaoProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
}) => {
  // Adiciona role, tabIndex e aria-label para acessibilidade
  return (
    <BotaoStyled
      type={type}
      onClick={onClick}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      className={className}
      role="button"
      tabIndex={0}
      aria-label={typeof children === 'string' ? children : undefined}
      // Foco visível para navegação por teclado
      style={{ outline: 'none', boxShadow: '0 0 0 2px #2563eb' }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled && !loading) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Exibe spinner de carregamento se loading estiver ativo */}
      {loading ? <span className="animate-spin">Carregando...</span> : children}
    </BotaoStyled>
  );
};

export default Botao;
