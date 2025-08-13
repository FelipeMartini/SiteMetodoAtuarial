

# 07 – Cálculos Atuariais

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.

> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.

## Diagnóstico e Auditoria Completa (2025)

### 1. Funções Atuariais Implementadas

**src/lib/atuarial/calculadora.ts**
- calcularProbabilidadeSobrevivencia
- calcularExpectativaVida
- calcularPremioUnicoVida
- calcularRendaVitalicia
- calcularReservaMatemática
- calcularCompleto
- Utiliza tabela AT-2000 hardcoded (não dinâmica)

**src/lib/atuarial/calculos-financeiros.ts**
- valorPresenteAnuidade
- valorFuturoAnuidade
- premioNivelado
- reservaTecnica
- premioComCarregamento
- calcularTIR
- calcularVPL
- duracaoMacaulay
- analiseSensibilidade
- equivalenciaAtuarial
- simulacaoMonteCarlo
- RelatoriosAtuariais.gerarRelatorioCompleto

### 2. O que está implementado
- Cálculos básicos de seguro de vida, anuidades, reservas, expectativa de vida, sensibilidade, equivalência e simulação.
- Utilização de bibliotecas modernas (`decimal.js`, `financejs`).
- Estrutura de código modular e tipada.
- Funções utilitárias para formatação de moeda e percentual.
- UI com abas para calculadora, tabelas de mortalidade e relatórios (mas apenas placeholders).
- Exportação de dados para Excel já implementada para outros módulos (não para tábuas atuariais).

### 3. O que falta implementar
- **Importação de tábuas atuariais via Excel:** Não existe função para importar tábuas de mortalidade do Excel para o sistema.
- **Exportação de tábuas para Excel e PDF:** Não há função para exportar as tábuas atuariais cadastradas.
- **Modelo de banco de dados para tábuas:** Não existe tabela/modelo no Prisma para armazenar tábuas de mortalidade (tudo é hardcoded).
- **Gestão de múltiplas tábuas:** Não é possível cadastrar, editar, ativar/desativar ou versionar diferentes tábuas (ex: BR-EMS, IBGE, customizadas).
- **Integração dos cálculos com tábuas do banco:** Os cálculos não buscam dados do banco, apenas da tabela fixa no código.
- **UI funcional para importação/exportação:** As abas de tabelas e relatórios são apenas visuais, sem backend ou lógica real.
- **Logs e notificações permanentes:** Não há registro de importações, exportações ou erros relacionados a tábuas.
- **Documentação de exemplos de uso real:** Não há exemplos práticos de importação/exportação de tábuas na documentação.

### 4. Pontos críticos e recomendações
- O sistema está limitado a uma única tábua fixa, o que inviabiliza uso profissional e atualização conforme normas SUSEP/IBGE.
- Não há rastreabilidade, versionamento ou histórico das tábuas utilizadas.
- A ausência de importação/exportação dificulta integração com outros sistemas e auditoria.
- A UI não permite ao usuário gerenciar as tábuas de forma autônoma.
- Falta integração entre backend (banco) e frontend (UI/calculadora).

### 5. Resumo
- **Cálculos atuariais básicos estão implementados e funcionais, mas dependem de uma tabela fixa.**
- **Faltam recursos essenciais para importação, exportação, gestão e integração de tábuas atuariais.**
- **A estrutura do código é moderna e modular, facilitando a expansão, mas a funcionalidade de tábuas precisa ser priorizada para uso real.**

---

---

## Plano de Melhoria Detalhado


- [ ] Criar modelo Prisma `TabuaMortalidade` e `TaxaMortalidade`:
	- `TabuaMortalidade`: id, nome, ano, fonte, sexo, status, data_importacao, observacao.
	- `TaxaMortalidade`: id, tabua_id, idade, sexo, qx, lx, ex, observacao.
- [ ] Permitir múltiplas tábuas (BR-EMS, AT-2000, IBGE, customizadas).



### 2. Importação e Exportação de Tábuas (ExcelJS/PDF)
- [ ] Implementar função de importação de Excel para tábuas atuariais (campos: nome, ano, fonte, sexo, status, data_importacao, idade, qx, lx, ex, observacao).
- [ ] Implementar função de exportação de tábuas para Excel (campos em português).
- [ ] Implementar função de exportação de tábuas para PDF (campos em português, ex: pdf-lib).
- [ ] Validar formato, tipos e duplicidade (campos em português).
- [ ] Salvar dados normalizados no banco (campos em português).
- [ ] Logar importações, exportações e erros (mensagens em português).


### 3. Integração com Cálculos
- [ ] Refatorar calculadora para buscar tábuas do banco (usando nomes e campos em português).
- [ ] Permitir seleção de tábua na UI/calculadora (exibir nomes em português).
- [ ] Garantir fallback para tábua padrão.


### 4. UI/UX
- [ ] Implementar módulo de gestão de tábuas (importar, listar, ativar/desativar, excluir) com campos e labels em português.
- [ ] Exibir metadados, histórico e status das tábuas (campos em português).
- [ ] Permitir download/exportação de tábuas (campos em português).


### 5. Documentação e Testes
- [ ] Documentar exemplos de importação e uso (campos e prints em português).
- [ ] Garantir ciclo de validação (type-check, lint, build, limpeza).
- [ ] Adicionar logs e notificações permanentes para importações e erros (mensagens em português).

---

## Checklist de Implementação



