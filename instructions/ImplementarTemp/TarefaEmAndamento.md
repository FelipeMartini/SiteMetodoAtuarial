---
applyTo: '**'
---

# Tarefa Em Andamento - Consolidação de Logging e Correções ABAC

## Checklists (Fase 1 - Unificação de Logging)
- [x] Analisar contratos de logging existentes (DatabaseLogger, simpleLogger, auditLogger)
- [x] Criar facade que exponha DatabaseLogger e funções compatíveis
- [x] Mapear todos os usos de `simpleLogger` em rotas API e libs
- [x] Mapear usos diretos de `logger-simple` (import logger from '@/lib/logger-simple')
- [x] Mapear `console.error|warn|info` relevantes em server side para migração
- [ ] Definir função helper unificada (ex: `logError`, `logWarn`) na facade (se necessário)
- [ ] Substituir imports críticos para usar facade (`structuredLogger` / `performanceLogger`)
- [x] Migrar rotas de notificações (`/api/notifications*`) de `simpleLogger` para `structuredLogger`
- [x] Migrar métricas (`/api/monitoring/metrics`) de `logger-simple` para facade
- [x] Migrar email-logger para usar `DatabaseLogger.logSystem` (via structuredLogger)
- [ ] Migrar adapters ABAC (`prisma-adapter-abac.ts`) para `structuredLogger`
- [x] Revisar `prisma.ts` e substituir `console.error` por `structuredLogger.error`
- [ ] Criar util de geração automática de `correlationId` para requests (middleware)
- [ ] Implementar middleware que anexa correlationId no contexto (quando possível)
- [ ] Adicionar captura de duração em pontos críticos (ex: métricas, notificações) via `performanceLogger.api`
- [ ] Remover (ou deprecar com comentário) exports redundantes de simple-logger após migração
- [ ] Rodar lint/typecheck
- [ ] Rodar smoke tests locais (dev server) e verificar logs

## Checklists (Fase 2 - Auditoria & Observabilidade UI Unificada)
- [x] Inventariar páginas: `/admin/logs`, `/admin/audit-logs`, `/admin/auditoria`, `/admin/abac`
- [ ] Projetar página única "Central de Observabilidade" com tabs (Sistema / Auditoria / Performance / Email / Segurança / Notificações)
- [ ] Criar componente de layout + tabs shadcn/ui
- [ ] Implementar tabela reutilizável tipada para cada tipo de log (usar DataTable existente)
- [ ] Adicionar filtros avançados (período, nível, usuário, recurso, duração mínima)
- [ ] Gráficos (recharts) de: erros por hora, taxa de sucesso ABAC, p95/p99 performance
- [ ] Export (CSV/JSON) centralizado reutilizando endpoints API
- [ ] Endpoint unificado `/api/admin/observability` com sub-recursos (query param `type=`)
- [ ] Desprecar páginas antigas com redirecionamento 302 temporário

## Checklists (Fase 3 - Scripts e Migração de Logs)
- [ ] Script para migrar logs console existentes (se armazenados fora) -> systemLog (não iniciado)
- [ ] Script limpeza de logs antigos (> 90 dias) usando `DatabaseLogger.cleanupOldLogs`
- [ ] CLI: `npm run logs:cleanup` e `npm run logs:migrate-console` (placeholders)

## Checklists (Fase 4 - Correções ABAC & Prisma)
- [ ] Integrar validação de política em endpoints de admin
- [ ] Resolver Prisma Error 14 para permitir debug via adapter
- [ ] Testar enforcer.loadPolicy() em dev e staging

## Checklists (Fase 5 - Documentação)
- [ ] Atualizar documentação (README logging) descrevendo fluxo unificado
- [ ] Atualizar CHANGELOG com breaking changes (se houver)
- [ ] Guia rápido para adicionar novo tipo de log

## Notas de Execução
- Priorizar conclusão total da Fase 1 antes de iniciar UI unificada.
- Manter fallback de simpleLogger até 100% migrado.
- Adicionar correlationId sempre que gerar logs múltiplos em uma mesma requisição.

## Próxima Ação Imediata
Completar conteúdo das tabs (Sistema & Auditoria) consumindo endpoints (a criar) e adicionar DataTables.

## Histórico de Progresso
- 2025-08-16: Facade criada e analisados pontos de uso legacy.

