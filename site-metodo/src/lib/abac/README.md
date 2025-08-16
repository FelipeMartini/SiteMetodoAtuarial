# ABAC - Guia Rápido

Padrões recomendados para uso do sistema ABAC neste projeto.

Principais contratos:
- `checkABACPermission(subject, object, action)` (server-side): função principal que realiza enforcement via Casbin e retorna `AuthResult` com metadados.
- `checkPermissionDetailed(subject, object, action)` (server-side): alias/fachada para `checkABACPermission` quando se deseja o resultado detalhado.
- `checkClientPermission(userEmail, resource, action)` (client-side): chamada que faz POST para `/api/abac/check` e retorna boolean.
- `serverCheckPermissionDetailed(subject, object, action)` (server-side helper): wrapper exportado por `src/lib/abac/server.ts` para uso em Server Components.

Recomendações de uso:
- Em Server Components / API routes: chame `serverCheckPermissionDetailed(session.user.email, 'resource', 'read')` e passe o resultado (AuthResult) para o componente client-side como prop (`serverAuthResult`). Evita latência e discrepâncias entre client e server.
- Em Client Components: use `ABACProtectedPage` ou `usePermission`, que por sua vez chamam `checkClientPermission` (caching de 30s). Para evitar loops e chamadas desnecessárias prefira que a página seja protegida via server-side quando possível.
- Normalização de recursos: padronize objetos das policies. No projeto existem formas diferentes: `admin:dashboard`, `admin:abac`, `/area-cliente/dashboard-admin`. Escolha um padrão e converta. Recomendação: usar `admin:dashboard` para dashboards administrativos e `area-cliente:dashboard` para dashboards de cliente, evitando caminhos de URL diretos nos policies.

Exemplo (Server Component):

```tsx
// src/app/area-cliente/dashboard-admin/page.tsx (server)
import { serverCheckPermissionDetailed } from '@/lib/abac/server'

export default async function Page() {
  const session = await getServerSession() // helper
  const auth = await serverCheckPermissionDetailed(session.user.email, 'admin:dashboard', 'read')

  return (
    <ABACProtectedPage serverAuthResult={auth}>
      <DashboardAdmin />
    </ABACProtectedPage>
  )
}
```

Exemplo (Client Component - fallback):

```tsx
// se não for possível checar no server, ABACProtectedPage fará verificação no cliente usando checkClientPermission
<ABACProtectedPage>
  <DashboardAdmin />
</ABACProtectedPage>
```

Manutenção:
- Sempre garanta que as seeds de políticas contenham o usuário admin `felipemartinii@gmail.com` com políticas adequadas. Use `scripts/setup-abac-policies.ts`.
- Evite misturar caminhos de URL com `:`-separators; padronize e atualize as policies existentes.
