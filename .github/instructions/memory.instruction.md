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
