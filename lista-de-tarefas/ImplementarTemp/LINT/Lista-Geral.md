# Lista Geral de Erros de Lint - Projeto SiteMetodoAtuarial

## Instruções Gerais
Para cada erro/warning:
1. Consulte o Google/GitHub sobre a solução mais moderna e segura.
2. Abra o arquivo, leia TODO o conteúdo (não apenas a linha do erro) e procure por outros problemas semelhantes ou correlatos.
3. Corrija o erro pontualmente, criando tipagem específica sempre que possível.
4. Teste o lint no arquivo alterado e garanta que o erro sumiu.
5. Teste o build completo para garantir que nada quebrou.
6. Documente detalhadamente a alteração em um arquivo markdown específico para o erro (ver instrução abaixo).
7. Atualize o contador de erros restantes e o checklist geral.
8. Repita até zerar todos os erros/warnings.

## Como documentar cada erro corrigido (arquivo markdown específico)
Para cada erro corrigido, crie um arquivo markdown na pasta `lista-de-tarefas/ImplementarTemp/LINT/` com o nome do arquivo e linha do erro, por exemplo: `src-lib-api-services-cep.ts-41-unused-var.md`.

O arquivo deve conter:
- **Título:** Descrição do erro e local (arquivo/linha).
- **Resumo do problema:** Explique o que causou o erro/warning.
- **Solução aplicada:** Detalhe a alteração feita, incluindo o trecho de código antes/depois.
- **Referências:** Links para documentação, StackOverflow, handbook, etc.
- **Orientação para casos semelhantes:** Explique como identificar e corrigir esse tipo de erro em outros arquivos.
- **Checklist de verificação:**
  - [x] Lint passou sem erros neste arquivo
  - [x] Build passou sem erros
  - [x] Documentação criada

**Exemplo:**
---
### Erro: Variável não utilizada (`_error`) - src/lib/api/services/cep.ts:41

**Resumo:**
Variável `_error` foi declarada mas não utilizada, violando a regra `no-unused-vars`.

**Solução:**
Removido o parâmetro `_error` da função. Código antes/depois:

Antes:
```ts
catch (_error) {
  // ...
}
```
Depois:
```ts
catch {
  // ...
}
```

**Referências:**
- [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)

**Orientação:**
Sempre que encontrar variáveis de erro não utilizadas, remova o parâmetro ou utilize para log/debug. Leia o arquivo inteiro para encontrar outros casos semelhantes.

**Checklist:**
- [x] Lint passou
- [x] Build passou
- [x] Documentação criada
---

> Sempre leia o arquivo inteiro a cada análise, pois podem existir outros erros não reportados na mesma execução do lint.

