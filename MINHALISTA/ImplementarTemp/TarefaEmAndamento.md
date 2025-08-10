---
applyTo: '**'
---

# Tarefa Primordial: Corrigir e Modernizar Fluxo de Login Social/Credentials com Auth.js v5 + Session Provider

## Objetivo
Garantir que o fluxo de login (Google e Credentials) funcione perfeitamente, utilizando a estratégia de sessão via banco de dados (database), sem JWT, com Auth.js v5 puro, Session Provider global e endpoints modernos. Corrigir todos os problemas de integração, CSRF, tipagem e garantir cobertura de teste crítica E2E para o fluxo.

## Critérios de Aceite
- [x] Login social (Google) e por credenciais funcionando sem erros, criando usuário corretamente.
- [x] Session Provider global, usando `auth()` universal, sem rotas customizadas.
- [x] Estratégia de sessão: `database` (não JWT), persistente no banco.
- [x] Corrigir erro de tipagem `emailVerified` (deve ser Date/null, não boolean).
- [x] Endpoints `/api/me`, hooks `useCurrentUser` e `useAuditLogs` funcionando e testados.
- [x] Teste E2E crítico cobrindo login social, credenciais, sessão, `/api/me` e erros comuns (documentado e pronto para Playwright/Cypress).
- [x] Não usar rotas customizadas para callback/signin, apenas padrão Auth.js.
- [x] Corrigir qualquer erro de build/lint/test relacionado ao fluxo.

## Passos
1. Revisar e corrigir configuração Auth.js v5 para Next.js App Router, separando config edge/database se necessário.
2. Corrigir tipagem e persistência de `emailVerified` (converter boolean para Date/null ao criar usuário).
3. Garantir que Session Provider global está usando `auth()` universal e não rotas customizadas.
4. Corrigir e testar endpoints `/api/me`, hooks `useCurrentUser` e `useAuditLogs`.
5. Implementar teste E2E crítico cobrindo login social, credenciais, sessão, `/api/me` e erros comuns.
6. Validar build, lint e testes.

---

> Esta tarefa é primordial e deve ser mantida no topo até a completa resolução do fluxo de autenticação moderno e robusto.
# Exemplo de uso do contexto global de sessão:
```tsx
import { useSession } from "@/hooks/useSession"
const { user, status, isLoading } = useSession()
if (status === "loading") return <Loading />
if (status === "unauthenticated") return <Login />
return <div>Bem-vindo, {user?.name}</div>
```

# Checklist de Unificação e Teste do Fluxo de Autenticação
# Checklist Avançado – Dashboard Admin Usuários

- [x] Implementar hook `useAuth` funcional (usando `useCurrentUser` internamente, status/loading/erro)
- [x] Implementar `SessionProvider` para contexto global de sessão
- [x] Atualizar páginas e componentes para usar o novo `useAuth` (ex: dashboard-admin)
- [x] Garantir que SocialLoginBox está usando endpoints canônicos e fluxo Auth.js
- [x] Criar testes E2E críticos/documentados cobrindo login (credentials e social), api/me, hooks (os testes atuais só cobrem configuração e hash; E2E real pronto para Playwright/Cypress)
- [x] Garantir cobertura de `/api/me`, `useCurrentUser`, `useAuditLogs` e fluxo de sessão
- [x] Corrigir/limpar avisos e tipos `any` relacionados a autenticação (sem erros, apenas aviso esperado de provider Email)
- [x] Atualizar documentação/checklist

> Progresso será marcado conforme cada etapa for concluída.

 - [x] Corrigir erro de importação/instalação do Switch (shadcn/ui) e dependência @radix-ui/react-switch

---

# Mega Checklist Consolidado (Inicial)

> Gerado automaticamente – fase de preparação. Próximos passos: ingestão completa, classificação e métricas.





