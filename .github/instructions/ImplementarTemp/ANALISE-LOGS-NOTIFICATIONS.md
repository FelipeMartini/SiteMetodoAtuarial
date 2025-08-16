## Análise profunda — Logs e Push Notifications

Data: 2025-08-16

Resumo executivo
- Branch analisada: `feat/log-notifications-wip` (HEAD 20fbcde...)
- Base remota comparada: `origin/main` (antes do push na sessão: f91bbb5...)
- Objetivo: avaliar duplicações, impactos no esquema (Prisma), riscos à tabela `User` e compatibilidade com ABAC existente; propor um plano de integração minimalista e seguro.

Escopo da análise
- Modelos Prisma afetados: novos modelos de push (PushSubscription, PushNotification, PushDelivery, PushBroadcast) adicionados localmente.
- Novos artefatos de aplicação: `DatabaseLogger`, `AuditLogger` (adaptação), APIs de push (`/api/push/*`), APIs admin de logs (`/api/admin/logs/*`), hooks/cliente SW e UI admin.
- Arquivos modificados em UI/tema não estão no foco principal, mas foram verificados superficialmente.

## Análise profunda — Logs e Push Notifications

Data: 2025-08-16 (consolidação final)

Resumo executivo
- Branch analisada: `feat/log-notifications-wip` (HEAD local)
- Objetivo: detectar e eliminar duplicações na pasta `src/app`, unificar lógicas de logging/notifications/push e padronizar ABAC para existir apenas um ponto de verificação.

Escopo e resultados-chave
- Varrição completa em `site-metodo/src/app` e `site-metodo/src/lib`.
- Achado principal: existem múltiplas superfícies responsáveis por notificações e logs (rotas que escrevem em `prisma` + `PushNotificationService` com stubs + `notification-service` shim). Também há múltiplos pontos de verificação ABAC no front-end (chamadas a `checkClientPermission`) e um HOC `ABACProtectedPage` — isso precisa ser consolidado para apenas um fluxo confiável.

Decisão do time (aplicada neste plano)
- Unificar tudo em um destino final (single source of truth):
  - `PushNotificationService` (arquivo final em `src/lib/notifications/push-service.ts`) será o único responsável por persistência e integração web-push.
  - Todas as rotas que hoje escrevem `prisma.push*` serão refatoradas para delegar ao `PushNotificationService` e, prontas, os arquivos/rotas duplicadas/shims serão removidos do projeto.
  - `DatabaseLogger` será a API canônica para gravação de logs no DB; `simpleLogger`/outros shims serão removidos ou reduzidos a passthrough para console (fallback dev).
  - ABAC: haverá um único backend check `/api/abac/check` (já existente) e o cliente usará `src/lib/abac/client.ts` com cache local; todas as chamadas duplicadas que implementam check local serão eliminadas e `ABACProtectedPage` será o padrão de aplicação para páginas protegidas.

Resumo técnico das duplicações encontradas (pasta `src/app`)
- Padrões duplicados:
  - Notificações: `src/app/api/notifications/*` (user-facing) + `src/app/api/push/*` (admin/new) + shim `src/lib/notifications/notification-service.ts`.
  - Logging: rotas admin `api/admin/logs/*` e usos esparsos de `simpleLogger`/`structuredLogger` além do `DatabaseLogger`.
  - ABAC checks: múltiplos componentes chamam `checkClientPermission` diretamente; existe `ABACProtectedPage` HOC que também chama `checkClientPermission` — objetivo: manter apenas o HOC e remover chamadas ad-hoc.

Impactos e regras de remoção segura
- Não tocar na tabela `users` (sem alteração de colunas). Mudanças em relações (FKs) são aceitáveis mas serão tratadas via migration revisada.
- Remoção de arquivos: iremos remover shims/rotas duplicadas somente após:
  1) garantir testes unitários para o serviço final;
  2) refatorar todas as referências para usar o serviço final;
  3) executar lint/tsc e validar que nenhuma importação restante aponta para o recurso a ser removido.

