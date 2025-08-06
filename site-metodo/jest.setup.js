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

// Comentário: Este arquivo é carregado automaticamente pelo Jest (ver jest.config.js) para preparar o ambiente antes dos testes. Adiciona o fetch global e os matchers do Testing Library, evitando erros de ReferenceError e TS2339.
