// Componente CardInfo reutilizável do design system
import React from "react";
import styled from "styled-components";

/**
 * CardInfo padronizado para exibir informações, agora usando styled-components.
 * Recebe título, descrição e children para conteúdo extra.
 *
 * @example
 * <CardInfo titulo="Informações" descricao="Descrição opcional">
 *   <div>Conteúdo adicional</div>
 * </CardInfo>
 */
export interface CardInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  titulo: string;
  descricao?: string;
  children?: React.ReactNode;
}

// Estilos do card usando styled-components
const CardStyled = styled.div`
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  background: ${({ theme }) => theme.palette?.background?.paper || '#fff'};
  padding: 24px;
  margin: 8px 0;
`;

const Titulo = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.palette?.text?.primary || '#21243d'};
`;

const Descricao = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.palette?.text?.secondary || '#666'};
  margin-bottom: 16px;
`;

const CardInfo: React.FC<CardInfoProps> = React.memo(function CardInfoMemo({ titulo, descricao, children, ...props }) {
  return (
    <CardStyled {...props}>
      <Titulo>{titulo}</Titulo>
      {descricao && <Descricao>{descricao}</Descricao>}
      {children}
    </CardStyled>
  );
});
// Adiciona displayName para evitar erro de lint e facilitar debug
CardInfo.displayName = "CardInfo";

export default CardInfo;
