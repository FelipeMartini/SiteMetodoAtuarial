## Limpeza-SRC.md

Resumo rápido
- Objetivo: revisar os top 30 arquivos identificados pela pipeline de detecção de órfãos em `site-metodo/src/`, documentar riscos e recomendar ações em lotes (batchs) para remoção ou retenção.
- Fonte dos dados: `XLOGS/filtered-orphans-src-*.json` (gerado pela análise consolidada: madge + ts-prune + knip + scripts).

Checklist (requisitos da tarefa)
- [ ] Extrair top 30 candidatos do relatório filtrado (feito)
- [ ] Revisar cada arquivo (assinaturas, exports, uso, riscos) (feito abaixo)
- [ ] Agrupar em lotes seguros para revisão/remoção (cada batch com 5-7 arquivos)
- [ ] Para cada arquivo: recomendar ação (keep/review/remove/manual) e passos de verificação
- [ ] Registrar tudo neste arquivo (feito)
- [ ] Aguardar aprovação para criar branches/PRs para remoções (pendente)

Como ler este arquivo
- Cada entrada tem: caminho, tipo (kind), por que foi marcado, o que exporta, risco, recomendação e passos de verificação.
- Batches propostos no final. Remoções só serão executadas após sua autorização.

---

Análise detalhada — Top 30

Batch 1 (itens 1–6)

1) `src/lib/api/index.ts`
- Kind: lib
- Por que foi marcado: identificado por `ts-prune` como possível barrel não consumido diretamente; muitas re-exports.
- O que faz/exporta: re-exporta `ApiClient`, cache, monitor, helpers (monitored), `CepService`, `ExchangeService`, constantes `API_CONSTANTS`, `ApiHelpers`, `ApiHealthChecker` e export default `apiExports`.
- Observações: é um barrel que reagrupa utilitários de API. Pode parecer "não usado" por ferramentas se os consumidores importam de caminhos mais específicos (ex: `@/lib/api/client`). Porém é útil para conveniência. Contém lógica runtime (registro de endpoints no browser) e decorator `monitored`.
- Risco de remoção: alto se a aplicação usar o barrel em algum lugar (import `@/lib/api`). Remover sem verificação causa runtime errors e perda de monitoramento.
- Recomendação: review. Buscar por imports `@/lib/api` ou `@/lib/api/index` (grep/tsc). Se poucos ou nenhum import, mover funcionalidades essenciais (monitored, ApiHelpers) para módulos específicos e descontinuar o barrel.
- Verificação: rodar `rg "@/lib/api" -n site-metodo || rg "from '@libs/api'"` e executar build/type-check após qualquer modificação.

2) `src/components/ui/index.ts`
- Kind: component (barrel)
- Por que: `ts-prune` flag — barrel que re-exporta vários componentes server-safe.
- O que exporta: Separator, Avatar, Toaster, Skeleton, Progress, Tooltip, AlertDialog, Loading components, buttons, wrappers etc.
- Observações: é típico barrel de UI; mesmo que não seja importado em todos lugares, é provavél que partes do app usem `@/components/ui`.
- Risco: médio — remoção quebra imports em muitos componentes se consumido.
- Recomendação: review. Fazer busca `rg "@/components/ui" site-metodo` e se existirem muitos imports, manter. Se vários consumidores importam subpaths (ex: `@/components/ui/button`), o barrel pode ser removido ou mantido conforme conveniência.
- Verificação: substituir temporariamente o barrel por exportações específicas e rodar `npm run build`/lint.

3) `src/validators/abacSchemas.ts`
- Kind: validator
- Por que: ts-prune indicou como possivelmente não importado diretamente.
- O que exporta: schemas Zod para ABAC (usuarioABACSchema, policy schemas, request schemas, login/register, admin actions, migration steps) e tipos inferidos.
- Observações: arquivo crítico para validações de ABAC — mesmo que a importação seja indireta (barrels) ele é essencial para endpoints de ABAC e auth. Pode ser referenciado por `import abacSchemas from '@/validators/abacSchemas'` ou via barrel.
- Risco: alto — remoção quebra validações e endpoints que usam ABAC.
- Recomendação: keep (manter). Remover somente se confirmado que todo o sistema ABAC foi migrado e um substituto existe.
- Verificação: buscar `abacSchemas`/`usuarioABACSchema` no código; rodar testes e endpoints `/api/abac/*`.

