// Componente InputTexto moderno usando o novo sistema de temas

import React, { forwardRef } from 'react';
import { Input } from '../theme/ComponentesBase';
import { Texto } from '../theme/ComponentesBase';
import { Flex } from '../theme/ComponentesBase';

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
    <Flex $direcao="column" $gap="xs" className={className}>
      {label && (
        <Texto as="label" htmlFor={inputId} $variante="legenda" $peso="medio">
          {label}
          {obrigatorio && (
            <Texto as="span" $cor="terciario" style={{ marginLeft: '4px' }}>
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
          $variante="legenda"
          $cor="terciario"
          style={{ color: 'var(--cor-erro, #ef4444)' }}
          role="alert"
        >
          {erro}
        </Texto>
      )}

      {ajuda && !erro && (
        <Texto
          id={`${inputId}-ajuda`}
          $variante="legenda"
          $cor="terciario"
        >
          {ajuda}
        </Texto>
      )}
    </Flex>
  );
});

InputTexto.displayName = 'InputTexto';

export default InputTexto;
