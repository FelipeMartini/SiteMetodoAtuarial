# Arquitetura de Auditoria, Logging e Notificações

## Objetivos
- Observabilidade completa (segurança, performance, uso) sem degradar UX.
- Rastreabilidade ponta‑a‑ponta (correlation id) entre requisição, decisão ABAC, auditoria e notificação.
- Minimizar ruído e suportar escalabilidade futura (migrar de FS para DB / fila).

## Camadas
1. Logging Estruturado – JSONL em `XLOGS/`.
2. Auditoria – Eventos de segurança e gestão.
3. ABAC Decision Log – appliedPolicies + timing.
4. Notificações – Serviço push (stub evolutivo).

## Campos Padronizados
`ts`, `level`, `correlationId`, `userEmail`, `ip`, `route`, `latencyMs`, `action`, `resource`.

## CorrelationId
Middleware futuro injeta header `x-correlation-id`; AsyncLocalStorage para propagar. Logger enriquece automaticamente.

## Retenção
| Tipo | Retenção | Ação |
|------|----------|------|
| audit | 30d | rotate/compress -> data lake |
| errors | 14d | rotate/compress |
| perf | 7d | agregação métricas |

## Classes de Evento
LOGIN_SUCCESS/FAILED, ACCESS_GRANTED/DENIED, PERMISSION_CHANGE, DATA_ACCESS, USER_CREATE/UPDATE/DELETE, SECURITY_ALERT.

## Fluxo ABAC
Cliente (cache 30s) -> `/api/abac/check` -> enforcer -> log decisão `ABAC_DECISION` -> auditoria condicional (deny crítico) -> (futuro) notificação.

## Notificações (Roadmap)
F1 stub -> F2 Prisma -> F3 fila (BullMQ) -> F4 preferências/digest.

Modelo Prisma proposto:
```
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  title     String
  body      String
  data      Json?
  readAt    DateTime?
  createdAt DateTime @default(now())
  @@index([userId, readAt])
}
```

## Métricas
`performance.mark/measure` já em permissões. Próximos marks: `api:*`, `abac:enforce`, `notify:send`.

## Segurança
Sanitização de payload sensível; rate limit export auditoria; HMAC em webhooks futuros.

## Testes
- Unit: formatação log, correlationId, normalização campos.
- Integration: login gera LOGIN_SUCCESS + correlationId consistente.
- E2E: mudança de policy -> PERMISSION_CHANGE + invalidação cache cliente.

## Roadmap
1. CorrelationId middleware/util
2. Persist Notification + endpoints CRUD
3. Export auditoria (CSV/JSON) + filtros
4. Fila assíncrona + retries
5. Preferências + digest diário

## Próximos Passos
Criar util correlationId, middleware, ajustar simpleLogger, endpoints `/api/notifications`, migration Prisma, paginação real em `getAuditLogs`.

---
Documento inicial; manter atualizado.
