// Componente SeletorTema unificado
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useTema } from '@core/theme/ContextoTema';
import { ThemeName, availableThemes } from '../../styles/themes';
import { Botao } from '../design-system/Botao';

const ContainerSeletor = styled.div`
  position: relative;
  display: inline-block;
`;

const BotaoSeletor = styled(Botao)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: space-between;
`;

const MenuDropdown = styled.div<{ $aberto: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 200px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: 0.5rem;
  margin-top: 0.25rem;
  opacity: ${props => props.$aberto ? 1 : 0};
  visibility: ${props => props.$aberto ? 'visible' : 'hidden'};
  transform: ${props => props.$aberto ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all ${props => props.theme.transitions.normal};
`;

const ItemTema = styled.button<{ $ativo: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.$ativo ? props.theme.colors.backgroundSecondary : 'transparent'};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.borderFocus};
    outline-offset: 1px;
  }
`;

const IconeTema = styled.span`
  font-size: 1.2rem;
  min-width: 1.5rem;
  text-align: center;
`;

const InfoTema = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
`;

const NomeTema = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const DescricaoTema = styled.span<{ $cor: string }>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$cor};
    margin-right: 0.5rem;
  }
`;

const SetaDropdown = styled.span<{ $aberto: boolean }>`
  transform: ${props => props.$aberto ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform ${props => props.theme.transitions.fast};
`;

// Overlay invisível para fechar o dropdown ao clicar fora
const Overlay = styled.div<{ $aberto: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: ${props => props.$aberto ? 'block' : 'none'};
`;

export function SeletorTema() {
  const { currentTheme, themeName, setTheme } = useTema();
  const temasDisponiveis = availableThemes;
  const temaAtual = currentTheme;
  const nomeTemaAtual = themeName;
  const selecionarTema = (nome: string) => setTheme(nome as ThemeName);
  const [menuAberto, setMenuAberto] = useState(false);

  const alternarMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const selecionarEFecharMenu = (nomeTema: ThemeName) => {
    selecionarTema(nomeTema);
    setMenuAberto(false);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <>
      <Overlay $aberto={menuAberto} onClick={fecharMenu} />
      <ContainerSeletor>
        <BotaoSeletor
          variant="ghost"
          size="sm"
          onClick={alternarMenu}
          aria-label="Selecionar tema"
          aria-expanded={menuAberto}
          aria-haspopup="true"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconeTema aria-hidden="true" style={{ color: temaAtual.colors.primary }}>●</IconeTema>
            {nomeTemaAtual.charAt(0).toUpperCase() + nomeTemaAtual.slice(1)}
          </span>
          <SetaDropdown $aberto={menuAberto} aria-hidden="true">
            ▼
          </SetaDropdown>
        </BotaoSeletor>

        <MenuDropdown $aberto={menuAberto} role="menu">
          {temasDisponiveis.map((tema) => (
            <ItemTema
              key={tema.name}
              $ativo={tema.name === nomeTemaAtual}
              onClick={() => selecionarEFecharMenu(tema.name as ThemeName)}
              role="menuitem"
              aria-current={tema.name === nomeTemaAtual ? 'true' : 'false'}
            >
              <IconeTema aria-hidden="true" style={{ color: tema.colors.primary }}>●</IconeTema>
              <InfoTema>
                <NomeTema>{tema.name.charAt(0).toUpperCase() + tema.name.slice(1)}</NomeTema>
                <DescricaoTema $cor={tema.colors.primary}>
                  {/* Descrição personalizada pode ser ajustada conforme necessidade */}
                  {tema.name === 'light' ? 'Claro e moderno' : tema.name === 'dark' ? 'Escuro elegante' : 'Tema personalizado'}
                </DescricaoTema>
              </InfoTema>
            </ItemTema>
          ))}
        </MenuDropdown>
      </ContainerSeletor>
    </>
  );
}
