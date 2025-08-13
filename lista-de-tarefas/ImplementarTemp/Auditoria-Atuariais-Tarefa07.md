# Auditoria e Plano de Melhoria – Cálculos Atuariais (Tarefa 07)

## 1. Funções Atuariais Implementadas

### `src/lib/atuarial/calculadora.ts`
- `calcularProbabilidadeSobrevivencia`
- `calcularExpectativaVida`
- `calcularPremioUnicoVida`
- `calcularRendaVitalicia`
- `calcularReservaMatemática`
- `calcularCompleto`
- Utiliza tabela AT-2000 hardcoded (não dinâmica)

### `src/lib/atuarial/calculos-financeiros.ts`
- `valorPresenteAnuidade`
- `valorFuturoAnuidade`
- `premioNivelado`
- `reservaTecnica`
- `premioComCarregamento`
- `calcularTIR`
- `calcularVPL`
- `duracaoMacaulay`
- `analiseSensibilidade`
- `equivalenciaAtuarial`
- `simulacaoMonteCarlo`
- `RelatoriosAtuariais.gerarRelatorioCompleto`

## 2. Lacunas e Pontos Críticos
- ❌ Não há modelo de banco de dados para tábuas atuariais (tabelas de mortalidade).
- ❌ Não há importação de tábuas via Excel (ExcelJS).
- ❌ Cálculos usam tabela hardcoded, não suportam múltiplas tábuas nem atualização dinâmica.
- ❌ UI apenas com placeholders para importação e gestão de tábuas.
- ❌ Não há versionamento, histórico ou validação de tábuas importadas.
- ❌ Não há integração entre importação, banco e cálculos.

## 3. Plano de Melhoria Detalhado

### 3.1. Banco de Dados
- [ ] Criar modelo Prisma `MortalityTable` e `MortalityRate`:
  - `MortalityTable`: id, nome, ano, fonte, sexo, status, dataImportacao, etc.
  - `MortalityRate`: id, tableId, idade, sexo, qx, lx, ex, etc.
- [ ] Permitir múltiplas tábuas (BR-EMS, AT-2000, IBGE, customizadas).

### 3.2. Importação de Tábuas (ExcelJS)
- [ ] Implementar função de importação de Excel para tábuas atuariais.
- [ ] Validar formato, tipos e duplicidade.
- [ ] Salvar dados normalizados no banco.
- [ ] Logar importações e erros.

### 3.3. Integração com Cálculos
- [ ] Refatorar calculadora para buscar tábuas do banco.
- [ ] Permitir seleção de tábua na UI/calculadora.
- [ ] Garantir fallback para tábua padrão.

### 3.4. UI/UX
- [ ] Implementar módulo de gestão de tábuas (importar, listar, ativar/desativar, excluir).
- [ ] Exibir metadados, histórico e status das tábuas.
- [ ] Permitir download/exportação de tábuas.

### 3.5. Documentação e Testes
- [ ] Documentar exemplos de importação e uso.
- [ ] Garantir ciclo de validação (type-check, lint, build, limpeza).
- [ ] Adicionar logs e notificações permanentes para importações e erros.

## 4. Referências Obrigatórias e Melhores Práticas

1. https://www.soa.org/resources/research-reports/
2. https://www.actuaries.org/
3. https://www.casact.org/
4. https://www.issa.int/
5. https://www.actuary.com/
6. https://www.actuarialoutpost.com/
7. https://www.actuaries.digital/
8. https://www.actuaries.org.uk/
9. https://www.aiforactuaries.org/
10. https://actuaries.org/events-library
11. https://www.w3.org/WAI/standards-guidelines/wcag/
12. https://nextjs.org/docs/app/getting-started/layouts-and-pages
13. https://nextjs.org/docs/app/guides/lazy-loading
14. https://eslint.org/docs/latest/use/getting-started
15. https://www.typescriptlang.org/docs/handbook/intro.html
16. https://authjs.dev/getting-started
17. https://www.npmjs.com/package/winston
18. https://www.elastic.co/elastic-stack
19. https://socket.io/docs/v4/
20. https://www.npmjs.com/package/web-push
21. https://react.email/docs
22. https://mjml.io/
23. https://www.radix-ui.com/primitives/docs/components/tabs#accessibility
24. https://ui.shadcn.com/docs/components
25. https://tanstack.com/table/v8/docs/guide
26. https://www.npmjs.com/package/otplib
27. https://www.twilio.com/docs/authy/api
28. https://www.w3.org/TR/WCAG21/
29. https://www.w3.org/TR/WCAG22/
30. https://nextjs.org/docs/app/guides/production-checklist
31. https://nextjs.org/docs/architecture/accessibility
32. https://nextjs.org/docs/app/guides/testing
33. https://nextjs.org/docs/app/guides/authentication
34. https://nextjs.org/docs/app/guides/data-security
35. https://nextjs.org/docs/app/guides/environment-variables
36. https://nextjs.org/docs/app/getting-started/error-handling
37. https://nextjs.org/docs/app/guides/caching
38. https://nextjs.org/docs/app/guides/forms
39. https://nextjs.org/docs/app/guides/internationalization
40. https://nextjs.org/docs/app/guides/open-telemetry
41. https://nextjs.org/docs/app/guides/analytics
42. https://nextjs.org/docs/app/guides/upgrading
43. https://nextjs.org/docs/app/guides/upgrading/codemods

---

## Checklist de Implementação

```markdown
- [ ] Modelos Prisma para tábuas atuariais
- [ ] Função de importação ExcelJS para tábuas
- [ ] Integração dos cálculos com tábuas do banco
- [ ] UI de gestão/importação de tábuas
- [ ] Documentação e exemplos de uso
- [ ] Logs e notificações permanentes
- [ ] Validação: type-check, lint, build, limpeza
```

---

> **Status:** Auditoria concluída. Plano de melhoria detalhado pronto para execução.
