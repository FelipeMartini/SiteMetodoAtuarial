---
# 03 – Unificação do Estado Global de UI/Status/Tema com Zustand e Integração ABAC

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.
>
> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

## Checklist Detalhado de Zustand/Global UI
- [ ] Remover totalmente o ThemeProvider e migrar o controle de tema para um slice Zustand, garantindo SSR e persistência
- [ ] Separar todos os estados de UI em slices por módulo (sidebar, modais, status, preferências, etc)
- [ ] Refatorar todos os componentes de UI para consumir o estado global via hooks do Zustand
- [ ] Preparar slices para personalização via ABAC, permitindo que atributos de acesso do usuário personalizem menus, sidebars e componentes
- [ ] Documentar a separação de responsabilidades: Zustand para UI, next-auth/SQLite para sessão/autenticação, React Query/Prisma para dados
- [ ] Testar persistência e SSR para garantir que preferências e tema funcionem corretamente
- [ ] Nunca armazenar dados sensíveis no Zustand
- [ ] Garantir integração transparente com AuthProvider, TanstackQueryProvider e demais providers
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os slices
- [ ] Validar integração com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

## Plano de Implementação Zustand/Global UI

1. **Remoção do ThemeProvider**
   - Eliminar o uso de `ThemeProvider` e `next-themes`.
   - Implementar slice de tema no Zustand, com persistência (localStorage) e suporte a SSR.
   - Adaptar todos os componentes e hooks para consumir o tema via Zustand.

2. **Estruturação dos Slices**
   - Criar slices separados para sidebar, modais, status, preferências e outros estados de UI.
   - Garantir que cada módulo de UI tenha seu próprio slice, facilitando manutenção e escalabilidade.

3. **Refatoração dos Componentes**
   - Atualizar todos os componentes de UI para utilizar hooks do Zustand.
   - Remover dependências antigas de contextos ou providers de UI.

4. **Personalização via ABAC**
   - Estruturar o Zustand para permitir estados e preferências de UI customizados conforme atributos de acesso do usuário (roles, permissões, perfil).
   - Garantir que a lógica de controle de acesso permaneça nos providers/contextos seguros.

5. **Testes e Validação**
   - Implementar testes unitários e de integração para todos os slices e hooks.
   - Validar SSR, persistência e integração com providers.

6. **Documentação**
   - Documentar a arquitetura, exemplos de uso dos hooks e instruções para manutenção futura.

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
- [Zustand - Persistência](https://docs.pmnd.rs/zustand/guides/persisting-store-data)
- [next-auth.js - SQLite](https://next-auth.js.org/adapters/sqlite)
- [TanStack Query](https://tanstack.com/query/v4/docs/overview)
- [shadcn/ui - Componentes UI](https://ui.shadcn.com/docs/components)
- [Testing Library](https://testing-library.com/)
- [Markdown Guide](https://www.markdownguide.org/)

---
