# Correção de build: chamada incorreta de getTrends em test-helper

## Título
Erro de build: chamada de função com número incorreto de argumentos (`getTrends`) - src/lib/api/test-helper.ts:194

## Resumo do problema
A função `getTrends` do serviço de câmbio (`exchangeService`) aceita apenas 1 argumento (`currency: string`), mas estava sendo chamada com dois argumentos (`'USD', 7`). Isso gerou o erro de build:

```
Type error: Expected 1 arguments, but got 2.
```

## Solução aplicada
- Corrigida a chamada para `exchangeService.getTrends('USD')`.
- Mantido o valor `days: 7` no objeto de resultado para compatibilidade.
- Type check e build testados após a correção.

### Antes
```ts
const trends = await exchangeService.getTrends('USD', 7)
```

### Depois
```ts
const trends = await exchangeService.getTrends('USD')
```

## Referências
- [TypeScript Handbook: Optional Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters)
- [StackOverflow: TypeScript error Expected 1 arguments, but got 2](https://stackoverflow.com/questions/77754087/typescript-error-expected-1-arguments-but-got-2)
- [MDN: Function parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)

## Orientação para casos semelhantes
Sempre confira a assinatura da função antes de passar múltiplos argumentos. Use grep para encontrar todas as chamadas de uma função específica no projeto e corrigi-las simultaneamente.

## Checklist de verificação
- [x] Type check passou sem erros
- [x] Build passou sem erros
- [x] Documentação criada
