import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  $loading?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  const variants = {
    primary: css`
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.onPrimary};
      border: 1px solid ${({ theme }) => theme.colors.primary};

      &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.primaryHover};
        border-color: ${({ theme }) => theme.colors.primaryHover};
      }

      &:active:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.primaryActive};
        border-color: ${({ theme }) => theme.colors.primaryActive};
      }
    `,
    secondary: css`
      background-color: ${({ theme }) => theme.colors.secondary};
      color: ${({ theme }) => theme.colors.onSecondary};
      border: 1px solid ${({ theme }) => theme.colors.secondary};

      &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.secondaryHover};
        border-color: ${({ theme }) => theme.colors.secondaryHover};
      }

      &:active:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.secondaryActive};
        border-color: ${({ theme }) => theme.colors.secondaryActive};
      }
    `,
    outline: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.primary};
      border: 1px solid ${({ theme }) => theme.colors.primary};

      &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.primary}10;
      }

      &:active:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.primary}20;
      }
    `,
    ghost: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.primary};
      border: 1px solid transparent;

      &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.primary}10;
      }

      &:active:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.primary}20;
      }
    `,
  };

  return variants[variant];
};

const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    small: css`
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      min-height: 2rem;
    `,
    medium: css`
      padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
      font-size: ${({ theme }) => theme.typography.fontSize.base};
      min-height: 2.5rem;
    `,
    large: css`
      padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
      min-height: 3rem;
    `,
  };

  return sizes[size];
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  outline: none;
  user-select: none;
  position: relative;
  overflow: hidden;

  ${({ $variant = 'primary' }) => getVariantStyles($variant)}
  ${({ $size = 'medium' }) => getSizeStyles($size)}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  ${({ $loading }) =>
    $loading &&
    css`
      cursor: not-allowed;
      pointer-events: none;
    `}
`;

export const ButtonContent = styled.span<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: opacity ${({ theme }) => theme.transitions.fast};

  ${({ $loading }) =>
    $loading &&
    css`
      opacity: 0;
    `}
`;

export const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;
