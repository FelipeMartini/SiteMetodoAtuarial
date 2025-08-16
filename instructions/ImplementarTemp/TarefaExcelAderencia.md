---
applyTo: '**'
---

# Tarefa Em Andamento - Análise Profunda Excel & Aderência Tábuas (Focus Item 7)

## Fase 0 - Pesquisa e Fontes (40+ referências)
- [ ] Coletar 10 fontes sobre Teste Qui-Quadrado aplicado a mortalidade
- [ ] Coletar 10 fontes sobre tábuas atuariais brasileiras (IBGE, AT-2000, BR-EMS, etc.)
- [ ] Coletar 5 fontes sobre hipóteses atuariais e aderência estatística
- [ ] Coletar 5 fontes sobre implementação de análise de mortalidade em Python (openpyxl, pandas, lifelines)
- [ ] Coletar 5 fontes sobre exceljs / limitações / parsing de fórmulas
- [ ] Coletar 5 fontes sobre melhores práticas de importação massiva (streaming, chunking)
- [ ] Consolidar resumo crítico (vantagens / riscos / limitações)

## Fase 1 - Inventário & Padronização da Massa
- [ ] Script Node (exceljs) para abrir arquivo MASSA e extrair: matrícula, sexo, idade, status óbito (se aplicável), datas
- [ ] Script Node para extrair tabela de óbitos ocorridos
- [ ] Script Node para extrair qx por sexo e idade
- [ ] Normalizar estrutura única: { matricula, sexo, idade, vivo, anoRef }
- [ ] Validar consistência (idade dentro do range qx, sexo válido, duplicatas)
- [ ] Reportar estatísticas básicas (contagem por idade/sexo, % faltantes)

## Fase 2 - Cálculo Esperados & Observados (Node/TypeScript)
- [ ] Função gerar exposição aproximada (E_x) se campo não existir
- [ ] Calcular óbitos esperados: Expected_x = Exposicao_x * qx_x
- [ ] Calcular óbitos observados agregando massa + lista de óbitos
- [ ] Gerar tabela consolidada: idade, sexo, Exposicao, qx, Esperados, Observados, Diferença
- [ ] Validar soma dos esperados vs observados (sanity check)

## Fase 3 - Teste Qui-Quadrado (Node)
- [ ] Agrupar faixas com esperados < 5 (regras de qui-quadrado)
- [ ] Calcular χ² = Σ ( (O-E)^2 / E )
- [ ] Determinar graus de liberdade (k - 1 - p) conforme ajuste
- [ ] P-valor (aproximação função gamma incompleta ou tabela pré-carregada)
- [ ] Decisão aderência (comparar com α=0.05 e configurável)
- [ ] Exportar JSON estruturado do resultado

## Fase 4 - Versão Python (openpyxl + pandas opcional)
- [ ] Script Python para replicar extração (openpyxl) e cálculo
- [ ] Calcular esperados/observados em Python e comparar com Node (teste de consistência)
- [ ] Implementar cálculo de p-valor com scipy.stats (se permitido) ou implementação manual
- [ ] CLI Python: `python scripts/aderencia_calc.py --input massa.xlsx --out result.json`
- [ ] Validar outputs binários equivalentes (tolerância numérica pequena)

## Fase 5 - API & Integração
- [ ] Endpoint POST `/api/aderencia/processar` (upload + seleção linguagem node|python)
- [ ] Streaming de progresso (SSE ou polling) - opcional (deferred se complexo)
- [ ] Persistir execução (job table) com status (pending, running, done, failed)
- [ ] Endpoint GET `/api/aderencia/result/:jobId`
- [ ] Endpoint GET `/api/aderencia/export/:jobId?format=csv|json`

## Fase 6 - UI `app/AderenciaTabua/`
- [ ] Página upload + seleção linguagem + parâmetros (alpha, minEsperado)
- [ ] Tabela interativa (DataTable) com filtros (sexo, faixa etária)
- [ ] Gráfico barras Observados vs Esperados (recharts)
- [ ] Linha acumulada de χ² parcial
- [ ] Destaque condicional (células com alto residual)
- [ ] Cartões KPI (χ², gl, p-valor, decisão)
- [ ] Ação export (CSV/JSON) e botão baixar log de processamento

## Fase 7 - Persistência & Import Massivo SQLite
- [ ] Modelo Prisma para massa normalizada (ParticipantExposure, MortalityObservation, MortalityTableQx)
- [ ] Seed inicial opcional para testes
- [ ] Importador em lotes (chunk 1000 linhas) com transações
- [ ] Índices (idade, sexo) para acelerar queries
- [ ] Função recalcular aderência direto do banco (sem Excel)

## Fase 8 - Qualidade & Validação
- [ ] Testes unitários (normalização, qui-quadrado, agrupamento faixas)
- [ ] Testes de integração (API upload -> resultado)
- [ ] Snapshot comparando Node vs Python
- [ ] Linter / type-check sem erros
- [ ] Documentação README (fluxo completo)

## Fase 9 - Documentação & Referências
- [ ] Listar todas as 40+ fontes consultadas (com data de acesso)
- [ ] Explicar fórmulas (Exposição, qx, Esperados, Qui-quadrado)
- [ ] Limitações dos dados e recomendações futuras
- [ ] Guia para adicionar novas tábuas

## Próxima Ação Imediata
Coletar fontes (Fase 0) e iniciar script Node de extração básica (Fase 1).

## Histórico
- 2025-08-16: Estrutura de tarefas criada.
