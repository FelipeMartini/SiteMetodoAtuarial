// Arquivo para definição dos temas MUI: dark e claro
// Facilita a personalização e futura adição de novos temas

import { createTheme } from '@mui/material/styles';

// Tema escuro (dark)
export const temaDark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#000000', // Preto
    },
    secondary: {
      main: '#512da8',
    },
    background: {
      default: '#121212',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#fff',
      secondary: '#bdbdbd',
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

// Tema claro (light)
export const temaClaro = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Azul padrão MUI
    },
    secondary: {
      main: '#512da8',
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
    text: {
      primary: '#212121',
      secondary: '#333',
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

// Comentário: Para adicionar novos temas, basta criar outros objetos usando createTheme e exportar aqui.
