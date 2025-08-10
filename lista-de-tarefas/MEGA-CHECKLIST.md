---
applyTo: '**'
---

# MEGA CHECKLIST CONSOLIDADO – SITE METODO ATUARIAL

> Checklist centralizado, revisado e sem redundâncias. Progresso real, comentários claros e agrupamento por domínio. Atualize sempre neste arquivo.

## Como usar
- Marque cada item concluído com [x].
- Use comentários para contexto, links e decisões.
- Cada domínio tem subtarefas detalhadas.

---

## 1. Autenticação & MFA
- [x] Unificar sessão de login usando banco de dados (Auth.js v5, Prisma, sem JWT)
- [x] Corrigir tipagem e persistência de emailVerified (Date/null)
- [x] SessionProvider global e hooks (useAuth, useCurrentUser)
- [x] Endpoints modernos: /api/me, /api/admin/metrics, hooks useAuditLogs
- [x] Teste E2E crítico documentado (login, sessão, erros comuns)
- [x] Remover rotas customizadas de callback/signin
- [x] Corrigir todos os erros de build/lint/test
- [x] Documentar arquitetura e flows
- [ ] Consolidar arquitetura unificada (Auth.js v5, Prisma, RBAC, MFA, Rate Limit, CORS, Zod)
- [ ] Centralizar todos os fluxos (login, social, MFA, registro, redefinição)
- [ ] Integrar RBAC e checagem de roles em endpoints sensíveis
- [ ] Integrar Upstash Rate Limit
- [ ] Garantir CORS, headers de segurança e edge compatibility
- [ ] Padronizar e documentar MFA/TOTP (flows obrigatórios e opcionais)
- [ ] Garantir validação Zod e feedbacks claros
- [ ] Refatorar e documentar hooks, páginas e componentes
- [ ] Validar integração ponta a ponta (login, registro, redefinição, MFA, RBAC)
- [ ] Revisar variáveis de ambiente e .env.example
- [ ] Testar todos os fluxos ponta a ponta
### SocialLoginBox & Providers
	- [x] Recuperar SocialLoginBox completo (todos os providers necessários, lógica condicional, fallback)
	- [x] Normalizar IDs dos botões/providers
	- [x] Garantir uso de endpoints canônicos e consumo de /api/auth/providers
	- [x] Remover endpoints legados e rotas manuais
	- [x] Atualizar .env.example com variáveis dos novos providers
	- [ ] Testar manualmente cada botão/provider
	- [ ] Documentar lógica condicional e fluxo
### Modernização Formulário Criar Conta
	- [x] Criar schema Zod compartilhado (RegisterSchema)
	- [x] Componente FormularioCriarConta (react-hook-form + zodResolver)
	- [x] Hook useRegistrarUsuario (React Query mutate)
	- [x] Normalizar mensagens de erro API
	- [x] Auto login pós-registro
	- [x] Força da senha (componente visual)
	- [x] Botão mostrar/ocultar senha
	- [x] Spinner/loading no botão principal
	- [x] Acessibilidade: aria-invalid, aria-describedby, focus no erro
	- [x] Sanitização: trim, email lowercase, limite tamanho
	- [x] Telemetria simples (console.info)
	- [ ] Testes unitários: força senha, validação, email inválido
	- [ ] Teste integração: fluxo sucesso
	- [ ] Snapshot do componente
### Limpeza/Resíduos
	- [x] Remover endpoints antigos/deprecados
	- [x] Garantir ausência de rotas manuais
	- [ ] Atualizar checklist principal com links para esta tarefa
### Documentação
	- [ ] Comentar novos arquivos (header explicativo)
	- [ ] Adicionar README sobre novos providers/variáveis
	- [ ] Anotar tarefa com data/commit
### Critérios de Aceite
	- [ ] Build/lint sem erros
	- [ ] Testes novos passando
	- [ ] Registro cria usuário e executa auto login
	- [ ] SocialLoginBox exibe/desabilita botões corretamente

## 2. Área Cliente (Dashboard Usuário)
- [x] Mapear jornadas principais (onboarding, perfil, segurança, billing)
- [x] Definir arquitetura de páginas, navegação e providers
- [x] Implementar layout base, sidebar, navegação e providers globais
- [x] Implementar páginas: resumo, perfil, segurança, sessões
- [x] Hooks dedicados: useCurrentUser, useSessions, useMfaStatus
- [x] Mensageria de feedback unificada (Toaster/Alert shadcn/ui)
- [x] Preferências de conta (tema, idioma, notificações)
- [x] Gestão de dispositivos e sessões (listar/revogar)
- [x] Fluxo MFA planejado (setup, backup codes, recovery)
- [x] Testes unitários e integração básicos
- [x] Documentar arquitetura e decisões
- [ ] Integrar dados reais nos widgets (sessões, MFA, logs)
- [ ] Expandir preferências e flows de MFA
- [ ] Refinar acessibilidade e responsividade
- [ ] Adicionar testes unitários e2e
- [ ] Evoluir documentação conforme novas features
### Incrementos e Testes
	- [ ] Mock API e Fixtures para desenvolvimento offline e testes
	- [ ] TanStack Query avançado (persistência, prefetch, optimistic updates)
	- [ ] Zod + React Hook Form em todos os formulários
	- [ ] Internacionalização (i18n) moderna
	- [ ] Analytics e Observabilidade (Sentry, Vercel Analytics)
	- [ ] Usabilidade e Experiência (onboarding, busca global, dashboards customizáveis)

