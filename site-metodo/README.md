# Site Método – Autenticação Unificada (Resumo Providers)

## Providers OAuth Configurados Condicionalmente

Os seguintes providers podem ser habilitados definindo suas variáveis no `.env` (ver `.env.example`):

| Provider           | Variáveis Necessárias                                                                                 | Observações                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Credentials        | AUTH_SECRET                                                                                           | Sempre ativo (login interno)          |
| Email (magic link) | SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM                                                           | Inserido após Credentials             |
| Google             | AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET                                                                    |                                       |
| GitHub             | AUTH_GITHUB_ID, AUTH_GITHUB_SECRET                                                                    |                                       |
| Apple              | AUTH_APPLE_ID, AUTH_APPLE_TEAM_ID, AUTH_APPLE_KEY_ID, AUTH_APPLE_PRIVATE_KEY                          | Converte \n escapado para quebra real |
| Twitter            | AUTH_TWITTER_ID, AUTH_TWITTER_SECRET                                                                  |                                       |
| Microsoft Entra ID | AUTH_MICROSOFT_ENTRA_ID_ID, AUTH_MICROSOFT_ENTRA_ID_SECRET, (opcional AUTH_MICROSOFT_ENTRA_ID_ISSUER) | ID provider: `microsoft-entra-id`     |

O componente `SocialLoginBox` consome `/api/auth/providers` para detectar quais providers estão ativos e desabilita os botões ausentes mostrando tooltip.

## Limpeza Realizada

- Removidas rotas manuais customizadas Microsoft.
- Removido endpoint duplicado `/api/auth/local/register`.
- Registro consolidado em `/api/auth/register` usando prisma singleton.

## Próximos Passos Sugeridos

- Refinar testes de integração (quando retomados).
- Adicionar indicadores de rate limit visual no formulário de registro caso backend implemente.

## Checklist para Novas Rotas/Páginas

### Antes de Criar uma Nova Rota
- [ ] **Verificar duplicação**: Buscar se a rota/página já existe no projeto
- [ ] **Definir permissões**: Qual objeto ABAC será usado (ex: `admin:logs`, `user:dashboard`)
- [ ] **Planejar navegação**: Como será acessada (sidebar, breadcrumb, link direto)
- [ ] **Definir estrutura**: Layout, componentes necessários, dados requeridos

### Durante o Desenvolvimento
- [ ] **Usar `ABACProtectedPage`**: Proteger páginas administrativas com HOC
- [ ] **Seguir padrão de componentes**: 
  - StatsCard para métricas (props: `title`, `value`, `description`, `icon`, `change`)
  - DataTable para listagens (props: `data`, `columns`, `searchKey`, `caption`, `aria-label`)
  - DatePickerWithRange para filtros de data
- [ ] **Implementar acessibilidade**:
  - Aria-labels em tabelas e botões
  - Caption em tabelas
  - Landmarks e roles adequados
- [ ] **Usar utilitários padronizados**:
  - `formatDateTime()` para datas
  - `fetchWithJsonError()` para requisições
  - `useStandardToast()` para mensagens
  - `useStreamingExport()` para exports

### Após Implementação
- [ ] **Executar type-check**: `npm run type-check`
- [ ] **Executar lint**: `npm run lint`
- [ ] **Testar acessibilidade**: Navegação por teclado, leitores de tela
- [ ] **Verificar responsividade**: Testar em diferentes resoluções
- [ ] **Documenter permissões**: Atualizar documentação ABAC se necessário
- [ ] **Testes básicos**: Smoke tests para funcionalidades críticas

### Integração com Backend
- [ ] **Seguir padrão de API**: Usar paginação server-side quando necessário
- [ ] **Implementar filtros**: Usar URLSearchParams consistente
- [ ] **Adicionar exports**: Suporte a CSV/JSON quando aplicável
- [ ] **Logging adequado**: Usar DatabaseLogger para ações importantes
- [ ] **Error handling**: Tratamento adequado de erros de rede/servidor

