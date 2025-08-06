// Polyfill global fetch para ambiente de testes Node.js
global.fetch = require('cross-fetch');

// Importa os matchers do Testing Library para habilitar 'toBeInTheDocument' e outros
require('@testing-library/jest-dom');

// Comentário: Este arquivo é carregado automaticamente pelo Jest (ver jest.config.js) para preparar o ambiente antes dos testes. Adiciona o fetch global e os matchers do Testing Library, evitando erros de ReferenceError e TS2339.
