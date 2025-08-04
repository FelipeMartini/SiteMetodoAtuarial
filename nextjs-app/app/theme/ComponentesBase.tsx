/**
 * Componentes base modernos para o design system
 * Compatível com o novo sistema de 5 temas
 */
import styled from 'styled-components';

// Container base responsivo
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.espacamentos.md};

  @media (max-width: 768px) {
    padding: 0 ${props => props.theme.espacamentos.sm};
  }
`;

// Flex container com propriedades configuráveis
export const Flex = styled.div<{
  $direcao?: 'row' | 'column';
  $alinhar?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  $justificar?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  $gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.$direcao || 'row'};
  align-items: ${props => props.$alinhar || 'stretch'};
  justify-content: ${props => props.$justificar || 'flex-start'};
  gap: ${props => props.$gap ? props.theme.espacamentos[props.$gap] : '0'};
  flex-wrap: ${props => props.$wrap ? 'wrap' : 'nowrap'};
`;

// Texto com variantes tipográficas
export const Texto = styled.p<{
  $variante?: 'corpo' | 'legenda' | 'titulo' | 'subtitulo';
  $cor?: 'primario' | 'secundario' | 'terciario';
  $peso?: 'normal' | 'medio' | 'negrito';
  $alinhamento?: 'esquerda' | 'centro' | 'direita';
}>`
  margin: 0;
  font-family: ${props => props.theme.tipografia.fontes.principal};
  color: ${props => {
    switch (props.$cor) {
      case 'primario': return props.theme.cores.texto;
      case 'secundario': return props.theme.cores.textoSecundario;
      case 'terciario': return props.theme.cores.textoTerciario;
      default: return props.theme.cores.texto;
    }
  }};
  font-weight: ${props => {
    switch (props.$peso) {
      case 'normal': return props.theme.tipografia.pesos.normal;
      case 'medio': return props.theme.tipografia.pesos.medio;
      case 'negrito': return props.theme.tipografia.pesos.negrito;
      default: return props.theme.tipografia.pesos.normal;
    }
  }};
  text-align: ${props => {
    switch (props.$alinhamento) {
      case 'esquerda': return 'left';
      case 'centro': return 'center';
      case 'direita': return 'right';
      default: return 'left';
    }
  }};
  font-size: ${props => {
    switch (props.$variante) {
      case 'corpo': return props.theme.tipografia.tamanhos.base;
      case 'legenda': return props.theme.tipografia.tamanhos.sm;
      case 'titulo': return props.theme.tipografia.tamanhos['2xl'];
      case 'subtitulo': return props.theme.tipografia.tamanhos.lg;
      default: return props.theme.tipografia.tamanhos.base;
    }
  }};
  line-height: ${props => props.theme.tipografia.alturas.normal};
`;

// Seção para organizar layout
export const Secao = styled.section<{
  $padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  $fundo?: 'primario' | 'secundario' | 'transparente';
}>`
  width: 100%;
  padding: ${props => {
    const padding = props.$padding || 'lg';
    return `${props.theme.espacamentos[padding]} 0`;
  }};
  background: ${props => {
    switch (props.$fundo) {
      case 'primario': return props.theme.cores.fundo;
      case 'secundario': return props.theme.cores.fundoSecundario;
      case 'transparente': return 'transparent';
      default: return props.theme.cores.fundo;
    }
  }};
`;

// Card base para conteúdo
export const Card = styled.div<{
  $padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  $elevacao?: boolean;
}>`
  background: ${props => props.theme.cores.superficie};
  border: 1px solid ${props => props.theme.cores.borda};
  border-radius: ${props => props.theme.bordas.raios.lg};
  padding: ${props => {
    const padding = props.$padding || 'lg';
    return props.theme.espacamentos[padding];
  }};
  box-shadow: ${props => props.$elevacao ? props.theme.sombras.md : props.theme.sombras.sm};
  transition: all ${props => props.theme.animacoes.transicoes.normal} ${props => props.theme.animacoes.curvas.easeOut};

  &:hover {
    box-shadow: ${props => props.$elevacao ? props.theme.sombras.lg : props.theme.sombras.md};
    border-color: ${props => props.theme.cores.bordaHover};
  }
`;

