// Componente CardInfo moderno usando o novo sistema de temas

import React from 'react';
import { Card, Texto, Flex } from '../theme/ComponentesBase';

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
  hover = true,
  className,
}) => {
  const isClickable = !!onClick;

  return (
    <Card
      $elevacao={elevacao > 1}
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
      <Flex $direcao="column" $gap="md">
        {icone && (
          <Flex $justificar="center" $alinhar="center" style={{ marginBottom: '8px' }}>
            {icone}
          </Flex>
        )}

        <Texto $variante="subtitulo" $peso="medio" $alinhamento="centro">
          {titulo}
        </Texto>

        {descricao && (
          <Texto $variante="corpo" $cor="secundario" $alinhamento="centro">
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
