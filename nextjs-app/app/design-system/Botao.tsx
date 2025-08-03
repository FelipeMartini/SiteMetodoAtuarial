// Componente Botao reutilizável do design system
import Button, { ButtonProps } from "@mui/material/Button";
import React from "react";

/**
 * Botão padronizado para o sistema, já integrado ao tema e com props do MUI.
 * Pode ser usado em qualquer página ou componente.
 */
const Botao: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button {...props} sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', ...props.sx }}>
      {children}
    </Button>
  );
};

export default Botao;
