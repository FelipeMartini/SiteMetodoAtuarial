global.fetch = require('cross-fetch');
// Polyfill global fetch para ambiente de testes Node.js
// Isso garante que NextAuth e outros módulos que usam fetch funcionem nos testes

global.fetch = require('cross-fetch');

// Importa os matchers do Testing Library para habilitar 'toBeInTheDocument' e outros
import '@testing-library/jest-dom';

// Comentário: Este arquivo é carregado automaticamente pelo Jest (ver jest.config.js) para preparar o ambiente antes dos testes. Adiciona o fetch global e os matchers do Testing Library, evitando erros de ReferenceError e TS2339.
