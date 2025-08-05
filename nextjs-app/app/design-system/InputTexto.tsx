// Componente InputTexto moderno usando o novo sistema de temas

import React, { forwardRef } from 'react';
import { Flex, Texto, InputBase } from '../../styles/ComponentesBase';

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
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Flex $direction="column" $gap="xs" className={className}>
      {label && (
        <Texto as="label" htmlFor={inputId} $variante="caption" $peso="normal">
          {label}
          {obrigatorio && (
            <Texto as="span" $cor="#ff0000" style={{ marginLeft: '4px' }}>
              *
            </Texto>
          )}
        </Texto>
      )}

      <Input
        ref={ref}
        id={inputId}
        $erro={!!erro}
        {...props}
        aria-invalid={!!erro}
        aria-describedby={
          erro ? `${inputId}-erro` : ajuda ? `${inputId}-ajuda` : undefined
        }
      />

      {erro && (
        <Texto
          id={`${inputId}-erro`}
          $variante="caption"
          $cor="#ef4444"
          style={{ color: 'var(--cor-erro, #ef4444)' }}
          role="alert"
        >
          {erro}
        </Texto>
      )}

      {ajuda && !erro && (
        <Texto
          id={`${inputId}-ajuda`}
          $variante="caption"
          $cor="#666666"
        >
          {ajuda}
        </Texto>
      )}
    </Flex>
  );
});

InputTexto.displayName = 'InputTexto';

export default InputTexto;