## Checklist Geral (Resumo Alto Nível)
- [ ] A) Pesquisa e Referências (40 fontes mín.)
- [x] B) Mapeamento completo de arquivos já existentes (aderência / análises / cálculos) ✅ (endpoints e componentes inventariados)
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
- [x] 1. Listar todos os endpoints `/api/aderencia-tabuas/*` e descrever função atual (upload, analise-exceljs, analise-python, chi-quadrado, configuracao-avancada, relatorio, salvar-dados, validar-upload)
- [x] 2. Inventariar componentes em `app/aderencia-tabuas/componentes/*` (FormularioUploadExcel, AnalisePrevia, TesteChiQuadrado, VisualizacaoResultados, RelatorioAderencia)
- [x] 3. Mapear tipos existentes relacionados a aderência e cálculos (interfaces, d.ts) ✅ (analise: `analise-excel.d.ts`, schemas zod em rotas upload/analise/salvar-dados, novo `aderencia-tabuas.d.ts`)
- [ ] 4. Identificar duplicações entre página `dashboard/aderencia-tabuas` e `aderencia-tabuas`
- [ ] 5. Padronizar nomenclatura ("aderencia-tabuas" vs "aderencia-tábuas")
- [x] 6. Definir interface canônica `MassaParticipante { matricula, idade, sexo, ... }` ✅ (arquivo `src/types/aderencia-tabuas.d.ts`)
- [x] 7. Definir interface `ObitoRegistro { matricula, dataObito, idade, sexo }` ✅ (arquivo tipos criado)
- [x] 8. Definir interface `TabuaMortalidadeLinha { idade, qx_m, qx_f }` ✅ (arquivo tipos criado)
 - [x] 9. Definir agregados: agrupamento por faixa etária (configurável) ✅ (util `agrupamento.ts` e rota atualizada)
 - [x] 10. Planejar enum / config de faixas etárias padrão (ex: 0-29, 30-39, ...) ✅ (tamanho configurável + heurística adaptativa fallback)
 - [x] 11. Especificar fórmula completa do Qui-Quadrado aplicada (Σ (O-E)^2 / E) ✅ (implementada em rota chi-quadrado com correção Yates opcional)
- [ ] 12. Calcular graus de liberdade corretos (k - 1 - m ajustes se existirem)
 - [x] 13. Implementar função p-valor (aprox. distribuição χ²) via mathjs ✅ (substituída por cálculo exato via gamma regularizada; futura validação cruzada com mathjs)
 - [x] 14. Validar extremos (E < 5 consolidar grupos) — regra estatística ✅ (consolidação automática na rota)
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

## Fontes (Coleta em andamento — meta ≥ 40)
1. TailAdmin Next.js Dashboard (estrutura de componentes, dark mode, layout responsivo) - https://github.com/TailAdmin/free-nextjs-admin-dashboard
2. Next Shadcn Admin Dashboard (colocation, theming presets, uso shadcn/ui) - https://github.com/arhamkhnz/next-shadcn-admin-dashboard
3. IBGE Tábuas Completas de Mortalidade 2023 (qx oficiais ambos sexos, homens, mulheres) - https://www.ibge.gov.br/estatisticas/sociais/populacao/9126-tabuas-completas-de-mortalidade.html
4. SUSEP Portal (normativos e supervisão atuária/previdência aberta) - https://www.gov.br/susep/pt-br
5. NIST Chi-Square Critical Values (valores críticos distribuição χ²) - (fonte a adicionar URL exata Tabela NIST)
6. Wikipedia Chi-squared distribution (definição, pdf, cdf) - https://en.wikipedia.org/wiki/Chi-squared_distribution
7. ExcelJS GitHub (parsing, streaming de planilhas) - https://github.com/exceljs/exceljs
8. OpenPyXL Documentation (Workbook, leitura células, performance) - https://openpyxl.readthedocs.io/
9. Node.js Child Process (spawn integração Python) - https://nodejs.org/api/child_process.html
10. WHO Mortality / Life Tables (validação cruzada biométrica) - (adicionar URL específica WHO life tables)
11. Society of Actuaries (SOA) Experience Studies (metodologias aderência) - (adicionar URL estudo experiência SOA relevante)
12. Math.js Library (funções estatísticas potenciais para χ²) - https://mathjs.org/
13. Journal referência regra E >= 5 (agregação categorias em χ²) - (adicionar citação acadêmica)
14. Documentação Tailwind CSS (design system utilitário) - https://tailwindcss.com/docs
15. shadcn/ui Docs (componentização acessível) - https://ui.shadcn.com/
16. TanStack Query Docs (data fetching, caching) - https://tanstack.com/query/latest
17. TanStack Table Docs (tabelas reativas para relatórios) - https://tanstack.com/table/latest
18. Zod Documentation (validação esquemas) - https://zod.dev/
19. Auth.js v5 Docs (controle acesso e sessão) - https://authjs.dev/
20. Prisma Docs (schema, migrations, performance) - https://www.prisma.io/docs

Restante das fontes (≥20 adicionais) a serem incluídas: literatura atuarial brasileira (IBGE metodologias, SUSEP normativos específicos de provisões, mortalidade previdenciária), papers de ajuste de tábuas, bibliotecas de estatística avançada em JS/Python (scipy.stats referência para validação), normas de testes estatísticos, guidelines de performance para parsing de grandes XLSX.

## Próximos Passos Imediatos
1. Coletar 40 fontes (Google acadêmico, docs libs) e preencher seção Fontes.
2. Mapear endpoints e componentes existentes (itens 1-4) e marcar no checklist.
3. Definir DTOs centrais (itens 6-13) e adicionar arquivo de tipos (sem substituir existentes).

(Arquivo gerado automaticamente — manter sincronizado com progresso.)
