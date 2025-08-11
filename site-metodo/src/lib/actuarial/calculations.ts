/**
 * Biblioteca de Cálculos Atuariais
 * Implementa funções fundamentais para cálculos de seguros de vida, pensões e anuidades
 */

// Tipos básicos
export interface MortalityTableEntry {
  age: number;
  qx: number; // Probabilidade de morte entre idade x e x+1
  px?: number; // Probabilidade de sobrevivência entre idade x e x+1
  lx?: number; // Número de sobreviventes na idade x
  dx?: number; // Número de mortes entre idade x e x+1
  ex?: number; // Expectativa de vida na idade x
}

export interface MortalityTable {
  name: string;
  description: string;
  country: string;
  year: number;
  gender: 'male' | 'female' | 'unisex';
  entries: MortalityTableEntry[];
}

export interface LifeInsuranceParams {
  age: number;
  insuranceAmount: number;
  premiumPaymentPeriod: number;
  interestRate: number;
  mortalityTable: MortalityTable;
  loading?: number; // Carregamento para despesas
}

export interface AnnuityParams {
  age: number;
  annuityAmount: number;
  paymentFrequency: number; // 1=anual, 12=mensal
  interestRate: number;
  mortalityTable: MortalityTable;
  immediateStart: boolean;
}

/**
 * Funções básicas de mortalidade
 */
export class MortalityCalculations {
  
  /**
   * Calcula a probabilidade de sobrevivência entre idades x e x+n
   * @param mortalityTable Tabela de mortalidade
   * @param fromAge Idade inicial
   * @param yearsAhead Número de anos à frente
   * @returns Probabilidade de sobrevivência
   */
  static survivalProbability(
    mortalityTable: MortalityTable, 
    fromAge: number, 
    yearsAhead: number
  ): number {
    let survivalProb = 1.0;
    
    for (let i = 0; i < yearsAhead; i++) {
      const currentAge = fromAge + i;
      const entry = mortalityTable.entries.find(e => e.age === currentAge);
      
      if (!entry) {
        throw new Error(`Idade ${currentAge} não encontrada na tabela de mortalidade`);
      }
      
      const px = entry.px || (1 - entry.qx);
      survivalProb *= px;
    }
    
    return survivalProb;
  }

  /**
   * Calcula a probabilidade de morte entre idades x e x+n
   * @param mortalityTable Tabela de mortalidade
   * @param fromAge Idade inicial
   * @param yearsAhead Número de anos à frente
   * @returns Probabilidade de morte
   */
  static deathProbability(
    mortalityTable: MortalityTable, 
    fromAge: number, 
    yearsAhead: number
  ): number {
    return 1 - this.survivalProbability(mortalityTable, fromAge, yearsAhead);
  }

  /**
   * Calcula a expectativa de vida na idade x
   * @param mortalityTable Tabela de mortalidade
   * @param age Idade
   * @returns Expectativa de vida em anos
   */
  static lifeExpectancy(mortalityTable: MortalityTable, age: number): number {
    let expectancy = 0;
    const maxAge = Math.max(...mortalityTable.entries.map(e => e.age));
    
    for (let t = 1; t <= (maxAge - age); t++) {
      const survivalProb = this.survivalProbability(mortalityTable, age, t);
      expectancy += survivalProb;
    }
    
    return expectancy;
  }
}

/**
 * Cálculos de seguros de vida
 */
export class LifeInsuranceCalculations {
  
  /**
   * Calcula o valor presente atuarial de um seguro de vida
   * @param params Parâmetros do seguro
   * @returns Valor presente atuarial
   */
  static presentValueLifeInsurance(params: LifeInsuranceParams): number {
    const { age, insuranceAmount, interestRate, mortalityTable } = params;
    const discountRate = 1 / (1 + interestRate);
    const maxAge = Math.max(...mortalityTable.entries.map(e => e.age));
    
    let presentValue = 0;
    
    for (let t = 1; t <= (maxAge - age); t++) {
      // Probabilidade de sobreviver até o ano t-1 e morrer no ano t
      const survivalToT_1 = MortalityCalculations.survivalProbability(mortalityTable, age, t - 1);
      const deathInYearT = mortalityTable.entries.find(e => e.age === age + t - 1)?.qx || 0;
      
      const probDeathInYearT = survivalToT_1 * deathInYearT;
      const discountedValue = Math.pow(discountRate, t) * insuranceAmount * probDeathInYearT;
      
      presentValue += discountedValue;
    }
    
    return presentValue;
  }

