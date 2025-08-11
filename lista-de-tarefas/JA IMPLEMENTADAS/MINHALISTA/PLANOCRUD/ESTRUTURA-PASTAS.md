# Estrutura Recomendada de Pastas e Arquivos

```
/src
  /app
    /admin
      /dashboard
      /usuarios
      /permissoes
      /configuracoes
    /api
      /usuarios
      /auth
  /components
    /ui
    /admin
  /hooks
  /lib
  /contexts
  /utils
  /styles
  /types
```

- **/admin**: Telas e rotas administrativas (dashboard, usuários, permissões, configs)
- **/api**: Endpoints REST/GraphQL (usuários, autenticação, etc)
- **/components/ui**: Componentes reutilizáveis (shadcn/ui customizados)
- **/components/admin**: Componentes específicos do admin
- **/hooks, /lib, /contexts, /utils**: Lógica compartilhada, stores, helpers
- **/styles**: Tailwind, tokens, temas
- **/types**: Tipos globais, interfaces, zod schemas

> Adapte conforme a evolução do projeto e necessidades dos times.
