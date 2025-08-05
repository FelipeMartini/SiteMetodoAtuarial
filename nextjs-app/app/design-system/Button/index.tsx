'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import {
  Button as StyledButton,
  ButtonContent,
  LoadingSpinner,
  ButtonVariant,
  ButtonSize,
} from './Button.styled';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  children,
  startIcon,
  endIcon,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      <ButtonContent $loading={loading}>
        {startIcon}
        {children}
        {endIcon}
      </ButtonContent>
      {loading && <LoadingSpinner />}
    </StyledButton>
  );
};

export default Button;
export type { ButtonVariant, ButtonSize };