  /**
   * Calcula o prêmio anual de um seguro de vida
   * @param params Parâmetros do seguro
   * @returns Prêmio anual
   */
  static annualPremium(params: LifeInsuranceParams): number {
    const presentValueBenefits = this.presentValueLifeInsurance(params);
    const presentValueAnnuity = AnnuityCalculations.presentValueLifeAnnuity({
      age: params.age,
      annuityAmount: 1, // Anuidade unitária
      paymentFrequency: 1,
      interestRate: params.interestRate,
      mortalityTable: params.mortalityTable,
      immediateStart: true
    });
    
    const grossPremium = presentValueBenefits / presentValueAnnuity;
    const loading = params.loading || 0.1; // 10% de carregamento padrão
    
    return grossPremium * (1 + loading);
  }
}

/**
 * Cálculos de anuidades e pensões
 */
export class AnnuityCalculations {
  
  /**
   * Calcula o valor presente de uma anuidade vitalícia
   * @param params Parâmetros da anuidade
   * @returns Valor presente da anuidade
   */
  static presentValueLifeAnnuity(params: AnnuityParams): number {
    const { age, annuityAmount, paymentFrequency, interestRate, mortalityTable, immediateStart } = params;
    const periodicRate = interestRate / paymentFrequency;
    const discountFactor = 1 / (1 + periodicRate);
    const maxAge = Math.max(...mortalityTable.entries.map(e => e.age));
    
    let presentValue = 0;
    const startPeriod = immediateStart ? 0 : 1;
    
    for (let year = startPeriod; year <= (maxAge - age); year++) {
      const survivalProb = MortalityCalculations.survivalProbability(mortalityTable, age, year);
      
      for (let period = 1; period <= paymentFrequency; period++) {
        const totalPeriods = year * paymentFrequency + period;
        const discountedPayment = Math.pow(discountFactor, totalPeriods) * annuityAmount * survivalProb;
        presentValue += discountedPayment;
      }
    }
    
    return presentValue;
  }

  /**
   * Calcula uma anuidade temporária (por n anos)
   * @param params Parâmetros da anuidade
   * @param duration Duração em anos
   * @returns Valor presente da anuidade temporária
   */
  static presentValueTemporaryAnnuity(params: AnnuityParams, duration: number): number {
    const { age, annuityAmount, paymentFrequency, interestRate, mortalityTable, immediateStart } = params;
    const periodicRate = interestRate / paymentFrequency;
    const discountFactor = 1 / (1 + periodicRate);
    
    let presentValue = 0;
    const startPeriod = immediateStart ? 0 : 1;
    
    for (let year = startPeriod; year < duration; year++) {
      const survivalProb = MortalityCalculations.survivalProbability(mortalityTable, age, year);
      
      for (let period = 1; period <= paymentFrequency; period++) {
        const totalPeriods = year * paymentFrequency + period;
        const discountedPayment = Math.pow(discountFactor, totalPeriods) * annuityAmount * survivalProb;
        presentValue += discountedPayment;
      }
    }
    
    return presentValue;
  }
}

/**
 * Funções auxiliares para cálculos financeiros
 */
export class FinancialMath {
  
  /**
   * Calcula o valor presente de uma série de pagamentos
   * @param payment Valor do pagamento
   * @param periods Número de períodos
   * @param rate Taxa de juros por período
   * @returns Valor presente
   */
  static presentValue(payment: number, periods: number, rate: number): number {
    if (rate === 0) return payment * periods;
    return payment * (1 - Math.pow(1 + rate, -periods)) / rate;
  }

