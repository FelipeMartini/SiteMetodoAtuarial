# 09 – Limpeza Profunda & Refatoração

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.

> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.

## Diagnóstico
1. Diversos arquivos/pastas com sufixos (bak, antigo, novo, moderno, backup, etc), arquivos stubs, temporários, incompletos, marcados para deleção ou em branco.
2. Pastas vazias e arquivos sem uso.

## Plano de Melhoria
1. Mapear e remover todos os arquivos/pastas obsoletos, stubs, temporários, incompletos, marcados para deleção ou em branco.
2. Remover pastas vazias e arquivos sem uso.
3. Auditar e finalizar arquivos aguardando implementação.
4. Garantir que não haja código morto ou duplicado.

## Checklist Detalhado
1. [ ] Mapear arquivos/pastas obsoletos
2. [ ] Remover arquivos/pastas desnecessários
3. [ ] Auditar arquivos aguardando implementação
4. [ ] Garantir ausência de código morto/duplicado
5. [ ] Documentar mudanças de estrutura
6. [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
7. [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros

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

### Limpeza, Refatoração, Code Splitting, Lazy Loading, Otimização, Auditoria, Documentação
1. [Next.js - Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/code-splitting)
2. [Next.js - Lazy Loading](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
3. [Next.js - Otimização de Imagens](https://nextjs.org/docs/app/building-your-application/optimizing/images)
4. [Next.js - Otimização de Fontes](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
5. [Next.js - Otimização de Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
6. [Next.js - Produção](https://nextjs.org/docs/app/building-your-application/optimizing/production)
7. [Next.js - Bundling](https://nextjs.org/docs/app/building-your-application/optimizing/bundling)

### Novas Referências e Melhores Práticas (2025)
8. [Next.js - Upgrading](https://nextjs.org/docs/app/guides/upgrading)
9. [Next.js - Codemods](https://nextjs.org/docs/app/guides/upgrading/codemods)
10. [Next.js - Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
11. [Next.js - Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
12. [Next.js - Analytics](https://nextjs.org/docs/app/guides/analytics)
13. [axe DevTools - Acessibilidade](https://www.deque.com/axe/devtools/)
14. [Google Lighthouse - Acessibilidade e Performance](https://developer.chrome.com/docs/lighthouse/overview/)
15. [Markdown Guide - Documentação](https://www.markdownguide.org/)

---

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. Novos links de limpeza, refatoração, code splitting, lazy loading, otimização, auditoria, documentação e ciclo de validação foram incluídos.
3. Todos os tópicos abordados nas tarefas e sub-tarefas possuem referência moderna e oficial.
4. O ciclo de validação e revisão está reforçado e atualizado.