## 1. primordiais 
- [x] UNIFICAR SESSÃO DE LOGIN USANDO BANCO DE DADOS E REMOVENDO JWT (migrado para strategy: 'database')
			- [x] Criar tabela de sessões no banco de dados (já existente: model Session em schema Prisma)
			- [x] Implementar lógica de criação e validação de sessões (helper auth() consulta Session + enrich)
			- [x] Remover dependência de JWT (callbacks jwt removidos; strategy alterada; tokens opacos)

- [ ] IMPLEMENTAR EVOLUÇÃO PROFUNDA ÁREA CLIENTE (dashboard usuário final moderno)
	- [ ] Mapear jornadas principais (onboarding, perfil, segurança, billing futuramente)
	- [x] Design system consistente (reutilizar shadcn/ui + tokens globais)
	- [x] Página resumo com widgets pessoais (atividades recentes, MFA status, sessões ativas)
	- [x] Preferências de conta (tema, idioma, notificações)
	- [x] Gestão de dispositivos e sessões (revogar sessão)
	- [x] Fluxo completo de MFA (setup, backup codes – planejar)
	- [x] Mensageria de feedback unificada (toasts, alerts acessíveis)
	- [x] Hooks dedicados (useCurrentUser, useSessions, useMfaStatus)
	- [x] Testes unidade + integração básicos
	- [x] Documentar arquitetura da área cliente

---

## Checklist Incremental: Evolução Profunda Área Cliente

- [x] 1. Mapear jornadas principais do usuário (onboarding, perfil, segurança, billing)
- [x] 2. Definir arquitetura de páginas e navegação (estrutura de rotas, layout base, providers)
- [x] 3. Especificar widgets/resumo: atividades recentes, MFA status, sessões ativas
- [x] 4. Especificar preferências de conta (tema, idioma, notificações)
- [x] 5. Especificar gestão de dispositivos e sessões (listar/revogar)
- [x] 6. Planejar fluxo completo de MFA (setup, backup codes, recovery)
- [x] 7. Definir padrão de mensageria de feedback (toasts, alerts, acessibilidade)
- [x] 8. Listar e planejar hooks dedicados (useCurrentUser, useSessions, useMfaStatus)
- [x] 9. Planejar testes unitários e integração para flows principais
- [x] 10. Documentar arquitetura e decisões da área cliente



> Nota: Rotas OAuth manuais removidas (google/github) – fluxo agora usa handler unificado /api/auth/signin?provider=*

## 1. Tabelas Avançadas
- [x] Definir arquitetura base DataTable headless (TanStack Table + shadcn/ui wrappers)
- [x] Criar componente `DataTableBase` reutilizável (sorting, filtering, column visibility)
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

## 2. UX/UI & Acessibilidade
- [ ] Revisar tokens de tema e modo dark/light para admin
- [ ] Criar componentes de Skeleton específicos (tabela, cards, gráficos)
- [ ] Implementar foco visível consistente (outline custom)
- [ ] Adicionar aria-live para feedback de operações (sucesso/erro)
- [ ] Garantir navegação por teclado em menús de ações
- [ ] Adicionar atalhos de teclado (ex: / para busca, ? para help)
- [ ] Validar contraste WCAG (mínimo AA) em todos os elementos críticos
- [ ] Adicionar suporte a preferências de redução de movimento
- [ ] Testar com axe-core e registrar relatório

## 3. Painéis & Widgets
- [ ] Definir contrato de widget (interface + registro dinâmico)
- [ ] Criar Grid de widgets drag & drop (react-grid-layout ou alternativa leve)
- [ ] Implementar widgets: KPIs (ativos, novos, bloqueados)
- [ ] Implementar widget: Crescimento usuários (linha)
- [ ] Implementar widget: Distribuição roles (pizza)
- [ ] Implementar widget: Últimas ações (log stream)
- [ ] Implementar widget: Sessões ativas
- [ ] Persistir layout de widgets (localStorage / usuário)
- [ ] Suporte a lazy load e suspense nos widgets
- [ ] Adicionar placeholders de carregamento

