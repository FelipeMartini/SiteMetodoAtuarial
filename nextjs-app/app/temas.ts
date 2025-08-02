// Arquivo para definição dos temas MUI: dark e claro
// Facilita a personalização e futura adição de novos temas

import { createTheme } from '@mui/material/styles';

// Tema escuro (escuro)
export const temaEscuro = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#21243d', // Azul profundo para conforto visual
      contrastText: '#fff',
    },
    secondary: {
      main: '#512da8',
      contrastText: '#fff',
    },
    background: {
      default: '#181a20', // Cinza escuro para fundo
      paper: '#23263a', // Cinza/azul escuro para cards
    },
    text: {
      primary: '#e0e0e0', // Cinza claro para texto principal
      secondary: '#bdbdbd', // Cinza para texto secundário
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
      main: '#2196f3', // Azul claro moderno
      contrastText: '#fff',
    },
    secondary: {
      main: '#90caf9', // Azul claro secundário
      contrastText: '#212121',
    },
    background: {
      default: '#e3f2fd', // Azul muito claro para fundo
      paper: '#ffffff', // Branco para cards e papel
    },
    text: {
      primary: '#212121', // Preto para texto principal
      secondary: '#1976d2', // Azul para texto secundário
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

// Comentário: Para adicionar novos temas, basta criar outros objetos usando createTheme e exportar aqui.
