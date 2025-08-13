# Tarefa: Unificação do Estado Global de UI/Status/Tema com Zustand e Integração ABAC

## Objetivo

Centralizar todo o gerenciamento de estado global de UI (tema, sidebar, status, preferências, etc) em um único Zustand store, com slices separados por módulo/domínio, e preparar a base para personalização de UI conforme atributos ABAC.

---

## Checklist de Implementação

- [ ] Remover totalmente o ThemeProvider e migrar o controle de tema para um slice Zustand, garantindo SSR e persistência.
- [ ] Separar todos os estados de UI em slices por módulo (sidebar, modais, status, preferências, etc).
- [ ] Refatorar todos os componentes de UI para consumir o estado global via hooks do Zustand.
- [ ] Preparar slices para personalização via ABAC, permitindo que atributos de acesso do usuário personalizem menus, sidebars e componentes.
- [ ] Documentar a separação de responsabilidades: Zustand para UI, next-auth/SQLite para sessão/autenticação, React Query/Prisma para dados.
- [ ] Testar persistência e SSR para garantir que preferências e tema funcionem corretamente.
- [ ] Nunca armazenar dados sensíveis no Zustand.
- [ ] Garantir integração transparente com AuthProvider, TanstackQueryProvider e demais providers.

---

## Plano de Implementação

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

---

## Instruções Importantes e Obrigatórias

- Nunca armazene tokens, sessão ou dados sensíveis no Zustand.
- A sessão do usuário deve continuar sendo persistida no SQLite via next-auth.
- Qualquer alteração estrutural deve ser acompanhada de testes completos para evitar regressões.
- A integração com ABAC deve ser feita de forma que atributos de acesso determinem a personalização da UI, sem expor dados sensíveis no client.
- Siga sempre as melhores práticas de acessibilidade e composição de componentes.

---

## Referências

1. https://docs.pmnd.rs/zustand/guides/persisting-store-data
2. https://next-auth.js.org/adapters/sqlite
3. https://next-auth.js.org/getting-started/introduction
4. https://nextjs.org/docs/app/building-your-application/rendering/server-components
5. https://react.dev/learn/passing-data-deeply-with-context
6. https://github.com/pmndrs/zustand/discussions/1245
7. https://kentcdodds.com/blog/application-state-management-with-react
8. https://vercel.com/blog/nextjs-authentication
9. https://www.smashingmagazine.com/2023/01/global-state-management-react-zustand/
10. https://www.joshwcomeau.com/react/context-or-zustand/
11. https://www.builder.io/blog/zustand-vs-context
12. https://ui.shadcn.com/docs/components
13. https://authjs.dev/guides/basics/session-strategies
14. https://www.npmjs.com/package/zustand
15. https://www.npmjs.com/package/next-themes

---
