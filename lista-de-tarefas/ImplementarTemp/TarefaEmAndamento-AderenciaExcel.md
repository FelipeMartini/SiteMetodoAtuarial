# Tarefa Em Andamento — Aderência Tábuas, ExcelJS + OpenPyXL, Cálculos Atuariais

## Escopo
Unificar e aprofundar:
- Pipeline de importação e análise de massa (Excel) via ExcelJS (Node) e OpenPyXL (Python)
- Persistência estruturada (normalização massa, óbitos, tábuas, cálculos intermediários)
- Cálculo de aderência (Qui-Quadrado) completo, validado e testado
- Página unificada de Aderência (reuso sem duplicar rotas existentes `aderencia-tabuas`)
- Integração ABAC (permissões de acesso a dados sensíveis)
- Exportações (CSV/JSON) e relatórios

## Premissas / Regras
- Não duplicar páginas: reutilizar `/app/aderencia-tabuas` componentes; criar sub-componentes reutilizáveis se necessário.
- Evitar criar nova rota se uma existente puder ser estendida (`/api/aderencia-tabuas/*`).
- Operações pesadas: preparar arquitetura para background job (fila futura) mas manter síncrono otimizado por enquanto com streaming incremental.
- Formato de datas e números padronizado (util central de formatação).
- Importações grandes: usar chunking e backpressure (limite de memória) — planejar.

## Checklist Geral (Resumo Alto Nível)
- [ ] A) Pesquisa e Referências (40 fontes mín.)
- [ ] B) Mapeamento completo de arquivos já existentes (aderência / análises / cálculos)
- [ ] C) Definir modelo de dados intermediário (normalização massa + óbitos + qx)
- [ ] D) Fluxo ExcelJS: upload -> parsing -> normalização -> preview -> persistência
- [ ] E) Fluxo OpenPyXL: script Python -> JSON -> API -> unificação contrato
- [ ] F) Cálculo Qui-Quadrado consolidado (grupo etário, graus liberdade, p-valor)
- [ ] G) Página aderência: UI integrada (upload, progresso, preview, análise, relatório, export)
- [ ] H) Export CSV/JSON streaming
- [ ] I) Testes unitários (parsing, qui-quadrado, normalização)
- [ ] J) Testes integração (upload ciclo completo)
- [ ] K) Documentação técnica (06-analise-excel.md + README seção)
- [ ] L) Hardening & validação (limites, erros, logs)