## 3. Admin Dashboard (Tabelas, Widgets, Segurança)
- [x] Definir arquitetura base DataTable headless (TanStack Table + shadcn/ui wrappers)
- [x] Criar componente DataTableBase reutilizável (sorting, filtering, column visibility)
- [x] Adicionar suporte a paginação client-side
- [x] Adicionar suporte a paginação server-side (manualPagination)
- [x] Implementar exportação CSV
- [x] Implementar exportação Excel (SheetJS)
- [ ] Implementar exportação PDF (pdf-lib ou jsPDF) opcional
- [~] Adicionar row selection + ações em lote (coluna seleção + contagem + placeholder ação)
- [ ] Adicionar column pinning (esquerda/direita)
- [ ] Adicionar column resizing
- [ ] Adicionar column ordering (drag & drop)
- [ ] Implementar cell formatters padronizados (datas, números, status)
- [ ] Implementar row actions (menu contextual)
- [~] Adicionar toolbar global (busca, densidade, export CSV, seleção parcial)
- [ ] Adicionar filtros por coluna (text, select, date range)
- [ ] Adicionar persitência de preferências (localStorage + chave de namespace)
- [x] Integrar com React Query (cache, prefetch)
- [ ] Adicionar virtualização (TanStack Virtual) para > 1k linhas
- [ ] Implementar modo compacto/denso via toggle
- [ ] Adicionar caption acessível e descrição ARIA
### Testes e Cobertura
	- [ ] Testes unidade: hooks (useCan, data adapters)
	- [ ] Testes unidade: componentes (DataTableBase)
	- [ ] Testes integração: fluxo CRUD usuário
	- [ ] Testes e2e (Cypress/Playwright) login -> editar usuário
	- [ ] Teste acessibilidade (axe) automatizado CI
	- [ ] Adicionar script npm "test:admin"
	- [ ] Cobertura mínima 80% módulos críticos
### Paridade & Evolução fuse-react
	- [ ] Listar features do DataTable fuse-react já presentes
	- [ ] Mapear gaps vs implementação atual
	- [ ] Reproduzir comportamento de toolbar (filtros, densidade)
	- [ ] Implementar ícones equivalentes (lucide) nos menus
	- [ ] Migrar lógica de pin/resize adaptada ao headless
	- [ ] Validar UX mobile comparando fuse-react
	- [ ] Adicionar melhorias não presentes (persist prefs, exportações)
	- [ ] Documentar diferenças e razões das mudanças

## 4. UI/Design System (shadcn/ui, theming)
- [x] Design system consistente (shadcn/ui + tokens globais)
- [x] Atualizar Button, Card, Input, Alert, Switch, Popover para visual moderno
- [x] Corrigir Popover do seletor de tema (portal/fixed)
- [x] Revisar variáveis de cor e radius no Tailwind/globals.css
- [x] Adicionar animações/microinterações (framer-motion)
- [x] Garantir responsividade e acessibilidade
- [x] Testar todos os componentes em light/dark/system
- [x] Refatorar exemplos e documentação interna
- [ ] Todos os formulários usam <Form />, <FormField />, <Input />, <Button />
- [ ] Feedbacks e erros com <Alert /> e <FormMessage />
- [ ] Dialogs e modais com <Dialog />
- [ ] Acessibilidade (aria, labels, navegação)
- [ ] Estilização consistente e moderna em todos os fluxos
### Incrementos e Adaptações
	- [ ] Mapear e customizar componentes reutilizáveis
	- [ ] Documentar exemplos de uso
	- [ ] Garantir responsividade total (Tailwind v4)
	- [ ] Personalizar todos os componentes shadcn/ui conforme identidade visual

## 5. DevEx & Automação
- [x] Scripts shell reutilizáveis (instalar, atualizar, remover dependências, audit, outdated, ncu)
- [x] Integrar scripts como tasks no VS Code
- [x] Garantir instalação/uso de npm-check-updates
- [x] Documentar todos os fluxos no README
- [x] Testar todos os fluxos e garantir robustez
- [x] Garantir tasks seguras, modernas e fáceis de usar
- [x] Validar integração com CI/CD e ambiente local
- [x] Auditoria e correção de comandos/scripts/configs para robustez com caminhos com espaços
- [ ] Validar se automações (scripts/tasks) continuam funcionando após mudanças
### Incrementos
	- [ ] Automatizar auditoria de acessibilidade e performance (Lighthouse, axe-core)
	- [ ] Atualizar dependências e remover libs não utilizadas

## 6. Documentação
- [x] Documentar arquitetura, flows e decisões principais
- [x] Checklist incremental e consolidado sempre atualizado
- [ ] Atualizar README geral do projeto e módulos
- [ ] Criar docs por domínio (usuarios, permissoes, dashboard, área cliente)
- [ ] Gerar diagrama arquitetura (mermaid)
- [ ] Cobertura mínima 80% módulos críticos
- [ ] Teste acessibilidade (axe) automatizado CI
### Incrementos
	- [ ] Documentar exemplos de uso dos principais componentes e hooks
	- [ ] Documentar tudo (exemplos, fluxos, arquitetura)
	- [ ] Criar docs incrementais por domínio
	- [ ] Adicionar seções README sobre novos providers, flows e variáveis
	- [ ] Anotar tarefas concluídas com data/commit
	- [ ] Atualizar checklist principal com links para tarefas detalhadas
	- [ ] Cobertura mínima 80% módulos críticos
	- [ ] Teste acessibilidade (axe) automatizado CI

---

> Última revisão: 09/08/2025. Atualize sempre neste arquivo. Para detalhes, consulte os arquivos de domínio e históricos.
