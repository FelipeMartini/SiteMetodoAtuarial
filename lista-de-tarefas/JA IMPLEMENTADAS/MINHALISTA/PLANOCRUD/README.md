---
applyTo: '**'
---

# Plano Estratégico – CRUD & Dashboard Administrativo / Área Cliente

## Visão Geral
Objetivo: Evoluir o `site-metodo` para um sistema completo de gestão (Admin + Área Cliente) com foco em performance, UX moderna (Tailwind + shadcn/ui), segurança (Auth.js + RBAC simples) e extensibilidade. Este plano serve como guia para múltiplas squads executarem em paralelo.

## Princípios
1. Componentes reutilizáveis (design system consolidado em `@/components/ui`).
2. Server Components para páginas e data-fetching sensível + Client Components só onde há estado interativo.
3. Evitar sobrecarga inicial de libs — priorizar fetch direto e otimizar posteriormente (ex: React Query apenas onde caching avançado é crítico).
4. Acessibilidade e i18n (estrutura pronta para tradução futura).
5. Observabilidade: logs estruturados + pontos de telemetria (console placeholder até integrar plataforma externa).

## Stack Base
- Next.js App Router (React 19 / RSC)
- Auth.js v5 (sessions DB via Prisma)
- Prisma + PostgreSQL
- Tailwind + shadcn/ui
- Lucide Icons
- Zod (validação)
- (Opcional) TanStack Query isolado somente em áreas client pesadas após confirmar não interferência SSR

## Domínios Funcionais
1. Usuários & Perfis
2. Permissões / Papéis (admin, moderador, cliente)
3. Conteúdo Institucional (serviços, artigos, páginas)
4. Relatórios / Uploads Arquivos
5. Configurações do Sistema (feature flags, temas, integrações)
6. Auditoria & Logs de Acesso

## Estrutura de Pastas (Incremental)
```
src/
  app/
    area-cliente/
      dashboard/
      perfil/
      relatorios/
    admin/
      usuarios/
      conteudo/
      configuracoes/
      auditoria/
  server/ (camada server-only: repositórios / serviços)
    db/
    services/
    auth/
  components/
    ui/
    layout/
    data/
  lib/
  hooks/
  utils/
  schemas/
```

## Módulos & Entregáveis
### 1. Usuários
- [ ] Lista paginada (server-side fetch -> tabela responsiva)
- [ ] Filtro por email / status / papel
- [ ] Edição inline modal (nome, papel, ativo)
- [ ] Reset de senha admin -> gera token
- [ ] Desativar/reativar usuário (soft flag)

### 2. Papéis & Permissões
- [ ] Enum central (usuario, moderador, admin)
- [ ] Middleware / helper server `requireRole`
- [ ] Guardião client para esconder botões sem permissão
- [ ] Página Admin: gerenciamento de papéis (somente admin)

### 3. Conteúdo
- [ ] CRUD Serviços (nome, slug, descrição, tags, publicado)
- [ ] Editor rich text (shadcn + tiptap ou textarea simplificada fase 1)
- [ ] CRUD Páginas Institucionais (sobre, contato) – versão inicial
- [ ] Preview draft (RSC + query param)

### 4. Relatórios / Uploads
- [ ] Upload seguro (aceitar PDF, XLSX) com verificação mimetype
- [ ] Associação relatório -> usuário ou grupo
- [ ] Página cliente: listar e baixar
- [ ] Página admin: painel de uploads com status (processando, pronto)

### 5. Configurações / Feature Flags
- [ ] Integração inicial Unleash já existente (UI de toggle interna)
- [ ] Tema: persistência preferência usuário (tabela UserPreference)
- [ ] Página admin para toggles (respeita RBAC)

### 6. Auditoria
- [ ] Tabela AuditLog (id, userId, action, target, meta JSON, createdAt)
- [ ] Hook server util `audit(action, target, meta)`
- [ ] Listagem admin com filtros por usuário / período

