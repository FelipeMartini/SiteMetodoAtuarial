// Tipos canônicos para pipeline de aderência de tábuas de mortalidade
// Mantidos separados para futura extensão sem quebrar consumidores.

export interface MassaParticipante {
  matricula: string
  sexo: 1 | 2 // 1 = masculino, 2 = feminino
  idade: number
  ano_cadastro?: number
  data_nascimento_iso?: string
  metadados?: Record<string, any>
}

export interface ObitoRegistro {
  matricula: string
  dataObito?: string // ISO
  ano_obito?: number
  idade: number
  sexo: 1 | 2
  causaObito?: string
  metadados?: Record<string, any>
}

export interface TabuaMortalidadeLinha {
  idade: number
  qx_masculino?: number
  qx_feminino?: number
  at2000_suav_masc?: number
  at2000_suav_fem?: number
  fonte?: string
}

export interface CalculoMassaQxLinha {
  matricula: string
  ano_obito: number
  sexo: 1 | 2
  idade: number
  qx_aplicado: number
  obitos_observados: number
  obitos_esperados: number
}

export interface CalculosEstatisticos {
  graus_liberdade: number
  chi_quadrado: number
  valor_p: number
  valor_critico?: number
  nivel_significancia: number
  resultado_teste: 'ACEITA' | 'REJEITA'
}

export interface AnaliseAderenciaDTO {
  massa_participantes: MassaParticipante[]
  tabuas_mortalidade: TabuaMortalidadeLinha[]
  calculos_massa_qx: CalculoMassaQxLinha[]
  calculos_estatisticos: CalculosEstatisticos
}

// Configuração do teste
export interface ConfigTesteChiQuadrado {
  nivel_significancia?: number // default 0.05
  usar_correcao_continuidade?: boolean
  agrupar_por_faixa_etaria?: boolean
  tamanho_faixa?: number // default 5
}
