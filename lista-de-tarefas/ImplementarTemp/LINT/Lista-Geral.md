# Lista Geral de Erros de Lint - Projeto SiteMetodoAtuarial

## Instruções Gerais
- Para cada erro/warning, consultar o Google/GitHub sobre a solução mais moderna e segura.
- Abrir o arquivo, ler todo o contexto e identificar todos os usos da variável/problema.
- Corrigir o erro pontualmente, criando tipagem específica sempre que possível.
- Testar o lint no arquivo alterado e garantir que o erro sumiu.
- Testar o build completo para garantir que nada quebrou.
- Documentar detalhadamente a alteração, motivo, links de referência e status dos erros restantes.
- Repetir até zerar todos os erros/warnings.

## Referências Obrigatórias
- [ESLint: Regras Oficiais](https://eslint.org/docs/latest/rules/)
- [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js: Linting](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [Google: TypeScript lint best practices](https://www.google.com/search?q=typescript+lint+best+practices)
- [GitHub: TypeScript Lint Patterns](https://github.com/typescript-eslint/typescript-eslint)

---

## CONTADOR DE ERROS/WARNINGS
- **Total inicial:** 90
- **Restantes:** (atualize a cada correção)

---

## PRIORIDADE MÁXIMA (corrija primeiro)

### 🛑 Arquivos com múltiplos erros graves (uso de `any`, muitos warnings, impacto em API/core):

- [ ] ./src/lib/api/services/exchange-simple.ts (6 erros)
  - Uso de `any` em múltiplos pontos, variáveis não utilizadas, lógica de API crítica.
  - [no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/) | [unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [ ] ./src/lib/api/services/cep.ts (5 erros)
  - Uso de `any`, variáveis não utilizadas, impacto em API de CEP.
  - [no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/) | [unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [ ] ./src/lib/notifications/websocket-server.ts (10 erros)
  - Uso de `any`, variáveis não utilizadas, tipos não explícitos, lógica de notificação central.
  - [no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/) | [unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [ ] ./src/lib/notifications/push-service.ts (6 erros)
  - Uso de `any`, variáveis não utilizadas, tipos não explícitos, lógica de push notification.
  - [no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/) | [unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [ ] ./src/lib/performance/routePrefetch.tsx (10 erros)
  - Uso de `any`, variáveis não utilizadas, tipos não explícitos, lógica de performance.
  - [no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/) | [unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)

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

> Marque cada item como concluído após corrigir e documentar no arquivo específico correspondente.
> Sempre consulte as referências e pesquise antes de corrigir cada tipo de erro.
> Atualize o contador de erros restantes a cada correção!