4) `src/types/next-auth-abac.d.ts`
- Kind: types (declaration)
- Por que: ts-prune marcou (tipos podem ser reportados como não usados). Tipos `.d.ts` são utilizados pelo TypeScript implicitamente.
- O que exporta: ampliações do módulo `next-auth` e `next-auth/jwt` e tipos ABAC (ABACContext, ABACResult, etc.).
- Observações: mesmo sem imports diretos, as declarações augmentam globalmente o tipo do projeto; não devem ser removidas sem checagem de type-check.
- Risco: alto para regressão de tipos e autocomplete; remover causa erros de build.
- Recomendação: keep.
- Verificação: rodar `npm run type-check` (ou `tsc --noEmit`) antes/ depois de qualquer modificação.

5) `src/types/next-auth.d.ts`
- Kind: types
- Similar ao item 4 — extensões/overrides para `next-auth` e definição de tipos de sessão/usuário.
- Risco: alto — manter.

6) `src/lib/abac/types.ts`
- Kind: lib (types + interfaces + errors)
- Por que: ts-prune flagged — tipos e interfaces para ABAC e enforcer.
- O que contém: Subject, Resource, Context, PolicyRule, Enforcer interface, Middleware types, Audit types, errors (AuthorizationError) e exports Prisma types.
- Observações: arquivo central para contratos ABAC. Sem ele, compilação e coerência serão afetadas.
- Risco: alto.
- Recomendação: keep.

---

Batch 2 (itens 7–12)

7) `src/types/notifications.ts`
- Kind: other (types)
- O que contém: enums e interfaces para Notification (NotificationData, templates, preferences, push subscription, queue, email data, stats, hooks return types).
- Observações: arquivos de tipos que podem ser consumidos por serviços de notificação e UI. Mesmo que ts-prune marque, tipos costumam ser referenciados em runtime indiretamente.
- Risco: médio.
- Recomendação: review — manter se serviços de notificações (notification-service, email integration) realmente usam; caso contrário, consolidar tipos em `lib/notifications`.

8) `src/lib/performance/lazyComponents.tsx`
- Kind: lib
- O que exporta: componentes React lazy para páginas/admin e HOC `withLazyLoading`.
- Observações: utiliza lazy imports com caminhos para `@/app/...` e `@/components/...`. Se as rotas/páginas importarem esses lazy exports, são usados. `ts-prune` aponta possivelmente não referenciado.
- Risco: médio.
- Recomendação: manual — buscar `LazyCalculosAtuariais`, `LazyDashboardAdmin`, etc. Se não houver uso, pode ser removido; caso contrário, manter ou mover para `performance` barrel.

9) `src/lib/performance/serviceWorkerUtils.ts`
- Kind: lib
- O que exporta: funções de registro/unregister, clear cache, update SW, hooks `useOnlineStatus`, `useServiceWorkerStatus`, background sync helpers.
- Observações: contém código client-only que referencia `/sw.js` e `navigator`; pode não ser usado se o app não usar PWA features.
- Risco: médio — remoção afeta PWA functionality.
- Recomendação: manual — verificar chamadas (`registerServiceWorker`, `useServiceWorkerStatus`) e `public/sw.js` existência.

10) `src/lib/performance/routePrefetch.tsx`
- Kind: lib
- O que exporta: `CRITICAL_ROUTES`, `ROLE_BASED_ROUTES`, `useSmartPrefetch`, `SmartLink`, `SmartNavigation`, hooks de prefetch.
- Observações: utilitário de UX para prefetch; usado na navegação inteligente. Se não usado, é seguro remover, mas perda de otimização.
- Risco: baixo-med.
- Recomendação: review; procurar `SmartLink`, `useSmartPrefetch` referencias.

