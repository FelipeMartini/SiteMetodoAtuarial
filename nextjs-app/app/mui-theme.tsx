"use client";
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // Alterando a cor primária para preto para criar uma temática dark
    primary: {
      main: '#000000', // Preto
    },
    secondary: {
      main: '#512da8',
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

export default theme;