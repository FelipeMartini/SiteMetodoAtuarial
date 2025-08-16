---
applyTo: '**'
---

# Memória de Tarefas Ativas

## Front-end (FE) Checklist Atual
- FE-1 concluído: página unificada `/admin/logs` criada.
- FE-2 parcialmente: ABAC aplicado em aderência e auditoria, falta notifications refino.
- FE-8, FE-9, FE-12 concluídos (helpers fetchWithJsonError, dateFormat; remoção parcial de console.logs).
- Próximas prioridades: FE-3 (export padronizado), FE-4/FE-5 (padronização StatsCard/DataTable), FE-6 (DateRangePicker unificado), FE-7 (UX paginação), FE-10/FE-11/FE-19 (acessibilidade, export streaming, toasts), FE-13 relatório final Prisma.

## Aderência Tábuas Progresso
- Inventário endpoints e componentes concluído (itens 1-3).
- Tipos canônicos criados (`aderencia-tabuas.d.ts`).
- Agrupamento + consolidação E<5 implementados (item 9,14).
- P-valor exato via gamma regularizada (item 13 substituindo aprox.).
- Próximos: graus de liberdade refinado (12), normalização ExcelJS (15-19), pipeline Python wrapper (23-24,47), unificação contrato DTO (25), testes (38-40), export streaming (30-31), logs e métricas (32,46).

## Utilidades Criadas
- `src/utils/aderenciaAgrupamento.ts`
- `src/utils/fetchWithJsonError.ts`
- `src/utils/dateFormat.ts`

Manter esta memória sincronizada conforme itens forem concluídos.
---
applyTo: '**'
---

# Memória de Tarefas - Consolidação ABAC

- [x] Criar `checkPermissionDetailed` no enforcer (alias para `checkABACPermission`).
- [x] Remover exportações de `isAdmin`, `canAccess`, `hasPermission` do enforcer público.
- [x] Atualizar `src/lib/abac/index.ts` para exportar `checkPermissionDetailed`.
- [x] Atualizar chamadas server-side que usavam `checkABACPermission` com variável `hasPermission` para `permissionResult`/`checkPermissionDetailed` nas rotas críticas (admin/users, notifications, auth/session, auth/local/session, etc.).
- [x] Adicionar logs em `XLOGS/abac-enforcer.log` e `XLOGS/abac-check.log` (rota) para rastreamento.
- [ ] Atualizar todos os consumidores restantes que importavam os nomes antigos (varredura final e substituição se necessário).
- [ ] Atualizar documentação e README com a nova API e guideline de uso (client vs server).
- [ ] Refatorar frontend (navbar, dashboard button, sidebar cliente) para usar `checkClientPermission` / `checkClientPermissionDetailed` conforme necessidade.
- [ ] Rodar testes, lint e type-check; corrigir quebras se aparecerem.

Última atualização: automática durante run agent.
