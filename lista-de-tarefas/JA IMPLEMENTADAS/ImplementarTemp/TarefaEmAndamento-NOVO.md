# 🚨 CONTADOR DE ERROS - CHECKLIST PRINCIPAL

**Total de Erros Identificados:** 43 warnings + 1 erro crítico = 44 total
**Erros Resolvidos:** 17
**Erros Restantes:** 27
**Progresso:** 38.6%

---

## 🎯 CHECKLIST MASTER - FASE 1: CORREÇÃO COMPLETA DE ERROS

### ✅ ERROS DE BUILD (1 ERRO CRÍTICO)
- [x] **1.1** ./src/app/area-cliente/MenuLateralCliente.tsx:23:35 - Property 'role' does not exist on type 'User' - CORRIGIDO: Implementado sistema ABAC puro

### ✅ ERROS DE LINT (43 WARNINGS)

#### Variáveis não utilizadas (26 warnings)
- [x] **2.1** ./src/app/api/auth/local/register/route-abac.ts:7:10 - 'checkABACPermission' unused - CORRIGIDO
- [x] **2.2** ./src/app/api/auth/local/register/route-abac.ts:48:23 - '_' unused - CORRIGIDO
- [x] **2.3** ./src/app/api/auth/local/register/route.ts:7:10 - 'checkABACPermission' unused - CORRIGIDO
- [x] **2.4** ./src/app/api/auth/local/register/route.ts:48:23 - '_' unused - CORRIGIDO
- [x] **2.5** ./src/app/api/auth/local/session/route-abac.ts:7:27 - 'request' unused - CORRIGIDO
- [x] **2.6** ./src/app/api/auth/local/session/route.ts:7:27 - 'request' unused - CORRIGIDO
- [x] **2.7** ./src/app/api/auth/register/route-abac.ts:47:23 - '_' unused - CORRIGIDO
- [x] **2.8** ./src/app/api/auth/register/route.ts:47:23 - '_' unused - CORRIGIDO
- [x] **2.9** ./src/app/api/auth/session/route-abac.ts:5:27 - 'request' unused - CORRIGIDO
- [x] **2.10** ./src/app/api/auth/session/route.ts:5:27 - 'request' unused - CORRIGIDO
- [x] **2.11** ./src/app/api/auth/totp-verify/route.ts:4:8 - 'speakeasy' unused - CORRIGIDO
- [x] **2.12** ./src/app/api/usuarios/route-abac-puro.ts:7:31 - 'hasPermission' unused - CORRIGIDO
- [x] **2.13** ./src/app/api/usuarios/route-abac-puro.ts:272:13 - 'id' unused - CORRIGIDO
- [x] **2.14** ./src/app/api/usuarios/route.ts:7:31 - 'hasPermission' unused - CORRIGIDO
- [x] **2.15** ./src/app/api/usuarios/route.ts:10:8 - 'logger' unused - CORRIGIDO
- [x] **2.16** ./src/app/api/usuarios/route.ts:273:13 - 'id' unused - CORRIGIDO
- [x] **2.17** ./src/lib/abac/enforcer-abac-puro.ts:16:8 - 'logger' unused - CORRIGIDO
- [ ] **2.18** ./src/types/next-auth-abac.d.ts:9:16 - 'AuthorizationPolicy' unused
- [ ] **2.19** ./src/types/next-auth-abac.d.ts:9:37 - 'AccessLog' unused
- [ ] **2.20** ./src/types/next-auth-abac.d.ts:9:48 - 'AuditLog' unused
- [ ] **2.21** ./src/types/next-auth-abac.d.ts:10:8 - 'NextAuth' unused
- [ ] **2.22** ./src/types/next-auth-abac.d.ts:11:10 - 'JWT' unused
- [ ] **2.23** ./src/types/next-auth.d.ts:9:16 - 'AuthorizationPolicy' unused
- [ ] **2.24** ./src/types/next-auth.d.ts:9:37 - 'AccessLog' unused
- [ ] **2.25** ./src/types/next-auth.d.ts:9:48 - 'AuditLog' unused
- [ ] **2.26** ./src/types/next-auth.d.ts:10:8 - 'NextAuth' unused

