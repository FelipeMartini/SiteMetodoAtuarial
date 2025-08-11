# Implementação ABAC com Casbin no Next.js + Auth.js v5 + Prisma + SQLite

## Visão Geral
Este documento detalha um plano de implementação de ABAC (Attribute-Based Access Control) usando Casbin no contexto do seu projeto Next.js, com Auth.js v5 puro, com Middleware, speakeasy,  Prisma e prisma adapter, SQLite,  e integração com Zustand, ZOD, nosso sistema atual de permission e roles deve ser migrado para essa nova abordagem convertendo proteção das paginas cliente e admin dashboard para isso. O objetivo é migrar do modelo atual baseado em roles para um controle de acesso flexível, auditável e escalável, usando atributos de usuário e recurso.

---

## 1. Fundamentos e Boas Práticas
- **Modelagem de atributos:** Defina claramente os atributos relevantes de usuário (ex: id, role, departamento, accessLevel) e de recurso (ex: ownerId, tipo, tags).
- **Políticas dinâmicas:** Use regras expressivas no Casbin, como `r.sub.department == r.obj.department`.
- **Auditoria:** Implemente logs detalhados para cada decisão de autorização.
- **Performance:** Carregue o enforcer Casbin como singleton.
- **Testes:** Cubra cenários de permissão e negação para todos os tipos de usuário e recurso.

---

## 2. Dependências e Ferramentas
- [node-casbin](https://github.com/casbin/node-casbin)
- [casbin-prisma-adapter](https://github.com/node-casbin/prisma-adapter)
- [prisma](https://www.prisma.io/)
- [zustand](https://github.com/pmndrs/zustand)
- [auth.js v5](https://authjs.dev/)

---

## 3. Arquivos e Pontos de Integração
- `site-metodo/middleware.ts`: Middleware de proteção de rotas.
- `src/lib/auth/apiAuth.ts`: Função de autorização de API.
- `src/lib/auth/permissions.ts`: Lógica de permissões.
- Hooks e componentes que usam roles: migrar para uso de atributos e ABAC.
- Testes automatizados: atualizar para cobrir cenários de atributos e políticas ABAC.

---

## 4. Plano de Refatoração

### 4.1. Instalação e Setup
- Instale as dependências:
  ```bash
  npm install casbin @casbin/prisma-adapter
  ```
- Crie o modelo Casbin (ex: `abac_model.conf`) e defina as políticas iniciais (pode ser via DB ou arquivo).

### 4.2. Adaptação do Prisma
- Adapte o schema do Prisma para incluir tabelas de políticas, se necessário (ver exemplos do [prisma-adapter](https://github.com/node-casbin/prisma-adapter)).
- Rode as migrations.

### 4.3. Utilitário ABAC
- Crie um utilitário `src/utils/abac.ts`:
  - Função `getEnforcer()` singleton.
  - Função `checkPermission(user, resource, action)` que retorna `true/false`.

### 4.4. Middleware de Rotas
- Em `middleware.ts`, troque a checagem de roles por:
  ```typescript
  const allowed = await checkPermission(user, resource, action);
  if (!allowed) return NextResponse.redirect('/403');
  ```
- Garanta que os atributos necessários estejam disponíveis (carregue do banco se preciso).

### 4.5. API e Endpoints Protegidos
- Em cada endpoint, troque a checagem de roles por:
  ```typescript
  const allowed = await checkPermission(user, resource, action);
  if (!allowed) return res.status(403).json({ error: 'Acesso negado' });
  ```

### 4.6. Hooks e Componentes React
- Crie um hook `useAbacPermission(resource, action)` que retorna `true/false`.
- Use este hook para condicionar renderização de componentes sensíveis.

### 4.7. Integração com Zustand
- Use Zustand para armazenar o resultado das permissões e evitar múltiplas checagens desnecessárias no client.

### 4.8. Testes Automatizados
- Atualize os testes para cobrir cenários de atributos e políticas ABAC.

---

## 5. Exemplo de Função de Verificação
```typescript
// src/utils/abac.ts
import { newEnforcer } from 'casbin';
import PrismaAdapter from '@casbin/prisma-adapter';
import prisma from '@/lib/prisma';

let enforcer: any;
export async function getEnforcer() {
  if (!enforcer) {
    const adapter = await PrismaAdapter.newAdapter({ prisma });
    enforcer = await newEnforcer('abac_model.conf', adapter);
  }
  return enforcer;
}

export async function checkPermission(user, resource, action) {
  const e = await getEnforcer();
  return e.enforce(user, resource, action);
}
```

---

## 6. Exemplo de Uso em Página Protegida
```typescript
import { checkPermission } from '@/utils/abac';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await auth();
  if (!session?.user?.id) return res.status(401).json({ error: 'Não autenticado' });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const resource = await prisma.document.findUnique({ where: { id: req.query.id } });
  const allowed = await checkPermission(user, resource, 'read');
  if (!allowed) return res.status(403).json({ error: 'Acesso negado' });
  // ...restante do handler
}
```

---

## 7. Adaptação das Páginas Protegidas
- **Área do Cliente:**
  - Troque a checagem de `role`/`accessLevel` por `checkPermission(user, recurso, 'acessar-area-cliente')`.
- **Dashboard Admin:**
  - Troque a checagem de `role`/`accessLevel` por `checkPermission(user, recurso, 'acessar-dashboard-admin')`.
- **Função central:**
  ```typescript
  export async function podeAcessarAreaCliente(user, recurso) {
    return checkPermission(user, recurso, 'acessar-area-cliente');
  }
  export async function podeAcessarDashboardAdmin(user, recurso) {
    return checkPermission(user, recurso, 'acessar-dashboard-admin');
  }
  ```

---

## 8. Checklist de Refatoração
- [ ] Remover checagens de roles e accessLevel hardcoded.
- [ ] Integrar Casbin e PrismaAdapter.
- [ ] Adaptar middleware, endpoints e hooks.
- [ ] Atualizar testes.
- [ ] Documentar exemplos e onboarding.

---

## 9. Referências e Fontes
- [node-casbin/node-casbin (GitHub)](https://github.com/casbin/node-casbin)
- [node-casbin/prisma-adapter (GitHub)](https://github.com/node-casbin/prisma-adapter)
- [Casbin ABAC Docs](https://casbin.org/docs/abac)
- [Casbin Adapters](https://casbin.org/docs/adapters/)
- [Casbin Frontend Usage](https://casbin.org/docs/frontend)
- [Exemplo Casbin + Next.js](https://github.com/casbin/casbin-editor)
- [Auth.js v5 Docs](https://authjs.dev/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

## 10. Observações Finais
- O modelo ABAC permite evoluir regras sem alterar código.
- O Casbin pode ser usado tanto no backend (API/middleware) quanto no frontend (condicional de UI).
- Documente e audite todas as políticas e decisões de acesso.

---

> **Este plano cobre todos os pontos críticos para migrar seu sistema para ABAC com Casbin, integrando com Auth.js v5, Prisma, SQLite e Zustand, e serve como guia para implementação incremental e segura.**

