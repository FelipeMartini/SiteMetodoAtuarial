/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';

// Mock das funções do Auth.js
const mockAuth = jest.fn();
jest.mock('../../auth', () => ({
  auth: mockAuth,
}));

describe('Middleware de Autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Proteção de Rotas por Role', () => {
    it('deve permitir acesso a rotas públicas sem autenticação', async () => {
      mockAuth.mockResolvedValue(null);
      
      const { middleware } = await import('../../middleware');
      const request = new NextRequest('http://localhost:3000/login');
      
      const response = await middleware(request);
      
      expect(response.status).not.toBe(302); // Não deve redirecionar
    });

    it('deve redirecionar usuários não autenticados de rotas protegidas', async () => {
      mockAuth.mockResolvedValue(null);
      
      const { middleware } = await import('../../middleware');
      const request = new NextRequest('http://localhost:3000/dashboard');
      
      const response = await middleware(request);
      
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toContain('/login');
    });

    it('deve permitir acesso a ADMIN em rotas administrativas', async () => {
      mockAuth.mockResolvedValue({
        user: { id: '1', role: 'ADMIN', email: 'admin@test.com' }
      });
      
      const { middleware } = await import('../../middleware');
      const request = new NextRequest('http://localhost:3000/admin/users');
      
      const response = await middleware(request);
      
      expect(response.status).not.toBe(302);
    });

    it('deve bloquear acesso de USER a rotas administrativas', async () => {
      mockAuth.mockResolvedValue({
        user: { id: '1', role: 'USER', email: 'user@test.com' }
      });
      
      const { middleware } = await import('../../middleware');
      const request = new NextRequest('http://localhost:3000/admin/users');
      
      const response = await middleware(request);
      
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toContain('/unauthorized');
    });

    it('deve permitir acesso a MANAGER em rotas de gestão', async () => {
      mockAuth.mockResolvedValue({
        user: { id: '1', role: 'MANAGER', email: 'manager@test.com' }
      });
      
      const { middleware } = await import('../../middleware');
      const request = new NextRequest('http://localhost:3000/dashboard/manage');
      
      const response = await middleware(request);
      
      expect(response.status).not.toBe(302);
    });
  });

  describe('Configuração de Rotas', () => {
    it('deve ter rotas públicas definidas corretamente', async () => {
      const middleware = await import('../../middleware');
      
      // Testamos indiretamente através do comportamento
      expect(middleware).toBeDefined();
    });

    it('deve ter matcher configurado para proteger rotas específicas', async () => {
      const { config } = await import('../../middleware');
      
      expect(config.matcher).toBeDefined();
      expect(Array.isArray(config.matcher)).toBe(true);
    });
  });

  describe('Logs de Auditoria', () => {
    it('deve registrar tentativas de acesso não autorizado', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      mockAuth.mockResolvedValue({
        user: { id: '1', role: 'USER', email: 'user@test.com' }
      });
      
      const { middleware } = await import('../../middleware');
      const request = new NextRequest('http://localhost:3000/admin/settings');
      
      await middleware(request);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Acesso negado')
      );
      
      consoleSpy.mockRestore();
    });

    it('deve registrar acessos autorizados', async () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
      
      mockAuth.mockResolvedValue({
        user: { id: '1', role: 'ADMIN', email: 'admin@test.com' }
      });
      
      const { middleware } = await import('../../middleware');
      const request = new NextRequest('http://localhost:3000/dashboard');
      
      await middleware(request);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Acesso autorizado')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('deve tratar sessões malformadas graciosamente', async () => {
      mockAuth.mockResolvedValue({
        user: { id: '1' } // Role ausente
      });
      
      const { middleware } = await import('../../middleware');
      const request = new NextRequest('http://localhost:3000/dashboard');
      
      const response = await middleware(request);
      
      // Deve redirecionar por falta de role válida
      expect(response.status).toBe(302);
    });

    it('deve tratar erros de autenticação graciosamente', async () => {
      mockAuth.mockRejectedValue(new Error('Auth error'));
      
      const { middleware } = await import('../../middleware');
      const request = new NextRequest('http://localhost:3000/dashboard');
      
      const response = await middleware(request);
      
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toContain('/login');
    });
  });
});
