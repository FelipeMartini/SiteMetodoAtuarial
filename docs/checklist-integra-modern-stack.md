# Checklist de Melhoria e Execução Incremental – Modern Stack Next.js 15+

Este checklist serve para acompanhamento prático e incremental das melhorias e correções aplicadas no projeto, conforme o guia de integração moderna.

## 1. TanStack Query
- [ ] Criar provider global (QueryClientProvider) e garantir uso apenas em client components
- [ ] Implementar dehydrate/hydrate para SSR/CSR
- [ ] Atualizar para v5+ e revisar imports/hooks

## 2. Auth.js v5
- [ ] Garantir leitura correta de variáveis .env e reinício do server
- [ ] Corrigir callbacks de login/logout e roles
- [ ] Validar roles no backend (não só middleware)
- [ ] Cookies HttpOnly e adapter Prisma

## 3. Zod + React Hook Form
- [ ] Usar zodResolver e schemas tipados
- [ ] Garantir validação client/server
- [ ] Formularios só em client components

## 4. shadcn/ui + Tailwind v4
- [ ] Atualizar todos componentes via CLI @canary
- [ ] Corrigir imports para @/components/ui
- [ ] Adaptar global.css para @theme
- [ ] Garantir dark mode com abordagem baseada em `Zustand` (slice `theme`) e script anti-FOUC

## 5. Unleash
- [ ] Atualizar SDK
- [ ] Validar flags no backend
- [ ] Implementar fallback seguro

## 6. Upstash Rate Limit
- [ ] Atualizar pacote
- [ ] Rate limit por IP real
- [ ] Logar tentativas
- [ ] Headers de segurança

## 7. SSR/CSR
- [ ] Nunca usar hooks client em Server Components
- [ ] Separar lógica de dados e UI

## 8. Testes
- [ ] Adicionar testes para autenticação, permissões, rate limit e flags

---

> Marque cada item conforme for implementando. Use este checklist junto ao guia para garantir máxima robustez e modernidade no projeto.
