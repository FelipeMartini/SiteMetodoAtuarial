---
# 05 – Guia Moderno de UX/Auth/ABAC com shadcn/ui + Next.js

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.
>
> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

## Checklist Detalhado de UX/Auth/ABAC
- [ ] Adicionar feedback instantâneo (toasts, sonner)
- [ ] Usar diálogos/alertas acessíveis (Dialog/AlertDialog)
- [ ] Skeletons e Progress para loading
- [ ] Tooltips explicativos
- [ ] Botões, Badges e Avatar modernos
- [ ] Fluxo de acesso negado claro
- [ ] Loading global seguro
- [ ] Garantir acessibilidade total
- [ ] Composição e abstração de wrappers
- [ ] Suporte total a tema claro/escuro (dark mode) e seletor de tema
- [ ] Garantir documentação e exemplos de uso para todos os fluxos
- [ ] Validar contraste e acessibilidade em ambos os temas
- [ ] Testar navegação por teclado e leitores de tela
- [ ] Documentar todos os componentes customizados e wrappers

## Plano de Implementação UX/Auth/ABAC

### 1. Resumo das Melhorias Propostas
- Feedback instantâneo (toasts, sonner)
- Diálogos/alertas acessíveis (Dialog/AlertDialog)
- Skeletons e Progress para loading
- Tooltips explicativos
- Botões, Badges e Avatar modernos
- Fluxo de acesso negado claro
- Loading global seguro
- Acessibilidade total
- Composição e abstração de wrappers
- **Suporte total a tema claro/escuro (dark mode) e seletor de tema**

---

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
- [shadcn/ui - Dark Mode](https://ui.shadcn.com/docs/dark-mode)
- [shadcn/ui - Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui - Button](https://ui.shadcn.com/docs/components/button)
- [shadcn/ui - Sonner (Toaster)](https://ui.shadcn.com/docs/components/sonner)
- [Radix UI - Dialog](https://www.radix-ui.com/primitives/components/dialog)
- [TanStack Table - Tabelas Avançadas](https://tanstack.com/table/v8/docs/guide)
- [WCAG 2.2 - Acessibilidade Web](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Testing Library](https://testing-library.com/)
- [Markdown Guide](https://www.markdownguide.org/)

---

**Resumo:**
Todas as melhorias de UX/Auth devem ser 100% compatíveis com dark mode, respeitando o seletor de tema global, garantindo contraste, acessibilidade e experiência moderna em qualquer contexto visual.