#### Tipos 'any' não permitidos (11 warnings)
- [ ] **3.1** ./src/app/api/monitoring/metrics/route.ts:45:54 - Unexpected any
- [ ] **3.2** ./src/app/api/monitoring/metrics/route.ts:173:17 - Unexpected any
- [ ] **3.3** ./src/app/api/monitoring/metrics/route.ts:174:24 - Unexpected any
- [ ] **3.4** ./src/app/api/usuarios/route-abac-puro.ts:16:54 - Unexpected any
- [x] **3.5** ./src/lib/abac/enforcer-abac-puro.ts:54:18 - Unexpected any - CORRIGIDO
- [x] **3.6** ./src/lib/abac/enforcer-abac-puro.ts:338:28 - Unexpected any - CORRIGIDO
- [x] **3.7** ./src/lib/abac/enforcer.ts:54:18 - Unexpected any - CORRIGIDO
- [x] **3.8** ./src/lib/abac/enforcer.ts:342:28 - Unexpected any - CORRIGIDO
- [ ] **3.9** ./src/lib/abac/prisma-adapter-abac.ts:19:27 - Unexpected any
- [ ] **3.10** ./src/lib/abac/prisma-adapter-abac.ts:40:27 - Unexpected any
- [ ] **3.11** ./src/lib/abac/prisma-adapter-abac.ts:117:20 - Unexpected any
- [ ] **3.12** ./src/lib/logger-simple.ts - 9 ocorrências de 'any'
- [ ] **3.13** ./src/lib/logger.ts - 11 ocorrências de 'any'
- [ ] **3.14** ./src/types/next-auth-abac.d.ts:144:18 - Unexpected any
- [ ] **3.15** ./src/types/next-auth-abac.d.ts:180:31 - Unexpected any
- [ ] **3.16** ./src/types/next-auth-abac.d.ts:219:28 - Unexpected any
- [ ] **3.17** ./src/types/next-auth.d.ts:144:18 - Unexpected any
- [ ] **3.18** ./src/types/next-auth.d.ts:180:31 - Unexpected any
- [ ] **3.19** ./src/types/next-auth.d.ts:219:28 - Unexpected any

#### Exports anônimos (5 warnings)
- [ ] **4.1** ./src/lib/abac/enforcer-abac-puro.ts:458:1 - Assign object to variable before exporting
- [ ] **4.2** ./src/lib/abac/enforcer.ts:470:1 - Assign object to variable before exporting
- [ ] **4.3** ./src/types/next-auth-abac.d.ts:368:1 - Assign object to variable before exporting
- [ ] **4.4** ./src/types/next-auth.d.ts:368:1 - Assign object to variable before exporting
- [ ] **4.5** ./src/validators/abacSchemas.ts:318:1 - Assign object to variable before exporting

#### React hooks (1 warning)
- [ ] **5.1** ./src/components/ui/perfil-usuario-moderno.tsx:67:6 - useEffect missing dependency

---

## 🎯 FASE 2: TESTES MANUAIS OBRIGATÓRIOS

### ✅ CONFIGURAÇÃO DO USUÁRIO ADMIN
- [ ] **7.1** Garantir usuário felipemartinii@gmail.com com privilégios máximos
- [ ] **7.2** Verificar se não existe felipemartiniii@gmail.com (com 3 i's)
- [ ] **7.3** Executar seed ABAC puro para admin

### ✅ TESTES DE ENDPOINTS
- [ ] **8.1** Testar /area-cliente (usuário comum e admin)
- [ ] **8.2** Testar /admin/dashboard (apenas admin)
- [ ] **8.3** Testar /admin/abac (apenas admin)
- [ ] **8.4** Documentar todos os erros encontrados

### ✅ VALIDAÇÃO ABAC/ASIC PURO
- [ ] **9.1** Eliminar todos resquícios de RBAC/accessLevel
- [ ] **9.2** Centralizar permissões no backend via Casbin
- [ ] **9.3** Endpoint /api/auth/permissions funcionando
- [ ] **9.4** Multifator e sessões globais funcionando

---

## 🚀 PRINCÍPIOS DE CORREÇÃO

### 🧹 Padrões de Correção Estabelecidos
1. **Variáveis não utilizadas:** Remover declarações desnecessárias
2. **Tipos 'any':** Criar interfaces específicas ou usar Record<string, unknown>
3. **Exports anônimos:** Atribuir a variável antes de exportar
4. **Hooks React:** Adicionar dependências missing ou usar useCallback
5. **Propriedades inexistentes:** Corrigir tipos ou adicionar propriedades necessárias

### 📚 Referências Consultadas
- ABAC/ASIC: https://casbin.org/docs/en/abac
- Casbin GitHub: https://github.com/casbin/casbin
- Prisma Adapter: https://github.com/node-casbin/prisma-adapter
- OWASP Authorization: https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Authorization_Cheat_Sheet.md

---

**Última atualização:** 12/08/2025 - Correção sistemática em progresso (38.6% completo)