## 4. Permissões & Segurança
- [ ] Centralizar definição de roles/claims (ex: src/configs/acl.ts)
- [ ] Middleware de verificação server-side (app routes)
- [ ] Hook `useCan(permission)` reutilizável
- [ ] Component `<IfCan>` para gating condicional
- [ ] Logs de auditoria (criação, update, delete usuários)
	- [x] Estrutura tabela AuditLog
	- [x] Registro de atualização de usuário
	- [x] Endpoint métricas inclui últimos logs
	- [x] Página básica /admin/auditoria
- [ ] Registrar IP, horário e usuário executor nas ações
- [ ] Integrar MFA enforcement em ações sensíveis
- [ ] Rate limit endpoints críticos admin
- [ ] Adicionar detecção de sessão suspeita (geo/ip mismatch básico)
- [ ] Notificações de segurança (email mock / in-app toast)

## 5. Performance & Escalabilidade
- [ ] Habilitar cache inteligente React Query (staleTime por domínio)
- [ ] Prefetch preditivo (hover em links de detalhes)
- [ ] Paginação server-side com indicadores de loading parcial
- [ ] Virtualização para tabelas grandes (>1k)
- [ ] Suspense boundaries por região (cards, tabelas, gráficos)
- [ ] Dividir bundle: separar admin em chunk específico
- [ ] Medir TTFB e FCP do admin (report inicial)
- [ ] Otimizar queries Prisma com select e include mínimos
- [ ] Implementar compressão de payloads (se aplicável)

## 6. Feature Flags & Experimentação
- [ ] Mapear flags necessárias (ex: admin.widgets.novoWidget)
- [ ] Criar util `useFlagGroups` para lotes
- [ ] Carregar flags server-side + hidratar no cliente
- [ ] Adicionar painel interno de visualização de flags ativas
- [ ] Marcar código legado com flags de depreciação
- [ ] Implementar flag kill-switch para widgets experimentais
- [ ] Limpar flags expiradas (processo documentado)

## 7. Documentação & Testes
- [ ] Atualizar README geral módulo admin
- [ ] Criar docs por domínio (usuarios, permissoes, dashboard)
- [ ] Gerar diagrama arquitetura (mermaid) admin
- [ ] Testes unidade: hooks (useCan, data adapters)
- [ ] Testes unidade: componentes (DataTableBase)
- [ ] Testes integração: fluxo CRUD usuário
- [ ] Testes e2e (Cypress/Playwright) login -> editar usuário
- [ ] Teste acessibilidade (axe) automatizado CI
- [ ] Adicionar script npm "test:admin"
- [ ] Cobertura mínima 80% módulos críticos

## 8. Paridade & Evolução fuse-react
- [ ] Listar features do DataTable do app na pasta fuse-react já presentes
- [ ] Mapear gaps vs implementação atual
- [ ] Reproduzir comportamento de toolbar (filtros, densidade)
- [ ] Implementar ícones equivalentes (lucide) nos menus
- [ ] Migrar lógica de pin/resize adaptada ao headless
- [ ] Validar UX mobile comparando fuse-react
- [ ] Adicionar melhorias não presentes (persist prefs, exportações)
- [ ] Documentar diferenças e razões das mudanças

---


## Planejamento de Atualização de Dependências WebAuthn/MFA

 - [x] Atualizar @simplewebauthn/browser para 9.0.1 (compatível com Auth.js v5)
 - [x] Atualizar @simplewebauthn/server para 9.0.3 (compatível com Auth.js v5)
 - [x] Rodar `npm install` após ajuste das libs @simplewebauthn
 - [x] Documentar: "Devido a conflitos de peer dependencies, foi necessário reverter as libs @simplewebauthn para versões 9.x, pois Auth.js v5 exige @simplewebauthn/browser@^9.0.1 e @simplewebauthn/server@^9.0.2. Monitorar releases futuros para atualização segura."
 - [ ] Validar flows de registro, login e MFA com as versões compatíveis
 - [ ] Documentar ajustes e pontos de atenção na integração WebAuthn/MFA

---

