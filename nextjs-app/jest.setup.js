// Polyfill global fetch para ambiente de testes Node.js
// Isso garante que NextAuth e outros módulos que usam fetch funcionem nos testes

global.fetch = require('cross-fetch');

// Comentário: Este arquivo é carregado automaticamente pelo Jest (ver jest.config.js) para preparar o ambiente antes dos testes. Adiciona o fetch global, evitando erros de ReferenceError.
