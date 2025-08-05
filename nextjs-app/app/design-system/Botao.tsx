// Componente Botao moderno usando o novo sistema de temas

import React from 'react';
import { Container } from '../../styles/ComponentesBase';
import styled from 'styled-components';

const BotaoBase = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
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
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? 'Carregando...' : children}
    </BotaoBase>
  );
};

export default Botao;