## Detalhamento de Tarefas (40+ Itens)
```markdown
- [ ] 1. Listar todos os endpoints `/api/aderencia-tabuas/*` e descrever função atual
- [ ] 2. Inventariar componentes em `app/aderencia-tabuas/componentes/*`
- [ ] 3. Mapear tipos existentes relacionados a aderência e cálculos (interfaces, d.ts)
- [ ] 4. Identificar duplicações entre página `dashboard/aderencia-tabuas` e `aderencia-tabuas`
- [ ] 5. Padronizar nomenclatura ("aderencia-tabuas" vs "aderencia-tábuas")
- [ ] 6. Definir interface canônica `MassaParticipante { matricula, idade, sexo, ... }`
- [ ] 7. Definir interface `ObitoRegistro { matricula, dataObito, idade, sexo }`
- [ ] 8. Definir interface `TabuaMortalidadeLinha { idade, qx_m, qx_f }`
- [ ] 9. Definir agregados: agrupamento por faixa etária (configurável)
- [ ] 10. Planejar enum / config de faixas etárias padrão (ex: 0-29, 30-39, ...)
- [ ] 11. Especificar fórmula completa do Qui-Quadrado aplicada (Σ (O-E)^2 / E)
- [ ] 12. Calcular graus de liberdade corretos (k - 1 - m ajustes se existirem)
- [ ] 13. Implementar função p-valor (aprox. distribuição χ²) via mathjs
- [ ] 14. Validar extremos (E < 5 consolidar grupos) — regra estatística
- [ ] 15. Implementar normalização ExcelJS (sheet -> arrays tipados)
- [ ] 16. Extrair planilhas relevantes (massa, óbitos, qx, cálculos massa) de forma resiliente
- [ ] 17. Validar colunas obrigatórias e formatar erros amigáveis
- [ ] 18. Criar função de detecção automática de sexo (M/F) se codificado
- [ ] 19. Implementar limpeza de registros inconsistentes (idades inválidas, qx fora de 0..1)
- [ ] 20. Criar pipeline incremental (yield batches) para grandes volumes
- [ ] 21. Persistir massa normalizada (tabela existente ou nova?) — planejar, não migrar sem aprovação
- [ ] 22. Persistir tábuas importadas temporariamente (cache) vs tabela definitiva
- [ ] 23. Sincronizar pipeline Python: script recebe caminho arquivo e retorna JSON normalizado
- [ ] 24. Criar wrapper Node `spawnPythonAnalise()` (timeout, captura stderr)
- [ ] 25. Unificar contrato: ambos fluxos resultam em `AnaliseAderenciaDTO`
- [ ] 26. Calcular estatísticas agregadas (totais, médias, variâncias se necessário)
- [ ] 27. Implementar cálculo Qui-Quadrado consolidado multi-sexo (separado e combinado)
- [ ] 28. Gerar conclusão (Aderente / Não Aderente) com valor crítico e p-valor
- [ ] 29. Implementar relatório detalhado (estrutura: Introdução, Dados, Metodologia, Resultados, Conclusão)
- [ ] 30. Implementar export CSV (massa normalizada, agregados, resultados)
- [ ] 31. Implementar export JSON (estrutura completa com metadados)
- [ ] 32. Adicionar logs (DatabaseLogger) em cada fase crítica do pipeline
- [ ] 33. Padronizar tratamento de erros com códigos (UPLOAD_INVALIDO, FORMATO_INCOMPATIVEL, CALCULO_FALHA)
- [ ] 34. Acessibilidade UI (aria-live para progresso)
- [ ] 35. Estados de loading granulares (upload, parsing, cálculo, relatório)
- [ ] 36. Criar hook `useAderenciaTabuas` (estado global + ações)
- [ ] 37. Integrar com Zustand slice existente se aplicável (excelSlice?)
- [ ] 38. Implementar testes unitários para normalização qx e agrupamento faixas
- [ ] 39. Teste unitário para função quiQuadrado (caso sintético conhecido)
- [ ] 40. Teste integração: upload -> análise -> relatório -> export
- [ ] 41. Documentar limitações (memória, tempo, necessidade de fila futura)
- [ ] 42. Criar seção de segurança (tratamento de arquivos potencialmente maliciosos)
- [ ] 43. Verificar limpeza de arquivos temporários pós-processo
- [ ] 44. Adicionar verificação ABAC (recurso: 'aderencia:tabuas', ação read/analyze)
- [ ] 45. Garantir que endpoints não exponham dados sensíveis sem autorização
- [ ] 46. Adicionar métricas simples (tempo parsing, tempo cálculo) logadas
- [ ] 47. Incluir feature flag futura (ativar pipeline Python) — placeholder boolean
- [ ] 48. Criar doc 06-analise-excel.md (aprimorar existente) com fluxos e exemplos
- [ ] 49. Criar diagrama de fluxo (ASCII / mermaid) no doc
- [ ] 50. Checklist final de revisão antes merge (lint, type-check, testes, docs)
```

## Fontes (Placeholder – coletar na etapa A)
Início da coleta (2/40):
1. TailAdmin Next.js Dashboard (estrutura de componentes, dark mode, layout responsivo) - https://github.com/TailAdmin/free-nextjs-admin-dashboard
2. Next Shadcn Admin Dashboard (colocation, theming presets, uso shadcn/ui) - https://github.com/arhamkhnz/next-shadcn-admin-dashboard

Demais referências estatística, mortalidade, chi-square, ExcelJS, OpenPyXL, tábuas atuariais oficiais (IBGE, SUSEP, SOA, OMS) serão adicionadas na conclusão da etapa A.

## Próximos Passos Imediatos
1. Coletar 40 fontes (Google acadêmico, docs libs) e preencher seção Fontes.
2. Mapear endpoints e componentes existentes (itens 1-4) e marcar no checklist.
3. Definir DTOs centrais (itens 6-13) e adicionar arquivo de tipos (sem substituir existentes).

(Arquivo gerado automaticamente — manter sincronizado com progresso.)
