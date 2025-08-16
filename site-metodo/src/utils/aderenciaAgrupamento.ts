// util de agrupamento e consolidação de faixas etárias para análise de aderência
// Mantido em utils conforme orientação do projeto
export interface GrupoFaixaEtaria {
  faixa: string
  idadeInicio: number
  idadeFim: number
  observados: number
  esperados: number
  participantes: number
}

// Agrupa registros por faixa etária de tamanho definido
export function agruparPorFaixaEtaria<T extends { idade: number; obitos_observados: number; obitos_esperados: number }>(
  registros: T[],
  tamanhoFaixa: number
): GrupoFaixaEtaria[] {
  const grupos: Record<string, GrupoFaixaEtaria> = {}
  for (const r of registros) {
    const inicio = Math.floor(r.idade / tamanhoFaixa) * tamanhoFaixa
    const fim = inicio + tamanhoFaixa - 1
    const chave = `${inicio}-${fim}`
    if (!grupos[chave]) {
      grupos[chave] = { faixa: chave, idadeInicio: inicio, idadeFim: fim, observados: 0, esperados: 0, participantes: 0 }
    }
    grupos[chave].observados += r.obitos_observados
    grupos[chave].esperados += r.obitos_esperados
    grupos[chave].participantes += 1
  }
  return Object.values(grupos).sort((a,b)=>a.idadeInicio-b.idadeInicio)
}

// Consolida grupos consecutivos com expectativa < limiar (padrão 5) somando até atingir critério
export function consolidarGruposBaixaExpectancia(grupos: GrupoFaixaEtaria[], limiar = 5): GrupoFaixaEtaria[] {
  if (!grupos.length) return []
  const resultado: GrupoFaixaEtaria[] = []
  let acumulador: GrupoFaixaEtaria | null = null
  const flush = () => {
    if (acumulador) {
      acumulador.faixa = `${acumulador.idadeInicio}-${acumulador.idadeFim}`
      resultado.push(acumulador)
      acumulador = null
    }
  }
  for (const g of grupos) {
    if (g.esperados >= limiar && !acumulador) {
      // grupo isolado suficiente
      resultado.push({ ...g })
      continue
    }
    if (!acumulador) {
      acumulador = { ...g }
      continue
    }
    // acumular
    acumulador.observados += g.observados
    acumulador.esperados += g.esperados
    acumulador.participantes += g.participantes
    acumulador.idadeFim = g.idadeFim
    if (acumulador.esperados >= limiar) {
      flush()
    }
  }
  flush()
  return resultado
}
