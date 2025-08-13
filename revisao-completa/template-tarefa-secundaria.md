
# XX – [Título da Subtarefa]

> **Se a subtarefa envolver cálculos ou tabelas atuariais, padronize sempre como "Tábua de Mortalidade". Inclua instruções para importação/exportação (Excel/PDF) e siga o checklist incremental abaixo.**

> **IMPORTANTE:**
> - O progresso de cada subtarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal correspondente;
>   2. No checklist deste template de subtarefa;
>   3. No arquivo específico da subtarefa (ex: 07-calculos-atuariais.md).
> - Isso garante rastreabilidade e validação cruzada.

> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.
## Checklist Incremental para Tábua de Mortalidade (se aplicável)

- [ ] Implementar importação de Tábua de Mortalidade (Excel)
- [ ] Implementar exportação de Tábua de Mortalidade (Excel/PDF)
- [ ] Validar integridade e formato das tábuas importadas
- [ ] Garantir integração das tábuas com os cálculos
- [ ] Adicionar testes unitários para cálculos e importação/exportação
- [ ] Documentar exemplos de uso e referências obrigatórias
- [ ] Validar manualmente todos os fluxos de importação, exportação e cálculo
- [ ] Seguir ciclo obrigatório: type-check, lint, build, validação manual
- [ ] Consultar e registrar todas as referências técnicas e atuariais utilizadas
## Referências Obrigatórias para Tábuas de Mortalidade

- [Society of Actuaries](https://www.soa.org/resources/research-reports/)
- [International Actuarial Association](https://www.actuaries.org/)
- [ExcelJS](https://github.com/exceljs/exceljs)
- [pdf-lib](https://pdf-lib.js.org/)

## Diagnóstico
- (Descreva o diagnóstico do problema ou contexto atual)

## Plano de Melhoria
- (Liste as ações de melhoria planejadas)

## Checklist Detalhado
1. [ ] (Item 1)
2. [ ] (Item 2)
3. [ ] (Item 3)
4. [ ] (Item 4)
5. [ ] (Item 5)
6. [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
7. [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros

## Checklist Incremental de Implementação e Validação Manual

Para cada página, componente ou endpoint alterado nesta subtarefa:

- [ ] Implementar/refatorar seguindo o padrão do projeto referência e instruções técnicas abaixo
- [ ] Garantir responsividade e acessibilidade
- [ ] Validar integração visual/técnica
- [ ] Garantir tipagem estrita (sem any, unknown tipado, tipos oficiais)
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos
- [ ] Revisar variáveis, props e funções para evitar conflitos e garantir segurança
- [ ] **Executar teste manual completo:**
   - Navegar/interagir por todos os fluxos, formulários, tabelas, widgets, dark/light mode, etc
   - Validar todos os endpoints, links, navegação, feedbacks visuais e mensagens de erro
   - Corrigir qualquer erro encontrado antes de avançar
- [ ] Só marcar como concluído após validação manual 100% e ciclo de validação completo

## Instruções Técnicas (OBRIGATÓRIAS)

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
9. Regra obrigatória de tipagem:
   1. Não utilize `any` em hipótese alguma.
   2. Tipos `unknown` devem ser tipados corretamente e explicitamente.
   3. Sempre prefira e estenda tipagens oficiais das bibliotecas/frameworks quando necessário.
   4. Revise e corrija a tipagem de todas as funções, variáveis e props.
```

> **NUNCA pule a etapa de validação manual nos links/endpoints, a revisão de variáveis e a análise do projeto referência!**

## Referências Obrigatórias e Atualizadas

- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js Accessibility](https://nextjs.org/docs/architecture/accessibility)
- [ESLint - Linting Moderno](https://eslint.org/docs/latest/use/getting-started)
- [TypeScript - Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [WCAG 2.2 - Acessibilidade Web](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. O ciclo de validação e revisão está reforçado e atualizado.