// Input base para formulários
export const Input = styled.input<{
  $erro?: boolean;
  $tamanho?: 'sm' | 'md' | 'lg';
}>`
  width: 100%;
  font-family: ${props => props.theme.tipografia.fontes.principal};
  font-size: ${props => {
    switch (props.$tamanho) {
      case 'sm': return props.theme.tipografia.tamanhos.sm;
      case 'md': return props.theme.tipografia.tamanhos.base;
      case 'lg': return props.theme.tipografia.tamanhos.lg;
      default: return props.theme.tipografia.tamanhos.base;
    }
  }};
  padding: ${props => {
    switch (props.$tamanho) {
      case 'sm': return `${props.theme.espacamentos.xs} ${props.theme.espacamentos.sm}`;
      case 'md': return `${props.theme.espacamentos.sm} ${props.theme.espacamentos.md}`;
      case 'lg': return `${props.theme.espacamentos.md} ${props.theme.espacamentos.lg}`;
      default: return `${props.theme.espacamentos.sm} ${props.theme.espacamentos.md}`;
    }
  }};
  background: ${props => props.theme.cores.superficie};
  color: ${props => props.theme.cores.texto};
  border: 1px solid ${props => props.$erro ? props.theme.cores.erro : props.theme.cores.borda};
  border-radius: ${props => props.theme.bordas.raios.md};
  transition: all ${props => props.theme.animacoes.transicoes.rapida};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.cores.bordaFoco};
    box-shadow: 0 0 0 3px ${props => props.theme.cores.bordaFoco}25;
  }

  &::placeholder {
    color: ${props => props.theme.cores.textoTerciario};
  }

  &:disabled {
    background: ${props => props.theme.cores.fundoTerciario};
    color: ${props => props.theme.cores.textoTerciario};
    cursor: not-allowed;
  }
`;

// Botão base com variantes
export const BotaoBase = styled.button<{
  $variante?: 'primary' | 'secondary' | 'ghost' | 'danger';
  $tamanho?: 'sm' | 'md' | 'lg';
  $larguraCompleta?: boolean;
  $carregando?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.espacamentos.xs};
  width: ${props => props.$larguraCompleta ? '100%' : 'auto'};
  border: none;
  border-radius: ${props => props.theme.bordas.raios.md};
  font-family: ${props => props.theme.tipografia.fontes.principal};
  font-weight: ${props => props.theme.tipografia.pesos.medio};
  text-decoration: none;
  cursor: ${props => props.$carregando ? 'wait' : 'pointer'};
  transition: all ${props => props.theme.animacoes.transicoes.rapida};
  position: relative;
  overflow: hidden;

  /* Tamanhos */
  ${props => {
    switch (props.$tamanho) {
      case 'sm':
        return `
          padding: ${props.theme.espacamentos.xs} ${props.theme.espacamentos.sm};
          font-size: ${props.theme.tipografia.tamanhos.sm};
          min-height: 32px;
        `;
      case 'md':
        return `
          padding: ${props.theme.espacamentos.sm} ${props.theme.espacamentos.md};
          font-size: ${props.theme.tipografia.tamanhos.base};
          min-height: 40px;
        `;
      case 'lg':
        return `
          padding: ${props.theme.espacamentos.md} ${props.theme.espacamentos.lg};
          font-size: ${props.theme.tipografia.tamanhos.lg};
          min-height: 48px;
        `;
      default:
        return `
          padding: ${props.theme.espacamentos.sm} ${props.theme.espacamentos.md};
          font-size: ${props.theme.tipografia.tamanhos.base};
          min-height: 40px;
        `;
    }
  }}

  /* Variantes */
  ${props => {
    switch (props.$variante) {
      case 'primary':
        return `
          background: ${props.theme.cores.primario};
          color: ${props.theme.cores.textoInvertido};
          border: 1px solid ${props.theme.cores.primario};

          &:hover:not(:disabled) {
            background: ${props.theme.cores.primariaHover};
            border-color: ${props.theme.cores.primariaHover};
            transform: translateY(-1px);
            box-shadow: ${props.theme.sombras.md};
          }
        `;
      case 'secondary':
        return `
          background: ${props.theme.cores.secundario};
          color: ${props.theme.cores.textoInvertido};
          border: 1px solid ${props.theme.cores.secundario};

          &:hover:not(:disabled) {
            background: ${props.theme.cores.secundariaHover};
            border-color: ${props.theme.cores.secundariaHover};
            transform: translateY(-1px);
            box-shadow: ${props.theme.sombras.md};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${props.theme.cores.texto};
          border: 1px solid transparent;

          &:hover:not(:disabled) {
            background: ${props.theme.cores.fundoSecundario};
            border-color: ${props.theme.cores.borda};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.cores.erro};
          color: ${props.theme.cores.textoInvertido};
          border: 1px solid ${props.theme.cores.erro};

          &:hover:not(:disabled) {
            background: ${props.theme.cores.erro}dd;
            transform: translateY(-1px);
            box-shadow: ${props.theme.sombras.md};
          }
        `;
      default:
        return `
          background: ${props.theme.cores.primario};
          color: ${props.theme.cores.textoInvertido};
          border: 1px solid ${props.theme.cores.primario};

          &:hover:not(:disabled) {
            background: ${props.theme.cores.primariaHover};
            border-color: ${props.theme.cores.primariaHover};
            transform: translateY(-1px);
            box-shadow: ${props.theme.sombras.md};
          }
        `;
    }
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.cores.bordaFoco};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Estado de carregamento */
  ${props => props.$carregando && `
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;
