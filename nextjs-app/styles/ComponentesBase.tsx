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
