// Arquivo central de temas e cores customizadas do projeto
// Todas as cores e configurações de tema ficam aqui para facilitar manutenção e expansão
// Basta alterar este arquivo para criar novos temas ou modificar cores globais

import { createTheme } from '@mui/material/styles';

// Tema escuro do projeto
export const temaEscuro = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#21243d', // Barra superior, botões principais
      contrastText: '#fff',
    },
    secondary: {
      main: '#512da8', // Botões secundários, destaques
      contrastText: '#fff',
    },
    background: {
      default: '#181a20', // Fundo geral da página
      paper: '#23263a', // Cards, containers, rodapé
    },
    text: {
      primary: '#e0e0e0', // Texto principal
      secondary: '#bdbdbd', // Texto secundário
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

// Tema claro do projeto
export const temaClaro = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3', // Barra superior, botões principais
      contrastText: '#fff',
    },
    secondary: {
      main: '#90caf9', // Botões secundários, destaques
      contrastText: '#212121',
    },
    background: {
      default: '#e3f2fd', // Fundo geral da página
      paper: '#ffffff', // Cards, containers, rodapé
    },
    text: {
      primary: '#212121', // Texto principal
      secondary: '#1976d2', // Texto secundário
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

// Objeto centralizado de cores extras para uso em todo o projeto
// Utilize coresCustomizadas[temaAtual].<propriedade> para acessar nos componentes
export const coresCustomizadas = {
  escuro: {
    rodape: '#181a20', // Fundo do rodapé
    rodapeTexto: '#bdbdbd', // Texto do rodapé
    card: '#23263a', // Fundo dos cards
    destaque: '#512da8', // Destaques
    destaqueTexto: '#fff', // Texto de destaque
    botao: '#21243d', // Botão principal
    botaoTexto: '#fff',
  },
  claro: {
    rodape: '#e3f2fd', // Fundo do rodapé
    rodapeTexto: '#1976d2', // Texto do rodapé
    card: '#ffffff', // Fundo dos cards
    destaque: '#90caf9', // Destaques
    destaqueTexto: '#fff', // Texto de destaque
    botao: '#2196f3', // Botão principal
    botaoTexto: '#fff',
  }
};

// Para adicionar novos temas, crie um novo objeto usando createTheme e adicione as cores em coresCustomizadas.
// Para acessar cores extras use coresCustomizadas[temaAtual].rodape, etc. nos componentes.


// Comentário: Para adicionar novos temas, basta criar outros objetos usando createTheme e adicionar no objeto coresCustomizadas.
// Para acessar cores extras use coresCustomizadas[temaAtual].rodape, etc. nos componentes.
