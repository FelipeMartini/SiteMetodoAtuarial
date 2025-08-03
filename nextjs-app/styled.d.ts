// Tipagem customizada para o tema do styled-components
import 'styled-components';
import { Theme as MuiTheme } from '@mui/material/styles';

declare module 'styled-components' {
  export interface DefaultTheme extends MuiTheme {}
}

// Comentário: Isso permite que o styled-components reconheça as propriedades do tema MUI, incluindo palette.