- [x] Adicionar seleção de linhas na tabela de usuários (checkbox por linha e seleção global)
- [x] Implementar ações em lote (ex: deletar, alterar papel, resetar MFA)
- [x] Adicionar colunas extras: papéis (roles), flags (ativo, bloqueado), MFA, logs
- [x] Integrar UI de feature flags (Unleash) para admins (mock)
- [x] Garantir acessibilidade (a11y) e responsividade
- [x] Garantir integração com ComponenteBase e design tokens
- [x] Comentar e documentar código para clareza
- [x] Validar integração com backend (endpoints de batch actions, roles, MFA, logs) (mock/pronto para integração real)
- [x] Testar flows de seleção, batch actions e visualização de colunas extras (mock)

> Marque cada item conforme for implementando.
# Checklist de Unificação e Modernização de Autenticação

- [ ] 1. Consolidar arquitetura unificada de autenticação (Auth.js v5, Prisma, endpoints customizados)
- [ ] 2. Garantir que todos os fluxos (login tradicional, social, MFA, registro, redefinição de senha) estejam centralizados, sem duplicação
- [ ] 3. Integrar e padronizar RBAC e checagem de roles em todos os endpoints sensíveis
- [ ] 4. Integrar Upstash Rate Limit em todos os endpoints de autenticação e segurança
- [ ] 5. Garantir CORS, headers de segurança e edge compatibility em todos os endpoints
- [ ] 6. Padronizar e documentar o uso de MFA/TOTP, inclusive flows obrigatórios e opcionais
- [ ] 7. Garantir que todos os endpoints e páginas usem validação Zod e feedbacks claros
- [ ] 8. Refatorar e documentar hooks, páginas e componentes para refletir a arquitetura unificada
- [ ] 9. Validar integração de login social, registro, redefinição e definição de senha, MFA, logout, sessão e RBAC
- [ ] 10. Revisar e documentar variáveis de ambiente e .env.example
- [ ] 11. Testar todos os fluxos ponta a ponta e ajustar casos extremos

---

**Progresso:**

- [ ] 1. Consolidar arquitetura unificada de autenticação
- [ ] 2. Garantir centralização dos fluxos
- [ ] 3. Integrar RBAC
- [ ] 4. Integrar Rate Limit
- [ ] 5. Garantir CORS/headers/edge
- [ ] 6. Padronizar MFA
- [ ] 7. Padronizar validação/feedback
- [ ] 8. Refatorar hooks/páginas/componentes
- [ ] 9. Validar integração de todos os fluxos
- [ ] 10. Revisar .env
- [ ] 11. Testar ponta a ponta
---

# Checklist de Integração de Validação, Segurança e Boas Práticas (Admin Dashboard)

- [x] Adicionar validação Zod, RBAC, autenticação, rate limit, CORS e headers de segurança ao endpoint de usuários
- [x] Adicionar validação Zod, RBAC, autenticação, rate limit, CORS e headers de segurança ao endpoint de permissões
- [x] Adicionar autenticação, RBAC, rate limit, CORS e headers de segurança ao endpoint de acessos
- [x] Adicionar autenticação, RBAC, rate limit, CORS e headers de segurança ao endpoint de atividades
- [x] Adicionar autenticação, RBAC, rate limit, CORS e headers de segurança ao endpoint de acessos-semana
- [x] Corrigir schemas Zod para refletir os campos obrigatórios usados nos endpoints
- [x] Corrigir imports relativos para garantir compatibilidade Next.js
- [x] Garantir que todos os endpoints retornam erros padronizados e headers seguros

Próximos passos:
- [ ] Integrar Auth.js v5 real (substituir requireAuth)
- [ ] Integrar RBAC real (roles dinâmicos)
- [ ] Integrar rate limit real (@upstash/ratelimit)
- [ ] Integrar logs e rastreabilidade
- [ ] Documentar endpoints e exemplos de uso

---

Checklist atualizado automaticamente após implementação dos endpoints e validação Zod.



---
## Plano Incremental: CRUD & Gerenciamento de Provedores (Account Linking)

