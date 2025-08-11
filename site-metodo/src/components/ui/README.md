# Componentes UI (Design System)

## Objetivo

Centralizar e documentar todos os componentes reutilizáveis do projeto, seguindo o padrão shadcn/ui e tokens de design customizados.

## Componentes Essenciais

- Button
- Card
- Table
- Modal
- Drawer
- Toast
- Avatar
- Badge
- Input
- Select
- Switch
- Skeleton
- Tooltip
- AlertDialog
- Pagination

## Como adicionar um novo componente shadcn/ui

```bash
npx shadcn-ui@latest add <componente>
```

## Exemplo de uso

```tsx
import { Button } from '@/components/ui/button'

;<Button variant='primary'>Salvar</Button>
```

## Checklist de Design System

- [ ] Todos os componentes possuem documentação de props
- [ ] Exemplos de uso para cada componente
- [ ] Tokens de design aplicados (cores, espaçamentos)
- [ ] Testes de acessibilidade

---

> Atualize este arquivo sempre que um novo componente for criado ou customizado.
