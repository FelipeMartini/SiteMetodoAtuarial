# Exemplo de Integração ABAC (node-casbin)

## 1. API Route (Next.js)
```typescript
import { checkPermission } from '@/utils/abac';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await auth();
  if (!session?.user?.id) return res.status(401).json({ error: 'Não autenticado' });

  // Buscar usuário e recurso
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const resource = await prisma.document.findUnique({ where: { id: req.query.id } });

  // Checagem ABAC
  const allowed = await checkPermission(user, resource, 'read');
  if (!allowed) return res.status(403).json({ error: 'Acesso negado' });

  // ...restante do handler
}
```

## 2. Middleware (Next.js)
```typescript
import { NextResponse } from 'next/server';
import { getEnforcer } from '@/utils/abac';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function middleware(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.redirect('/auth/signin');
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  // Exemplo: buscar recurso conforme rota
  // const resource = ...
  // const allowed = await checkPermission(user, resource, 'read');
  // if (!allowed) return NextResponse.redirect('/403');
  return NextResponse.next();
}
```

## 3. Hook/Componente React
```typescript
import { checkPermission } from '@/utils/abac';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useAbacPermission(resource, action) {
  const { data: session } = useSession();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (session?.user && resource) {
      checkPermission(session.user, resource, action).then(setAllowed);
    }
  }, [session, resource, action]);
  return allowed;
}
```

## Observações
- Sempre passar objetos ricos (usuário, recurso) para o enforcer.
- Adaptar modelos/políticas conforme atributos do domínio.
- Garantir que atributos necessários estejam disponíveis no momento da checagem.
