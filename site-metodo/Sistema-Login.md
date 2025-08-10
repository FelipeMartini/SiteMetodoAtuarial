# Sistema-Login (Auth.js v5, Prisma, Account Linking, Roles, Auditlog)

## Visão Geral

Este documento detalha toda a arquitetura, arquivos, dependências, fluxos e links do sistema de autenticação, autorização, account linking, providers, session, auditlog, roles e banco de dados do projeto `site-metodo`.

---

## Estrutura de Arquivos e Componentes

### Arquivos principais
- **/auth.ts**: Configuração central do Auth.js v5 (NextAuth), providers, callbacks, roles, account linking, auditlog, PrismaAdapter, session database.
- **/src/lib/auth.ts**: Reexporta métodos do arquivo raiz `auth.ts` para uso em outros módulos.
- **/src/lib/prisma.ts**: Singleton do Prisma Client, conexão e helpers.
- **/src/lib/auth/authRoles.ts**: Sistema de roles moderno, hierarquia e tipos.
- **/src/lib/audit/auditLogger.ts**: Sistema de auditoria, logging de ações, integração com tabela AuditLog do banco.
- **/prisma/schema.prisma**: Modelos do banco (User, Account, Session, AuditLog, etc.), enums de roles e ações.

### Componentes React/Hooks
- **/src/components/SocialLoginBox.tsx**: UI de login social, detecta providers ativos, faz login via handler Auth.js v5.
- **/src/components/auth/AuthGuard.tsx**: Protege rotas, verifica sessão e roles.
- **/src/hooks/useAuth.ts, useSession.ts, useCurrentUser.ts**: Hooks para acessar sessão, usuário logado, status, roles.
- **/src/components/ui/perfil-usuario-moderno.tsx, dashboard-usuario-widget.tsx**: Consomem sessão e exibem dados do usuário.

### API/Rotas
- **/app/api/auth/[...nextauth]/route.ts**: Handler de rotas do Auth.js v5, importa de `auth.ts`.
- **/app/api/auth/register/route.ts, definir-senha/route.ts, reset-senha/route.ts**: Fluxos de registro, redefinição de senha, integração com Prisma e Auth.js.
- **/app/api/users/**: Endpoints de perfil, update, etc.
- **/app/api/admin/dashboard/api/**: Endpoints protegidos por requireAuth, session, roles.

---

## Dependências e Versões
- **next-auth**: ^5.0.0-beta.29 (Auth.js v5, App Router-first)
- **@auth/prisma-adapter**: ^2.10.0
- **@prisma/client**: ^6.1.0
- **prisma**: ^6.1.0
- **bcryptjs**: ^3.0.2
- **zod**: ^4.0.14
- **react, next, tailwindcss, zustand, tanstack/react-query, etc.**: sempre manter atualizados

---

## Fluxos e Funcionalidades
- **Providers OAuth**: Google, Microsoft Entra ID, Discord, Facebook, Apple (configuráveis via .env)
- **Credentials**: Login interno com email/senha, validação Zod, bcryptjs
- **Account Linking**: Permite vincular múltiplos provedores ao mesmo usuário (via email)
- **Session Database**: Sessions persistidas no banco (SQLite via Prisma)
- **Roles**: Sistema moderno (admin, staff, user, guest), compatível com accessLevel legado
- **Auditlog**: Todas as ações críticas (login, logout, signup, MFA, account link/unlink, etc.) podem ser logadas na tabela AuditLog
- **MFA/TOTP**: Suporte a autenticação multifator (campos no modelo User)
- **Account Linking Seguro**: `allowDangerousEmailAccountLinking` só ativo em dev
- **Callbacks**: Enriquecimento de sessão, criação/atualização de usuário, controle de roles, redirecionamento seguro
- **Hooks**: useAuth, useSession, useCurrentUser, useSessions, etc.

---

## Estrutura do Banco (Prisma)
- **User**: id, email, password, accessLevel, role, isActive, lastLogin, MFA, auditLogs, accounts, sessions
- **Account**: provider, providerAccountId, userId, tokens
- **Session**: sessionToken, userId, expires
- **AuditLog**: userId, action, target, details, ip, userAgent, success, createdAt
- **Enums**: UserRole (GUEST, USER, MODERATOR, ADMIN), AuditAction (LOGIN_SUCCESS, SIGNUP, OAUTH_LINK, etc.)

---

## Links e Referências
- [Auth.js Docs](https://authjs.dev/getting-started)
- [Guia de Migração v5](https://authjs.dev/guides/upgrade-to-v5)
- [Providers](https://authjs.dev/getting-started/providers/)
- [Prisma Adapter](https://authjs.dev/getting-started/adapters/prisma)
- [Changelog](https://github.com/nextauthjs/next-auth/releases)
- [Session Management](https://authjs.dev/getting-started/session-management/login)
- [Security](https://authjs.dev/security)
- [API reference](https://authjs.dev/reference/overview)
- [Discord Community](https://discord.authjs.dev/?utm_source=docs)

---

## Observações e Melhores Práticas
- Sempre use variáveis de ambiente prefixadas com AUTH_ para providers.
- Account linking seguro: nunca ative allowDangerousEmailAccountLinking em produção.
- Sessions sempre persistidas no banco para todos os providers.
- Roles modernas e compatíveis com accessLevel legado.
- Auditoria pronta para integração com logs de segurança (tabela AuditLog).
- MFA/TOTP já previsto no modelo User.
- Prisma Client sempre singleton para evitar leaks em dev.
- Atualize dependências regularmente e siga as recomendações do Auth.js v5.

---

## TODOs e Pontos de Atenção
- Implementar logging real na tabela AuditLog (ver TODO em /auth.ts e /src/lib/audit/auditLogger.ts)
- Validar flows de MFA/TOTP e account linking em produção
- Monitorar breaking changes do Auth.js v5 beta
- Revisar roles e permissões conforme crescimento do sistema

---

*Gerado automaticamente via auditoria profunda do workspace em 10/08/2025.*
