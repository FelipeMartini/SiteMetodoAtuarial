# Login Form Components with Styled Components

## components/design-system/InputField/InputField.styled.ts

```typescript
import styled, { css } from 'styled-components';

interface InputContainerProps {
  $hasError?: boolean;
  $isFocused?: boolean;
}

interface InputFieldProps {
  $hasError?: boolean;
}

export const InputContainer = styled.div<InputContainerProps>`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const InputField = styled.input<InputFieldProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 1;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.error};
      
      &:focus {
        border-color: ${theme.colors.error};
        box-shadow: 0 0 0 3px ${theme.colors.error}20;
      }
    `}

  &:disabled {
    background-color: ${({ theme }) => theme.colors.surfaceVariant};
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
`;

export const HelperText = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
```

## components/design-system/InputField/index.tsx

```typescript
'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import {
  InputContainer,
  InputField as StyledInputField,
  Label,
  ErrorMessage,
  HelperText,
} from './InputField.styled';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <InputContainer className={className}>
        {label && (
          <Label htmlFor={props.id}>
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
          </Label>
        )}
        <StyledInputField
          ref={ref}
          $hasError={hasError}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <ErrorMessage id={`${props.id}-error`} role="alert">
            {error}
          </ErrorMessage>
        )}
        {helperText && !error && (
          <HelperText id={`${props.id}-helper`}>
            {helperText}
          </HelperText>
        )}
      </InputContainer>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
```

## components/design-system/Button/Button.styled.ts

```typescript
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
```

## components/design-system/Button/index.tsx

```typescript
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
```

## components/design-system/SocialLoginButton/SocialLoginButton.styled.ts

```typescript
import styled from 'styled-components';

export const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  outline: none;
  min-height: 3rem;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.surfaceVariant};
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SocialIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;
```

## components/design-system/SocialLoginButton/index.tsx

```typescript
'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { SocialButton, SocialIcon } from './SocialLoginButton.styled';

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: 'google' | 'apple' | 'facebook' | 'github';
  children: ReactNode;
  icon?: ReactNode;
}

const getDefaultIcon = (provider: string) => {
  const icons = {
    google: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    apple: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  };

  return icons[provider as keyof typeof icons] || null;
};

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  children,
  icon,
  ...props
}) => {
  const defaultIcon = getDefaultIcon(provider);

  return (
    <SocialButton {...props}>
      <SocialIcon>
        {icon || defaultIcon}
      </SocialIcon>
      {children}
    </SocialButton>
  );
};

export default SocialLoginButton;
```