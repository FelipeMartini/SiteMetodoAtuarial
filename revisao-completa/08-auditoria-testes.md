# 09 – Auditoria Final & Validação Completa

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.
>
> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

## Checklist Detalhado de Auditoria & Validação
- [ ] Rodar lint e type-check em todo o projeto, até que não haja mais erros
- [ ] Garantir build sem erros, repetindo processo até não ter mais erros
- [ ] Validar acessibilidade e responsividade
- [ ] Documentar todas as mudanças novas do projeto, analisando e atualizando toda documentação
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Acessar manualmente todos os links/endpoints e corrigir eventuais erros (admin dashboard, admin abac, área cliente, cálculos atuariais, logs, auditoria, notificações)
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os fluxos
- [ ] Validar integração com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

## Plano de Implementação Auditoria & Validação
1. Possíveis problemas de lint, type-check, build, acessibilidade e documentação.

## Plano de Melhoria
1. Rodar lint e type-check em todo o projeto.
2. Garantir build sem erros.
3. Validar acessibilidade e responsividade.
4. Documentar todas as mudanças e decisões.

## Instruções Técnicas (OBRIGATÓRIAS)

> ⚠️ Siga SEMPRE o ciclo de validação abaixo:
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
> - Garanta que todos os testes estejam atualizados e cobrem todos os fluxos críticos.
> - Documente cada função, parâmetro e resultado esperado de forma clara e rastreável.

## Referências Modernas
- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js Accessibility](https://nextjs.org/docs/architecture/accessibility)
- [Next.js Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)
- [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security)
- [Next.js Analytics](https://nextjs.org/docs/app/guides/analytics)
- [Next.js OpenTelemetry](https://nextjs.org/docs/app/guides/open-telemetry)
- [Next.js Upgrading](https://nextjs.org/docs/app/guides/upgrading)
- [Next.js Codemods](https://nextjs.org/docs/app/guides/upgrading/codemods)
- [ESLint - Linting Moderno](https://eslint.org/docs/latest/use/getting-started)
- [TypeScript - Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [axe DevTools - Acessibilidade](https://www.deque.com/axe/devtools/)
- [Google Lighthouse - Acessibilidade e Performance](https://developer.chrome.com/docs/lighthouse/overview/)
- [WCAG 2.2 - Acessibilidade Web](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [shadcn/ui - Componentes UI](https://ui.shadcn.com/docs/components)
- [Radix UI - Acessibilidade](https://www.radix-ui.com/primitives/docs/components/tabs#accessibility)
- [TanStack Table - Tabelas Avançadas](https://tanstack.com/table/v8/docs/guide)
- [Testing Library](https://testing-library.com/)
- [Markdown Guide](https://www.markdownguide.org/)

---

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. Novos links de auditoria, validação, acessibilidade, lint, type-check, build, revisão manual e documentação foram incluídos.
3. Todos os tópicos abordados nas tarefas e sub-tarefas possuem referência moderna e oficial.
4. O ciclo de validação e revisão está reforçado e atualizado.
