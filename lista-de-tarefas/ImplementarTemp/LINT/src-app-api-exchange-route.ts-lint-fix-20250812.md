# Correção de build: chamada incorreta de getTrends

## Título
Erro de build: chamada de função com número incorreto de argumentos (`getTrends`) - src/app/api/exchange/route.ts

## Resumo do problema
A função `getTrends` do serviço de câmbio (`exchangeService`) aceita apenas 1 argumento (`currency: string`), mas estava sendo chamada com dois argumentos (`currency, days`). Isso gerou o erro de build:

```
Type error: Expected 1 arguments, but got 2.
```

## Solução aplicada
- Corrigida a chamada para `exchangeService.getTrends(query.currency)`.
- Mantido o schema de validação aceitando `days` para uso futuro, mas a função não recebe esse argumento.
- Build e lint testados após a correção.

### Antes
```ts
const trends = await exchangeService.getTrends(query.currency, query.days)
```

### Depois
```ts
const trends = await exchangeService.getTrends(query.currency)
```

## Referências
- [TypeScript Handbook: Optional Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters)
- [StackOverflow: TypeScript error Expected 1 arguments, but got 2](https://stackoverflow.com/questions/77754087/typescript-error-expected-1-arguments-but-got-2)
- [MDN: Function parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)

## Orientação para casos semelhantes
Sempre confira a assinatura da função antes de passar múltiplos argumentos. Se precisar de parâmetros opcionais, defina-os explicitamente na assinatura da função. Use schemas de validação para garantir coerência, mas não passe argumentos extras para funções que não os aceitam.

## Checklist de verificação
- [x] Lint passou sem erros de build
- [x] Build passou sem erros
- [x] Documentação criada
