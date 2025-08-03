// Componente Botao reutilizável do design system

import React from "react";
import styled, { css } from "styled-components";

/**
 * Estilos do botão padronizado usando styled-components
 * Integração com tema via props
 */
// Removido estilosBotao: agora BotaoStyled e LinkStyled usam template string diretamente

// Corrigido: uso do css como template string diretamente no styled.button e styled.a para evitar erro de tipagem
const BotaoStyled = styled.button<{ variant?: string; color?: string }>`
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 8px 24px;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
  ${({ theme, color }) =>
    color === "primary"
      ? css`
          background: ${theme.palette?.primary?.main || "#2196f3"};
          color: ${theme.palette?.primary?.contrastText || "#fff"};
        `
      : color === "secondary"
        ? css`
          background: ${theme.palette?.secondary?.main || "#512da8"};
          color: ${theme.palette?.secondary?.contrastText || "#fff"};
        `
        : css`
          background: #e0e0e0;
          color: #21243d;
        `}
  ${({ variant }) =>
    variant === "outlined" &&
    css`
      background: transparent;
      border: 2px solid #2196f3;
      color: #2196f3;
    `}
`;

const LinkStyled = styled.a<{ variant?: string; color?: string }>`
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  padding: 8px 24px;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-block;
  ${({ theme, color }) =>
    color === "primary"
      ? css`
          background: ${theme.palette?.primary?.main || "#2196f3"};
          color: ${theme.palette?.primary?.contrastText || "#fff"};
        `
      : color === "secondary"
        ? css`
          background: ${theme.palette?.secondary?.main || "#512da8"};
          color: ${theme.palette?.secondary?.contrastText || "#fff"};
        `
        : css`
          background: #e0e0e0;
          color: #21243d;
        `}
  ${({ variant }) =>
    variant === "outlined" &&
    css`
      background: transparent;
      border: 2px solid #2196f3;
      color: #2196f3;
    `}
`;

export interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "outlined";
  color?: "primary" | "secondary";
  href?: string;
}

/**
 * Botão padronizado para o sistema, agora usando styled-components.
 * Pode ser usado em qualquer página ou componente.
 *
 * @example
 * <Botao variant="contained" color="primary">Enviar</Botao>
 */
const Botao: React.FC<BotaoProps> = React.memo(function BotaoMemo({ children, variant = "contained", color = "primary", href, ...props }) {
  // Se href for passado, renderiza um <a> estilizado para navegação
  if (href) {
    // Extrai props compatíveis com <a> usando tipagem correta
    const {
      style,
      className,
      id,
      tabIndex,
      title,
      // Props específicas de <a>
      target,
      rel,
      ...rest
    } = props as Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    return (
      <LinkStyled
        variant={variant}
        color={color}
        href={href}
        style={style}
        className={className}
        id={id}
        target={target}
        rel={rel}
        tabIndex={tabIndex}
        title={title}
        role="button"
        {...rest}
      >
        {children}
      </LinkStyled>
    );
  }
  // Caso contrário, renderiza um <button> padrão
  return (
    <BotaoStyled variant={variant} color={color} {...props}>
      {children}
    </BotaoStyled>
  );
});
// Adiciona displayName para evitar erro de lint e facilitar debug
Botao.displayName = "Botao";

export default Botao;

