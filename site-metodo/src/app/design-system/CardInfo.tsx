
// CardInfo moderno usando styled-components, Tailwind e shadcn/ui, com suporte ao tema
import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { Skeleton } from '../components/ui/skeleton';

// Estilização do card usando styled-components e integração com tema
const CardStyled = styled.div<{ $shadow?: boolean; theme: DefaultTheme }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ $shadow, theme }) => $shadow ? theme.shadows.sm : 'none'};
  padding: 1.5rem;
  transition: box-shadow 0.2s;
`;

const Titulo = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
`;

const Descricao = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  text-align: center;
`;

const Conteudo = styled.div`
  margin-top: 1rem;
`;

/**
 * Componente CardInfo
 * Modernizado para usar styled-components, Tailwind e shadcn/ui
 * Suporte ao tema claro/escuro via ThemeProvider
 * Comentários explicativos em cada parte
 */
interface CardInfoProps {
  titulo: string;
  descricao?: string;
  conteudo?: React.ReactNode;
  icone?: React.ReactNode;
  onClick?: () => void;
  elevacao?: 1 | 2 | 3;
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
  // Exibe Skeletons se props principais não estiverem disponíveis
  if (!titulo && !descricao && !conteudo) {
    return (
      <CardStyled $shadow={elevacao > 1} className={className}>
        <Skeleton className="h-[24px] w-[120px] mb-2" />
        <Skeleton className="h-[16px] w-[180px] mb-2" />
        <Skeleton className="h-[32px] w-full" />
      </CardStyled>
    );
  }
  return (
    <CardStyled
      $shadow={elevacao > 1}
      onClick={onClick}
      className={className}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {icone && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' }}>
          {icone}
        </div>
      )}
      <Titulo>{titulo}</Titulo>
      {descricao && <Descricao>{descricao}</Descricao>}
      {conteudo && <Conteudo>{conteudo}</Conteudo>}
    </CardStyled>
  );
};

export default CardInfo;
