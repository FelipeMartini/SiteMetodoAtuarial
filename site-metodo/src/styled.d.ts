// Tipagem customizada para o tema do styled-components
import 'styled-components';

import { Theme } from './styles/themes';

declare module 'styled-components' {
  // Aqui você pode adicionar propriedades extras ao tema, se necessário
  export interface DefaultTheme extends Theme {
    _dummy?: boolean // Campo fictício para evitar interface vazia
  }
}

// Comentário: Isso permite que o styled-components reconheça as propriedades do nosso tema customizado.
