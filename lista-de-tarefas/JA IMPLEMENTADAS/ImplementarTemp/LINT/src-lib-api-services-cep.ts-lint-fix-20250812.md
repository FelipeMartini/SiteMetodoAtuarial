# Erros de lint resolvidos em src/lib/api/services/cep.ts

## Título
Remoção de variáveis não utilizadas e tipagem explícita de respostas de API externa - src/lib/api/services/cep.ts

## Resumo do problema
O arquivo apresentava os seguintes problemas:
- Variável `_CepErrorSchema` declarada mas nunca utilizada.
- Uso de `as any` para tipar respostas de APIs externas, violando a regra de tipagem explícita do TypeScript.
- Parâmetros `_error` em blocos `catch` não utilizados, violando a regra `no-unused-vars`.

## Solução aplicada
- Removido o schema `_CepErrorSchema` não utilizado.
- Criados tipos intermediários para as respostas das APIs (ViaCep, BrasilAPI, AwesomeAPI) e utilizados explicitamente com `as Tipo`.
- Removidos parâmetros `_error` dos blocos `catch` onde não eram utilizados.
- Garantido que todas as funções estejam tipadas explicitamente.

### Antes
```ts
const _CepErrorSchema = z.object({
  erro: z.boolean(),
  message: z.string().optional(),
})
...
const apiData = response.data as any
...
catch (_error) {
  ...
}
```

### Depois
```ts
// _CepErrorSchema removido
...
type BrasilApiResponse = { ... }
const apiData = response.data as BrasilApiResponse
...
catch {
  ...
}
```

## Referências
- [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [TypeScript: Tipagem de resposta Axios](https://axios-http.com/docs/res_schema)
- [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html)

## Orientação para casos semelhantes
Sempre que encontrar variáveis, schemas ou parâmetros não utilizados, remova-os para evitar warnings. Para respostas de APIs externas, crie tipos intermediários e utilize `as Tipo` explicitamente, nunca `as any`. Leia o arquivo inteiro para garantir que não há outros problemas correlatos.

## Checklist de verificação
- [x] Lint passou sem erros neste arquivo
- [x] Build passou sem erros (exceto erros não relacionados a este arquivo)
- [x] Documentação criada
