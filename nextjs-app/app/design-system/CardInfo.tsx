// Componente CardInfo moderno usando o novo sistema de temas

import React from 'react';
import { Card, Flex, Texto } from '../../styles/ComponentesBase';

interface CardInfoProps {
  titulo: string;
  descricao?: string;
  conteudo?: React.ReactNode;
  icone?: React.ReactNode;
  onClick?: () => void;
  elevacao?: 1 | 2 | 3;
  hover?: boolean;
  className?: string;
}

export const CardInfo: React.FC<CardInfoProps> = ({
  titulo,
  descricao,
  conteudo,
  icone,
  onClick,
  elevacao = 1,
  className,
}) => {
  const isClickable = !!onClick;

  return (
    <Card
      $shadow={elevacao > 1}
      onClick={onClick}
      className={className}
      style={{
        cursor: isClickable ? 'pointer' : 'default',
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      <Flex $direction="column" $gap="md">
        {icone && (
          <Flex $justify="center" $align="center" style={{ marginBottom: '8px' }}>
            {icone}
          </Flex>
        )}

        <Texto $variante="h3" $peso="negrito" $align="centro">
          {titulo}
        </Texto>

        {descricao && (
          <Texto $variante="body2" $cor="secundario" $align="centro">
            {descricao}
          </Texto>
        )}

        {conteudo && (
          <div>
            {conteudo}
          </div>
        )}
      </Flex>
    </Card>
  );
};

export default CardInfo;
