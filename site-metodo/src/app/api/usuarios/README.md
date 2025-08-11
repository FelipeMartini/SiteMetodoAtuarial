# API Usuários

- Endpoints REST/GraphQL para CRUD
- Proteção por autenticação e RBAC
- Validação e tratamento de erros

---

## Endpoints Sugeridos

- `GET /api/usuarios` — Listar usuários
- `POST /api/usuarios` — Criar usuário
- `GET /api/usuarios/:id` — Detalhar usuário
- `PUT /api/usuarios/:id` — Atualizar usuário
- `DELETE /api/usuarios/:id` — Remover usuário

## Proteção

- Middleware de autenticação (JWT)
- RBAC: apenas admins podem criar/remover

## Validação

- Zod para validação de payload
- Tratamento de erros padronizado

## Testes

- Testes unitários e2e para cada endpoint
