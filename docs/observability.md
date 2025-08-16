## Observabilidade Unificada

### Arquitetura
- Middleware gera correlationId e AsyncLocalStorage propaga contexto.
- `structuredLogger` enriquece cada log com correlationId automaticamente.
- Endpoint principal: `GET /api/admin/observability` para consulta paginada com filtros e resumo opcional.
- Endpoint export streaming: `GET /api/admin/observability/export` (CSV, suporta `all=true`).

### Parâmetros de Consulta
`type` (sistema|auditoria|performance|email|notificacoes|seguranca) obrigatório. Filtros adicionais variam conforme tipo (level, action, resource, operation, status, from, to, page, pageSize, summary, export).

### Exportações
- Página atual: `?export=csv|json` no endpoint principal.
- Streaming multi-page: `/export?type=...&all=true` (limite 50k linhas, batches 1000).

### DataTable
- Colunas dinâmicas por tipo.
- Paginação server-side sincronizada com filtros locais.
- Toolbar inclui ações streaming.

### Roadmap Futuro
- Alertas reativos (threshold p95, taxa de erro).
- Dashboards agregados (gráficos).
- Integração tracing distribuído externo.

### Limites
- MAX_ROWS=50000 no export streaming.
- BATCH_SIZE=1000 (ajustável se necessário).

### Segurança
- Protegido por ABAC (`observability:read`).