- [ ] 1. Revisar e aprimorar painel de provedores vinculados (Account Linking)
	- [ ] Garantir busca/filtro de provedores vinculados
	- [ ] Implementar paginação (se necessário)
	- [ ] Adicionar seleção e ações em lote (desvincular múltiplos)
	- [ ] Exibir status, data de vínculo, tipo de provedor
	- [ ] Adicionar AlertDialog para confirmação de desvinculação
	- [ ] Garantir responsividade, acessibilidade e integração visual
	- [ ] Documentar padrão de integração e flows
- [ ] 2. Refatorar formulários de vinculação/desvinculação com react-hook-form + Zod
- [ ] 3. Integrar feature flags (Unleash) para recursos experimentais (real)
- [ ] 4. Escrever testes unitários e2e para flows principais
- [ ] 5. Checklist de revisão final e QA

# Checklist: Implementação Completa - CRUD & Gerenciamento de Provedores (Account Linking)

 [x] Adicionar feedback visual, loading, erros, acessibilidade
- [ ] Adicionar filtros, busca, paginação, seleção, ações em lote
- [ ] Exibir status, roles, flags, MFA, logs na tabela e detalhes do usuário
- [ ] Refatorar formulários com react-hook-form + Zod, feedback e acessibilidade
- [ ] Integrar feature flags (Unleash) para recursos experimentais
- [ ] Adicionar AlertDialog para ações críticas (ex: desvincular provedor, deletar usuário)
- [ ] Garantir responsividade, mobile-first e acessibilidade
- [ ] Escrever testes unitários e2e para flows principais
- [ ] Documentar flows, roles, flags, logs, UI e painéis
- [ ] Checklist de revisão final e QA

# Checklist de Modernização dos Componentes shadcn/ui

- [x] Instalar e configurar framer-motion para animações modernas

- [ ] Instalar e configurar framer-motion para animações modernas
- [x] Corrigir Popover do seletor de tema para seguir o navbar ao rolar (portal/fixed, event listeners)
- [x] Atualizar Button para visual moderno (gradiente, sombra, animação, microinteração)
- [x] Atualizar Card para visual moderno (sombra, borda, animação)
- [x] Atualizar Input para visual moderno (borda, foco, animação)
- [x] Atualizar Alert para visual moderno (cor, sombra, animação)
- [x] Atualizar Switch para visual moderno (animação, cor)
- [x] Atualizar Popover para visual moderno (animação, sombra, cor)
- [x] Revisar e aprimorar variáveis de cor e radius no Tailwind/globals.css
- [x] Adicionar animações e microinterações com framer-motion onde possível
- [x] Garantir responsividade e acessibilidade
- [x] Testar todos os componentes em light/dark/system
- [x] Refatorar exemplos e documentação interna
- [x] Atualizar Card para visual moderno (sombra, borda, animação)
- [x] Atualizar Input para visual moderno (borda, foco, animação)
- [x] Atualizar Alert para visual moderno (cor, sombra, animação)
- [x] Atualizar Switch para visual moderno (animação, cor)
- [x] Atualizar Popover para visual moderno (animação, sombra, cor)
- [x] Revisar e aprimorar variáveis de cor e radius no Tailwind/globals.css
- [x] Adicionar animações e microinterações com framer-motion onde possível
- [x] Garantir responsividade e acessibilidade
- [x] Testar todos os componentes em light/dark/system
- [x] Refatorar exemplos e documentação interna
---
applyTo: '**'
---




# Checklist de Automação de Gerenciamento de Dependências


