# Correção: Substituição de 'any' por interfaces específicas em cacheStrategy.tsx

## Arquivo: ./src/lib/performance/cacheStrategy.tsx

## Problemas Identificados
- **Linha 20:** `(error as any)?.status` - uso duplo de 'any' para acessar propriedade status do erro
- **Linha 208:** `{'bottom-right' as any}` - uso de 'any' para position do ReactQueryDevtools

## Solução Aplicada

### 1. Criação de interface específica para erros HTTP
```typescript
// ANTES:
if ((error as any)?.status >= 400 && (error as any)?.status < 500) {

// DEPOIS:
// Interface para erros HTTP que podem ter status code
interface HttpError extends Error {
  status: number
}

// Type guard para verificar se o erro tem status
function isHttpError(error: Error): error is HttpError {
  return 'status' in error && typeof (error as HttpError).status === 'number'
}

if (isHttpError(error) && error.status >= 400 && error.status < 500) {
```

### 2. Remoção da prop position problemática
```typescript
// ANTES:
<ReactQueryDevtools initialIsOpen={false} position={'bottom-right' as any} />

// DEPOIS:
<ReactQueryDevtools initialIsOpen={false} />
```

## Referências Consultadas
- **tanstack.com**: Documentação oficial do TanStack Query v5 sobre TypeScript
- **TypeScript Handbook**: Type guards e interfaces

## Benefícios da Correção
1. **Type Safety**: Interface HttpError fornece tipagem segura para erros HTTP
2. **Type Guards**: Verificação runtime de propriedades do erro
3. **Lint Compliance**: Remove 3 warnings do ESLint (2 'any' + 1 posição)
4. **Best Practices**: Uso correto de type narrowing para erros HTTP

## Detalhes Técnicos
- **HttpError Interface**: Estende Error com propriedade status obrigatória
- **isHttpError Type Guard**: Verifica se erro tem propriedade status do tipo number
- **ReactQueryDevtools**: Removida prop position que causava conflito de tipos

## Impacto
- **Redução de warnings:** 3 warnings eliminados (34 → 31)
- **Compatibilidade:** Mantém funcionalidade do sistema de cache
- **Type Safety:** Melhora significativa na tipagem de erros HTTP
- **UX:** ReactQueryDevtools continua funcionando com posição padrão

## Validação
- ✅ Lint: Verificado que os 3 warnings foram resolvidos
- ✅ Build: Compilação bem-sucedida sem erros
- ✅ Type Safety: HttpError e type guard funcionam corretamente
- ✅ Funcionalidade: Sistema de cache e devtools continuam operando normalmente
