// TestHydration.tsx - Componente para testar se hydration está funcionando
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTema } from '../contexts/ThemeContext';

// Styled component para testar
const TesteContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: ${({ theme }) => theme.spacing.md} 0;
  transition: all ${({ theme }) => theme.transitions.normal};
  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const TituleTeste = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TextoTeste = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// ...styled do BotaoTeste já está definido corretamente abaixo...
const BotaoTeste = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverted};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

// ...styled do StatusIndicator já está definido corretamente abaixo...
const StatusIndicator = styled.div<{ $status: 'success' | 'errorr' }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  ${({ $status, theme }) => {
    switch ($status) {
      case 'success':
        return `background: ${theme.colors.successBackground}; color: ${theme.colors.success}; border: 1px solid ${theme.colors.success};`;
      case 'errorr':
        return `background: ${theme.colors.errorBackground}; color: ${theme.colors.error}; border: 1px solid ${theme.colors.error};`;
      default:
        return '';
    }
  }}
`;

interface TestHydrationProps {
  dataRenderizacao?: Date;
}

export default function TestHydration({ dataRenderizacao }: TestHydrationProps) {
  // Hook do tema e estados locais
  const { currentTheme, toggleTheme } = useTema();
  const [renderTime, setRenderTime] = useState<string>('');
  const [clickCount, setClickCount] = useState(0);

  // Marca o horário de renderização para testar hydration
  useEffect(() => {
    const data = dataRenderizacao || new Date();
    setRenderTime(data.toLocaleTimeString());
  }, [dataRenderizacao]);

  // Alterna o tema e conta cliques
  const handleTemaClick = () => {
    toggleTheme();
    setClickCount(prev => prev + 1);
  };

  // Status de hydration
  const getHydrationStatus = () => {
    return renderTime ? 'success' : 'errorr';
  };

  // Texto do status
  const getStatusText = () => {
    const status = getHydrationStatus();
    switch (status) {
      case 'success':
        return '✅ Hydrated';
      case 'errorr':
        return '❌ Erro';
      default:
        return '';
    }
  };

  // Renderização principal do componente
  return (
    <TesteContainer>
      <TituleTeste>Teste de Hydration</TituleTeste>
      <TextoTeste>
        Este componente valida visualmente e funcionalmente o SSR do styled-components, alternância de temas e status de hydration.
      </TextoTeste>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Tema Atual:</strong> {currentTheme?.name ? currentTheme.name.charAt(0).toUpperCase() + currentTheme.name.slice(1) : 'Desconhecido'}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Renderizado em:</strong> {renderTime || 'Aguardando...'}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Cliques no botão:</strong> {clickCount}
      </div>
      <BotaoTeste onClick={handleTemaClick}>
        🎨 Alternar Tema ({clickCount} cliques)
      </BotaoTeste>
      <div style={{ margin: '1rem 0' }}>
        <StatusIndicator $status={getHydrationStatus()}>
          {getStatusText()}
        </StatusIndicator>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>
        💡 <strong>Como testar:</strong>
        <br />
        1. Abra o DevTools (F12)
        <br />
        2. Recarregue a página (F5)
        <br />
        3. Verifique se não há erros de hydration no console
        <br />
        4. Observe se os estilos carregam instantaneamente (sem flicker)
        <br />
        5. Teste a alternância de temas clicando no botão
      </div>
    </TesteContainer>
  );
}

// Comentário: Este componente serve para validar visualmente e funcionalmente o SSR do styled-components, alternância de temas e status de hydration. Deve ser usado em testes automatizados e manuais.
