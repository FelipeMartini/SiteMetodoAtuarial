/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock do Prisma antes da importação
const mockPrismaUser = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  deleteMany: jest.fn(),
};

const mockPrismaSession = {
  create: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  deleteMany: jest.fn(),
};

const mockPrismaAccount = {
  create: jest.fn(),
  findFirst: jest.fn(),
  deleteMany: jest.fn(),
};

const mockPrisma = {
  user: mockPrismaUser,
  session: mockPrismaSession,
  account: mockPrismaAccount,
  $disconnect: jest.fn(),
};

// Mock do Prisma Client
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
  prisma: mockPrisma,
}));

// Mock do bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('hashedPassword')),
  compare: jest.fn(() => Promise.resolve(true)),
}));

// Mock do Auth.js
jest.mock('next-auth', () => ({
  default: jest.fn(),
}));

describe('Auth.js v5 Configuration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    process.env.NEXTAUTH_SECRET = 'test-secret';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    
    // OAuth Provider Credentials
    process.env.AUTH_GOOGLE_ID = 'test-google-id';
    process.env.AUTH_GOOGLE_SECRET = 'test-google-secret';
    process.env.AUTH_MICROSOFT_ENTRA_ID_ID = 'test-microsoft-id';
    process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET = 'test-microsoft-secret';
    process.env.AUTH_DISCORD_ID = 'test-discord-id';
    process.env.AUTH_DISCORD_SECRET = 'test-discord-secret';
    process.env.AUTH_FACEBOOK_ID = 'test-facebook-id';
    process.env.AUTH_FACEBOOK_SECRET = 'test-facebook-secret';
    process.env.AUTH_APPLE_ID = 'test-apple-id';
    process.env.AUTH_APPLE_SECRET = 'test-apple-secret';
  });

  describe('OAuth Providers Configuration', () => {
    it('deve ter 5 provedores OAuth configurados', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      expect(config.providers).toHaveLength(5);
      
      const providerIds = config.providers.map((p: any) => p.id);
      expect(providerIds).toContain('google');
      expect(providerIds).toContain('microsoft-entra-id');
      expect(providerIds).toContain('discord');
      expect(providerIds).toContain('facebook');
      expect(providerIds).toContain('apple');
    });

    it('deve ter configuração correta do Google OAuth', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      const googleProvider = config.providers.find((p: any) => p.id === 'google');
      expect(googleProvider).toBeDefined();
      expect(googleProvider.clientId).toBe('test-google-id');
      expect(googleProvider.clientSecret).toBe('test-google-secret');
    });

    it('deve ter configuração correta do Microsoft OAuth', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      const microsoftProvider = config.providers.find((p: any) => p.id === 'microsoft-entra-id');
      expect(microsoftProvider).toBeDefined();
      expect(microsoftProvider.clientId).toBe('test-microsoft-id');
      expect(microsoftProvider.clientSecret).toBe('test-microsoft-secret');
    });

    it('deve ter configuração correta do Discord OAuth', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      const discordProvider = config.providers.find((p: any) => p.id === 'discord');
      expect(discordProvider).toBeDefined();
      expect(discordProvider.clientId).toBe('test-discord-id');
      expect(discordProvider.clientSecret).toBe('test-discord-secret');
    });

    it('deve ter configuração correta do Facebook OAuth', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      const facebookProvider = config.providers.find((p: any) => p.id === 'facebook');
      expect(facebookProvider).toBeDefined();
      expect(facebookProvider.clientId).toBe('test-facebook-id');
      expect(facebookProvider.clientSecret).toBe('test-facebook-secret');
    });

    it('deve ter configuração correta do Apple OAuth', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      const appleProvider = config.providers.find((p: any) => p.id === 'apple');
      expect(appleProvider).toBeDefined();
      expect(appleProvider.clientId).toBe('test-apple-id');
      expect(appleProvider.clientSecret).toBe('test-apple-secret');
    });
  });

  describe('Sistema de Roles Unificado', () => {
    it('deve mapear corretamente accessLevel para roles', async () => {
      const authModule = await import('../../../auth');
      
      expect(authModule.mapAccessLevelToRole(0)).toBe('ADMIN');
      expect(authModule.mapAccessLevelToRole(1)).toBe('MANAGER');
      expect(authModule.mapAccessLevelToRole(2)).toBe('USER');
      expect(authModule.mapAccessLevelToRole(99)).toBe('USER'); // Valor inválido deve ser USER
    });
  });

  describe('Database Configuration', () => {
    it('deve usar PrismaAdapter para sessões de banco', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      expect(config.adapter).toBeDefined();
      expect(config.session.strategy).toBe('database');
    });

    it('deve ter configuração correta de sessão', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      expect(config.session).toEqual({
        strategy: 'database',
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        updateAge: 24 * 60 * 60,   // 24 horas
      });
    });
  });

  describe('Callbacks de Segurança', () => {
    it('deve processar callback de signin corretamente', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      expect(config.callbacks.signIn).toBeDefined();
      expect(typeof config.callbacks.signIn).toBe('function');
    });

    it('deve processar callback de session corretamente', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      expect(config.callbacks.session).toBeDefined();
      expect(typeof config.callbacks.session).toBe('function');
    });

    it('deve processar callback de jwt corretamente', async () => {
      const authModule = await import('../../../auth');
      const config = (authModule.auth as any).config;
      
      expect(config.callbacks.jwt).toBeDefined();
      expect(typeof config.callbacks.jwt).toBe('function');
    });
  });

  describe('Variáveis de Ambiente', () => {
    it('deve validar todas as variáveis OAuth necessárias', () => {
      expect(process.env.AUTH_GOOGLE_ID).toBeDefined();
      expect(process.env.AUTH_GOOGLE_SECRET).toBeDefined();
      expect(process.env.AUTH_MICROSOFT_ENTRA_ID_ID).toBeDefined();
      expect(process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET).toBeDefined();
      expect(process.env.AUTH_DISCORD_ID).toBeDefined();
      expect(process.env.AUTH_DISCORD_SECRET).toBeDefined();
      expect(process.env.AUTH_FACEBOOK_ID).toBeDefined();
      expect(process.env.AUTH_FACEBOOK_SECRET).toBeDefined();
      expect(process.env.AUTH_APPLE_ID).toBeDefined();
      expect(process.env.AUTH_APPLE_SECRET).toBeDefined();
    });

    it('deve ter configuração de URL base', () => {
      expect(process.env.NEXTAUTH_URL).toBeDefined();
      expect(process.env.NEXTAUTH_SECRET).toBeDefined();
    });
  });
});
