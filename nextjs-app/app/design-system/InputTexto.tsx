// Componente InputTexto reutilizável do design system
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React from "react";

/**
 * InputTexto padronizado para campos de texto, já integrado ao tema.
 * Pode ser usado em formulários e páginas do sistema.
 *
 * @example
 * // Exemplo de uso:
 * <InputTexto label="Nome" variant="outlined" value={nome} onChange={handleChange} />
 *
 * @param props Props do TextField do Material-UI, como label, value, onChange, etc.
 *
 * O componente InputTexto utiliza o TextField do Material-UI, garantindo acessibilidade, responsividade e integração com o tema global.
 */
// Memoização do componente para evitar renderizações desnecessárias quando as props não mudam

const InputTexto: React.FC<TextFieldProps> = React.memo(function InputTextoMemo(props) {
  return (
    <TextField {...props} sx={{ borderRadius: 2, ...props.sx }} />
  );
});
// Adiciona displayName para evitar erro de lint e facilitar debug
InputTexto.displayName = "InputTexto";

export default InputTexto;
