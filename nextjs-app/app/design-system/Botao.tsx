// Componente Botao moderno usando o novo sistema de temas

import React from 'react';
import { BotaoBase } from '../theme/ComponentesBase';

interface BotaoProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
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
      $variante={variant}
      $tamanho={size}
      $larguraCompleta={fullWidth}
      $carregando={loading}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? 'Carregando...' : children}
    </BotaoBase>
  );
};

export default Botao;