### 7. Dashboard Admin
- [ ] Cards métricas (nº usuários, ativos, relatórios) – server fetch
- [ ] Gráfico simples (ex: usuários novos por semana) – usar biblioteca leve (ex: `recharts` ou `chart.js` dinamicamente)
- [ ] Lista últimas ações (AuditLog)

### 8. Área Cliente
- [ ] Home cliente: atalhos (meus relatórios, perfil, suporte)
- [ ] Perfil: alterar nome, avatar (upload), preferência tema
- [ ] Segurança: alterar senha, status MFA (placeholder)

### 9. Infra & Qualidade
- [ ] Centralizar Prisma (singleton) já feito
- [ ] Repositórios server (ex: `server/services/users.ts`)
- [ ] Zod Schemas compartilhados em `schemas/`
- [ ] Loader boundary + skeleton states

### 10. Observabilidade / Telemetria (fase 2)
- [ ] Logger simples server (wrap console) + níveis
- [ ] Endpoint health `/api/health`

## Tabela de Dependências Potenciais
| Objetivo | Lib | Status |
|----------|-----|--------|
| Editor rich text | tiptap | avaliar |
| Gráficos | recharts / chart.js | decidir |
| Upload | tus-js-client (fase 2) | backlog |

## Convenções
- Nome de arquivo server-only: `*.server.ts` (não importado em client)
- Componentes UI genéricos em `components/ui/` (seguir padrão shadcn e estilizar)
- Funções mutação: sempre via ações server (`app/.../actions.ts`) ou rotas API dedicadas

## Checklist Geral (Ordem Recomendada)
```
- [ ] Infra básica server (pasta server/, repositórios usuários)
- [ ] RBAC helper + enum papéis
- [ ] CRUD Usuários (lista + edição)
- [ ] AuditLog base + registro em mutações de usuário
- [ ] Dashboard Admin v1 (cards + últimas ações)
- [ ] CRUD Serviços
- [ ] Área Cliente home + perfil básico
- [ ] Upload relatórios + listagem cliente
- [ ] Configurações (tema persistido + feature flags UI)
- [ ] Auditoria avançada (filtros, export)
- [ ] Gráficos métricas
- [ ] Conteúdo institucional pages CRUD
- [ ] Observabilidade inicial
```

## Referências Externas (Pesquisar ao Implementar)
- shadcn/ui docs: https://ui.shadcn.com
- Next.js App Router Patterns: https://nextjs.org/docs/app
- Auth.js Providers & Callbacks: https://authjs.dev
- Padrões de Auditoria: OWASP Logging Cheat Sheet

## Anotações de Execução
- Cada módulo deve adicionar comentários PT-BR explicando decisões.
- Evitar introduzir dependências pesadas sem ganho claro.
- Provedores sociais já unificados – apenas consumir sessão para RBAC.

## Encerramento
Este plano será iterado; manter atualização incremental com data e autor.

---
Data criação: 2025-08-09
Autor: Plano Automático Assistente
Versão: 1.0
# Plano de Implementação CRUD & Dashboard Admin

## Visão Geral

Este plano detalha a adaptação e implementação de um sistema completo de CRUD, dashboard administrativo e gestão de usuários, utilizando as melhores práticas do ecossistema React/Next.js, TailwindCSS, shadcn/ui, Framer Motion, Zod, Auth.js, TanStack Query, Zustand e outras dependências modernas. O objetivo é criar um guia robusto, colaborativo e inovador, permitindo que múltiplas equipes atuem de forma integrada e eficiente.

---

## Estrutura de Diretórios

```
/src
  /app
    /admin
      /dashboard
      /usuarios
      /permissoes
      /configuracoes
    /api
      /usuarios
      /auth
  /components
    /ui
    /admin
  /hooks
  /lib
  /contexts
  /utils
  /styles
  /types
```

---

