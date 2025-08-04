# 5. ARQUIVO: styled.d.ts corrigido
styled_d_ts_corrigido = '''// styled.d.ts - Tipagem corrigida para styled-components
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
 */'''

# Salvando arquivo 5
with open('styled_corrigido.d.ts', 'w', encoding='utf-8') as f:
    f.write(styled_d_ts_corrigido)

print("✅ Arquivo 5 criado: styled_corrigido.d.ts")