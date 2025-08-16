---
applyTo: '**'
---

# Memória de Tarefas Ativas

## Front-end (FE) Checklist Atual
- ✅ FE-1 concluído: página unificada `/admin/logs` criada.
- ✅ FE-2 concluído: ABAC aplicado em aderência, auditoria e logs pages.
- ✅ FE-3 concluído: Export padronizado implementado em `/api/admin/audit-logs?export=csv|json`.
- FE-4 pendente: Padronização StatsCard (componente já existe, verificar uso consistente).
- FE-5 parcial: DataTable melhorada com acessibilidade (caption, aria-label), aplicar em outras páginas.
- FE-6 completo: DatePickerWithRange já existe e está sendo usado.
- FE-7 pendente: Melhorar UX de paginação server-side.
- ✅ FE-8, FE-9, FE-12 concluídos (helpers fetchWithJsonError, dateFormat; limpeza console.logs).
- ✅ FE-10 parcial: Acessibilidade implementada em DataTable, expandir para outros componentes.
- FE-11 pendente: Export streaming com UI de progresso.
- ✅ FE-13 concluído: Apenas 3 imports @prisma/client restantes em arquivos de tipagem (correto).
- FE-14 em progresso: Lint warnings reduzidos significativamente.
- FE-15 completo: Política de scripts documentada.
- FE-16 pendente: Testes mínimos.
- FE-17 pendente: Centralizar uso PushNotificationService.
- ✅ FE-18 concluído: Links do sidebar atualizados para `/admin/logs`.
- ✅ FE-19 concluído: Sistema de toast padronizado criado (`useStandardToast`).
- FE-20 pendente: Checklist de revisão antes de nova rota.

## Aderência Tábuas Progresso
- Inventário endpoints e componentes concluído (itens 1-3).
- Tipos canônicos criados (`aderencia-tabuas.d.ts`).
- Agrupamento + consolidação E<5 implementados (item 9,14).
- P-valor exato via gamma regularizada (item 13 substituindo aprox.).
- Próximos: graus de liberdade refinado (12), normalização ExcelJS (15-19), pipeline Python wrapper (23-24,47), unificação contrato DTO (25), testes (38-40), export streaming (30-31), logs e métricas (32,46).

## Utilidades Criadas
- `src/utils/aderenciaAgrupamento.ts`
- `src/utils/fetchWithJsonError.ts`
- `src/utils/dateFormat.ts`

Manter esta memória sincronizada conforme itens forem concluídos.
---
applyTo: '**'
---

# Memória de Tarefas - Consolidação ABAC

- [ ] Criar `checkPermissionDetailed` no enforcer (alias para `checkABACPermission`).
- [ ] Remover exportações de `isAdmin`, `canAccess`, `hasPermission` do enforcer público.
- [ ] Atualizar `src/lib/abac/index.ts` para exportar `checkPermissionDetailed`.
- [ ] Atualizar chamadas server-side que usavam `checkABACPermission` com variável `hasPermission` para `permissionResult`/`checkPermissionDetailed` nas rotas críticas (admin/users, notifications, auth/session, auth/local/session, etc.).
- [ ] Adicionar logs em `XLOGS/abac-enforcer.log` e `XLOGS/abac-check.log` (rota) para rastreamento.
- [ ] Atualizar todos os consumidores restantes que importavam os nomes antigos (varredura final e substituição se necessário).
- [ ] Atualizar documentação e README com a nova API e guideline de uso (client vs server).
- [ ] Refatorar frontend (navbar, dashboard button, sidebar cliente) para usar `checkClientPermission` / `checkClientPermissionDetailed` conforme necessidade.
- [ ] Rodar testes, lint e type-check; corrigir quebras se aparecerem.

Última atualização: automática durante run agent.



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