Plano de ação consolidado (ordem de execução automática/semi-automática)
1) Varredura e identificação (feito): gerar lista de arquivos candidatos para remoção (shims e rotas que escrevem direto em prisma). Lista de candidatos anexada neste documento (seção "Arquivos candidatos à remoção").
2) Implementar o destino final (feito parcialmente): completar `PushNotificationService` com persistência e métodos faltantes, padronizar contrato de retorno.
3) Refatorar rotas para delegarem ao serviço final (aplicar patches): `/api/push/*`, `/api/notifications/*` (quando for push) e `/api/notifications/push` serão atualizadas para chamar o serviço.
4) Executar testes unitários para o serviço e hooks (mockar `web-push` e `prisma`).
5) Remover arquivos obsoletos (shims e rotas duplicadas) e enxugar imports.
6) Rodar `npm run lint` e `npm run type-check`, corrigir problemas e commitar as mudanças.
7) Gerar migration não-destrutiva do Prisma para novos modelos (em dev), revisar SQL e deixar pronta para revisão (não aplicar em produção sem autorização).

Arquivos candidatos à remoção (após refactor e testes)
- `src/lib/notifications/notification-service.ts` (shim) — substituir por export do serviço final e remover shim.
- Rotas que escrevem diretamente em `prisma.push*` e que serão refatoradas: listagem detectada em `src/app/api/push/*` (serão leves controllers), e endpoints duplicados em `src/app/api/notifications/push/route.ts`.
- `simple-logger` ou `logger-simple` se existirem e não forem usados como fallback — serão substituídos por `DatabaseLogger` + fallback console.

ABAC: unificação e garantia de um único ponto
- Objetivo: haver apenas UMA verificação de autorização no backend (endpoint `/api/abac/check`) e UMA abstração cliente `src/lib/abac/client.ts` com cache local.
- A estratégia adotada: manter `ABACProtectedPage` como componente padrão; remover chamadas manuais a `checkClientPermission` em componentes / headers / sidebars, substituindo por props/HOC que delegam à página ou server-side check (quando for SSR). Essa mudança exige varredura e substituição automática em vários arquivos.

Referências e fontes (inspiracão para UI moderna com shadcn/ui e práticas de logging/auditoria)
1. https://ui.shadcn.com/docs/components - shadcn/ui docs (component patterns)
2. https://tailwindcss.com/docs - Tailwind CSS docs (utilitários e dark mode)
3. https://nextjs.org/docs - Next.js App Router patterns
4. https://reactjs.org/docs - React docs (concurrency, hooks)
5. https://www.prisma.io/docs - Prisma schema & migration best practices
6. https://github.com/vercel/next.js/tree/canary/examples - Next.js examples and admin patterns
7. https://ui.shadcn.com/docs/recipes - shadcn recipes for dashboards
8. https://react-query.tanstack.com - React Query (data fetching patterns)
9. https://github.com/shadcn/ui - shadcn/ui repo
10. https://developer.mozilla.org/en-US/docs/Web/API/Push_API - MDN Push API (service worker + push)
11. https://developers.google.com/web/fundamentals/push-notifications - Google Web Push guide
12. https://web-push-book.gauntface.com - Web Push best practices
13. https://owasp.org - OWASP logging and secure design guidelines
14. https://datatracker.ietf.org/doc/html/rfc8030 - Web Push protocol references
15. https://prometheus.io/docs/introduction/overview/ - Metrics & monitoring guidance
16. https://www.elastic.co/observability - Observability guidance (ELK stack patterns)
17. https://github.com/eliculture/abac - exemplos ABAC (open source)
18. https://www.npmjs.com/package/web-push - web-push npm package
19. https://github.com/shadcn/ui/discussions - shadcn community patterns
20. https://www.smashingmagazine.com/2021/06/designing-modern-admin-dashboards/ - artigos sobre design de admin dashboards

Observações sobre modernização (UI)
- Use shadcn/ui primitives (`Card`, `DataTable`, `StatsCard`, `Breadcrumb`) e padronize tokens de cor e dark-mode via Tailwind; manter contraste e acessibilidade.

### Plano de Padronização Front-end (FE-1 .. FE-20)

Estas tarefas focam apenas em alterar arquivos existentes (nenhum novo top-level) e consolidar UI/admin.

