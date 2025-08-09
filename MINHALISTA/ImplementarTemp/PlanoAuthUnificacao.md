# Plano de Ação – Unificação Auth.js Puro (@auth/core) e Correção de Build

## Objetivo
Remover dependência de `next-auth` (v4) para eliminar conflitos, padronizar autenticação usando **Auth.js puro (@auth/core)** + **PrismaAdapter**, manter compatibilidade com APIs existentes (`auth()` em rotas) e preparar base para otimizações de React Query.

## Premissas
- Usar apenas `@auth/core` + `@auth/prisma-adapter` (já presentes).
- Banco correto: `site-metodo/src/prisma/schema.prisma` (sqlite atual, adaptável depois).
- Session strategy: JWT (criptografado) + custom claims (`role`, `accessLevel`).
- Mapear `accessLevel` (User) -> `role` derivado (admin | moderador | usuario).
- WebAuthn/TOTP: manter placeholders até consolidar flows; não bloquear build.
- Evitar duplicação de rotas e manter compatibilidade de chamadas existentes a `/api/auth/*`.

## Entregáveis
1. Remoção de `next-auth` do `package.json`.
2. Novo `src/auth.ts` exportando:
   - `authConfig` (objeto @auth/core)
   - `GET/POST handlers` (usados pela rota dinâmica)
   - Função utilitária `auth()` que decodifica JWT do cookie e retorna sessão simplificada.
3. Nova rota: `src/app/api/auth/[...auth]/route.ts` delegando para `Auth(request, authConfig)`.
4. Atualização de imports em código que usa `{ auth }` (manter assinatura compatível).
5. Ajustar callbacks JWT/Session para incluir `role` derivada + `id`.
6. Checagem de dependências e build limpo.
7. Placeholder seguro para `AUTH_SECRET` se ausente (.env).
8. Documentação breve no próprio `auth.ts` e neste plano.
9. Base para futura otimização React Query (análise inicial listada).

## Checklist de Execução
```markdown
- [ ] 1. Remover dependência "next-auth" do package.json
- [ ] 2. Criar/atualizar .env com AUTH_SECRET placeholder se não existir
- [ ] 3. Reescrever src/auth.ts usando @auth/core providers (@auth/core/providers/*)
- [ ] 4. Implementar mapAccessLevelToRole e callbacks JWT/Session
- [ ] 5. Implementar função auth() que decodifica cookie JWT (@auth/core/jwt)
- [ ] 6. Criar rota src/app/api/auth/[...auth]/route.ts com GET/POST -> Auth()
- [ ] 7. Revisar imports em rotas/API que usam { auth } (garantir compatibilidade)
- [ ] 8. Rodar npm install (prune) e verificar build
- [ ] 9. Corrigir erros de tipagem / build remanescentes
- [ ] 10. Validar fluxo mínimo: signup (custom), signin OAuth redirect (mock), session decode
- [ ] 11. Documentar limitações temporárias (authorize credentials ainda TODO)
- [ ] 12. Análise inicial pontos de otimização React Query (anexar lista)
```

## Considerações Técnicas
- Cookies possíveis: `__Secure-authjs.session-token` | `authjs.session-token` (fallback); manter suporte também a legado `next-auth.session-token` para sessões antigas durante transição.
- Decodificação via `decode` de `@auth/core/jwt` requer `AUTH_SECRET`.
- Se for necessário rotacionar segredo futuramente, suportar array de secrets.
- Rota dinâmica `[...auth]` alinhar basePath `/api/auth` (setar `basePath: '/api/auth'` no config core para clareza).

## React Query (fase posterior) – Pré-Análise
- Criar boundary de hydration seletiva: usar `prefetchQuery` apenas para blocos visíveis.
- Suspense + partitioning: dividir queries pesadas em lazy boundaries.
- Cache keys padronizados: `['usuarios','lista',params]`, `['auth','session']`.
- Evitar disparo duplo em client + server: checar se já há dados de server actions.
- Implementar retry/backoff custom em queries críticas.

## Riscos
- Quebra de APIs internas que assumiam helpers de `next-auth` (ex: signIn/signOut). Mitigar exportando wrappers no futuro se necessários.
- Falta de secret => sessões inválidas: adicionar verificação inicial e log claro.
- WebAuthn/TOTP ainda não reimplementados: marcar como experimental / disabled até finalização.

## Próximos Passos Imediatos
Prosseguir com checklist acima começando pela remoção da dependência e refatoração de `auth.ts`.

-- Fim do Plano --