11) `src/lib/performance/imageOptimization.tsx`
- Kind: lib
- O que exporta: `IMAGE_SIZES`, `IMAGE_QUALITY`, componentes `OptimizedImage`, `OptimizedAvatar`, `OptimizedBanner`, helpers `supportsWebP`, `optimizeImageUrl`.
- Observações: integra com `next/image`. Remover impacta carregamento/UX de imagens.
- Risco: médio.
- Recomendação: manual — buscar `OptimizedImage`, `OptimizedAvatar` usos; se poucas referências, considerar mover para `components/ui/image`.

12) `src/lib/performance/cacheStrategy.tsx`
- Kind: lib
- O que exporta: `queryClient` (react-query), cache configs `STATIC_CACHE_CONFIG`, `DYNAMIC_CACHE_CONFIG`, `CRITICAL_CACHE_CONFIG`, `QUERY_KEYS`, hooks `useOptimisticCache`, `useInvalidateCache`, `CacheProvider`.
- Observações: contém provider e `queryClient` singleton — muito crítico para hooks que usam react-query. Mesmo que `ts-prune` marque, runtime consumers may import from other paths.
- Risco: alto — remover quebra queries/hooks.
- Recomendação: keep. Confirmar onde `CacheProvider` e `queryClient` são utilizados.

---

Batch 3 (itens 13–18)

13) `src/lib/notification-service.ts`
- Kind: lib
- O que exporta: `notificationService` and tipos; implementa envio multi-canal (in-app, email, push, sms) with integration `prisma`, `emailService` and `simpleLogger`.
- Observações: Código server-side (usa prisma) e importante se funcionalidades de notificação estiverem ativas.
- Risco: alto — remoção desabilita notificações.
- Recomendação: manual — confirmar rotas que dependem de `notificationService`, e se existe duplicata em `lib/notifications/*`.

14) `src/lib/performance/lighthouseConfig.ts`
- Kind: lib
- O que exporta: configuração e utilitários para Lighthouse (LIGHTHOUSE_CONFIG, CRITICAL_PAGES, analyzeLighthouseResult, evaluateMetrics).
- Observações: útil para CI/performance checks. Se não usado, baixo risco de runtime, mas impacto em automações.
- Recomendação: review; manter se há jobs/CI que usam.

15) `src/styles/themes.ts`
- Kind: style
- O que exporta: `Theme` interface, `lightTheme`, `darkTheme` constantes.
- Observações: arquivos de tema costumam ser consumidos por provider de tema. Mesmo que ts-prune marque, mantê-los até verificar uso (e.g., `ThemeProvider`).
- Risco: médio.
- Recomendação: review. Procurar `import { lightTheme }` ou `getNextTheme` usos.

16) `src/components/ui/dropdown-menu.tsx`
- Kind: component
- O que exporta: Dropdown primitives wrappers (DropdownMenu, Content, Item, CheckboxItem, etc.) usando `@radix-ui/react-dropdown-menu`.
- Observações: componente UI que provavelmente é usado em menus. `ts-prune` sinaliza possivelmente não importado diretamente (talvez importado via `ui/index` barrel).
- Risco: médio.
- Recomendação: manual — buscar imports diretos `dropdown-menu` ou uso via `@/components/ui`.

17) `src/components/ui/sidebar.tsx`
- Kind: component
- O que exporta: `Sidebar`, `SidebarProvider`, `SidebarTrigger`, e uma implementação complexa com hooks `useIsMobile`, `Sheet`, `TooltipProvider`.
- Observações: arquivo grande (695 linhas) que parece implementar a sidebar principal; se a UI atual tiver uma sidebar, este é usado. `ts-prune` pode marcar se consumido via barrel.
- Risco: alto — remoção impacta layout principal.
- Recomendação: keep. Verificar `app/layout.tsx` e `src/app/**` para referências.

18) `src/lib/logger-winston-disabled.ts`
- Kind: lib
- O que exporta: configuração Winston (dev/prod), StructuredLogger, wrappers `authLogger`, `auditLogger`, `performanceLogger`, `securityLogger`.
- Observações: contem logging audit/performance e é potencialmente alternado com `simple-logger` (há duplicatas). Nome sugere versão "disabled" — revisar se é usada ou substituída por `simple-logger.ts`.
- Risco: médio-alto se removido sem checar dependentes.
- Recomendação: manual — comparar com `src/lib/simple-logger.ts` e consolidar. Se `logger-winston-disabled` não é referenciado, pode ser removido após migração das chamadas para `simple-logger` ou `structuredLogger`.