```markdown
- [ ] FE-1: Unificar fonte canônica de logs nas páginas admin (audit-logs vs notifications): página principal mostra subset e linka para audit-logs detalhada.
- [ ] FE-2: Garantir checagem de permissão comum via `ABACProtectedPage` em todas páginas de auditoria/logs.
- [ ] FE-3: Padronizar componente/função de export (usar endpoint `/api/admin/audit-logs?export=true`).
- [ ] FE-4: Padronizar `StatsCard` (props: title, value, description, icon, trend) em audit-logs, notifications e dashboard.
- [ ] FE-5: Padronizar DataTable com i18n + caption acessível (usuarios, audit-logs, notifications).
- [ ] FE-6: Unificar filtros de data com `DateRangePicker` (shape `{ from: Date; to: Date; }`).
- [ ] FE-7: Melhorar UX de paginação server-side (substituir reload por refetch via hook `useUsuariosPaginados`).
- [ ] FE-8: Remover/normalizar `console.log`/debug → usar DatabaseLogger/AuditLogger ou remover.
- [ ] FE-9: Criar helper `fetchWithJsonError` e substituir fetches sem tratamento.
- [ ] FE-10: Acessibilidade: aria-labels / legendas em DataTables e botões chave.
- [ ] FE-11: Export streaming (CSV/JSON) com UI de progresso.
- [ ] FE-12: Padronizar formatação de data pt-BR via util (`src/lib/date.ts` ou util dentro de arquivo existente).
- [ ] FE-13: Validar/remover imports diretos de Prisma restantes em `src` (relatório final).
- [ ] FE-14: Lint pass complementar (unused-expressions em debug pages).
- [ ] FE-15: Documentar política de scripts que usam shim (nesta análise + TarefaEmAndamento.md).
- [ ] FE-16: Testes mínimos (helpers date/export + smoke de DataTable).
- [ ] FE-17: Centralizar uso do `PushNotificationService` nas páginas (evitar lógica duplicada nos handlers front-end).
- [ ] FE-18: Revisar/consolidar referências removidas para `/admin/logs` em sidebar e middleware.
- [ ] FE-19: Padronizar mensagens de erro (Toast/Alert) para ações (mark as read, create notification).
- [ ] FE-20: Criar checklist de revisão antes de qualquer nova rota (seção abaixo) e integrar no fluxo.
```

### Política de Scripts e Instância Prisma

Scripts que ainda usam `new PrismaClient()` foram catalogados (ver `TarefaEmAndamento.md`). Critérios para migração:
1. Scripts que requerem middlewares ou logging → migrar para import do singleton `@/lib/prisma`.
2. Scripts de seed/diagnóstico rápido podem manter instância própria (justificar no checklist interno).
3. Antes de adicionar novo script, executar Checklist de Nova Rota/Script.

### Checklist de Nova Rota / Script (Obrigatório)

1. Varredura completa de `src/app/api` e `src/app/admin` para detectar duplicação.
2. Reutilizar serviço existente (`PushNotificationService`, `DatabaseLogger`, etc.).
3. ABAC via endpoint central/HOC — não duplicar lógica.
4. Verificar componentes reutilizáveis (DataTable, StatsCard, Export) antes de criar outro.
5. Contrato JSON definido + considerar extensão de endpoint existente.
6. Proibir import direto de `@prisma/client` na camada API/UI (usar singleton).
7. Definir formato de datas padronizado.
8. Estratégia de erros consistente `{ error, code }` + UI Toast/Alert.
9. Testes mínimos (unit/smoke) definidos.
10. Atualizar `TarefaEmAndamento.md` com referência.
11. Rodar lint e type-check limpos antes de commit.
12. Verificar acessibilidade (aria, roles, captions).
13. Checar se export já cobre caso (`?export=true`).
14. Anotar necessidade de índices (não migrar direto sem revisão).
15. Confirmar ausência de `console.log` residual.

Falha em qualquer item → rota/script NÃO segue para PR.

Apêndice: listas de arquivos candidatas (extraídas com grep)
- arquivos que importam `@prisma/client` diretamente (scripts): `prisma/seed-abac-user.ts`, `scripts/*` (vários). Esses scripts serão atualizados para importar o shim ou o singleton quando fizer sentido.

Conclusão e próximos passos imediatos aplicados
- Atualizei documentos de tarefa (TarefaEmAndamento.md) e mantenho a obrigação de varredura antes de criar novas rotas/páginas.
- Próximo: aplicar patches de refatoração em lote (rotas -> PushNotificationService), rodar lint + type-check e enumerar arquivos finalmente removidos; então aplicar remoção física (delete) de shims/rotas duplicadas.

