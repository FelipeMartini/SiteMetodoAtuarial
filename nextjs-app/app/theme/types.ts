// Tipos TypeScript para o sistema de temas moderno
import 'styled-components';
import type { TemaCustomizado } from './temas';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends TemaCustomizado {
    // Extensão do tema para styled-components
  }
}

// Exportar tipo do tema para uso externo
export type TipoTema = TemaCustomizado;
export type { TemaCustomizado };