---

Batch 4 (itens 19–24)

19) `src/components/ui/chart.tsx`
- Kind: component
- O que exporta: `ChartContainer`, context, tooltip, legend wrappers sobre `recharts`.
- Observações: componente especializado; se houver dashboards que usam charts, este arquivo é necessário.
- Risco: médio.
- Recomendação: manual — verificar uso por dashboards (ex: admin dashboards, analytics pages).

20) `src/components/ui/pagination.tsx`
- Kind: component
- Exporta: `Pagination` e subcomponentes.
- Observações: componente padrão; manter se usado em listas/tables.
- Risco: baixo.
- Recomendação: review rápido por busca de `Pagination` em código.

21) `src/hooks/useRegistrarUsuario-abac.ts`
- Kind: hook (client)
- O que exporta: `useRegistrarUsuario`, `useValidarAtributosABAC`, `useVerificarEmailDisponivel` (duplicated with `useRegistrarUsuario.ts` - see item 29)
- Observações: existe duplicação aparente com `src/hooks/useRegistrarUsuario.ts` (item 29). Um é sufixado `-abac` e outro não; conteúdo similar. Isso explica marcação por knip/ts-prune.
- Risco: médio — duplicação é oportunidade para consolidação; remoção de um pode quebrar imports.
- Recomendação: manual — comparar os dois arquivos; manter o que segue as convenções do projeto (use client, nomes, imports), migrar consumidores para a versão escolhida e remover a duplicata.

22) `src/lib/actuarial/sample-data.ts`
- Kind: lib (data)
- O que exporta: tabelas de mortalidade de exemplo, constantes `EXAMPLE_LIFE_INSURANCE`, `AVAILABLE_TABLES`, utilitários `getTableByName`.
- Observações: data fixtures; podem ser usados em demos, testes, ou exemplos. Se não usados em produção, podem ser movidos para `dev/` ou `tests/`.
- Risco: baixo.
- Recomendação: move-to-dev/manual — conferir imports; se apenas testes usam, mover para `__tests__` ou `dev-data`.

23) `src/lib/api/helpers.ts`
- Kind: lib
- O que exporta: helpers HOFs (`withCache`, `withMonitoring`, `withRateLimit`, `withRetry`, `withTimeout`, `withFullEnhancement`).
- Observações: infrastructure helpers; potencialmente usados por serviços API. `ts-prune` pode indicar não-importação direta, mas verificações indicam uso por `@/lib/api/index.ts`.
- Risco: alto se remover (módulos dependem destas funções).
- Recomendação: keep; garantir que cache/monitor integrations estejam centralizadas.

24) `src/lib/notification-email-integration.ts`
- Kind: lib
- O que exporta: integração de email para notificações (NotificationEmailIntegration class, helpers para enviar welcome emails, processPendingEmailNotifications)
- Observações: implementa envio em lote, usa `prisma` e `emailService`. Importante para fluxo de notificações por email.
- Risco: alto.
- Recomendação: keep ou consolidar com `notification-service` se houver duplicidade.

---

Batch 5 (itens 25–30)

25) `src/lib/performance/bundleOptimization.ts`
- Kind: lib
- O que exporta: helpers (`dynamicImportWithRetry`, `preloadModule`, `lazyWithPreload`, PURE symbol, `createTreeShakableExport`, `ROUTE_CHUNKS`, `getChunkForRoute`).
- Observações: utilitários que ajudam a otimizar bundle splitting. Úteis em produção/CI.
- Risco: baixo-médio.
- Recomendação: review; manter se utilizado por lazy-loading/pages.

26) `src/lib/simple-logger.ts`
- Kind: lib
- O que exporta: `simpleLogger` singleton (fallback) e helpers (authLogger, auditLogger, performanceLogger, securityLogger).
- Observações: parece a versão lightweight do logger; coexistente com `logger-winston-disabled.ts`. Precisamos consolidar qual será usado em produção.
- Risco: médio.
- Recomendação: manual — alinhar com `logger-winston-disabled` (escolher um padrão), atualizar imports e depois remover duplicata.