## Bibliotecas e Referências

- [shadcn/ui](https://ui.shadcn.com/docs/components)
- [TailwindCSS](https://tailwindcss.com/docs/installation)
- [Framer Motion](https://www.framer.com/motion/)
- [Zod](https://zod.dev/)
- [Auth.js (ex-NextAuth)](https://authjs.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Prisma ORM](https://www.prisma.io/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/primitives/docs/components/overview)
- Exemplos: [Acme Dashboard (shadcn/ui)](https://ui.shadcn.com/examples/dashboard), [Vercel Dashboard](https://vercel.com/dashboard), [Refine.dev](https://refine.dev/)

---

## Etapas do Projeto

1. **Levantamento de Requisitos e Análise de Referências**
   - [ ] Mapear funcionalidades essenciais (CRUD, permissões, dashboard, etc)
   - [ ] Analisar exemplos de referência (Acme, Vercel, Refine, etc)
   - [ ] Definir padrões visuais e de UX (Dark/Light, responsividade, acessibilidade)

2. **Estruturação de Pastas e Arquivos Base**
   - [ ] Criar estrutura de diretórios conforme padrão acima
   - [ ] Gerar arquivos de instrução/checklist para cada módulo
   - [ ] Documentar dependências e comandos de setup

3. **Configuração de Dependências e Ambiente**
   - [ ] Garantir Tailwind, shadcn/ui, Framer Motion, Zod, Auth.js, TanStack Query, Zustand, Prisma
   - [ ] Configurar lint, prettier, husky, commitlint, cspell
   - [ ] Documentar scripts de automação

4. **Design System e Componentização**
   - [ ] Mapear componentes reutilizáveis (Button, Card, Table, Modal, etc)
   - [ ] Customizar shadcn/ui com tokens do projeto
   - [ ] Criar exemplos de uso e documentação de props

5. **Autenticação e Autorização**
   - [ ] Implementar Auth.js com JWT e OAuth
   - [ ] Criar hooks e contextos de usuário
   - [ ] Proteger rotas e componentes sensíveis
   - [ ] Documentar fluxo de login, logout, reset de senha

6. **CRUD de Usuários e Permissões**
   - [ ] Modelar schema Prisma para usuários, roles, permissões
   - [ ] Criar endpoints REST/GraphQL para CRUD
   - [ ] Implementar formulários com React Hook Form + Zod
   - [ ] Validar e tratar erros de API
   - [ ] Criar tabelas, filtros, paginação e busca
   - [ ] Adicionar testes unitários e2e (Jest, Testing Library, Cypress)

7. **Dashboard e Visualização de Dados**
   - [ ] Implementar cards, gráficos, widgets e KPIs
   - [ ] Integrar TanStack Query para dados reativos
   - [ ] Criar layouts responsivos e acessíveis
   - [ ] Documentar exemplos de dashboards

8. **Gestão de Configurações e Preferências**
   - [ ] Criar telas de configurações (tema, notificações, etc)
   - [ ] Salvar preferências no backend/localStorage
   - [ ] Documentar fluxo de atualização

9. **Documentação, Checklist e Colaboração**
   - [ ] Gerar checklists para cada etapa (arquivos .md)
   - [ ] Manter README atualizado com progresso
   - [ ] Instruir times sobre padrões de contribuição
   - [ ] Referenciar exemplos e boas práticas em cada arquivo

---

## Como Contribuir

- Siga o checklist de cada módulo
- Consulte exemplos e links de referência
- Documente decisões e padrões adotados
- Use PRs pequenos e bem descritos
- Marque revisores e mantenha comunicação ativa

---

## Observações Finais

- Priorize acessibilidade, responsividade e UX
- Use animações e microinterações com parcimônia
- Prefira componentes do projeto e shadcn/ui
- Mantenha o código limpo, tipado e testado

---

> **Este plano é vivo! Atualize e colabore sempre que necessário.**
