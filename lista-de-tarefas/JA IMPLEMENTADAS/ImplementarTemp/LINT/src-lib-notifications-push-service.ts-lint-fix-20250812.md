# Erros de lint resolvidos em src/lib/notifications/push-service.ts

## Título
Remoção de 'any', catch sem parâmetro e tipagem explícita - src/lib/notifications/push-service.ts

## Resumo do problema
O arquivo apresentava os seguintes problemas:
- Uso de 'as any' para enums NotificationType, NotificationChannel, NotificationPriority, NotificationStatus.
- Parâmetro '_error' em blocos catch não utilizado.
- Tipagem genérica em tratamento de erro.

## Solução aplicada
- Substituídos todos os usos de 'as any' por enums explícitos importados do types/notifications.
- Removidos parâmetros '_error' dos blocos catch onde não eram utilizados.
- Tipagem explícita para tratamento de erro (Record<string, unknown>).

### Antes
```ts
type: 'info' as any,
catch (_error) {
  ...
}
if (this.isSubscriptionInvalid(error as any)) {
  ...
}
```

### Depois
```ts
type: NotificationType.INFO,
catch {
  ...
}
if (this.isSubscriptionInvalid(error as Record<string, unknown>)) {
  ...
}
```

## Referências
- [ESLint: no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)
- [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html)

## Orientação para casos semelhantes
Sempre que encontrar 'as any' para enums, substitua por importação e uso explícito do enum. Remova parâmetros não utilizados em catch. Tipagem de erro deve ser sempre explícita.

## Checklist de verificação
- [x] Lint passou sem erros neste arquivo
- [ ] Build passou sem erros (validar após correção de todos os arquivos)
- [x] Documentação criada
