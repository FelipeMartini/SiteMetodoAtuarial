// TestHydration.tsx - Componente para testar se hydration está funcionando
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTema } from '../contexts/ThemeContext';

// Styled component para testar
const TesteContainer = styled.div`
  padding: ${props => props.theme.espacamentos.lg};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.bordas.raios.lg};
  margin: ${props => props.theme.espacamentos.md} 0;
  transition: all ${props => props.theme.animacoes.transicoes.normal};

  &:hover {
    background: ${props => props.theme.colors.surface};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.sombras.lg};
  }
`;

const TituleTeste = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.tipografia.tamanhos.xl};
  font-weight: ${props => props.theme.tipografia.pesos.negrito};
  margin-bottom: ${props => props.theme.espacamentos.sm};
`;

const TextoTeste = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.tipografia.tamanhos.base};
  line-height: ${props => props.theme.tipografia.alturas.relaxed};
  margin-bottom: ${props => props.theme.espacamentos.md};
`;

const BotaoTeste = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverted};
  border: none;
  border-radius: ${props => props.theme.bordas.raios.md};
  padding: ${props => props.theme.espacamentos.sm} ${props => props.theme.espacamentos.md};
  font-size: ${props => props.theme.tipografia.tamanhos.base};
  font-weight: ${props => props.theme.tipografia.pesos.medio};
  cursor: pointer;
  transition: all ${props => props.theme.animacoes.transicoes.rapida};

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatusIndicator = styled.div<{ $status: 'loading' | 'success' | 'errorr' }>`
  display: inline-block;
  padding: ${props => props.theme.espacamentos.xs} ${props => props.theme.espacamentos.sm};
  border-radius: ${props => props.theme.bordas.raios.full};
  font-size: ${props => props.theme.tipografia.tamanhos.sm};
  font-weight: ${props => props.theme.tipografia.pesos.medio};
  ${props => {
    switch (props.$status) {
      case 'loading':
        return `background: ${props.theme.colors.warningBackground}; color: ${props.theme.colors.warning}; border: 1px solid ${props.theme.colors.warning};`;
      case 'success':
        return `background: ${props.theme.colors.successBackground}; color: ${props.theme.colors.success}; border: 1px solid ${props.theme.colors.success};`;
      case 'errorr':
        return `background: ${props.theme.colors.errorrBackground}; color: ${props.theme.colors.error}; border: 1px solid ${props.theme.colors.error};`;
      default:
        return '';
    }
  }}
`;

export default function TestHydration() {
  const { temaAtual, alternarTema, isHydrated } = useTema();
  const [renderTime, setRenderTime] = useState<string>('');
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setRenderTime(new Date().toLocaleTimeString());
  }, []);

  const handleTemaClick = () => {
    alternarTema();
    setClickCount(prev => prev + 1);
  };

  const getHydrationStatus = () => {
    if (!isHydrated) return 'loading';
    return renderTime ? 'success' : 'errorr';
  };

  const getStatusText = () => {
    const status = getHydrationStatus();
    switch (status) {
      case 'loading':
        return '⏳ Carregando...';
      case 'success':
        return '✅ Hydrated';
      case 'errorr':
        return '❌ Erro';
      default:
        return '';
    }
  };

  return (
    <TesteContainer>
      <TituleTeste>🧪 Teste de Hydration - Styled Components</TituleTeste>
      <TextoTeste>
        Este componente testa se o styled-components está funcionando corretamente
        no Next.js 15 com Server Side Rendering e sem errors de hydration.
      </TextoTeste>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Status do Hydration:</strong>{' '}
        <StatusIndicator $status={getHydrationStatus()}>
          {getStatusText()}
        </StatusIndicator>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Tema Atual:</strong> {temaAtual.displayName} {temaAtual.icone}
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
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>
        💡 <strong>Como testar:</strong>
        <br />
        1. Abra o DevTools (F12)
        <br />
        2. Recarregue a página (F5)
        <br />
        3. Verifique se não há errors de hydration no console
        <br />
        4. Observe se os estilos carregam instantaneamente (sem flicker)
        <br />
        5. Teste a alternância de temas clicando no botão
      </div>
    </TesteContainer>
  );
}

// Comentário: Este componente serve para validar visualmente e funcionalmente o SSR do styled-components, alternância de temas e status de hydration. Deve ser usado em testes automatizados e manuais.
