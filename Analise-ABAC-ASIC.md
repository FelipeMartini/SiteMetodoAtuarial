# Análise Profunda ABAC/ASIC – SiteMetodoAtuarial

## Sumário
- **Data:** 12/08/2025
- **Responsável:** GitHub Copilot
- **Objetivo:** Análise exaustiva da implementação ABAC/ASIC, identificação de resquícios de RBAC/accessLevel, comparação com padrões oficiais ASIC, análise de seeds e inconsistências, documentação de problemas e referências.

---

## 1. Contexto do Projeto
- **Stack:** Next.js, TypeScript, Prisma, Casbin (ABAC/ASIC), NextAuth.js
- **Objetivo:** Controle de acesso baseado em atributos (ABAC/ASIC puro), eliminando RBAC/accessLevel.
- **Problemas reportados:**
  - Admin (felipemartinii@gmail.com) não acessa /admin/abac
  - Novos usuários não acessam área do cliente
  - Possível loop de redirecionamento para usuários não autorizados
  - Resquícios de RBAC/accessLevel ainda presentes
  - Seeds inconsistentes (usuário errado felipemartiniii@gmail.com)

---

## 2. Diagnóstico Inicial
- **Arquivos-chave lidos:**
  - src/app/admin/abac/page.tsx
  - src/lib/abac/hoc.tsx
  - src/lib/abac/client.ts
  - src/app/api/abac/check/route.ts
  - src/lib/abac/enforcer.ts
  - src/lib/abac/prisma-adapter.ts
  - src/app/api/abac/roles/route.ts
  - src/app/api/abac/policies/route.ts
  - src/types/next-auth.d.ts
  - src/lib/auth/apiAuth.ts
  - src/lib/abac/roleMapping.ts
  - src/app/area-cliente/page.tsx
  - src/hooks/useAuth.ts
  - src/components/ui/dashboard-usuario-widget.tsx
  - src/components/Header.tsx
  - src/app/area-cliente/dashboard-admin/PageDashboardAdmin.tsx
  - src/app/area-cliente/MenuLateralCliente.tsx
  - src/app/api/auth/session/route.ts
  - prisma/schema.prisma

---

## 3. Resquícios de RBAC/accessLevel
- **Evidências encontradas:**
  - Campo `accessLevel` ainda existe no schema do Prisma e é utilizado em vários pontos do código (ex: MenuLateralCliente, PageDashboardAdmin, apiAuth.ts, session/route.ts).
  - Funções como `getRoleTypeLabel`, `hasRequiredRole` e mapeamentos em `roleMapping.ts` ainda consideram accessLevel.
  - O frontend e backend convertem accessLevel em "role" para exibição e controle de acesso.
  - Isso é incompatível com ABAC/ASIC puro, que deveria usar apenas políticas e atributos.

---