- Duplicação de surface API: existem endpoints muito similares em dois namespaces:
  - `/api/notifications/push` (compat/legacy) vs `/api/push/*` (nova) — ambos expõem subscribe/unsubscribe/test/stats ações.
  - `/api/notifications` (user-facing) e `/api/push/send` (admin/internal) fazem criação/enfileiramento de notificações com contratos parcialmente diferentes (`userId` vs `targetUserId`, `notification.body` vs `notification.message`).

- Dupla responsabilidade entre rotas e service layer:
  - `push-service.ts` implementa lógica de alto nível (registro, envio, broadcast) mas muitas funções são stubs (TODO) — enquanto as rotas `/api/push/*` usam `prisma` diretamente para persistência. Isso cria dois caminhos de verdade para gravação e lógica de negócio.

- Contratos inconsistentes / nomes divergentes:
  - `createdBy` nos registros de push é escrito por algumas rotas como `session.user.email` (string email) e em outros lugares espera-se `userId` — isso quebra coesão com ABAC e com logs já existentes que usam `userId`.
  - Campos de requisição/response variam: `targetUserId` vs `userId`, resposta de sucesso com shapes diferentes (`{ success, deliveredCount }` vs shim retornando `notificationIds`).

- Problemas de tipagem/exports:
  - `tsconfig` warnings mostram imports que não batem com `push-service` (por ex. `createPushNotificationService` não exportado) — indica que houve refatoração parcial e pontos onde um wrapper/factory foi renomeado ou não exportado.

3) Impacto prático nas páginas
- `PushNotificationsAdmin.tsx` chama `/api/push/*` e espera resposta específica (sentCount, usersWithSubscriptions). Se unificarmos a API, manteremos compatibilidade ou adaptaremos a UI.
- `admin/notifications/page.tsx` usa `/api/notifications` e `notificationService` shim. Se esse shim delegar corretamente ao `PushNotificationService` consolidado, a página continuará funcionando.

4) Recomendações concretas de unificação (prioritárias)
- Definir uma única camada de serviço autoritativa: escolher `PushNotificationService` (ou renomear para `push-service` exportando um factory) como fonte única de verdade para persistência + integração com `web-push`.
  - Implementar os métodos TODO em `src/lib/notifications/push-service.ts` para usar `prisma` (findExistingSubscription, getUserSubscriptions, deactivateSubscription, cleanupInactiveSubscriptions).
  - Exportar uma factory `createPushNotificationService(config)` e/ou uma instância singleton compatível com o que `notification-service.ts` espera (resolver os erros de import/export mencionados pelo TS).

- Refatorar as rotas para delegar ao service layer (controllers finos):
  - `/api/push/register` deve chamar `PushNotificationService.registerSubscription(...)` e não usar `prisma` diretamente.
  - `/api/push/send` e `/api/push/broadcast` devem criar records via service, que internamente cria Notification/Delivery/Broadcast e chama web-push.
  - O service deve retornar um contrato unificado (ex: { success, messageId, deliveredCount, failedCount, errors[] }) que todas as rotas e UIs reutilizem.

- Consolidar namespace público vs admin:
  - Manter `/api/notifications` como API público/usuário (centro de notificações in-app + email), mas delegar internamente para o service quando precisar enviar push.
  - Reservar `/api/push/*` para operações de administração/infra (registro, stats, broadcast) ou transformá-lo em `/api/admin/push/*` para clareza.

- Padronizar identificadores e auditoria:
  - Padronizar `createdBy` e logs para gravar `userId` (nullable) + `createdByEmail` (opcional) para compatibilidade com ABAC e legibilidade.
  - Garantir que `DatabaseLogger.logAudit` sempre receba `userId` quando disponível.

5) Plano de ações (pequenos passos executáveis)
- Curto prazo (safe, baixo risco):
  1. Corrigir exports em `push-service.ts` para expor a factory mencionada (`createPushNotificationService`) e tipos (`PushConfig`, etc.) para sanar erros de build/TS.
  2. Atualizar `notification-service.ts` (shim) para consumir a factory sem suposições; garantir que o shim devolva respostas compatíveis.
  3. Padronizar contratos em rotas: alterar `/api/push/send` para usar `userId` no request e retornar o mesmo formato do shim.

