# Erros de lint resolvidos em src/lib/performance/routePrefetch.tsx

## Título
Remoção de 'any', catch sem parâmetro e tipagem explícita - src/lib/performance/routePrefetch.tsx

## Resumo do problema
O arquivo apresentava os seguintes problemas:
- Uso de 'as any' para cast de tipos em includes, router, etc.
- Parâmetro '_error' em blocos catch não utilizado.
- Tipagem genérica em tratamento de erro e funções utilitárias.

## Solução aplicada
- Substituídos todos os usos de 'as any' por tipos explícitos (cast para union types, tipagem de router, etc.).
- Removido parâmetro '_error' dos blocos catch onde não era utilizado.
- Garantida tipagem explícita em todos os pontos relevantes.

### Antes
```ts
if (ROLE_BASED_ROUTES.ADMIN.includes(route as any))
await (router as any).prefetch(route)
catch (_error) {
  ...
}
```

### Depois
```ts
if (ROLE_BASED_ROUTES.ADMIN.includes(route as typeof ROLE_BASED_ROUTES.ADMIN[number]))
await (router as { prefetch: (route: string) => Promise<void> }).prefetch(route)
catch {
  ...
}
```

## Referências
- [ESLint: no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)
- [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html)

## Orientação para casos semelhantes
Sempre que encontrar 'as any', substitua por cast para o tipo correto (union types, interfaces, etc). Remova parâmetros não utilizados em catch. Tipagem de erro deve ser sempre explícita.

## Checklist de verificação
- [x] Lint passou sem erros neste arquivo
- [x] Build passou sem erros (validado)
- [x] Documentação criada
