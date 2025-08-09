// webcrypto deve ser definido antes de qualquer import do Auth.js
try {
  const { webcrypto } = require('crypto')
  if (webcrypto) global.crypto = webcrypto
} catch {}
// Polyfill global fetch para ambiente de testes Node.js
// Mock global fetch para todos os testes: evita chamadas reais e permite simular respostas
global.fetch = jest.fn().mockImplementation((url, options) => {
  // Lista de usuários para dashboard-admin
  if (typeof url === 'string' && url.includes('/api/usuario/lista')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ usuarios: [{ id: '1', name: 'Admin', email: 'admin@site.com', accessLevel: 5, isActive: true, createdAt: '2023-01-01' }] })
    });
  }
  // Login tradicional: sucesso
  if (typeof url === 'string' && url.includes('/api/auth/signin/credentials')) {
    const body = options && options.body ? JSON.parse(options.body) : {};
    if (body.email === 'cliente@teste.com' && body.password === '123456') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { id: '1', email: body.email, accessLevel: 1, name: 'Cliente' } })
      });
    }
    // Login tradicional: erro
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: 'Credenciais inválidas' })
    });
  }
  // Sessão autenticada
  if (typeof url === 'string' && url.includes('/api/auth/session')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: { id: '1', email: 'cliente@teste.com', accessLevel: 1, name: 'Cliente' } })
    });
  }
  // Logout
  if (typeof url === 'string' && url.includes('/api/auth/signout')) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  }
  // Default
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

// Importa os matchers do Testing Library para habilitar 'toBeInTheDocument' e outros
require('@testing-library/jest-dom');

// Polyfill TextEncoder/TextDecoder exigidos por @auth/core (usa jose internamente)
const { TextEncoder, TextDecoder } = require('util')
if (!global.TextEncoder) global.TextEncoder = TextEncoder
if (!global.TextDecoder) global.TextDecoder = TextDecoder

// Mock de nodemailer para evitar erro quando provider Email é importado em ambiente de teste sem dependência instalada
try {
  jest.mock('nodemailer', () => ({
    createTransport: () => ({
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
      verify: jest.fn().mockResolvedValue(true),
    }),
  }))
} catch (e) {
  // Ignora se já estiver mockado
}

// Polyfill Request / Response / Headers via @whatwg-node/fetch (mais completo para Auth.js)
try {
  const { Request, Response, Headers, FormData, File, fetch: whatwgFetch } = require('@whatwg-node/fetch')
  if (!global.Request) global.Request = Request
  if (!global.Response) global.Response = Response
  if (!global.Headers) global.Headers = Headers
  if (!global.FormData) global.FormData = FormData
  if (!global.File) global.File = File
  if (!global.fetch) global.fetch = whatwgFetch
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('[jest.setup] Não foi possível polyfill Request/Response via @whatwg-node/fetch:', e?.message)
}

// Polyfill webcrypto (crypto.subtle) necessário para geração de CSRF e hashes no Auth.js
try {
  if (!global.crypto || !global.crypto.subtle) {
    const { webcrypto } = require('crypto')
    global.crypto = webcrypto
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('[jest.setup] Não foi possível definir webcrypto:', e?.message)
}

// Comentário: Este arquivo é carregado automaticamente pelo Jest (ver jest.config.js) para preparar o ambiente antes dos testes. Adiciona o fetch global e os matchers do Testing Library, evitando erros de ReferenceError e TS2339.
