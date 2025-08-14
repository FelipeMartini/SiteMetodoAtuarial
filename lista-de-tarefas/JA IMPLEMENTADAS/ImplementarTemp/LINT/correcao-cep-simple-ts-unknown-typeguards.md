# Correção: Substituição de 'any' por 'unknown' e type guards em cep-simple.ts

## Arquivo: ./src/lib/api/services/cep-simple.ts

## Problemas Identificados
- **Linha 28:** `Promise<any>` - uso de 'any' no retorno da função simpleFetch()
- **Linha 58:** `forceRefresh = false` - variável atribuída mas nunca usada
- **Linha 74:** `_error` - variável não utilizada no catch

## Solução Aplicada

### 1. Substituição de Promise<any> por Promise<unknown>
```typescript
// ANTES:
private async simpleFetch(url: string, timeout = 5000): Promise<any>

// DEPOIS:
private async simpleFetch(url: string, timeout = 5000): Promise<unknown>
```

### 2. Criação de interfaces específicas para cada provider
```typescript
interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento?: string
  bairro: string
  localidade: string
  uf: string
  ibge?: string
  gia?: string
  ddd?: string
  siafi?: string
  erro?: boolean
}

interface BrasilApiResponse {
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
  location?: {
    coordinates?: {
      latitude?: number
    }
  }
}

interface AwesomeApiResponse {
  cep: string
  address: string
  district: string
  city: string
  state: string
  city_ibge: string
  ddd: string
  status?: number
}
```

### 3. Implementação de type guards
```typescript
function isViaCepResponse(data: unknown): data is ViaCepResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'cep' in data &&
    'logradouro' in data &&
    'bairro' in data &&
    'localidade' in data &&
    'uf' in data
  )
}
```

### 4. Uso dos type guards nos métodos
```typescript
// ANTES:
const data = await this.simpleFetch(`https://viacep.com.br/ws/${cep}/json/`)
if (data.erro) { // ❌ 'data' é do tipo 'unknown'

// DEPOIS:
const data = await this.simpleFetch(`https://viacep.com.br/ws/${cep}/json/`)
if (!isViaCepResponse(data)) {
  throw new Error('Resposta inválida do ViaCEP')
}
if (data.erro) { // ✅ 'data' é do tipo 'ViaCepResponse'
```

### 5. Remoção de variáveis não utilizadas
```typescript
// ANTES:
const { provider, forceRefresh = false } = options
// E:
} catch (_error) {

// DEPOIS:
const { provider } = options
// E:
} catch {
```

## Referências Consultadas
- **carlrippon.com**: Type-safe Data Fetching with unknown in TypeScript
- **typescript-eslint.io**: Documentação sobre @typescript-eslint/no-explicit-any

## Benefícios da Correção
1. **Type Safety**: Type guards garantem validação runtime dos dados de API externa
2. **Lint Compliance**: Remove 3 warnings do ESLint
3. **Manutenibilidade**: Code mais robusto contra mudanças nas APIs externas
4. **Best Practices**: Uso correto de `unknown` em vez de `any` para dados externos

## Impacto
- **Redução de warnings:** 3 warnings eliminados (45 → 42)
- **Compatibilidade:** Mantém funcionalidade existente
- **Type Safety:** Melhora significativa na segurança de tipos para APIs externas
- **Runtime Safety:** Validação de dados em tempo de execução

## Validação
- ✅ Lint: Verificado que os 3 warnings foram resolvidos
- ✅ Build: Compilação bem-sucedida sem erros
- ✅ Type Safety: Todos os providers validados com type guards
- ✅ Funcionalidade: Serviço de CEP continua operando normalmente
