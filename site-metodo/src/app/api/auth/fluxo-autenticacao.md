# Fluxo de Autenticação e Autorização

## Stack

- Auth.js v5 (JWT + OAuth2)
- Prisma (User, Role, Session)
- Cookies HttpOnly/Secure
- Middleware para proteção de rotas

## Passos

1. Usuário faz login (email/senha ou OAuth)
2. Backend valida credenciais e gera JWT
3. JWT é enviado via cookie HttpOnly
4. Middleware verifica JWT em cada requisição protegida
5. Permissões (RBAC) são checadas antes de liberar acesso
6. Logout remove cookie

## Hooks/contextos sugeridos

- useUser (dados do usuário logado)
- useAuth (login, logout, reset)
- useRole (permissões)

## Referências

- https://authjs.dev/
- https://www.franciscomoretti.com/blog/modern-nextjs-authentication-best-practices
