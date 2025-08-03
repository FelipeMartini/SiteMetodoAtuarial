// Componente Botao reutilizável do design system
import Button, { ButtonProps } from "@mui/material/Button";
import React from "react";

/**
 * Botão padronizado para o sistema, já integrado ao tema e com props do MUI.
 * Pode ser usado em qualquer página ou componente.
 *
 * @example
 * // Exemplo de uso:
 * <Botao variant="contained" color="primary">Enviar</Botao>
 *
 * @param children Elementos filhos exibidos dentro do botão.
 * @param props Props do Button do Material-UI, como variant, color, onClick, etc.
 *
 * O componente Botao utiliza o Button do Material-UI, permitindo personalização via props e integração com o tema global.
 */
// Memoização do componente para evitar renderizações desnecessárias quando as props não mudam

const Botao: React.FC<ButtonProps> = React.memo(function BotaoMemo({ children, ...props }) {
  return (
    <Button {...props} sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', ...props.sx }}>
      {children}
    </Button>
  );
});
// Adiciona displayName para evitar erro de lint e facilitar debug
Botao.displayName = "Botao";

export default Botao;