- Médio prazo (refactor):
  1. Implementar persistência completa em `PushNotificationService` (usar `prisma` internamente). Remover duplicação onde rotas escrevem `prisma` diretamente.
  2. Consolidar testes unitários para service e rotas (mock `web-push`).
  3. Executar `prisma migrate dev` com migration não-destrutiva para `push_*` tables.

- Longo prazo (ops/segurança):
  1. Monitoramento/telemetria para envios (exportar métricas e dashboards). 2. Job de limpeza TTL para `push_subscriptions`/deliveries. 3. Criptografia de chaves (p256dh/auth) em DB se necessário.

6) Lista priorizada de arquivos para revisar/editar (tarefa imediata)
- `src/lib/notifications/push-service.ts` — implementar TODOs e export factory.
- `src/app/api/push/register/route.ts`, `src/app/api/push/send/route.ts`, `src/app/api/push/broadcast/route.ts`, `src/app/api/push/stats/route.ts` — refatorar para delegar ao service.
- `src/app/api/notifications/push/route.ts` e `src/lib/notifications/notification-service.ts` — alinhar contratos e remover duplicação.
- `src/components/admin/PushNotificationsAdmin.tsx` — validar chamadas e adaptar para o contrato unificado de resposta.
- `src/app/admin/notifications/page.tsx` e `src/components/admin/AuditDashboard.tsx` — checar parâmetros usados nas queries (por ex. `page`, `limit`, `action`) para compatibilidade.

7) Observações finais e riscos residuais
- Risco principal: divergência semântica entre `email` vs `userId` em `createdBy` e logs — consertar isso antes de mesclar é crítico para manter integridade do ABAC/auditoria.
- Risco secundário: duas implementações para envio (shim + novas rotas) podem causar discrepâncias de dados; priorizar implementação única no service.

Atualizo o arquivo no repositório com esta seção estendida.

---

## Análise estendida (varredura completa e unificação)

Atualizado: 2025-08-16 (extensão profunda solicitada)

Objetivo desta extensão
- Varredura exaustiva por todas as implementações de logging, audit e notificações no projeto.
- Identificar duplicações em código, bibliotecas utilitárias, modelos Prisma e contratos de API.
- Produzir um plano de ação detalhado (passo-a-passo) e checklist executável para unificar as peças sem criar conflitos com `origin/main`.

Resumo rápido do que encontrei (delta vs versão anterior do documento)
- Duplicações significativas entre os loggers: `simple-logger` / `simpleLogger` / `structuredLogger` coexistem com o novo `DatabaseLogger` e com shims (`logger.ts`, `logger-simple`).
- Serviço de notificações está duplicado: `PushNotificationService` (classe com TODOs) + `notification-service.ts` (shim que importa factory `createPushNotificationService` inexistente) + rotas que escrevem diretamente em `prisma.push*`.
- Modelos Prisma com sobreposição semântica: `Notification` (in-app), `PushNotification` (push), `EmailLog` — existem campos redundantes e nomes conflitantes (por ex. `createdBy` string em `PushNotification` vs `userId` em `Notification`/AuditLog).
- Vários endpoints duplicados/compat (user vs admin): `/api/notifications*` (legacy/usuário) vs `/api/push/*` (novo/admin). UIs chamam ambos, causando superfície duplicada.
- Erros de tipagem/exports detectados (ver `tsconfig.tsbuildinfo`): `createPushNotificationService` e `PushConfig` referenciados mas não exportados; parâmetros implicit any; imports de `getServerSession` e `authOptions` inconsistentes.

Pesquisa aprofundada: pontos críticos encontrados
- Logger / utilitários
  - `src/lib/simple-logger.ts` (singleton, console fallback) e `src/lib/logger-simple.ts` (shim) coexistem com `src/lib/logging/database-logger.ts`. Muitas chamadas usam `simpleLogger` (email, performance, middleware) enquanto admin APIs usam `DatabaseLogger` diretamente.
  - `src/lib/logger.ts` exports `structuredLogger` que mapeia para `logger-simple`. Há sobreposição de responsabilidades (formatar + persistir) sem contrato único.