27) `src/app/api/abac/policies/route.ts`
- Kind: api-route
- O que exporta: handlers `GET`, `POST`, `DELETE` para gerenciar políticas ABAC (usa `getEnforcer`, `withABACAuthorization`).
- Observações: endpoint ativo — recomendação automát. era `keep` (pipeline indicou `keep`).
- Risco: alto se remover; manter.

28) `src/app/api/abac/roles/route.ts`
- Kind: api-route
- Descrição: endpoint compatível (roles) que mapeia para políticas ABAC (mantido por backward compatibility). Exporta `protectedGET/POST/DELETE`.
- Observações: embora name seja `roles`, internamente trabalha com policies. Mantê-lo para compatibilidade.
- Recomendação: keep (ou adicionar redirect/alias se for consolidar URLs)

29) `src/hooks/useRegistrarUsuario.ts`
- Kind: hook
- Observações: duplicata dupla com `useRegistrarUsuario-abac.ts`. Contém hook principal para registro usando react-query.
- Recomendação: manual — comparar e unificar. Preferir o arquivo que já está em conformidade com `use client` e import paths usados pelo app.

30) `src/lib/abac/enforcer-abac-puro.ts`
- Kind: lib (ABAC enforcer)
- O que exporta: enforcer puro abac (getEnforcer, checkABACPermission, add/remove policy, isAdmin, canAccess, hasPermission); implementa resolução de email->userId, custom function `contextMatch`, auto-repair sanitization script invocation and prisma adapter.
- Observações: crítico, contém lógica de fallback e instrumentação de auditoria. Embora flagged como possível órfão, muitas rotas e middleware referenciam este enforcer.
- Risco: muito alto — NÃO remover. Em vez disso, consolidar imports para garantir apenas uma enforcer presente no projeto.
- Recomendação: keep e priorizar auditoria/limpeza das políticas DB; se há enforcer legacy (`src/lib/abac/enforcer.ts`), migrar todos imports para `enforcer-abac-puro.ts` antes de remover o legacy.

---

Agrupamento em lotes para revisão/remoção (proposta)
- Batch A (segurança alta - NÃO remover): 3,4,5,6,12,30 (validators, types, cacheStrategy, enforcer)
- Batch B (UI/UX críticos - revisar antes de remover): 1,2,11,16,17,19 (api barrel, ui barrel, image, dropdown, sidebar, chart)
- Batch C (performance & infra - revisar): 8,9,10,25,14 (lazyComponents, serviceWorker, routePrefetch, bundleOptimization, lighthouse)
- Batch D (notifications & emails - revisar/consolidar): 13,23,24,22,26 (notification-service, api helpers, email integration, sample-data, simple-logger)
- Batch E (hooks & duplicates - consolidar e remover duplicatas): 21,29 and review 18,20,15,27,28 (hooks duplication, logger consolidation, pagination, themes, abac api routes)

Plano de ação (próximos passos)
1. Validar referências: rodar buscas de import para cada arquivo listado (ex.: `rg "<file-name-or-export>" site-metodo`).
2. Para arquivos marcados como "keep" — documentar e garantir testes/CI.
3. Para duplicatas (hooks/loggers) — escolher canonical e migrar consumidores (pequenas PRs por 5 arquivos) e rodar `npm run build && npm run lint` no `site-metodo`.
4. Criar branches de cleanup por batch apenas após sua aprovação. Não farei commits sem autorização.

Critérios de remoção segura
- coverage: nenhum import local e não exportado em barrels; testes/verificações locais passam
- retrieval: nenhuma rota/api usa o arquivo (verificar com grep e man-in-the-middle stubs)
- build: `npm run build` e `npm run type-check` passam após remoção simulada em branch

Notas finais
- Já extraí e analisei os top 30 usando os artefatos em `XLOGS/` e leituras diretas dos arquivos citados. Este arquivo servirá como registro vivo: a cada batch que você aprovar eu executo as mudanças em branch separada, testo e atualizo este documento com o resultado (PASS/FAIL, erros e próximos passos).

---

Status atual: análise top30 concluída e registrada; aguardando sua aprovação para começar Batch A (arquivos críticos) ou Batch E (consolidação de duplicatas) — qual prefere começar?
