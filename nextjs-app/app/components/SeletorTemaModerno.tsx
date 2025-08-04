'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useUtilsTema } from '../theme/ContextoTema';
import { NomesTema } from '../theme/temas';
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
  background: ${props => props.theme.cores.superficie};
  border: 1px solid ${props => props.theme.cores.borda};
  border-radius: ${props => props.theme.bordas.raios.md};
  box-shadow: ${props => props.theme.sombras.lg};
  padding: 0.5rem;
  margin-top: 0.25rem;
  opacity: ${props => props.$aberto ? 1 : 0};
  visibility: ${props => props.$aberto ? 'visible' : 'hidden'};
  transform: ${props => props.$aberto ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all ${props => props.theme.animacoes.transicoes.normal} ${props => props.theme.animacoes.curvas.easeOut};
`;

const ItemTema = styled.button<{ $ativo: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.$ativo ? props.theme.cores.fundoSecundario : 'transparent'};
  color: ${props => props.theme.cores.texto};
  border: none;
  border-radius: ${props => props.theme.bordas.raios.sm};
  cursor: pointer;
  font-size: ${props => props.theme.tipografia.tamanhos.sm};
  font-family: ${props => props.theme.tipografia.fontes.principal};
  transition: all ${props => props.theme.animacoes.transicoes.rapida};

  &:hover {
    background: ${props => props.theme.cores.fundoSecundario};
  }

  &:focus {
    outline: 2px solid ${props => props.theme.cores.bordaFoco};
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
  font-weight: ${props => props.theme.tipografia.pesos.medio};
`;

const DescricaoTema = styled.span<{ $cor: string }>`
  font-size: ${props => props.theme.tipografia.tamanhos.xs};
  color: ${props => props.theme.cores.textoSecundario};
  
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
  transition: transform ${props => props.theme.animacoes.transicoes.rapida};
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

const descricoesPersonalizadas = {
  'escuro': 'Padrão elegante',
  'claro': 'Limpo e moderno',
  'verde-natural': 'Sustentável',
  'roxo-profissional': 'Criativo',
  'coral-vibrante': 'Energético'
} as const;

export function SeletorTemaModerno() {
  const { temaAtual, nomeTemaAtual, selecionarTema, temasDisponiveis } = useUtilsTema();
  const [menuAberto, setMenuAberto] = useState(false);

  const alternarMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const selecionarEFecharMenu = (nomeTema: NomesTema) => {
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
            <IconeTema aria-hidden="true">{temaAtual.icone}</IconeTema>
            {temaAtual.displayName}
          </span>
          <SetaDropdown $aberto={menuAberto} aria-hidden="true">
            ▼
          </SetaDropdown>
        </BotaoSeletor>

        <MenuDropdown $aberto={menuAberto} role="menu">
          {temasDisponiveis.map((tema) => (
            <ItemTema
              key={tema.nome}
              $ativo={tema.nome === nomeTemaAtual}
              onClick={() => selecionarEFecharMenu(tema.nome)}
              role="menuitem"
              aria-current={tema.nome === nomeTemaAtual ? 'true' : 'false'}
            >
              <IconeTema aria-hidden="true">{tema.icone}</IconeTema>
              <InfoTema>
                <NomeTema>{tema.displayName}</NomeTema>
                <DescricaoTema $cor={tema.cores.primario}>
                  {descricoesPersonalizadas[tema.nome]}
                </DescricaoTema>
              </InfoTema>
            </ItemTema>
          ))}
        </MenuDropdown>
      </ContainerSeletor>
    </>
  );
}
