// Classe para cor branca no menu em modo escuro
import { createGlobalStyle } from 'styled-components';

export const MenuTextStyle = createGlobalStyle`
  .menu-text-dark {
    color: #fff !important;
  }
`;
// Botão base moderno
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
  ${({ $size }) => {
    switch ($size) {
      case 'sm': return 'padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem;';
      case 'lg': return 'padding: 0.75rem 1.5rem; font-size: 1.125rem; line-height: 1.75rem;';
      default: return 'padding: 0.625rem 1rem; font-size: 1rem; line-height: 1.5rem;';
    }
  }}
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'secondary': return `background: ${theme.colors?.secondary || '#6b7280'}; color: ${theme.colors?.onSecondary || '#fff'}; border-color: ${theme.colors?.secondary || '#6b7280'}; &:hover:not(:disabled) { background: ${theme.colors?.secondaryHover || '#4b5563'}; border-color: ${theme.colors?.secondaryHover || '#4b5563'}; }`;
      case 'outline': return `background: transparent; color: ${theme.colors?.primary || '#3b82f6'}; border-color: ${theme.colors?.border || '#d1d5db'}; &:hover:not(:disabled) { background: ${theme.colors?.primary || '#3b82f6'}; color: ${theme.colors?.onPrimary || '#fff'}; border-color: ${theme.colors?.primary || '#3b82f6'}; }`;
      case 'ghost': return `background: transparent; color: ${theme.colors?.text || '#111827'}; border-color: transparent; &:hover:not(:disabled) { background: ${theme.colors?.surface || '#f9fafb'}; }`;
      default: return `background: ${theme.colors?.primary || '#3b82f6'}; color: ${theme.colors?.onPrimary || '#fff'}; border-color: ${theme.colors?.primary || '#3b82f6'}; &:hover:not(:disabled) { background: ${theme.colors?.primaryHover || '#2563eb'}; border-color: ${theme.colors?.primaryHover || '#2563eb'}; }`;
    }
  }}
`;

// Card base moderno
export const CardBase = styled.div<{
  $padding?: 'sm' | 'md' | 'lg';
  $shadow?: boolean;
}>`
  background: ${({ theme }) => theme.colors?.surface || '#fff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || '0.5rem'};
  ${({ $shadow, theme }) => $shadow && `box-shadow: ${theme.shadows?.sm || '0 1px 2px 0 rgb(0 0 0 / 0.05)'};`}
  ${({ $padding }) => {
    switch ($padding) {
      case 'sm': return 'padding: 1rem;';
      case 'lg': return 'padding: 2rem;';
      default: return 'padding: 1.5rem;';
    }
  }}
`;

// Input base moderno
export const InputBase = styled.input<{
  $hasError?: boolean;
  $size?: 'sm' | 'md' | 'lg';
}>`
  width: 100%;
  font-family: ${({ theme }) => theme.typography?.fontFamily || 'inherit'};
  background: ${({ theme }) => theme.colors?.surface || '#fff'};
  color: ${({ theme }) => theme.colors?.text || '#111827'};
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors?.error || '#ef4444' : theme.colors?.border || '#d1d5db'};
  border-radius: ${({ theme }) => theme.borderRadius?.md || '0.375rem'};
  transition: all ${({ theme }) => theme.transitions?.fast || '0.15s ease'};
  &:focus { outline: none; border-color: ${({ theme, $hasError }) => $hasError ? theme.colors?.error || '#ef4444' : theme.colors?.borderFocus || '#3b82f6'}; box-shadow: 0 0 0 3px ${({ theme, $hasError }) => $hasError ? (theme.colors?.error || '#ef4444') + '20' : (theme.colors?.borderFocus || '#3b82f6') + '20'}; }
  &:disabled { background: ${({ theme }) => theme.colors?.backgroundSecondary || '#f3f4f6'}; cursor: not-allowed; }
  ${({ $size }) => {
    switch ($size) {
      case 'sm': return 'padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem;';
      case 'lg': return 'padding: 0.875rem 1rem; font-size: 1.125rem; line-height: 1.75rem;';
      default: return 'padding: 0.625rem 0.875rem; font-size: 1rem; line-height: 1.5rem;';
    }
  }}
`;

// Label base moderno
export const LabelBase = styled.label<{
  $required?: boolean;
}>`
  display: block;
  font-family: ${({ theme }) => theme.typography?.fontFamily || 'inherit'};
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm || '0.875rem'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.medium || '500'};
  color: ${({ theme }) => theme.colors?.textSecondary || '#374151'};
  margin-bottom: ${({ theme }) => theme.spacing?.xs || '0.5rem'};
  ${({ $required }) => $required && `&::after { content: ' *'; color: #ef4444; }`}
`;

// Flex container moderno
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
    const spacing = theme.spacing || { xs: '0.5rem', sm: '0.75rem', md: '1rem', lg: '1.5rem', xl: '2rem' };
    return $gap ? `gap: ${spacing[$gap]};` : '';
  }}
`;

// Heading moderno
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
    const sizes = theme.typography?.fontSize || { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' };
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

// Text moderno
export const Text = styled.p<{
  $size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  $color?: 'text' | 'textSecondary' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  $weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}>`
  font-family: ${({ theme }) => theme.typography?.fontFamily || 'inherit'};
  margin: 0;
  ${({ $size = 'base', theme }) => {
    const sizes = theme.typography?.fontSize || { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' };
    return `font-size: ${sizes[$size] || '1rem'};`;
  }}
  ${({ $weight = 'normal', theme }) => {
    const weights = theme.typography?.fontWeight || { normal: '400', medium: '500', semibold: '600', bold: '700' };
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
import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const Flex = styled.div<{
  $direction?: 'row' | 'column';
  $align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  $gap?: string;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.$direction || 'row'};
  align-items: ${props => props.$align || 'stretch'};
  justify-content: ${props => props.$justify || 'flex-start'};
  gap: ${props => props.$gap || '0'};
  flex-wrap: ${props => props.$wrap ? 'wrap' : 'nowrap'};
`;

export const Texto = styled.div<{
  $variante?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
  $peso?: 'normal' | 'negrito' | 'light';
  $align?: 'left' | 'center' | 'right' | 'centro';
  $cor?: string;
}>`
  font-size: ${props => {
    switch (props.$variante) {
      case 'h1': return '2.5rem';
      case 'h2': return '2rem';
      case 'h3': return '1.5rem';
      case 'h4': return '1.25rem';
      case 'h5': return '1.125rem';
      case 'h6': return '1rem';
      case 'body1': return '1rem';
      case 'body2': return '0.875rem';
      case 'caption': return '0.75rem';
      default: return '1rem';
    }
  }};
  font-weight: ${props => {
    switch (props.$peso) {
      case 'negrito': return '700';
      case 'light': return '300';
      default: return '400';
    }
  }};
  text-align: ${props => {
    if (props.$align === 'centro') return 'center';
    return props.$align || 'left';
  }};
  color: ${props => props.$cor || 'inherit'};
  margin: 0;
`;

export const Secao = styled.section<{
  $padding?: string;
  $margin?: string;
  $bg?: string;
}>`
  padding: ${props => props.$padding || '2rem 0'};
  margin: ${props => props.$margin || '0'};
  background: ${props => props.$bg || 'transparent'};
`;

export const Card = styled.div<{
  $padding?: string;
  $shadow?: boolean;
  $radius?: string;
  $bg?: string;
}>`
  padding: ${props => props.$padding || '1.5rem'};
  border-radius: ${props => props.$radius || '8px'};
  background: ${props => props.$bg || '#ffffff'};
  box-shadow: ${props => props.$shadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
`;