## Referências Obrigatórias
- [ESLint: Regras Oficiais](https://eslint.org/docs/latest/rules/)
- [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js: Linting](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [Google: TypeScript lint best practices](https://www.google.com/search?q=typescript+lint+best+practices)
- [GitHub: TypeScript Lint Patterns](https://github.com/typescript-eslint/typescript-eslint)

---

## CONTADOR DE ERROS/WARNINGS
**Total inicial:** 90
**Restantes:** 53 (atualize a cada correção)

---

## PRIORIDADE MÁXIMA (corrija primeiro)
### 🛑 Arquivos com múltiplos erros graves (uso de `any`, muitos warnings, impacto em API/core):
- [x] ./src/lib/api/services/exchange-simple.ts (0 erros)
  - Corrigido: todos os usos de `any` substituídos por tipos explícitos (Promise<unknown>, interfaces específicas para retorno da AwesomeAPI, PromiseFulfilledResult tipado), parâmetros não utilizados removidos, variáveis não usadas eliminadas.
  - Testado lint/build: OK, sem erros restantes neste arquivo.
  - Referências:
    - [TypeScript: Promise.allSettled tipagem](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html)
    - [ESLint: no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)
    - [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
    - [StackOverflow: Promise.allSettled types](https://stackoverflow.com/questions/59780268/typescript-promise-allsettled-type)
  - Documentação e checklist atualizados.
 - [x] ./src/lib/api/services/cep.ts (0 erros)
   - Corrigido: remoção de variáveis não utilizadas, tipagem explícita de respostas de API externa, catch sem parâmetro não utilizado.
   - Testado lint/build: OK, sem erros restantes neste arquivo.
   - Documentação: [src-lib-api-services-cep.ts-lint-fix-20250812.md](src-lib-api-services-cep.ts-lint-fix-20250812.md)
   - Referências:
     - [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
     - [TypeScript: Tipagem de resposta Axios](https://axios-http.com/docs/res_schema)
     - [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html)
 - [x] ./src/lib/notifications/websocket-server.ts (0 erros)
   - Corrigido: remoção de importação e variáveis não utilizadas, catch sem parâmetro, tipagem explícita de eventos e propriedades.
   - Testado lint: OK, sem erros restantes neste arquivo.
   - Documentação: [src-lib-notifications-websocket-server.ts-lint-fix-20250812.md](src-lib-notifications-websocket-server.ts-lint-fix-20250812.md)
   - Referências:
     - [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
     - [TypeScript: Tipagem de eventos WebSocket](https://github.com/websockets/ws/blob/master/doc/ws.md)
     - [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html)
 - [x] ./src/lib/notifications/push-service.ts (0 erros)
   - Corrigido: substituição de 'as any' por enums explícitos, remoção de catch _error não utilizado, tipagem explícita de erro.
   - Testado lint: OK, sem erros restantes neste arquivo.
   - Documentação: [src-lib-notifications-push-service.ts-lint-fix-20250812.md](src-lib-notifications-push-service.ts-lint-fix-20250812.md)
   - Referências:
     - [ESLint: no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)
     - [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
     - [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html)
 - [x] ./src/lib/performance/routePrefetch.tsx (0 erros)
   - Corrigido: substituição de 'as any' por tipos explícitos, remoção de catch _error não utilizado, tipagem explícita de router e includes.
   - Testado lint/build: OK, sem erros restantes neste arquivo.
   - Documentação: [src-lib-performance-routePrefetch.tsx-lint-fix-20250812.md](src-lib-performance-routePrefetch.tsx-lint-fix-20250812.md)
   - Referências:
     - [ESLint: no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)
     - [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
     - [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html)

---

## PRIORIDADE ALTA
- [ ] ./src/app/relatorios-atuariais/page.tsx (4 erros)
- [ ] ./src/lib/api/cache.ts (4 erros)
- [ ] ./src/lib/api/services/cep-simple.ts (3 erros)
- [ ] ./src/lib/notifications/email-service.ts (3 erros)
- [ ] ./src/lib/notifications/notification-service.ts (2 erros)
- [ ] ./src/lib/performance/bundleOptimization.ts (2 erros)
- [ ] ./src/lib/performance/cacheStrategy.tsx (3 erros)
- [ ] ./src/lib/simple-logger.ts (2 erros)
- [ ] ./src/middleware/logging.ts (2 erros)

---

## PRIORIDADE MÉDIA/BAIXA
- [ ] ./src/app/api/usuario/definir-senha/route.ts (1 erro)
- [ ] ./src/app/api/usuarios/[id]/route.ts (1 erro)
- [ ] ./src/components/admin/data-table/usePersistenciaTabela.ts (2 erros)
- [ ] ./src/components/admin/users-table.tsx (1 erro)
- [ ] ./src/components/auth/AuthGuard.tsx (1 erro)
- [ ] ./src/components/notifications/notification-center.tsx (5 erros)
- [ ] ./src/hooks/useAuth.ts (1 erro)
- [ ] ./src/lib/abac/enforcer.ts (2 erros)
- [ ] ./src/lib/api/client.ts (1 erro)
- [ ] ./src/lib/api/index.ts (3 erros)
- [ ] ./src/lib/api/monitor-simple.ts (3 erros)
- [ ] ./src/lib/api/services/exchange.ts (5 erros)
- [ ] ./src/lib/atuarial/calculos-financeiros.ts (2 erros)
- [ ] ./src/lib/audit.ts (1 erro)
- [ ] ./src/lib/monitoring.ts (1 erro)

---

## DESCRIÇÃO DOS PRINCIPAIS ERROS
- **Uso de `any`**: Remove a segurança de tipos do TypeScript. Sempre prefira criar tipos ou interfaces específicas. [Referência](https://typescript-eslint.io/rules/no-explicit-any/)
- **Variável não utilizada (`_error`, `error`, etc.)**: Remova o parâmetro se não for usado, ou utilize para log/debug. [Referência](https://eslint.org/docs/latest/rules/no-unused-vars)
- **Variável atribuída mas não utilizada**: Remova ou justifique/documente. [Referência](https://eslint.org/docs/latest/rules/no-unused-vars)
- **Tipo não explícito em função/parâmetro**: Sempre tipar explicitamente. [Referência](https://www.typescriptlang.org/docs/handbook/2/functions.html)

---

# TODOS OS WARNINGS/ERROS DETECTADOS PELO LINT (atualize sempre que rodar o lint):

## ./src/app/api/usuario/definir-senha/route.ts
- 38:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/app/api/usuarios/[id]/route.ts
- 45:12  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/app/relatorios-atuariais/page.tsx
- 353:88  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 365:88  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 374:133  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 374:272  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

## ./src/components/admin/data-table/usePersistenciaTabela.ts
- 13:12  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 37:16  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/components/admin/users-table.tsx
- 184:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/components/auth/AuthGuard.tsx
- 306:53  Warning: 'action' is assigned a value but never used.  @typescript-eslint/no-unused-vars

## ./src/components/notifications/notification-center.tsx
- 94:16  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 112:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 128:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 149:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 180:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/hooks/useAuth.ts
- 37:16  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/abac/enforcer.ts
- 232:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 281:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/api/cache.ts
- 37:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 156:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 166:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 252:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/api/client.ts
- 326:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/api/index.ts
- 187:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 198:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 298:12  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/api/monitor-simple.ts
- 94:5  Warning: 'errorDetails' is defined but never used.  @typescript-eslint/no-unused-vars
- 95:5  Warning: 'statusCode' is defined but never used.  @typescript-eslint/no-unused-vars
- 247:11  Warning: '_timeWindow' is assigned a value but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/api/services/cep-simple.ts
- 28:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 58:23  Warning: 'forceRefresh' is assigned a value but never used.  @typescript-eslint/no-unused-vars
- 74:16  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/api/services/cep.ts
- 41:7  Warning: '_CepErrorSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
- 104:27  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 118:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 140:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 303:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/api/services/exchange.ts
- 197:17  Warning: 'pairKey' is assigned a value but never used.  @typescript-eslint/no-unused-vars
- 243:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 280:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 361:16  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 414:22  Warning: 'pattern' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/atuarial/calculos-financeiros.ts
- 79:13  Warning: 'capital' is assigned a value but never used.  @typescript-eslint/no-unused-vars
- 96:13  Warning: 'capital' is assigned a value but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/audit.ts
- 67:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/monitoring.ts
- 339:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/notifications/email-service.ts
- 75:57  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 120:18  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 274:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/notifications/notification-service.ts
- 279:86  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 374:50  Warning: 'deliveryStats' is assigned a value but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/notifications/push-service.ts
- 161:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 223:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 224:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 225:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 226:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 418:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/notifications/websocket-server.ts
- 3:28  Warning: 'NotificationSocketData' is defined but never used.  @typescript-eslint/no-unused-vars
- 211:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 224:13  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 226:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 329:24  Warning: 'info' is defined but never used.  @typescript-eslint/no-unused-vars
- 365:19  Warning: 'userId' is assigned a value but never used.  @typescript-eslint/no-unused-vars
- 367:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 372:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 375:20  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 392:16  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars

## ./src/lib/performance/bundleOptimization.ts
- 63:63  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 95:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

## ./src/lib/performance/cacheStrategy.tsx
- 20:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 20:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 208:79  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

## ./src/lib/performance/routePrefetch.tsx
- 151:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 167:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 250:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 252:14  Warning: '_error' is defined but never used.  @typescript-eslint/no-unused-vars
- 281:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 284:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 287:54  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 290:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 341:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

## ./src/lib/simple-logger.ts
- 6:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 29:11  Warning: 'entry' is assigned a value but never used.  @typescript-eslint/no-unused-vars

## ./src/middleware/logging.ts
- 92:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 146:12  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
