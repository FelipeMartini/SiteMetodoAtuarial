// styled.d.ts - Tipagem corrigida para styled-components
import 'styled-components';
import type { TemaCustomizado } from './app/theme/temas';

// Estende a interface DefaultTheme do styled-components
declare module 'styled-components' {
  export interface DefaultTheme extends TemaCustomizado {}
}

/**
 * Esta declaração permite que o TypeScript reconheça
 * todas as propriedades do nosso tema customizado quando
 * usamos props.theme dentro dos styled-components.
 * 
 * Exemplo de uso:
 * 
 * const MeuComponente = styled.div`
 *   color: ${props => props.theme.cores.primario};
 *   font-size: ${props => props.theme.tipografia.tamanhos.lg};
 *   padding: ${props => props.theme.espacamentos.md};
 * `;
 */