## 4. Comparação com Modelo Oficial ASIC
- **Referências:**
  - [ASIC Casbin Model](https://github.com/casbin/casbin)
  - [Casbin ABAC Docs](https://casbin.org/docs/en/abac)
  - [Prisma Adapter Casbin](https://github.com/node-casbin/prisma-adapter)
- **Diferenças identificadas:**
  - **Nosso schema:**
    - User: id, email, name, accessLevel, etc.
    - UserRole: userId, roleId, roleType
    - AuthorizationPolicy: subject, object, action, effect
  - **Modelo ASIC puro:**
    - Não utiliza accessLevel
    - Políticas são baseadas em atributos (subject, object, action, environment)
    - Usuários podem ter múltiplos atributos (não apenas role)
    - Não há conversão de accessLevel para role
  - **Conclusão:** accessLevel é um resquício de RBAC e deve ser removido do schema, código e seeds.

---

## 5. Seeds e Usuários

### Diagnóstico dos Seeds
- **Arquivo seed encontrado:** `site-metodo/prisma/seeds/seed.ts`
- **Conteúdo:**
  - Atualiza o campo `accessLevel` do usuário `felipemartinii@gmail.com` para 5.
  - Não há seed para `felipemartiniii@gmail.com` (com 3 i), mas é importante garantir que não exista no banco.
  - O seed não atribui roles, policies ou atributos ABAC/ASIC, apenas manipula accessLevel (RBAC legado).
- **Problema:**
  - O seed perpetua o uso de accessLevel, que deveria ser removido.
  - Não há seed para criar políticas ABAC/ASIC para o admin.
  - Não há seed para garantir que o admin tenha todos os atributos/policies necessários.

### Recomendações:
- Remover qualquer seed que manipule accessLevel.
- Criar seed que atribua policies ABAC/ASIC para o admin correto.
- Garantir que não exista seed para emails errados.

---

---

## 6. Checklist de Análise Profunda
```markdown
- [x] Mapear todos os pontos do código que usam accessLevel e sistema asic puro, onde estao as relações de permisoes e atributos todos inclusive isadmin e moderador, veja quais sao todos os atributos atualmente existems inclusive no banco de dados
- [x] Comparar schema atual com modelo ASIC oficial ver diferenças exatas
- [x] Listar e analisar todos os seeds de usuário
- [x] Diagnosticar seed do admin e ausência de seed para emails errados
- [ ] Verificar se há policies ABAC suficientes para admin e novos usuários
- [ ] Mapear fluxo de autenticação e atribuição de atributos (roles/policies)
- [ ] Identificar e documentar todos os pontos de conversão accessLevel -> role
- [ ] Listar todos os lugares onde accessLevel é usado para controle de acesso
- [ ] Propor plano de remoção completa do accessLevel
- [ ] Validar se o admin tem todas as permissões necessárias
- [ ] Validar se novos usuários recebem atributos/policies corretos
- [ ] Verificar se não há mais seeds ou usuários inconsistentes
- [ ] Documentar referências e links consultados
**Obrigatório:**
- [ ] Implementar seed automático para o usuário `felipemartinii@gmail.com` como admin ABAC puro, com todas as permissões necessárias, sempre que o projeto for criado do zero.
- [ ] O schema do banco de dados deve seguir exatamente o padrão ASIC/Casbin puro, sem campos RBAC (ex: accessLevel, roleType), apenas policies e atributos.
```

---

## 7. Referências Utilizadas

- [Casbin ABAC Model Example](https://github.com/casbin/casbin/blob/master/examples/abac_model.conf)
- [Casbin GitHub](https://github.com/casbin/casbin)
- [Prisma Adapter Casbin](https://github.com/node-casbin/prisma-adapter)
- [ABAC vs RBAC](https://auth0.com/docs/secure/access-control/rbac/)
- [ASIC Model Overview](https://github.com/casbin/casbin/blob/master/docs/model.md)
- [Casbin Online Editor](https://casbin.org/editor/)

---

## 8. Observações Iniciais

- O sistema ainda depende de accessLevel para controle de acesso, o que é incompatível com ABAC/ASIC puro.
- Seeds e policies precisam ser revisados para garantir que apenas o admin correto exista e que todos os controles sejam feitos via políticas ABAC.
- O modelo recomendado pelo Casbin/ASIC para ABAC puro não utiliza accessLevel, apenas policies `{subject, object, action}` e atributos.
- O modelo de tabela recomendado para persistência de policies é:
  ```prisma
  model CasbinRule {
    id    Int     @id @default(autoincrement())
    ptype String
    v0    String?
    v1    String?
    v2    String?
    v3    String?
    v4    String?
    v5    String?

    @@map("casbin_rule")
  }
  ```
- Nosso schema mistura RBAC (accessLevel, roleType) e ABAC (AuthorizationPolicy), o que gera inconsistências.
- Próximos passos: continuar checklist, detalhar cada ponto, propor plano de migração e correção.


---

## 9. Análise Comparativa Profunda do Banco de Dados

### Nosso Schema (atual)
- Modelo User possui `accessLevel` (Int) e `roleType` (enum UserRoleType), ambos herdados do RBAC.
- Modelo UserRole faz relação many-to-many entre User e Role, com campo `roleType` e enum.
- Modelo AuthorizationPolicy implementa policies ABAC, mas coexistem com RBAC.
- Seeds manipulam accessLevel, não policies ABAC.

### Modelo ASIC/Casbin Puro (recomendado)
- Não existe `accessLevel`, `roleType` ou enum de roles.
- Não existe UserRoleType, nem UserRole.
- Não existe modelo Role separado.
- O controle é feito apenas por policies `{subject, object, action}` e atributos.
- Persistência recomendada:
  ```prisma
  model CasbinRule {
    id    Int     @id @default(autoincrement())
    ptype String
    v0    String?
    v1    String?
    v2    String?
    v3    String?
    v4    String?
    v5    String?

    @@map("casbin_rule")
  }
  ```
- O usuário admin deve ser criado via seed já com todas as policies necessárias (exemplo: `p, felipemartinii@gmail.com, /admin/abac, manage`).

### Conflito de nomenclatura e herança RBAC
- O campo `roleType` foi criado para tentar migrar do RBAC, mas conflita com o conceito de role do Casbin/ASIC, que é apenas um atributo/policy.
- O campo `role` já existia no RBAC, mas no ABAC puro não existe como entidade fixa, apenas como atributo/policy.
- Isso gerou conflitos na primeira instalação e dificulta a adoção do modelo puro.

### Problema central
- O banco de dados precisa ser migrado para o padrão ASIC/Casbin puro, eliminando todos os campos e entidades RBAC.
- O seed do admin deve ser ABAC puro, sem manipular accessLevel ou roleType, apenas policies.
- O sistema deve garantir que, ao criar o projeto do zero, o admin correto já exista com todas as permissões ABAC necessárias.

---

## 10. Continuação da Análise

---

## 11. Autenticação: Auth.js v5, MFA, Account Linking e Provedores

- O sistema utiliza **Auth.js v5 beta puro**. Não pode haver resquícios de NextAuth v4.
- **Multifator (MFA)** implementado (TOTP, WebAuthn, etc) não pode ser quebrado.
- **Account linking**: todos provedores de conta (Google, GitHub, etc) devem ser mantidos e não podem ser removidos ou quebrados.
- O fluxo de login normal (senha/email) e login social (OAuth) deve funcionar normalmente, sem interrupções.
- **Zod** é utilizado para validação de dados e não pode ser removido.
- Qualquer migração de schema ou refatoração não pode quebrar:
  - MFA
  - Account linking
  - Provedores sociais
  - Login normal
  - Validações Zod

### Checklist de Autenticação
```markdown
- [ ] Garantir que não há dependências de NextAuth v4
- [ ] Garantir que MFA, account linking e todos provedores funcionam após migração
- [ ] Garantir que login social e normal funcionam sem interrupção
- [ ] Garantir que Zod está presente e funcional
```

---

## 12. Problema de Redirecionamento: Localhost vs IP da Rede

- Ao logar via celular na rede interna, o sistema redireciona para `localhost:3000` ao invés do IP da máquina (ex: `10.0.0.69:3000`).
- Isso impede o login em dispositivos que não são o próprio host.
- O comportamento padrão é determinado pelo provedor OAuth (ex: Google), que exige que o **redirect URI** seja cadastrado no console do provedor.
- Normalmente, só é possível cadastrar um ou poucos redirect URIs por aplicação no Google Console.
- **Problema:**
  - O sistema deveria ser flexível para aceitar o IP da rede ou o domínio acessado, não apenas localhost.
  - O ideal seria que o redirect URI retornasse para o mesmo host/ip que originou a requisição.
- **Pontos de investigação:**
  - Como configurar redirect URIs dinâmicos para provedores OAuth?
  - É possível cadastrar múltiplos URIs no Google Console? Há limites?
  - Existem estratégias para ambientes de desenvolvimento (ex: usar ngrok, wildcard domains, etc)?
  - Como garantir que o fluxo de login social funcione tanto em localhost quanto em IP de rede?

---

## 13. Comparação Detalhada: Nosso Schema vs ASIC/Casbin

---

## 14. Análise dos Atributos e Regras ABAC/ASIC Atuais vs Padrão ASIC

---

## 🚨 Destaque Crítico: Incompatibilidade de Enums/Campos Fixos/Strings com ABAC Puro

> **ATENÇÃO:**
>
> O sistema ainda utiliza enums, campos fixos e checagem por string para admin/moderador (ex: `roleType`, `UserRoleType`, `accessLevel`, checagem de 'admin', 'moderador', etc.), o que é **incompatível com ABAC puro**.
>
> **No padrão ASIC/ABAC puro:**
> - Não existem enums/campos fixos para roles.
> - Não existe checagem de permissão por string ou enum no código.
> - Tudo é policy dinâmica e atributos livres, definidos em tempo de execução.
>
> **Recomendação:**
> - Eliminar todos os enums/campos fixos de roles, accessLevel, UserRoleType, etc.
> - Centralizar permissões em policies ABAC (CasbinRule).
> - Toda checagem de permissão deve ser feita via enforcer ABAC, nunca por string ou enum.

---
---

## 15. Plano de Migração e Refatoração para ABAC/ASIC Puro

### Etapas Recomendadas
1. **Remover todos os campos e enums RBAC do schema:**
  - accessLevel, roleType, UserRoleType, UserRole, Role, etc.
2. **Migrar policies para CasbinRule:**
  - Persistir todas as permissões em CasbinRule, não em AuthorizationPolicy.
3. **Refatorar código para usar apenas enforcer ABAC:**
  - Eliminar checagens por string ('admin', 'moderador', etc.) e enums.
  - Toda autorização deve ser feita via enforcer Casbin.
4. **Criar seed ABAC puro para admin:**
  - Exemplo: `p, felipemartinii@gmail.com, /admin/abac, manage`
5. **Revisar e adaptar testes, MFA, account linking, provedores sociais:**
  - Garantir que nada é quebrado na autenticação e fluxo de login.
6. **Documentar e treinar equipe para novo padrão ABAC puro.**

### Exemplo de Policies ABAC Puro
```csv
p, felipemartinii@gmail.com, /admin/abac, manage
p, grupo-moderadores, /admin, view
g, usuario@email.com, grupo-moderadores
```

---

## 16. Continuação da Análise Aprofundada

### Mapeamento dos Principais Pontos de Checagem por Enum/Campo Fixo/String

- **Hooks e tipos:**
  - `useRegistrarUsuario.ts`: utiliza `accessLevel`.
  - `usuarioSchemas.ts`: valida `roleType`.
  - `next-auth.d.ts`: define `accessLevel`, `role`.
- **Componentes e lógica de UI:**
  - `Header.tsx`: exibe links de admin/staff baseado em `role` string.
  - `Dashboard Admin`: widgets e rotas protegidas por checagem de `role` string.
- **Middleware e policies:**
  - `middleware.ts`, `hoc.tsx`: checagem de roles por string e array.
  - `prisma-adapter.ts`: busca e atribui roles via entidades e campos fixos.
- **Policies e modelos:**
  - `pure_abac_policies.csv`, `basic_policies.csv`: ainda há mistura de roles fixos e atributos dinâmicos.
  - Modelos híbridos (RBAC+ABAC) presentes.
- **Enums e entidades:**
  - `UserRoleType`, `Role`, `UserRole` ainda existem no schema e código comprar com github assic oficial puro se atualize e veja o que temos que mudar para manter o padrao puro.

### Recomendações para Refatoração Incremental
1. **Priorizar refatoração dos pontos de checagem de permissão por string/enums:**
   - Substituir por chamadas ao enforcer ABAC.
2. **Remover gradualmente enums/campos fixos do schema e código:**
   - Adaptar migrations e testes.
3. **Centralizar toda lógica de autorização em policies ABAC:**
   - Atualizar policies para usar apenas atributos dinâmicos.
4. **Documentar cada etapa e garantir retrocompatibilidade temporária até migração total.**

### Exemplos de Refatoração
- Antes:
  ```ts
  if (user.role === 'admin') { /* ... */ }
  ```
- Depois:
  ```ts
  if (await enforcer.enforce(user.email, '/admin/abac', 'manage')) { /* ... */ }
  ```

---

- Mapear todos os pontos do código que ainda fazem checagem por string ou enum para permissão.
- Listar todos os lugares onde accessLevel, roleType, UserRoleType, Role, UserRole são usados.
- Propor plano incremental de refatoração para cada ponto identificado.
- Validar se todas as rotas e áreas protegidas estão cobertas por policies ABAC.
- Garantir que o fluxo de autenticação, MFA, account linking e provedores sociais não seja afetado.
- Documentar exemplos de policies para todos os perfis do sistema (admin, moderador, editor, usuário comum).

---

### Atributos e Regras Atuais no Projeto
- O sistema ainda utiliza atributos herdados do RBAC, como:
  - `accessLevel` (User)
  - `roleType` (User, UserRole, enum UserRoleType)
  - `isActive` (User, UserRole)
  - `Role` e `UserRole` (entidades e relacionamentos)
- Enum `UserRoleType` define: GUEST, USER, MODERATOR, ADMIN
- Diversos pontos do código e banco usam strings como 'admin', 'moderador', 'editor', 'viewer' para checagem de permissões.
- Policies ABAC são implementadas em `AuthorizationPolicy`, mas coexistem com RBAC.
- Não há atributo `isAdmin` explícito, mas a lógica de admin/moderador é feita via roleType, accessLevel ou role string.

### Padrão ASIC/ABAC Recomendado
- Não existe `accessLevel`, `roleType`, `UserRoleType`, nem entidades Role/UserRole.
- Não há enum fixo de roles; qualquer atributo pode ser usado como subject em policies.
- Atributos são livres e definidos por policies, ex:
  - `p, felipemartinii@gmail.com, /admin/abac, manage`
  - `p, grupo-moderadores, /admin, view`
- Não há checagem de 'admin', 'moderador', etc. por string fixa no código; tudo é policy.
- Atributos podem ser adicionados como claims extras no usuário, mas não como enum ou campo fixo.

### Diferenças e Recomendações
- O sistema atual mistura checagem de role por string, enums e policies, o que gera inconsistência e dificulta manutenção.
- Recomenda-se:
  - Remover todos os enums e campos fixos de role/accessLevel/moderador/admin.
  - Centralizar todas as permissões em policies ABAC (CasbinRule).
  - Se necessário, criar grupos (ex: grupo-admins) via policies, não via enum/campo fixo.
  - Checagens de permissão devem ser sempre via Casbin (enforcer), nunca por string ou enum no código.
- Exemplo de policy ABAC puro:
  - `p, felipemartinii@gmail.com, /admin/abac, manage`
  - `p, grupo-moderadores, /admin, view`
  - `g, usuario@email.com, grupo-moderadores`

### Resumo
- O modelo ASIC puro é mais flexível, seguro e fácil de manter.
- Atributos como isAdmin/moderador devem ser eliminados do schema/código e substituídos por policies dinâmicas.
- Toda lógica de permissão deve ser centralizada no enforcer ABAC.

---

### Nosso Schema (resumo)
- User: id, name, email, accessLevel, roleType, MFA, relacionamentos Auth.js, etc.
- UserRole: userId, roleId, roleType, etc.
- Role: id, name, description, attributes
- AuthorizationPolicy: subject, object, action, effect, conditions
- Diversos modelos auxiliares para MFA, notificações, logs, etc.

### ASIC/Casbin Puro
- User: id, name, email, MFA, relacionamentos mínimos
- CasbinRule: id, ptype, v0-v5 (policies)
- Não existe accessLevel, roleType, UserRole, Role separado
- Policies são persistidas em CasbinRule, não em AuthorizationPolicy
- Todos os controles de acesso são feitos via policies `{subject, object, action}`

### Diferenças Críticas
- Nosso schema mistura RBAC e ABAC, ASIC puro é só ABAC
- Temos entidades e enums extras (roleType, accessLevel, UserRole)
- Policies não estão centralizadas em CasbinRule
- MFA, notificações e logs podem ser mantidos, mas não podem interferir no controle de acesso

### Banco de Dados
- **Obrigatório:** Todo o banco de dados e tabelas do ASIC devem estar em **SQLite** (compatível com Casbin/Prisma)
- O modelo CasbinRule deve ser implementado exatamente como recomendado

---

- Próximos passos: detalhar fluxo de autenticação, mapear conversões accessLevel→role, listar todos os usos de accessLevel, propor plano de migração e correção.

---

*Este arquivo será atualizado continuamente durante a análise.*
