// Componente InputTexto reutilizável do design system
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React from "react";

/**
 * InputTexto padronizado para campos de texto, já integrado ao tema.
 * Pode ser usado em formulários e páginas do sistema.
 */
const InputTexto: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField {...props} sx={{ borderRadius: 2, ...props.sx }} />
  );
};

export default InputTexto;
