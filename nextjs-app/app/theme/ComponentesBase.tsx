/**
 * Componentes Base para o Design System
 * Unificação de componentes estilizados com tema
 */
import styled from 'styled-components';

// Botão base que pode ser estendido
export const BotaoBase = styled.button<{
  $variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  $size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing?.xs || '0.5rem'};
  
  font-family: ${({ theme }) => theme.typography?.fontFamily || 'inherit'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.medium || '500'};
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius?.md || '0.375rem'};
  transition: all ${({ theme }) => theme.transitions?.fast || '0.15s ease'};
  
  cursor: pointer;
  user-select: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Tamanhos */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
        `;
      case 'lg':
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
          line-height: 1.75rem;
        `;
      default:
        return `
          padding: 0.625rem 1rem;
          font-size: 1rem;
          line-height: 1.5rem;
        `;
    }
  }}
  
  /* Largura total */
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  
  /* Variantes */
  ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background: ${theme.colors?.secondary || '#6b7280'};
          color: ${theme.colors?.onSecondary || '#ffffff'};
          border-color: ${theme.colors?.secondary || '#6b7280'};
          
          &:hover:not(:disabled) {
            background: ${theme.colors?.secondaryHover || '#4b5563'};
            border-color: ${theme.colors?.secondaryHover || '#4b5563'};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors?.primary || '#3b82f6'};
          border-color: ${theme.colors?.border || '#d1d5db'};
          
          &:hover:not(:disabled) {
            background: ${theme.colors?.primary || '#3b82f6'};
            color: ${theme.colors?.onPrimary || '#ffffff'};
            border-color: ${theme.colors?.primary || '#3b82f6'};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors?.text || '#111827'};
          border-color: transparent;
          
          &:hover:not(:disabled) {
            background: ${theme.colors?.surface || '#f9fafb'};
          }
        `;
      default: // primary
        return `
          background: ${theme.colors?.primary || '#3b82f6'};
          color: ${theme.colors?.onPrimary || '#ffffff'};
          border-color: ${theme.colors?.primary || '#3b82f6'};
          
          &:hover:not(:disabled) {
            background: ${theme.colors?.primaryHover || '#2563eb'};
            border-color: ${theme.colors?.primaryHover || '#2563eb'};
          }
        `;
    }
  }}
`;

// Container base para cards
export const CardBase = styled.div<{
  $padding?: 'sm' | 'md' | 'lg';
  $shadow?: boolean;
}>`
  background: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || '0.5rem'};
  
  ${({ $shadow, theme }) => $shadow && `box-shadow: ${theme.shadows?.sm || '0 1px 2px 0 rgb(0 0 0 / 0.05)'};`}
  
  ${({ $padding }) => {
    switch ($padding) {
      case 'sm':
        return 'padding: 1rem;';
      case 'lg':
        return 'padding: 2rem;';
      default:
        return 'padding: 1.5rem;';
    }
  }}
`;

// Input base
export const InputBase = styled.input<{
  $hasError?: boolean;
  $size?: 'sm' | 'md' | 'lg';
}>`
  width: 100%;
  font-family: ${({ theme }) => theme.typography?.fontFamily || 'inherit'};
  background: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  color: ${({ theme }) => theme.colors?.text || '#111827'};
  
  border: 1px solid ${({ theme, $hasError }) => 
    $hasError 
      ? theme.colors?.error || '#ef4444'
      : theme.colors?.border || '#d1d5db'
  };
  border-radius: ${({ theme }) => theme.borderRadius?.md || '0.375rem'};
  
  transition: all ${({ theme }) => theme.transitions?.fast || '0.15s ease'};
  
  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => 
      $hasError 
        ? theme.colors?.error || '#ef4444'
        : theme.colors?.borderFocus || '#3b82f6'
    };
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => 
      $hasError 
        ? (theme.colors?.error || '#ef4444') + '20'
        : (theme.colors?.borderFocus || '#3b82f6') + '20'
    };
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors?.backgroundSecondary || '#f3f4f6'};
    cursor: not-allowed;
  }
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
        `;
      case 'lg':
        return `
          padding: 0.875rem 1rem;
          font-size: 1.125rem;
          line-height: 1.75rem;
        `;
      default:
        return `
          padding: 0.625rem 0.875rem;
          font-size: 1rem;
          line-height: 1.5rem;
        `;
    }
  }}
