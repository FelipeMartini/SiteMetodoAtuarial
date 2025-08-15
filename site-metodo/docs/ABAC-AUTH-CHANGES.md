Resumo das alterações — Auth + ABAC (nova estratégia)

Objetivo
- Remover resquícios de RBAC e garantir ABAC puro baseado em atributos (email).
- Consolidar handler Auth.js v5 em `src/lib/auth.ts` e garantir que `session:read` e `admin` políticas funcionem usando apenas email como subject.
- Tornar fallback permissivo em dev configurável via `ABAC_ALLOW_DEV_FALLBACK` (true/false).

Alterações principais

1) Enforcer ABAC (`src/lib/abac/enforcer-abac-puro.ts`)
- Agora normaliza `user:{id}` -> email quando possível. Se não for possível, passa subject como `''` (negação segura).
- Remove fallbacks RBAC (não tenta `user:{id}` enforcement nem caches que ligam email->userId para decisões). Mantém scans limitados para wildcards.
- Mantém funções de adicionar/remover/recarregar políticas.

2) Rota de sessão (`src/app/api/auth/session/route.ts`)
- Exige que o subject seja email (se não houver email, é tratado como não autenticado).
- Respeita `ABAC_ALLOW_DEV_FALLBACK` (padrão `true` para compatibilidade; setar `false` para testes/produção mais estritos).

3) Seeds / scripts
- `prisma/seed-abac-user.ts` garantirá que o email `felipemartinii@gmail.com` receba `session:read` e `session:write` além de `admin:dashboard` e `admin:abac`.
- `scripts/setup-abac.ts` foi atualizado para remover a adição de políticas `user:*` (RBAC). O script agora cria políticas explicitamente por email e por recurso.

4) Frontend HOC (`src/lib/abac/hoc.tsx`)
- Proteções do cliente já usam `session.user.email` como subject para chamadas client-side.

How to test locally

1) Ajuste variáveis de ambiente (no `site-metodo/.env.local`):

- DATABASE_URL (ex: `file:./prisma/db/dev.db`)
- NEXTAUTH_URL=http://localhost:3000
- ABAC_ALLOW_DEV_FALLBACK=false # para testar comportamento estrito

2) Recrie/seed DB (irá sobrescrever políticas):

```bash
cd /home/felipe/github/SiteMetodoAtuarial/site-metodo \
&& npm run prisma:generate && node prisma/seed-abac-user.js && node scripts/setup-abac.ts
```

3) Inicie dev server e faça login via Google e via credentials. Verifique `/api/auth/session` e o Admin Dashboard.

Principais conflitos detectados

A) Política `user:*` vs email-focused policies
- Problema: havia políticas `user:*` permitindo comportamento parecido com RBAC. Removemos para forçar políticas baseadas em email.
- Impacto: se houver código que passa `user:{id}` diretamente para `checkABACPermission`, agora terá que ser ajustado.

B) Fallback permissivo em dev
- Problema: código antigo permitia leituras de sessão em dev mesmo quando ABAC negava. Agora isso é configurável via `ABAC_ALLOW_DEV_FALLBACK`.

C) Duplicidade de handlers Auth
- Problema: existiam múltiplos arquivos exportando `auth`/handlers; consolidamos em `src/lib/auth.ts` e oferecemos um helper `auth()` compatível.

Próximos passos sugeridos
- Rode os scripts de seed com as envs corretas para garantir que `felipemartinii@gmail.com` tenha `session:read`.
- Auditar todos os pontos que usam `user:{id}` e garantir que passem email para `checkABACPermission`.
- Depois, se quiser, desativamos `ABAC_ALLOW_DEV_FALLBACK` e executamos testes automatizados (Jest) que cobriremos se confirmar.

