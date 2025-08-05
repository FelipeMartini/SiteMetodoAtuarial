// Componente Botao moderno usando o novo sistema de temas

import React from 'react';
import styled from 'styled-components';

const BotaoBase = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &.botao-ghost {
    background: transparent;
    color: ${({ theme }) => theme.name === 'dark' ? theme.colors.surface : theme.colors.primary};
    border: 1px solid transparent;
    /* Contraste: cor clara no tema escuro, cor primária no tema claro */
    &:hover, &:focus {
      color: ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.backgroundSecondary};
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 2px 8px ${({ theme }) => theme.colors.primary}30;
      outline: none;
    }
  }
`;

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
  return (
    <BotaoBase
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        className,
        `botao-${variant}`,
        `botao-${size}`,
        fullWidth ? 'botao-full' : ''
      ].filter(Boolean).join(' ')}
    >
      {loading ? 'Carregando...' : children}
    </BotaoBase>
  );
};

export default Botao;
