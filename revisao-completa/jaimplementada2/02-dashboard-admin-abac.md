# 02 – Dashboard Admin & Página ABAC

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.

> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.


## 🚨 OBRIGATÓRIO: Análise Profunda do Projeto de Referência

**Antes de qualquer implementação, é OBRIGATÓRIO estudar a fundo o projeto referência:**

👉 [Next.js Admin Template com Shadcn UI (next-shadcn-admin-dashboard)](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)

> **Você deve navegar, clonar, rodar e analisar o código, padrões de componentes, arquitetura, temas, responsividade, acessibilidade, integração de tabelas, widgets, dark/light mode, autenticação, RBAC/ABAC, e todos os detalhes do projeto.**
> 
> **A modernização do dashboard admin e da área do cliente DEVE seguir o padrão visual, técnico e de experiência desse projeto.**

### ⚡️ UNIFICAÇÃO E REESTRUTURAÇÃO OBRIGATÓRIA

> **A página Admin Dashboard e a página ABAC devem ser completamente refatoradas e unificadas, contemplando TODOS os pontos já existentes e TODOS os novos requisitos incrementados a partir do projeto referência.**
> 
> - Garanta que todos os widgets, painéis, tabelas, integrações, logs, métricas, notificações, dark/light mode, acessibilidade, navegação, autenticação, RBAC/ABAC, e demais funcionalidades estejam presentes e padronizadas.
> - Não deixe nenhum recurso legado de fora: tudo deve ser migrado, modernizado e integrado ao novo padrão visual/técnico.
> - Siga fielmente o padrão do projeto referência: https://github.com/arhamkhnz/next-shadcn-admin-dashboard

**Sugestão:**
- Use o projeto como inspiração para a área cliente, garantindo consistência visual e técnica entre admin e área do cliente.

## Diagnóstico
1. Código legado, widgets pouco reutilizáveis, ausência de design system consistente.
2. Falta de integração total com shadcn/ui, suporte dark/light e arquitetura moderna.
3. Falta de painéis de métricas, logs e auditoria em tempo real.
4. Área do cliente desatualizada, sem dashboard moderno, sem integração com logs/notificações e sem padrão visual unificado com admin.

## Plano de Melhoria
1. Refatorar todos os componentes (admin e área cliente) para shadcn/ui, padronizar layout, responsividade e arquitetura.
2. Implementar widgets de métricas, logs, auditoria e status do sistema, seguindo o padrão do projeto referência.
3. Adotar TanStack Table para tabelas dinâmicas e filtráveis.
4. Integrar painéis de logs/auditoria em tempo real.
5. Garantir acessibilidade (WCAG 2.2+) e responsividade total.
6. Modernizar a área do cliente: dashboard do usuário, métricas, notificações, logs, navegação, dark/light, integração visual/técnica com admin.

