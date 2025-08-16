# Tarefa Em Andamento – Otimizações Pendentes

## Macro Etapas (Backend/Infra)
- [x] Passo C: Varredura completa de imports diretos `@prisma/client` em `src` (restaram apenas types e singleton) – CONCLUÍDO
- [ ] Completar métodos restantes + testes `PushNotificationService` (persistência completa / cleanup) (FE-17 relacionado)
- [ ] Migration Prisma revisada (não executar sem autorização) – preparar após ajustes de schema (createdById?)
- [ ] Remover shims obsoletos (notification-service / loggers simples) após cobertura de testes

## Checklist Permissões / UI Geral
- [ ] Validar consistência de objetos de permissão admin ("admin:dashboard" READ, "admin:abac" READ)
- [ ] Remover referências antigas a "/area-cliente/dashboard-admin" se redundantes (manter rota canônica se necessário)
- [ ] Auditar objetos de permissão que usam path bruto e converter para nomes canônicos (ex: admin:dashboard, audit_logs)
- [ ] Implementar prefetch/SSR hydration (TanStack Query) para dados críticos se ainda necessário
- [ ] Inserir performance marks para ciclo de verificação de permissão no cliente
- [ ] Revisar e otimizar carregamento de framer-motion (lazy boundary apenas onde animações existirem)
- [ ] Documentar no README fluxo de permissão & caching (com link para análise)

## Itens de Logging / Notifications (Complementares)
- [ ] Revisão final integração DatabaseLogger em todos os pontos (substituir console.debug sensíveis)
- [ ] Revisar push notifications (rotas + UI) e remover duplicações remanescentes após FE-17

## Tarefas Front-end (FE-1 .. FE-20)
- [ ] FE-1: Unificar fonte canônica de logs na UI (subset + link detalhado audit-logs)
- [ ] FE-2: Padronizar checagem via `ABACProtectedPage` em páginas de auditoria/logs (PARCIAL – `admin/auditoria` + dashboard admin refatorados)
- [ ] FE-3: Padronizar export `/api/admin/audit-logs?export=true`
- [ ] FE-4: Padronizar componente `StatsCard` (title,value,description,icon,trend) reutilizado
- [ ] FE-5: Padronizar DataTable (i18n + caption + aria) em usuários/audit/notifications
- [ ] FE-6: Unificar filtros de data (`DateRangePicker` shape `{from:Date;to:Date;}`)
- [ ] FE-7: Melhorar UX de paginação (refetch react-query / evitar reload)
- [ ] FE-8: Remover / normalizar `console.log` → DatabaseLogger/AuditLogger ou remover
- [ ] FE-9: Helper `fetchWithJsonError` aplicado em fetches críticos
- [ ] FE-10: Reforçar acessibilidade (aria-label, roles, landmarks) tabelas e botões
- [ ] FE-11: Export streaming (CSV/JSON) + UI progresso
- [ ] FE-12: Util único formatação datas pt-BR (ex: `formatDateTime`)
- [ ] FE-13: Varredura final pós-refactor de imports Prisma (relatório final)
- [ ] FE-13b: Remover duplicação tipos `next-auth-abac.d.ts` (CONCLUÍDO – arquivo removido)
- [ ] FE-14: Lint pass complementar (unused-expressions / deps effect) limpo
- [ ] FE-15: Documentar política scripts (singleton vs instância) – (seção já presente análise, replicar README)
- [ ] FE-16: Testes mínimos (date util, export helper, smoke DataTable)
- [ ] FE-17: Centralizar uso `PushNotificationService` na UI (remover lógica direta em handlers)
- [ ] FE-18: Revisar sidebar/middleware para refs removidas `/admin/logs`
- [ ] FE-19: Padronizar mensagens de erro (Toast/Alert) para ações (export, envio push, marcar como lida)
- [ ] FE-20: Checklist obrigatório antes de nova rota (já em análise; incorporar em README)

## Observações Dark Mode
- [ ] Investigar tema escurecido (sidebar e centro cinza) e alinhar tokens tailwind (prioridade alta se persistir)

## Notas
Arquivo atualizado automaticamente pelo agente. Marcar cada item concluído e manter consistência com `ANALISE-LOGS-NOTIFICATIONS.md` e `VERIFICACAO-FINAL-COMPLETA.md`.