  /**
   * Calcula o valor futuro de uma série de pagamentos
   * @param payment Valor do pagamento
   * @param periods Número de períodos
   * @param rate Taxa de juros por período
   * @returns Valor futuro
   */
  static futureValue(payment: number, periods: number, rate: number): number {
    if (rate === 0) return payment * periods;
    return payment * (Math.pow(1 + rate, periods) - 1) / rate;
  }

  /**
   * Converte taxa de juros anual para taxa equivalente
   * @param annualRate Taxa anual
   * @param frequency Frequência de capitalização
   * @returns Taxa equivalente
   */
  static convertRate(annualRate: number, frequency: number): number {
    return Math.pow(1 + annualRate, 1 / frequency) - 1;
  }
}

/**
 * Utilitários para tabelas de mortalidade
 */
export class MortalityTableUtils {
  
  /**
   * Valida se uma tabela de mortalidade está correta
   * @param table Tabela de mortalidade
   * @returns true se válida, caso contrário lança erro
   */
  static validateTable(table: MortalityTable): boolean {
    if (!table.entries || table.entries.length === 0) {
      throw new Error('Tabela de mortalidade vazia');
    }
    
    // Verificar se as idades são sequenciais
    const ages = table.entries.map(e => e.age).sort((a, b) => a - b);
    for (let i = 1; i < ages.length; i++) {
      if (ages[i] - ages[i-1] !== 1) {
        throw new Error(`Idades não sequenciais encontradas: ${ages[i-1]} -> ${ages[i]}`);
      }
    }
    
    // Verificar se as probabilidades estão no intervalo [0, 1]
    for (const entry of table.entries) {
      if (entry.qx < 0 || entry.qx > 1) {
        throw new Error(`Probabilidade de morte inválida na idade ${entry.age}: ${entry.qx}`);
      }
    }
    
    return true;
  }

  /**
   * Completa campos calculados na tabela de mortalidade
   * @param table Tabela de mortalidade
   * @param radix Raiz da tabela (lx na idade mínima)
   * @returns Tabela completa
   */
  static completeTable(table: MortalityTable, radix: number = 100000): MortalityTable {
    const sortedEntries = [...table.entries].sort((a, b) => a.age - b.age);
    let currentLx = radix;
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i];
      
      // Calcular px se não existir
      if (!entry.px) {
        entry.px = 1 - entry.qx;
      }
      
      // Calcular lx
      entry.lx = currentLx;
      
      // Calcular dx
      entry.dx = currentLx * entry.qx;
      
      // Calcular expectativa de vida
      entry.ex = MortalityCalculations.lifeExpectancy(table, entry.age);
      
      // Atualizar lx para próxima idade
      currentLx = currentLx * entry.px;
    }
    
    return {
      ...table,
      entries: sortedEntries
    };
  }

  /**
   * Interpola valores para idades intermediárias
   * @param table Tabela de mortalidade
   * @param targetAge Idade desejada
   * @returns Entrada interpolada
   */
  static interpolateAge(table: MortalityTable, targetAge: number): MortalityTableEntry {
    const entries = table.entries.sort((a, b) => a.age - b.age);
    
    // Se a idade existe exatamente
    const exactMatch = entries.find(e => e.age === targetAge);
    if (exactMatch) return exactMatch;
    
    // Encontrar as idades adjacentes para interpolação
    let lowerEntry: MortalityTableEntry | undefined;
    let upperEntry: MortalityTableEntry | undefined;
    
    for (let i = 0; i < entries.length - 1; i++) {
      if (entries[i].age < targetAge && entries[i + 1].age > targetAge) {
        lowerEntry = entries[i];
        upperEntry = entries[i + 1];
        break;
      }
    }
    
    if (!lowerEntry || !upperEntry) {
      throw new Error(`Impossível interpolar para idade ${targetAge}`);
    }
    
    // Interpolação linear
    const weight = (targetAge - lowerEntry.age) / (upperEntry.age - lowerEntry.age);
    const interpolatedQx = lowerEntry.qx + weight * (upperEntry.qx - lowerEntry.qx);
    
    return {
      age: targetAge,
      qx: interpolatedQx,
      px: 1 - interpolatedQx
    };
  }
}