- Audit / AuditLogger
  - `src/lib/audit/auditLogger.ts` delega para `DatabaseLogger` e oferece compat shim (`auditLogger`) que usa email como `userId` em vários métodos (ex: logAuth, logAccess) — inconsistente com `DatabaseLogger` que grava `userId` UUID quando disponível.
  - `src/lib/audit.ts` é outro shim que exporta `auditService` e faz mapeamento de métodos; múltiplas camadas de adaptação tornam difícil garantir que todos gravem `userId` corretamente.

- Notificações e Push
  - `src/lib/notifications/push-service.ts` (classe `PushNotificationService`) contém implementação de envio e broadcast, mas métodos de persistência (findExistingSubscription, getUserSubscriptions, deactivateSubscription, cleanupInactiveSubscriptions) são stubs.
  - `src/lib/notifications/notification-service.ts` importa `createPushNotificationService` e espera factory/instância com métodos (`sendToUser`, `sendToUsers`, etc.) — estas APIs não correspondem exatamente aos métodos expostos por `PushNotificationService` (naming mismatch: `sendNotification` vs `sendToUser`).
  - Rotas novas `/api/push/*` gravam diretamente em `prisma.push*` (create/update) e também chamam `DatabaseLogger` — duplicação de lógica entre rotas e `PushNotificationService`.

- Prisma / Modelos e campos duplicados
  - Campos com sobreposição: `PushNotification.createdBy` (String?) pode armazenar email ou userId; `PushBroadcast.createdBy` idem. Em outros lugares (AuditLog, SystemLog) há `userId` referenciando FK para `users.id`.
  - `Notification` (in-app) usa `userId` FK; `PushNotification` usa `createdBy` string e `messageId` único — sem FK. Isso causa duplicação sem integridade referencial para push.
  - Há possibilidade de colunas/indices redundantes (ex: `messageId` + `correlationId` em várias tabelas) — útil, mas exigir regra de normalização.

- APIs / Rotas duplicadas
  - `/api/notifications/push` (compat) vs `/api/push/*` (nova). Ambas oferecem subscribe/test/unsubscribe/stats e endpoints de envio; contratos e shapes de request/response divergem.
  - Admin UIs (`PushNotificationsAdmin.tsx`) consomem `/api/push/*`, enquanto `admin/notifications/page.tsx` consome `/api/notifications` — UI e APIs estão desalinhadas.

Riscos identificados
- Inconsistência entre `userId` (UUID FK) e `createdBy` (string/email) quebra rastreabilidade e ABAC.
- Mesclar `feat/log-notifications-wip` sem harmonizar migrations pode gerar migração que recria `users` em ambientes com diferença de map/@@map (verifico que @@map("users") foi mantido, mas revisar SQL é obrigatório).
- Dois caminhos de persistência (rotas escritas direto em Prisma vs service) podem levar a comportamento divergente e registros incompletos.

Decisão recomendada (princípios)
1. Um serviço autoritativo por domínio: `PushNotificationService` deve ser a única camada que persiste `push_*` e executa chamadas `web-push`.
2. `DatabaseLogger` é a fonte canônica de logs persistidos; migrar chamadas existentes do `simpleLogger` para usar `DatabaseLogger` quando precisar persistir (manter `simpleLogger` para console/fallback e dev).
3. Padronizar identificadores: gravar sempre `userId` (FK) quando disponível; adicionar `createdByEmail`/`createdByName` opcionais para leitura rápida.
4. Evitar alterações diretas na tabela `users`. Todas as relações novas devem usar FKs separadas e opcionais.

Plano de ação detalhado (passos mínimos para criar PR sem conflitos)

