# 10 – Auditoria Final & Validação

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.

> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.

## Diagnóstico
1. Possíveis problemas de lint, type-check, build, acessibilidade e documentação.

## Plano de Melhoria
1. Rodar lint e type-check em todo o projeto.
2. Garantir build sem erros.
3. Validar acessibilidade e responsividade.
4. Documentar todas as mudanças e decisões.

## Checklist Detalhado
1. [ ] Rodar lint e type-check em todo o projeto
2. [ ] Garantir build sem erros
3. [ ] Validar acessibilidade e responsividade
4. [ ] Documentar todas as mudanças
5. [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
6. [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
7. [ ] Acessar manualmente todos os links/endpoints e corrigir eventuais erros

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
```

> **NUNCA pule a etapa de validação manual nos links/endpoints e a revisão de variáveis!**

## Referências Obrigatórias e Atualizadas

### Auditoria, Validação, Lint, Type-Check, Build, Acessibilidade e Documentação
1. [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
2. [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
3. [Next.js Accessibility](https://nextjs.org/docs/architecture/accessibility)
4. [Next.js Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)
5. [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security)
6. [Next.js Analytics](https://nextjs.org/docs/app/guides/analytics)
7. [Next.js OpenTelemetry](https://nextjs.org/docs/app/guides/open-telemetry)
8. [Next.js Upgrading](https://nextjs.org/docs/app/guides/upgrading)
9. [Next.js Codemods](https://nextjs.org/docs/app/guides/upgrading/codemods)
10. [ESLint - Linting Moderno](https://eslint.org/docs/latest/use/getting-started)
11. [TypeScript - Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
12. [axe DevTools - Acessibilidade](https://www.deque.com/axe/devtools/)
13. [Google Lighthouse - Acessibilidade e Performance](https://developer.chrome.com/docs/lighthouse/overview/)
14. [WCAG 2.2 - Acessibilidade Web](https://www.w3.org/WAI/standards-guidelines/wcag/)
15. [Markdown Guide - Documentação](https://www.markdownguide.org/)
16. [shadcn/ui - Componentes UI](https://ui.shadcn.com/docs/components)
17. [Radix UI - Acessibilidade](https://www.radix-ui.com/primitives/docs/components/tabs#accessibility)
18. [TanStack Table - Tabelas Avançadas](https://tanstack.com/table/v8/docs/guide)

### Novas Referências e Melhores Práticas (2025)
19. [Next.js Forms](https://nextjs.org/docs/app/guides/forms)
20. [Next.js Internationalization](https://nextjs.org/docs/app/guides/internationalization)
21. [Next.js Testing](https://nextjs.org/docs/app/guides/testing)
22. [Next.js Authentication](https://nextjs.org/docs/app/guides/authentication)
23. [Next.js Caching](https://nextjs.org/docs/app/guides/caching)
24. [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
25. [Next.js Logging](https://nextjs.org/docs/app/building-your-application/optimizing/logging)
26. [OpenTelemetry - Observabilidade](https://opentelemetry.io/docs/instrumentation/js/)
27. [Sentry - Monitoramento de Erros](https://docs.sentry.io/platforms/node/)
28. [Datadog - Logging Node.js](https://docs.datadoghq.com/logs/log_collection/nodejs/)

---

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. Novos links de auditoria, validação, acessibilidade, lint, type-check, build, revisão manual e documentação foram incluídos.
3. Todos os tópicos abordados nas tarefas e sub-tarefas possuem referência moderna e oficial.
4. O ciclo de validação e revisão está reforçado e atualizado.