## Checklist Detalhado
1. [ ] Refatorar TODOS os componentes (admin e área cliente) para shadcn/ui
2. [ ] Implementar dark/light mode unificado
3. [ ] Adicionar widgets de métricas, logs, notificações e status
4. [ ] Integrar TanStack Table para tabelas dinâmicas
5. [ ] Garantir acessibilidade (WCAG 2.2+)
6. [ ] Testar responsividade em todos os dispositivos
7. [ ] Documentar padrões de componentes e arquitetura
8. [ ] Modernizar área do cliente: dashboard, métricas, logs, navegação, integração visual/técnica
9. [ ] Exibir a foto do perfil do usuário (avatar pequeno) na barra superior (head) ao lado do nome, igual ao padrão da página de perfil atual
10. [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
11. [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros

## Checklist Incremental de Implementação e Validação Manual

Para cada página nova, atualizada ou refatorada (admin ou área cliente):

- [ ] Implementar/refatorar a página seguindo o padrão do projeto referência e instruções técnicas acima
- [ ] Garantir responsividade total (testar em desktop, tablet, mobile)
- [ ] Garantir acessibilidade (atalhos, navegação por teclado, contraste, ARIA, etc)
- [ ] Validar integração visual e técnica com o restante do sistema
- [ ] Revisar e garantir tipagem estrita (sem any, unknown tipado, tipos oficiais)
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos
- [ ] Revisar variáveis, props e funções para evitar conflitos e garantir segurança
- [ ] **Executar teste manual completo da página:**
	- Navegar por todos os fluxos, interações, formulários, tabelas, widgets, dark/light mode, etc
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

- Utilize sempre o CLI do shadcn/ui para adicionar/atualizar componentes.
- Importe componentes de `@/components/ui/<component>`.
- Use TanStack Table para tabelas avançadas.
- Siga as recomendações de acessibilidade (WCAG 2.2+).
- Comente o código para facilitar manutenção.
- **É OBRIGATÓRIO consultar, clonar e analisar profundamente o projeto referência:** [next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) antes de qualquer implementação.
- Consulte e estude OBRIGATORIAMENTE todos os links abaixo antes de implementar qualquer alteração.

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
9. **É OBRIGATÓRIO consultar e analisar profundamente:** https://github.com/arhamkhnz/next-shadcn-admin-dashboard
```

> **NUNCA pule a etapa de validação manual nos links/endpoints, a revisão de variáveis e a análise do projeto referência!**

## Referências Obrigatórias e Atualizadas

### Novas Referências e Melhores Práticas (2025)
1. [Next.js Admin Template com Shadcn UI (next-shadcn-admin-dashboard)](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)
2. [shadcn/ui - Componentes UI](https://ui.shadcn.com/docs/components)
3. [shadcn/ui - Dark Mode](https://ui.shadcn.com/docs/dark-mode)
4. [TanStack Table - Tabelas Avançadas](https://tanstack.com/table/v8/docs/guide)
5. [Next.js - Layouts e Páginas](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
6. [Smashing Magazine - Dark Mode CSS](https://www.smashingmagazine.com/2021/11/modern-css-solutions-dark-mode/)
7. [WCAG 2.2 - Acessibilidade Web](https://www.w3.org/WAI/standards-guidelines/wcag/)
8. [React - Aprenda React](https://react.dev/learn)
9. [Radix UI - Tabs](https://www.radix-ui.com/primitives/components/tabs)
10. [Radix UI - Tooltip](https://www.radix-ui.com/primitives/components/tooltip)
11. [Radix UI - Dialog](https://www.radix-ui.com/primitives/components/dialog)
12. [Radix UI - Alert Dialog](https://www.radix-ui.com/primitives/components/alert-dialog)
13. [Radix UI - Scroll Area](https://www.radix-ui.com/primitives/components/scroll-area)
14. [Radix UI - Accordion](https://www.radix-ui.com/primitives/components/accordion)
15. [Radix UI - Checkbox](https://www.radix-ui.com/primitives/components/checkbox)
16. [Radix UI - Switch](https://www.radix-ui.com/primitives/components/switch)
17. [Radix UI - Slider](https://www.radix-ui.com/primitives/components/slider)
18. [Radix UI - Menubar](https://www.radix-ui.com/primitives/components/menubar)
19. [Radix UI - Popover](https://www.radix-ui.com/primitives/components/popover)
20. [Radix UI - Select](https://www.radix-ui.com/primitives/components/select)
21. [Radix UI - Combobox](https://www.radix-ui.com/primitives/components/combobox)
22. [Radix UI - Toast](https://www.radix-ui.com/primitives/components/toast)
23. [Radix UI - Avatar](https://www.radix-ui.com/primitives/components/avatar)
24. [Radix UI - Progress](https://www.radix-ui.com/primitives/components/progress)
25. [Next.js - Accessibility](https://nextjs.org/docs/architecture/accessibility)
26. [Next.js - Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
27. [Next.js - Analytics](https://nextjs.org/docs/app/guides/analytics)
28. [Next.js - Caching](https://nextjs.org/docs/app/guides/caching)
29. [Next.js - Forms](https://nextjs.org/docs/app/guides/forms)
30. [Next.js - Internationalization](https://nextjs.org/docs/app/guides/internationalization)
31. [axe DevTools - Acessibilidade](https://www.deque.com/axe/devtools/)
32. [Google Lighthouse - Acessibilidade e Performance](https://developer.chrome.com/docs/lighthouse/overview/)

----

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. Novos links de dashboard, widgets, dark/light mode, tabelas, acessibilidade, integração, logs, responsividade e ciclo de validação foram incluídos.
3. Todos os tópicos abordados nas tarefas e sub-tarefas possuem referência moderna e oficial.
4. O ciclo de validação e revisão está reforçado e atualizado.
