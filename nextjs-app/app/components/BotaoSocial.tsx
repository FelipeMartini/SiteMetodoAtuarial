// Componente reutilizável para botões de login social
import React from 'react';
import styled from 'styled-components';

interface BotaoSocialProps {
  icone: React.ReactNode;
  texto: string;
  corFundo: string;
  corTexto: string;
  onClick: () => void;
  borderColor?: string;
  fontFamily?: string;
}

const BotaoStyled = styled.button<{
  corFundo: string;
  corTexto: string;
  borderColor?: string;
  fontFamily?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 999px;
  background: ${props => props.corFundo};
  color: ${props => props.corTexto};
  border: 1px solid ${props => props.borderColor || 'transparent'};
  font-family: ${props => props.fontFamily || 'Roboto, Arial, sans-serif'};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }
`;


// Removido: componente não é mais necessário, pois usamos apenas as imagens oficiais dos botões.
