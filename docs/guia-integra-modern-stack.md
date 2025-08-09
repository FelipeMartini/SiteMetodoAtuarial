# Guia Profissional de Integração e Melhores Práticas – Next.js 15, React 19, TanStack Query, Auth.js v5, Zod, shadcn/ui, Unleash, Upstash Rate Limit

Este guia reúne as melhores práticas, principais conflitos e soluções para integração de tecnologias modernas em projetos Next.js 15+ com React 19, TanStack Query, Auth.js v5, Zod, shadcn/ui, Unleash e Upstash Rate Limit. Baseado em documentação oficial, fóruns, GitHub e projetos de referência 2025.

---

## 1. TanStack Query + Next.js 15 (React 19)
- **Provider global**: Crie um `QueryClientProvider` no topo da árvore client-side.
- **SSR/CSR**: Use `dehydrate/hydrate` para sincronizar cache entre server/client. Nunca use hooks do TanStack Query em Server Components.
- **Conflitos comuns**: Hooks em Server Components (erro), cache duplicado, versão incompatível (use v5+).
- **Padrão recomendado**:
  - Crie `queryClient.ts` para instanciar o client.
  - Importe e use o provider em `_app.tsx` ou layout client.

## 2. Auth.js v5 + Next.js 15 + React 19
- **Problemas**: Variáveis de ambiente não lidas após build/start, redirecionamento quebrado, middleware burlável.
- **Soluções**:
  - Use `.env` e reinicie o server.
  - Corrija callbacks e use `router.replace`.
  - Sempre valide roles no backend.
  - Cookies HttpOnly e adapter Prisma.
  - Siga https://authjs.dev/getting-started/migrating-to-v5

## 3. Zod + React Hook Form + Next.js 15
- **Integração**: Use `zodResolver` de `@hookform/resolvers/zod`.
- **Schemas**: Defina em arquivos separados, tipagem via `z.infer`.
- **Conflitos**: Versão incompatível, falta de validação server-side, SSR (use só em client).

## 4. shadcn/ui + Tailwind v4 + Next.js 15
- **Instalação**: Use CLI com `@canary` para Tailwind v4.
- **Theming**: Adapte `global.css` para o novo `@theme`.
- **Dark mode**: Use `next-themes`.
- **Conflitos**: Componentes antigos, imports errados.

## 5. Unleash + Next.js 15
- **Problemas**: "body has already been consumed" em Server Components, SDK desatualizado.
- **Soluções**: Use SDK mais recente, flags validadas no backend, fallback seguro.

## 6. Upstash Rate Limit + Next.js 15
- **Problemas**: Cold start alto, limitação burlável.
- **Soluções**: Use versão atual, rate limit por IP real, log de tentativas, combine com headers de segurança.

## 7. Checklist de Prevenção de Conflitos
```
- [ ] TanStack Query: Provider global, hooks só em client, use dehydrate/hydrate, versão v5+.
- [ ] Auth.js v5: .env sempre lido, callbacks corretos, roles validados no backend, cookies HttpOnly.
- [ ] Zod + React Hook Form: zodResolver, schemas tipados, validação client/server, useForm só em client.
- [ ] shadcn/ui: CLI @canary, imports corretos, Tailwind v4 @theme, dark mode com next-themes.
- [ ] Unleash: SDK atualizado, flags validadas no backend, fallback seguro.
- [ ] Upstash Rate Limit: versão atual, rate limit por IP real, log de tentativas, combine com headers de segurança.
- [ ] SSR/CSR: Nunca use hooks client em Server Components, sempre separe lógica.
- [ ] Testes: Adicione testes para autenticação, permissões, rate limit e flags.
```

---

## Referências
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Auth.js v5 Migration](https://authjs.dev/getting-started/migrating-to-v5)
- [shadcn/ui + Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)
- [Unleash Next.js SDK](https://docs.getunleash.io/reference/sdks/next-js)
- [Upstash Rate Limit](https://upstash.com/blog/nextjs-ratelimiting)
- [Zod + React Hook Form](https://react-hook-form.com/integrations/zod)

---

> Consulte este guia sempre que precisar revisar integrações, prevenir conflitos ou atualizar dependências em projetos Next.js modernos.
