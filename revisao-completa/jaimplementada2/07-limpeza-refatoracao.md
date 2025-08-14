---
# 08 – Limpeza Profunda & Refatoração Estrutural

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.
>
> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

## Checklist Detalhado de Limpeza & Refatoração
- [ ] Mapear arquivos/pastas obsoletos, renomeados, stubs, temporários, incompletos, marcados para deleção ou em branco
- [ ] Remover arquivos/pastas desnecessários ou marcados como removidos ou deletados
- [ ] Auditar arquivos aguardando implementação
- [ ] Garantir ausência de código morto/duplicado
- [ ] Documentar mudanças de estrutura
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os fluxos
- [ ] Validar integração com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

## Plano de Implementação Limpeza & Refatoração
1. **Mapeamento Completo:**
   - [ ] Utilizar ferramentas de busca para identificar todos os arquivos/pastas com sufixos como (bak, antigo, novo, moderno, backup, etc).
   - [ ] Listar todos os arquivos stubs, temporários, incompletos ou marcados para deleção.
   - [ ] Identificar pastas vazias e arquivos sem uso.

2. **Remoção Segura:**
   - [ ] Remover arquivos/pastas desnecessários, garantindo que não há links quebrados.
   - [ ] Eliminar arquivos stubs e temporários.
   - [ ] Deletar pastas vazias e arquivos sem uso.

3. **Auditoria e Finalização:**
   - [ ] Revisar arquivos aguardando implementação e finalizar o que for necessário.
   - [ ] Garantir que não haja código morto ou duplicado.

4. **Documentação e Limpeza:**
   - [ ] Documentar todas as mudanças de estrutura realizadas.
   - [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build.

5. **Revisão de Variáveis e Testes:**
   - [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros.
   - [ ] Garantir que todos os testes estejam atualizados e cobrem todos os fluxos críticos.

6. **Validação Final:**
   - [ ] Acessar todos os links/endpoints no navegador e corrigir eventuais erros.
   - [ ] Submeter o código a uma revisão de especialista externo, se possível.

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
- [Next.js - Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/code-splitting)
- [Next.js - Lazy Loading](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Next.js - Otimização de Imagens](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js - Otimização de Fontes](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Next.js - Otimização de Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js - Produção](https://nextjs.org/docs/app/building-your-application/optimizing/production)
- [Next.js - Bundling](https://nextjs.org/docs/app/building-your-application/optimizing/bundling)
- [Next.js - Upgrading](https://nextjs.org/docs/app/guides/upgrading)
- [Next.js - Codemods](https://nextjs.org/docs/app/guides/upgrading/codemods)
- [Next.js - Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js - Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js - Analytics](https://nextjs.org/docs/app/guides/analytics)
- [axe DevTools - Acessibilidade](https://www.deque.com/axe/devtools/)
- [Google Lighthouse - Acessibilidade e Performance](https://developer.chrome.com/docs/lighthouse/overview/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Testing Library](https://testing-library.com/)

---
