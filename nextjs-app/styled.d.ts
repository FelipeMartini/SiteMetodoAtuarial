// Tipagem customizada para o tema do styled-components
import 'styled-components';
import type { TemaCustomizado } from './app/theme/types';

import 'styled-components';
import { Theme } from './styles/themes';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme { }
}

// Comentário: Isso permite que o styled-components reconheça as propriedades do nosso tema customizado.
