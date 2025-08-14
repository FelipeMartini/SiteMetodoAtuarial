# Correção LINT - serviceWorkerUtils.ts

## Erros Corrigidos
- [x] `_error` não utilizado em bloco catch (linha 255)
- [x] Uso de `any` nas linhas 252 e 253 para acesso ao sync do ServiceWorkerRegistration
  - **Solução:** Criada interface local `ServiceWorkerRegistrationWithSync` para tipar corretamente o uso de sync, eliminando o uso de `any`.
  - **Referências:**
    - https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/sync
    - https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types
    - https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/background-sync/index.js
    - https://stackoverflow.com/questions/38927338/background-sync-in-typescript
    - https://www.google.com/search?q=typescript+serviceworker+registration+sync+type

## Testes
- [x] Lint no arquivo: **OK**
- [x] Build global: **OK**

## Erros Restantes no Arquivo
- Nenhum warning ou erro de lint no arquivo.

## Próximos passos
- Continuar para o próximo arquivo da lista de warnings.
