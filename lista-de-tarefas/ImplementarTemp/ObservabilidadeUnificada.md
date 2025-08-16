---
## Central de Observabilidade Unificada – Plano de Implementação

### Objetivo
Consolidar logs de Sistema, Auditoria, Performance, Email, Segurança e Notificações em um único endpoint backend `/api/admin/observability` e interface `/admin/observabilidade` com abas e DataTables reutilizáveis, filtros, exportação e métricas agregadas. Eliminar páginas/rotas duplicadas antigas após migração.

### Assunções
- Usar Prisma com modelos já existentes (SystemLog, AuditLog, PerformanceLog, EmailLog, Notification, Push* quando aplicável).
- Reutilizar structuredLogger; adicionar correlationId middleware depois (fase 2).
- Primeira entrega: leitura e paginação; depois filtros avançados e export.

### Backlog de Alto Nível
1. Endpoint GET `/api/admin/observability` multi-tipo (type=sistema|auditoria|performance|email|notificacoes|seguranca)
2. Paginação unificada (page, pageSize) + ordenação básica (sort, order)
3. Filtros básicos: level (system), action/resource (audit), operation (performance), status (email/notificações), date range (from,to)
4. Resposta padronizada: `{ data, page, pageSize, total, type, elapsedMs }`
5. Tabs na UI consumindo esse endpoint com SWR/React Query
6. Componentes DataTable genéricos (colDefs por tipo)
7. Export CSV/JSON via query `?export=csv|json`
8. Métricas rápidas (cards) por tipo: últimos 24h contagem, erros, p95 performance
9. Migração de páginas antigas apontando redirect ou aviso
10. Remover console.* server-side substituindo structuredLogger
11. Middleware correlationId + propagação no logger
12. Documentação + CHANGELOG

### Checklist Detalhado
```markdown
- [x] (1) Criar rota `/api/admin/observability/route.ts` com dispatcher por `type`
- [x] (1.1) Implementar parsing seguro de query params (page,pageSize,sort,order,from,to,filters) – (filtros avançados ainda não: level/action etc.)
- [x] (1.2) Implementar handlers individuais (systemHandler, auditHandler, performanceHandler, emailHandler, notificacoesHandler, segurancaHandler)
- [x] (1.3) Padronizar retorno e capturar tempo (elapsedMs)
- [x] (1.4) Suportar export CSV/JSON simples (página atual)
- [x] (2) Adicionar zod schemas para validação dos parâmetros
- [x] (3) Criar util compartilhado para build de paginação e ordenação (atual inline)
- [x] (4) Atualizar página `/admin/observabilidade` para usar client component por aba com fetch real (versão simplificada inicial)
- [x] (4.1) Criar componentes `ObservabilidadeTabsClient` (sub-componentes específicos evoluirão para DataTable)
- [ ] (5) Reutilizar/portar colunas das páginas audit-logs/emails/performance existentes
- [x] (6) Adicionar métricas básicas via `summary=true` (count24h, errors24h, p95 performance)
- [x] (7) Migrar página antiga `/admin/logs` para redirecionar para `/admin/observabilidade`
- [x] (8) Migrar `/admin/audit-logs` e `/admin/auditoria` (exibir aviso de deprecação)
- [ ] (9) Substituir server-side console.* ainda presentes em rotas `api/admin/logs/*` por structuredLogger (parcial)
- [x] (10) Criar middleware correlationId (header `x-correlation-id` ou gerar uuid) e anexar ao structuredLogger
- [x] (11) Propagar correlationId para respostas e logs (fase 1: geração inline no handler)
- [ ] (12) Atualizar documentação em `docs/` sobre uso do novo endpoint
- [ ] (13) Registrar mudanças no CHANGELOG (site-metodo)
- [x] (14) UI filtros + export básico e métricas resumo iniciais
```

### Riscos / Considerações
- Volume de dados pode crescer: considerar índices adicionais (já existem básicos) e paginação por cursor futura.
- Export CSV pode ser pesado; limitar a 10k registros por export inicial.
- Segurança: exigir permissão ABAC `observability:read` ou granular por tipo.

### Próximos Passos Imediatos
Implementar rota unificada (itens 1.x) e wiring inicial da aba "Sistema" e "Auditoria".

---
Atualize esta lista conforme conclui etapas.