```markdown
- [ ] Modelos Prisma para tábuas de mortalidade (`TabuaMortalidade`, `TaxaMortalidade`)
- [ ] Função de importação ExcelJS para tábuas de mortalidade (campos em português)
- [ ] Função de exportação de tábuas de mortalidade para Excel (campos em português)
- [ ] Função de exportação de tábuas de mortalidade para PDF (campos em português)
- [ ] Integração dos cálculos com tábuas de mortalidade do banco (campos em português)
- [ ] UI de gestão/importação/exportação de tábuas de mortalidade (labels/campos em português)
- [ ] Documentação e exemplos de uso (campos em português)
- [ ] Logs e notificações permanentes (mensagens em português)
- [ ] Validação: type-check, lint, build, limpeza
```

---

## Referências Obrigatórias e Atualizadas

> **⚠️ Siga SEMPRE o ciclo de validação abaixo:**
> 1. Corrija TODOS os erros de type-check (TypeScript)
> 2. Corrija TODOS os erros/avisos de lint
> 3. Corrija TODOS os erros de build
> 4. Repita o ciclo até zerar erros
> 5. **Antes de acessar manualmente os links/endpoints, execute uma limpeza completa de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos do processo**
> 6. **Revise todas as variáveis e seus usos atuais para garantir que nada foi quebrado, principalmente em autenticação e endpoints seguros**
> 7. Só então acesse TODOS os links/endpoints no navegador e corrija eventuais erros


> **OBRIGATÓRIO:**
> - Não utilize `any` em hipótese alguma no código.
> - Tipos `unknown` devem ser tipados corretamente e explicitamente.
> - Sempre prefira e estenda tipagens oficiais das bibliotecas/frameworks quando necessário.
> - Revise e corrija a tipagem de todas as funções, variáveis e props.

## Destaque Visual e Reforço de Obrigatoriedade

```
🚨 OBRIGATÓRIO: Siga SEMPRE o ciclo de validação para cada alteração:
1. Corrija TODOS os erros de type-check (TypeScript)
2. Corrija TODOS os erros/avisos de lint
3. Corrija TODOS os erros de build
4. Repita o ciclo até zerar erros
5. Execute limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos
6. Revise todas as variáveis e seus usos para evitar conflitos, principalmente em autenticação e endpoints seguros
7. ACESSE TODOS os links/endpoints no navegador e corrija eventuais erros
8. Só avance após tudo estar 100% limpo!
```

> **NUNCA pule a etapa de validação manual nos links/endpoints e a revisão de variáveis!**



## Referências Obrigatórias e Atualizadas

1. https://www.soa.org/resources/research-reports/
2. https://www.actuaries.org/
3. https://www.casact.org/
4. https://www.issa.int/
5. https://www.actuarialoutpost.com/
6. https://www.actuaries.digital/
7. https://www.actuaries.org.uk/
8. https://www.aiforactuaries.org/
9. https://actuaries.org/events-library
10. https://www.w3.org/WAI/standards-guidelines/wcag/
11. https://nextjs.org/docs/app/getting-started/layouts-and-pages
12. https://nextjs.org/docs/app/guides/lazy-loading
13. https://eslint.org/docs/latest/use/getting-started
14. https://www.typescriptlang.org/docs/handbook/intro.html
15. https://authjs.dev/getting-started
16. https://www.npmjs.com/package/winston
17. https://www.elastic.co/elastic-stack
18. https://socket.io/docs/v4/
19. https://www.npmjs.com/package/web-push
20. https://react.email/docs
21. https://mjml.io/
22. https://www.radix-ui.com/primitives/docs/components/tabs#accessibility
23. https://ui.shadcn.com/docs/components
24. https://tanstack.com/table/v8/docs/guide
25. https://www.npmjs.com/package/otplib
26. https://www.twilio.com/docs/authy/api
27. https://www.w3.org/TR/WCAG21/
28. https://www.w3.org/TR/WCAG22/
29. https://nextjs.org/docs/app/guides/production-checklist
30. https://nextjs.org/docs/architecture/accessibility
31. https://nextjs.org/docs/app/guides/testing
32. https://nextjs.org/docs/app/guides/authentication
33. https://nextjs.org/docs/app/guides/data-security
34. https://nextjs.org/docs/app/guides/environment-variables
35. https://nextjs.org/docs/app/getting-started/error-handling
36. https://nextjs.org/docs/app/guides/caching
37. https://nextjs.org/docs/app/guides/forms
38. https://nextjs.org/docs/app/guides/internationalization
39. https://nextjs.org/docs/app/guides/open-telemetry
40. https://nextjs.org/docs/app/guides/analytics
41. https://nextjs.org/docs/app/guides/upgrading
42. https://nextjs.org/docs/app/guides/upgrading/codemods
43. https://www.actuaries.asn.au/research-analysis/actuaries-digital
44. https://actuaries.org.uk/formulae-and-tables-2025-edition?utm_source=ifoa+website&utm_medium=hero+slot&utm_campaign=newformulaebook&utm_term=launch
45. https://actuaries.org.uk/events/graduating-mortality-base-tables-theory-and-practice-part-one/
46. https://actuaries.org.uk/events/graduating-mortality-base-tables-theory-and-practice-part-two/
47. https://www.casact.org/publications-research
48. https://www.casact.org/about/global-connections
49. https://www.casact.org/publications-research
50. https://www.aiforactuaries.org/

---

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. Novos links de melhores práticas, acessibilidade, autenticação, logging, notificações, e-mail, tabelas, MFA/2FA, UI e testes foram incluídos.
3. Todos os tópicos abordados nas tarefas e sub-tarefas possuem referência moderna e oficial.
4. O ciclo de validação e revisão está reforçado e atualizado.
