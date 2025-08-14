# Documentação Técnica - Fórmulas e Metodologias Atuariais

## 📋 Índice

1. [Fundamentos Matemáticos](#1-fundamentos-matemáticos)
2. [Tábuas de Mortalidade](#2-tábuas-de-mortalidade)
3. [Cálculos de Sobrevivência](#3-cálculos-de-sobrevivência)
4. [Seguros de Vida](#4-seguros-de-vida)
5. [Anuidades](#5-anuidades)
6. [Reservas Técnicas](#6-reservas-técnicas)
7. [Implementação Computacional](#7-implementação-computacional)
8. [Validação e Testes](#8-validação-e-testes)

---

## 1. Fundamentos Matemáticos

### 1.1 Notação Atuarial

| Símbolo | Significado |
|---------|-------------|
| `x` | Idade atual do segurado |
| `qx` | Probabilidade de morte entre idade x e x+1 |
| `px` | Probabilidade de sobrevivência entre idade x e x+1 |
| `lx` | Número de sobreviventes até idade x |
| `dx` | Número de mortes entre idade x e x+1 |
| `ex` | Expectativa de vida na idade x |
| `i` | Taxa de juros anual |
| `v` | Fator de desconto = 1/(1+i) |

### 1.2 Relações Fundamentais

```
px = 1 - qx
lx+1 = lx * px = lx * (1 - qx)
dx = lx * qx
```

### 1.3 Precisão Decimal

Utilizamos a biblioteca `Decimal.js` com configuração:
- **Precisão**: 28 dígitos decimais
- **Arredondamento**: ROUND_HALF_UP
- **Range**: -9e15 a 9e15

```typescript
Decimal.set({
  precision: 28,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21,
  minE: -9e15,
  maxE: 9e15,
  crypto: false,
  modulo: Decimal.ROUND_DOWN,
  defaults: true
})
```

---

## 2. Tábuas de Mortalidade

### 2.1 Tábuas Implementadas

#### AT-2000 (American Table 2000)
- **Base**: Experiência demográfica americana
- **Período**: Dados populacionais consolidados
- **Uso**: Referência histórica e comparativa
- **Características**: Mortalidade intermediária

#### BR-EMS (Brasil Experiência Mercado Segurador)
- **Base**: Experiência do mercado segurador brasileiro
- **Regulamentação**: SUSEP - Circular nº 623/2021
- **Atualização**: Versionamento quinquenal (2010, 2015, 2021)
- **Características**: Menor mortalidade (maior longevidade)

#### AT-83 (American Table 1983)
- **Base**: Experiência demográfica americana histórica
- **Uso**: Validação cruzada e referência
- **Características**: Mortalidade mais elevada

### 2.2 Interpolação de Valores

Para idades não tabuladas, utilizamos interpolação linear:

```
qx = qx_inferior + (idade - idade_inferior) * (qx_superior - qx_inferior) / (idade_superior - idade_inferior)
```

**Implementação:**
```typescript
private obterQx(idade: number, sexo: 'M' | 'F'): number {
  const campo = sexo === 'M' ? 'qx_m' : 'qx_f'
  
  if (this.tabela[idade]) {
    return this.tabela[idade][campo]
  }
  
  // Interpolação linear para idades intermediárias
  const idades = Object.keys(this.tabela).map(Number).sort((a, b) => a - b)
  // ... lógica de interpolação
}
```

---

## 3. Cálculos de Sobrevivência

### 3.1 Probabilidade de Sobrevivência

**Fórmula para n anos:**
```
n_px = ∏(k=0 to n-1) px+k = ∏(k=0 to n-1) (1 - qx+k)
```

**Implementação:**
```typescript
public calcularProbabilidadeSobrevivencia(idade: number, sexo: 'M' | 'F', anos: number): number {
  let prob = 1.0
  
  for (let i = 0; i < anos; i++) {
    const idadeAtual = idade + i
    const qx = this.obterQx(idadeAtual, sexo)
    prob *= (1 - qx)
  }
  
  return prob
}
```

### 3.2 Expectativa de Vida

**Fórmula simplificada:**
```
ex = Σ(k=1 to ∞) k_px
```

**Implementação (método abreviado):**
```typescript
private calcularExpectativa(tabela: TabelaMortalidade, idade: number, sexo: 'M' | 'F'): number {
  let expectativa = 0
  let lx = 100000
  
  for (let i = idade; i <= idadeMaxima && i <= 100; i += 5) {
    const qx = this.obterQxInterpolado(tabela, i, sexo)
    const px = 1 - qx
    const sobreviventes = lx * Math.pow(px, 5)
    expectativa += (lx + sobreviventes) * 2.5 / 100000
    lx = sobreviventes
    
    if (lx < 100) break
  }
  
  return expectativa
}
```

---

## 4. Seguros de Vida

### 4.1 Seguro Vida Inteira

**Fórmula do Valor Presente:**
```
Ax = Σ(t=0 to ∞) v^(t+0.5) * t_px * qx+t
```

**Onde:**
- `t+0.5` representa o pagamento no meio do ano de morte
- `t_px` é a probabilidade de sobreviver t anos
- `qx+t` é a probabilidade de morte no ano t+1

**Implementação:**
```typescript
public calcularSeguroVidaInteira(dados: DadosAtuariais): number {
  const { idade, sexo, capital, taxaJuros } = dados
  const v = new Decimal(1).div(new Decimal(1).plus(taxaJuros))
  
  let valorPresente = new Decimal(0)
  
  for (let t = 0; t < 100; t++) {
    const idadeAtual = idade + t
    const tpx = new Decimal(this.calcularProbabilidadeSobrevivencia(idade, sexo, t))
    const qx = new Decimal(this.obterQx(idadeAtual, sexo))
    
    if (qx.gte(0.9999)) break
    
    const termo = v.pow(t + 0.5).mul(tpx).mul(qx)
    valorPresente = valorPresente.plus(termo)
    
    if (termo.lt(1e-10)) break
  }
  
  return valorPresente.mul(capital).toNumber()
}
```

### 4.2 Prêmio Único

**Fórmula:**
```
Prêmio_Único = Capital * Ax
```

**Implementação:**
```typescript
public calcularPremioUnicoVida(dados: DadosAtuariais): number {
  return this.calcularSeguroVidaInteira(dados)
}
```

---

## 5. Anuidades

### 5.1 Anuidade Vitalícia Imediata

**Fórmula:**
```
äx = Σ(t=0 to ∞) v^t * t_px
```

**Implementação:**
```typescript
public calcularAnuidadeVitalicia(dados: DadosAtuariais): number {
  const { idade, sexo, taxaJuros } = dados
  const v = new Decimal(1).div(new Decimal(1).plus(taxaJuros))
  
  let valorPresente = new Decimal(0)
  
  for (let t = 0; t < 100; t++) {
    const tpx = new Decimal(this.calcularProbabilidadeSobrevivencia(idade, sexo, t))
    
    if (tpx.lt(1e-6)) break
    
    const termo = v.pow(t).mul(tpx)
    valorPresente = valorPresente.plus(termo)
    
    if (termo.lt(1e-10)) break
  }
  
  return valorPresente.toNumber()
}
```

### 5.2 Anuidade Vitalícia Diferida

**Fórmula:**
```
n|äx = Σ(t=n to ∞) v^t * t_px
```

### 5.3 Anuidade Temporária

**Fórmula:**
```
äx:n = Σ(t=0 to n-1) v^t * t_px
```

### 5.4 Renda Vitalícia

**Valor da Renda Mensal:**
```
Renda_Mensal = Saldo_Acumulado / äx
```

**Implementação:**
```typescript
public calcularRendaVitalicia(dados: DadosAtuariais): number {
  const anuidadeVitalicia = this.calcularAnuidadeVitalicia(dados)
  return dados.capital / anuidadeVitalicia
}
```

---

## 6. Reservas Técnicas

### 6.1 Reserva Matemática

**Fórmula (Método Prospectivo):**
```
tV = Benefício_Futuro - Prêmio_Futuro
```

**Para Seguro Vida Inteira:**
```
tV = Capital * Ax+t - Prêmio * äx+t
```

**Implementação:**
```typescript
public calcularReservaMatemática(dados: DadosAtuariais, tempo: number): number {
  const dadosAtualizados = {
    ...dados,
    idade: dados.idade + tempo
  }
  
  const premioAtualizado = this.calcularPremioUnicoVida(dadosAtualizados)
  const premioOriginal = this.calcularPremioUnicoVida(dados)
  
  return premioAtualizado - premioOriginal
}
```

### 6.2 Equivalência Atuarial

**Princípio:**
```
Valor_Presente_Benefícios = Valor_Presente_Prêmios
```

---

## 7. Implementação Computacional

### 7.1 Arquitetura do Sistema

```
src/lib/atuarial/
├── calculadora.ts           # Calculadora principal
├── calculos-financeiros.ts  # Cálculos complementares
└── validacao-cruzada.ts     # Validação entre tabelas
```

### 7.2 Interfaces TypeScript

```typescript
interface DadosAtuariais {
  idade: number
  sexo: 'M' | 'F'
  capital: number
  prazo?: number
  taxaJuros: number
  tipoRenda?: 'vitalicia' | 'temporaria' | 'diferida'
  periodoCarencia?: number
}

interface ResultadoAtuarial {
  premio: number
  reserva: number
  valorPresente: number
  probabilidadeSobrevivencia: number
  expectativaVida: number
  valorFuturo?: number
  detalhes: {
    metodologia: string
    tabelaMortalidade: string
    dataCalculo: Date
    parametros: Record<string, unknown>
  }
}
```

### 7.3 Validação de Entrada

```typescript
private validarDados(dados: DadosAtuariais): void {
  if (dados.idade < 0 || dados.idade > 120) {
    throw new Error('Idade deve estar entre 0 e 120 anos')
  }
  
  if (dados.taxaJuros < -0.1 || dados.taxaJuros > 1) {
    throw new Error('Taxa de juros deve estar entre -10% e 100%')
  }
  
  if (dados.capital <= 0) {
    throw new Error('Capital deve ser positivo')
  }
}
```

---

## 8. Validação e Testes

### 8.1 Propriedades Matemáticas Validadas

1. **Probabilidades válidas**: 0 ≤ qx ≤ 1
2. **Progressão da mortalidade**: qx ≤ qx+1 (tendência geral)
3. **Consistência entre sexos**: qx_f ≤ qx_m (tendência geral)
4. **Expectativa finita**: ex < ∞
5. **Convergência**: Séries atuariais convergem

### 8.2 Testes de Equivalência

```typescript
test('equivalência atuarial: Ax + äx = 1', () => {
  const dados = { idade: 40, sexo: 'M', capital: 1, taxaJuros: 0.06 }
  const seguro = calculadora.calcularSeguroVidaInteira(dados)
  const anuidade = calculadora.calcularAnuidadeVitalicia(dados)
  
  expect(seguro + anuidade).toBeCloseTo(1, 6)
})
```

### 8.3 Testes de Propriedades

```typescript
test('probabilidade diminui com tempo', () => {
  const prob1 = calculadora.calcularProbabilidadeSobrevivencia(40, 'M', 1)
  const prob10 = calculadora.calcularProbabilidadeSobrevivencia(40, 'M', 10)
  
  expect(prob10).toBeLessThan(prob1)
})
```

### 8.4 Validação Cruzada

```typescript
const validacao = ValidadorTabelasMortalidade.compararTabelas(
  TABELA_MORTALIDADE_AT2000,
  TABELA_MORTALIDADE_BR_EMS,
  'AT-2000',
  'BR-EMS'
)

expect(validacao.validacao.dentroTolerancia).toBe(true)
```

---

## 9. Referências e Padrões

### 9.1 Regulamentação

- **SUSEP**: Circular nº 623/2021 (Tábuas BR-EMS)
- **SUSEP**: Circular nº 402/2010 (Critérios elaboração)
- **CNSP**: Resoluções sobre reservas técnicas

### 9.2 Literatura Atuarial

- Bowers, N. L. et al. "Actuarial Mathematics"
- Dickson, D. C. M. "Insurance Risk and Ruin"
- Gerber, H. U. "Life Insurance Mathematics"

### 9.3 Padrões Internacionais

- **SOA**: Society of Actuaries (EUA)
- **IAA**: International Actuarial Association
- **CAS**: Casualty Actuarial Society

---

## 10. Manutenção e Atualizações

### 10.1 Versionamento de Tabelas

As tabelas BR-EMS são atualizadas quinquenalmente:
- **2010**: Versão inicial
- **2015**: Primeira atualização
- **2021**: Atualização atual
- **2026**: Próxima atualização prevista

### 10.2 Procedimentos de Atualização

1. Obter dados oficiais da SUSEP
2. Validar propriedades matemáticas
3. Executar testes de validação cruzada
4. Atualizar documentação
5. Realizar testes de regressão

### 10.3 Monitoramento Contínuo

- Execução automática de testes (CI/CD)
- Validação periódica dos cálculos
- Comparação com benchmarks da indústria
- Auditoria de precisão numérica

---

**Documento Técnico**  
**Versão**: 1.0  
**Data**: 2024-12-20  
**Autor**: Sistema Automatizado de Documentação  
**Revisão**: Departamento Atuarial
