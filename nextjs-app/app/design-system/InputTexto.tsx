// Componente InputTexto reutilizável do design system
import React from "react";
import styled from "styled-components";

/**
 * InputTexto padronizado para campos de texto, agora usando styled-components.
 * Pode ser usado em formulários e páginas do sistema.
 *
 * @example
 * <InputTexto label="Nome" value={nome} onChange={handleChange} />
 */
export interface InputTextoProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  // Removido suporte a props do MUI: multiline, rows, variant, fullWidth
}

// Estilos do input usando styled-components
const InputStyled = styled.input`
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 10px 16px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 8px;
  background: ${({ theme }) => theme.palette?.background?.default || '#fff'};
  color: ${({ theme }) => theme.palette?.text?.primary || '#21243d'};
`;

const LabelStyled = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.palette?.text?.secondary || '#666'};
  margin-bottom: 4px;
  display: block;
`;

const InputTexto: React.FC<InputTextoProps> = React.memo(function InputTextoMemo({ label, ...props }) {
  // Renderiza label associado ao input via id para acessibilidade
  return (
    <div>
      {label && props.id && <LabelStyled htmlFor={props.id}>{label}</LabelStyled>}
      <InputStyled {...props} />
    </div>
  );
});
InputTexto.displayName = "InputTexto";

export default InputTexto;
