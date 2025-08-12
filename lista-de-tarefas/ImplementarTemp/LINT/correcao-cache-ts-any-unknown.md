# Correção: Substituição de 'any' por 'unknown' em cache.ts

## Arquivo: ./src/lib/api/cache.ts

## Problemas Identificados
- **Linha 37:** `LRUCache<string, CacheEntry<any>>` - uso de 'any' na tipagem do cache
- **Linha 156:** `CacheEntry<any>` - uso de 'any' no método getAge()
- **Linha 166:** `CacheEntry<any>` - uso de 'any' no método isStale()
- **Linha 252:** `_error` - variável não utilizada no catch

## Solução Aplicada

### 1. Substituição do tipo 'any' por 'unknown'
```typescript
// ANTES:
private cache: LRUCache<string, CacheEntry<any>>

// DEPOIS:
private cache: LRUCache<string, CacheEntry<unknown>>
```

### 2. Atualização dos métodos getAge() e isStale()
```typescript
// ANTES:
const entry = this.cache.get(key) as CacheEntry<any> | undefined

// DEPOIS:
const entry = this.cache.get(key) as CacheEntry<unknown> | undefined
```

### 3. Remoção de variável não utilizada
```typescript
// ANTES:
} catch (_error) {

// DEPOIS:
} catch {
```

## Referências Consultadas
- **typescript-eslint.io**: Documentação oficial sobre @typescript-eslint/no-explicit-any
- **Medium - TypeScript Generics**: Artigo sobre cache genérico com TypeScript

## Benefícios da Correção
1. **Type Safety**: 'unknown' é mais seguro que 'any' pois força type checking explícito
2. **Lint Compliance**: Remove 4 warnings do ESLint
3. **Manutenibilidade**: Código mais limpo sem variáveis não utilizadas
4. **Best Practices**: Seguindo recomendações oficiais do TypeScript

## Impacto
- **Redução de warnings:** 4 warnings eliminados (53 → 49)
- **Compatibilidade:** Mantém funcionalidade existente
- **Type Safety:** Melhora segurança de tipos

## Validação
- ✅ Lint: Verificado que os 4 warnings foram resolvidos
- ✅ Build: Compilação bem-sucedida sem erros
- ✅ Funcionalidade: Cache continua operando normalmente
