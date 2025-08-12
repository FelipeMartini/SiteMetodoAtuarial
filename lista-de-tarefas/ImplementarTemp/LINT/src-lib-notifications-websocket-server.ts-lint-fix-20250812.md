# Erros de lint resolvidos em src/lib/notifications/websocket-server.ts

## Título
Remoção de variáveis não utilizadas, catch sem parâmetro, e tipagem explícita - src/lib/notifications/websocket-server.ts

## Resumo do problema
O arquivo apresentava os seguintes problemas:
- Importação não utilizada (`NotificationSocketData`).
- Variáveis não utilizadas (`info`, `userId` em escopos onde não são usadas).
- Parâmetros `_error` em blocos `catch` não utilizados.
- Uso de `as any` em eventos e propriedades, violando a regra de tipagem explícita do TypeScript.

## Solução aplicada
- Removida a importação não utilizada.
- Removidas variáveis não utilizadas.
- Removidos parâmetros `_error` dos blocos `catch` onde não eram utilizados.
- Substituídos todos os usos de `as any` por tipos explícitos (`Buffer`, `boolean`, `unknown`).
- Garantida tipagem explícita em todos os pontos possíveis.

### Antes
```ts
import { WebSocketMessage, NotificationSocketData, NotificationData } from '@/types/notifications'
...
ws.on('message', data => {
  this.handleMessage(ws, _userId, Buffer.from(data as any))
})
...
catch (_error) {
  ...
}
```

### Depois
```ts
import { WebSocketMessage, NotificationData } from '@/types/notifications'
...
ws.on('message', (data: unknown) => {
  this.handleMessage(ws, _userId, Buffer.from(data as Buffer))
})
...
catch {
  ...
}
```

## Referências
- [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [TypeScript: Tipagem de eventos WebSocket](https://github.com/websockets/ws/blob/master/doc/ws.md)
- [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html)

## Orientação para casos semelhantes
Sempre que encontrar importações, variáveis ou parâmetros não utilizados, remova-os para evitar warnings. Para eventos e propriedades de bibliotecas externas, utilize tipagem explícita e evite `as any`. Leia o arquivo inteiro para garantir que não há outros problemas correlatos.

## Checklist de verificação
- [x] Lint passou sem erros neste arquivo
- [ ] Build passou sem erros (validar após correção de todos os arquivos)
- [x] Documentação criada
