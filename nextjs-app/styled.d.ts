// Tipagem customizada para o tema do styled-components
import 'styled-components';
import type { TemaCustomizado } from './app/theme/types';

declare module 'styled-components' {
  export interface DefaultTheme extends TemaCustomizado {}
}

// Comentário: Isso permite que o styled-components reconheça as propriedades do nosso tema customizado.