```markdown
- [ ] 🔎 1) Gerar e revisar migration não-destrutiva para `push_*` (local)
  - Gerar `prisma migrate dev --name add_push_models` em dev.
  - Revisar SQL gerado para garantir que não recria nem altera colunas sensíveis em `users`.

- [ ] 🧭 2) Padronizar identificadores e campos de auditoria
  - Alterar `PushNotification.createdBy` e `PushBroadcast.createdBy` para documentar/usar `userId` (nullable) e adicionar `createdByEmail` string?
  - Atualizar todos os pontos que gravam `createdBy` para preencher `userId` quando disponible e `createdByEmail` como redundância.

- [ ] 🧩 3) Resolver mismatch de export/import em `push-service` e `notification-service`
  - Exportar uma factory compatível: `export function createPushNotificationService(config?: PushConfig) { return new PushNotificationService(config) }` e tipos `PushConfig`.
  - Garantir que `notification-service.ts` importe a factory corretamente e que os métodos expostos (`sendToUser`, `sendToUsers`) correspondam ou chamem `PushNotificationService.sendNotification`/`sendBroadcast`.

- [ ] 🛠️ 4) Implementar persistência no `PushNotificationService` e remover duplicação nas rotas
  - Implementar `findExistingSubscription`, `getUserSubscriptions`, `deactivateSubscription`, `cleanupInactiveSubscriptions` usando `prisma`.
  - Refatorar `/api/push/*` para delegar ao service (rotas finas). Remover writes diretas `prisma.push*` das rotas.

- [ ] 🧪 5) Criar testes unitários (mock web-push) e testes de integração para contracts
  - Testes para: registrar assinatura, envio simples, broadcast, falha 410 -> desativar assinatura.

- [ ] ✅ 6) Rodar lint + type-check e corrigir avisos críticos
  - `npm run lint` e `npm run type-check` corrigir erros de import/export (ex: createPushNotificationService), implicit anys, e tipos de resposta.

- [ ] 🔁 7) Atualizar UIs e contratos de API
  - `PushNotificationsAdmin.tsx`, `admin/notifications/page.tsx`, `AuditDashboard.tsx` — alinhar shapes de resposta (contrato unificado do service).
  - Documentar endpoints públicos vs admin (`/api/notifications` = user-facing; `/api/admin/push` = admin/infra).

- [ ] 🧾 8) Gerar PR com descrição e checklist atrelada
  - Criar PR de unificação contendo: migration SQL revisado, mudanças de schema (se houver), refatoração de rotas, testes, e atualização do MD de análise.
  - Incluir instruções de verificação manual para staging (VAPID keys, env vars).

- [ ] ♻️ 9) Pós-merge: criar job de manutenção
  - Job/cron para limpar assinaturas expiradas, deliveries antigas e registros de broadcast antigos.

```

Checklist de arquivos mais importantes a revisar/alterar (ordem sugerida)
- `src/lib/notifications/push-service.ts` — implementar persistência e export factory
- `src/lib/notifications/notification-service.ts` — ajustar para usar factory/instância corretamente
- `src/app/api/push/register/route.ts`, `src/app/api/push/send/route.ts`, `src/app/api/push/broadcast/route.ts`, `src/app/api/push/stats/route.ts` — delegar para service
- `src/lib/logging/database-logger.ts` — rever contexto para garantir `userId` padronizado; adicionar adapter se preciso
- `src/lib/audit/auditLogger.ts` e `src/lib/audit.ts` — alinhar para gravar `userId` (UUID) e `userEmail` separadamente
- `src/lib/simple-logger.ts`, `src/lib/logger-simple.ts`, `src/lib/logger.ts` — consolidar responsabilidades (format vs persist)
- `src/components/admin/PushNotificationsAdmin.tsx`, `src/app/admin/notifications/page.tsx`, `src/components/admin/AuditDashboard.tsx` — alinhar chamadas e contratos
- `prisma/schema.prisma` — revisar e, se aprovar, gerar migration revisado

Plano de mitigação de riscos
- Antes de rodar migrate em qualquer ambiente, revisar SQL gerado e garantir backup.
- Marcar PR como 'draft' e testar em staging com VAPID keys válidas.
- Fazer deploy da migration em staging e executar scripts de validação (rotas de admin + envio simulado).

Critérios de aceite antes de merge definitivo
- Migration aceita e revisada (não-destrutiva em `users`)
- Todos os testes unitários e integrações passam localmente/CI
- `npm run lint` e `npm run type-check` retornam sem erros críticos
- UIs admin e user funcionando com contrato unificado manualmente verificado em staging

Checkpoint e próximos passos imediatos (o que eu vou fazer se autorizado)
- Corrigir export em `src/lib/notifications/push-service.ts` para expor uma factory compatível e tipos `PushConfig` (pequena mudança, baixo risco).
- Rodar `npm run type-check` e `npm run lint` para coletar erros restantes.

Deseja que eu aplique agora a correção do `push-service` (export/factory) e rode a checagem de tipos/lint? Se sim, eu aplico as mudanças, executo as verificações e retorno o relatório de erros e um diff resumido para revisão.

