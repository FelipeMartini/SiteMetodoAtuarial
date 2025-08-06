
// InputTexto moderno usando styled-components, Tailwind e shadcn/ui, com suporte ao tema
import React, { forwardRef, useId } from 'react';
import styled, { DefaultTheme } from 'styled-components';

// Estilização do input usando styled-components e integração com tema
const InputStyled = styled.input<{ $hasError?: boolean; theme: DefaultTheme }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.625rem 0.875rem;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all 0.15s ease;
  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => $hasError ? theme.colors.error + '20' : theme.colors.primary + '20'};
  }
  &:disabled {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    cursor: not-allowed;
  }
`;

const LabelStyled = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const AjudaStyled = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErroStyled = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
`;

/**
 * Componente InputTexto
 * Modernizado para usar styled-components, Tailwind e shadcn/ui
 * Suporte ao tema claro/escuro via ThemeProvider
 * Comentários explicativos em cada parte
 */
interface InputTextoProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  erro?: string;
  ajuda?: string;
  obrigatorio?: boolean;
}

export const InputTexto = forwardRef<HTMLInputElement, InputTextoProps>(({
  label,
  erro,
  ajuda,
  obrigatorio = false,
  className,
  id,
  ...props
}, ref) => {
  // useId garante id estável entre SSR e CSR, evitando mismatch de hidratação
  const reactId = useId();
  const inputId = id || `input-${reactId}`;
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <LabelStyled htmlFor={inputId}>
          {label}
          {obrigatorio && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
        </LabelStyled>
      )}
      <InputStyled
        ref={ref}
        // useId garante id estável entre SSR e CSR, evitando mismatch de hidratação
        const reactId= useId();
      const inputId = id || `input-${reactId}`;
      $hasError={!!erro}
      {...props}
      aria-invalid={!!erro}
      aria-label={label}
      role="textbox"
      aria-describedby={erro ? `${inputId}-erro` : ajuda ? `${inputId}-ajuda` : undefined}
      style={props.style ? { ...props.style, outline: 'none', boxShadow: '0 0 0 2px #2563eb' } : { outline: 'none', boxShadow: '0 0 0 2px #2563eb' }}
      />
      {erro && (
        <ErroStyled id={`${inputId}-erro`} role="alert">{erro}</ErroStyled>
      )}
      {ajuda && !erro && (
        <AjudaStyled id={`${inputId}-ajuda`}>{ajuda}</AjudaStyled>
      )}
    </div>
  );
});

InputTexto.displayName = 'InputTexto';

export default InputTexto;