`;

// Label base
export const LabelBase = styled.label<{
  $required?: boolean;
}>`
  display: block;
  font-family: ${({ theme }) => theme.typography?.fontFamily || 'inherit'};
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm || '0.875rem'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.medium || '500'};
  color: ${({ theme }) => theme.colors?.textSecondary || '#374151'};
  margin-bottom: ${({ theme }) => theme.spacing?.xs || '0.5rem'};
  
  ${({ $required }) => $required && `
    &::after {
      content: ' *';
      color: #ef4444;
    }
  `}
`;

// Container flexível
export const FlexContainer = styled.div<{
  $direction?: 'row' | 'column';
  $gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  $align?: 'start' | 'center' | 'end' | 'stretch';
  $justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  align-items: ${({ $align }) => {
    switch ($align) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'stretch': return 'stretch';
      default: return 'center';
    }
  }};
  justify-content: ${({ $justify }) => {
    switch ($justify) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'between': return 'space-between';
      case 'around': return 'space-around';
      default: return 'center';
    }
  }};
  
  ${({ $gap, theme }) => {
    const spacing = theme.spacing || {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    };
    return $gap ? `gap: ${spacing[$gap]};` : '';
  }}
`;

// Typography components
export const Heading = styled.h1<{
  $level?: 1 | 2 | 3 | 4 | 5 | 6;
  $color?: 'primary' | 'secondary' | 'text' | 'textSecondary';
}>`
  font-family: ${({ theme }) => theme.typography?.fontFamily || 'inherit'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.bold || '700'};
  line-height: 1.2;
  margin: 0;
  
  color: ${({ $color = 'text', theme }) => {
    switch ($color) {
      case 'primary': return theme.colors?.primary || '#3b82f6';
      case 'secondary': return theme.colors?.secondary || '#6b7280';
      case 'textSecondary': return theme.colors?.textSecondary || '#6b7280';
      default: return theme.colors?.text || '#111827';
    }
  }};
  
  ${({ $level = 1, theme }) => {
    const sizes = theme.typography?.fontSize || {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    };
    
    switch ($level) {
      case 1: return `font-size: ${sizes['4xl'] || '2.25rem'};`;
      case 2: return `font-size: ${sizes['3xl'] || '1.875rem'};`;
      case 3: return `font-size: ${sizes['2xl'] || '1.5rem'};`;
      case 4: return `font-size: ${sizes.xl || '1.25rem'};`;
      case 5: return `font-size: ${sizes.lg || '1.125rem'};`;
      case 6: return `font-size: ${sizes.base || '1rem'};`;
      default: return `font-size: ${sizes['3xl'] || '1.875rem'};`;
    }
  }}
`;

// Text component
export const Text = styled.p<{
  $size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  $color?: 'text' | 'textSecondary' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  $weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}>`
  font-family: ${({ theme }) => theme.typography?.fontFamily || 'inherit'};
  margin: 0;
  
  ${({ $size = 'base', theme }) => {
    const sizes = theme.typography?.fontSize || {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    };
    return `font-size: ${sizes[$size] || '1rem'};`;
  }}
  
  ${({ $weight = 'normal', theme }) => {
    const weights = theme.typography?.fontWeight || {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    };
    return `font-weight: ${weights[$weight] || '400'};`;
  }}
  
  color: ${({ $color = 'text', theme }) => {
    switch ($color) {
      case 'textSecondary': return theme.colors?.textSecondary || '#6b7280';
      case 'primary': return theme.colors?.primary || '#3b82f6';
      case 'secondary': return theme.colors?.secondary || '#6b7280';
      case 'success': return theme.colors?.success || '#10b981';
      case 'warning': return theme.colors?.warning || '#f59e0b';
      case 'error': return theme.colors?.error || '#ef4444';
      default: return theme.colors?.text || '#111827';
    }
  }};
`;