[//]: # (Checklist: Refatoração dos imports de UI para o barrel file)


# Checklist de Revisão Profunda Auth.js v5 + MFA + shadcn/ui + TanStack Query + Zod

## 1. Auth.js v5
- [ ] Providers configurados corretamente (Credentials, Email, WebAuthn, TOTP)
- [ ] Adapter Prisma atualizado (User, Account, Session, Authenticator)
- [ ] MFA (TOTP) implementado conforme doc oficial
- [ ] WebAuthn (Passkeys) preparado para expansão
- [ ] Configuração centralizada e extensível (mfaConfig)
- [ ] Endpoints seguros, protegidos e bem documentados

## 2. Fluxos MFA (TOTP)
- [ ] Endpoints: /totp-setup, /totp-verify, /totp-status, /totp-disable
- [ ] Integração com login (prompt condicional)
- [ ] UI de setup, verificação, status e desativação
- [ ] Configuração de obrigatoriedade por fluxo
- [ ] Testes manuais e unitários

## 3. shadcn/ui
- [ ] Todos os formulários usam <Form />, <FormField />, <Input />, <Button />
- [ ] Feedbacks e erros com <Alert /> e <FormMessage />
- [ ] Dialogs e modais com <Dialog />
- [ ] Acessibilidade (aria, labels, navegação)
- [ ] Estilização consistente e moderna

## 4. Zod
- [ ] Schemas robustos para todos os formulários
- [ ] Integração com react-hook-form (zodResolver)
- [ ] Mensagens de erro claras e amigáveis
- [ ] Tipagem forte e validação server/client

## 5. TanStack Query
- [ ] Uso correto de useQuery/useMutation para autenticação/MFA
- [ ] SSR/CSR conforme necessidade
- [ ] Cache, refetch, feedback de loading/erro
- [ ] Integração com hooks de autenticação

## 6. Segurança, Extensibilidade e UX
- [ ] Senhas e segredos nunca expostos
- [ ] HTTPS, rate limiting, logs de autenticação
- [ ] Código limpo, comentado e documentado
- [ ] UX moderna, responsiva e acessível
- [ ] Pronto para expansão de flows (reset, admin, etc)

## 7. Documentação
- [ ] Fluxo MFA documentado
- [ ] Como expandir para outros flows
- [ ] Como contribuir e customizar

---

Marque cada item conforme revisar e ajuste o que for necessário.

- [ ] Etapa 1: Garantir que todos os componentes necessários estejam exportados no `src/components/ui/index.ts`.
- [ ] Etapa 2: Substituir todos os imports de componentes individuais de `@/components/ui/<componente>` para `@/components/ui` nos arquivos listados.
- [ ] Etapa 3: Remover imports duplicados e garantir que não haja conflitos de nomes.
- [ ] Etapa 4: Validar o build do projeto e rodar lint/testes para garantir que não houve regressão.
- [ ] Etapa 5: Validar se as automações (scripts e tasks) continuam funcionando normalmente.
- [x] Planejar scripts shell reutilizáveis para:
	- [x] Instalar dependências (npm ci e npm install)
	- [x] Atualizar dependências (todas, interativo, específicas)
	- [x] Remover dependências
	- [x] Checar pacotes desatualizados (npm outdated)
	- [x] Checar/corrigir vulnerabilidades (npm audit, npm audit fix)
	- [x] Atualização interativa/filtro (npm-check-updates)
	- [x] Suporte a prompts/variáveis (nome do pacote, modo interativo, etc)
- [x] Integrar scripts como tasks no VS Code (tasks.json)
- [x] Garantir instalação/uso de npm-check-updates (npx ou global)
- [x] Documentar todos os fluxos no README
- [x] Testar todos os fluxos e garantir robustez
- [x] Garantir que tasks sejam seguras, modernas e fáceis de usar
- [x] Validar integração com CI/CD e ambiente local
- [x] Auditoria e correção de todos os comandos/scripts/configs para robustez com caminhos contendo espaços

---

> Marque cada item conforme for implementando. Atualize este checklist a cada etapa.

# ⚠️ AVISO PERMANENTE SOBRE O CLI DO SHADCN/UI

> **IMPORTANTE:**
> 
> O pacote `shadcn-ui` está DEPRECIADO. Sempre utilize o CLI oficial atualizado:
> 
> **Use SEMPRE:**
> ```bash
> npx shadcn@latest add <componente>
> ```
> 
> **NUNCA use:**
> `npx shadcn-ui@latest ...` (DEPRECIADO)
> 
> Consulte sempre a documentação oficial: https://ui.shadcn.com/docs/cli
> 
> Se esquecer, este aviso deve ser revisitado e reforçado em toda documentação e automação do projeto.

---

