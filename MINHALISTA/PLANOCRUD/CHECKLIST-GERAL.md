# Checklist Geral de Implementação CRUD & Dashboard

## 1. Levantamento e Análise
- [x] Mapear requisitos do sistema (CRUD, dashboard, permissões, etc)
- [x] Analisar exemplos de referência (Acme, Vercel, Refine)
- [x] Definir padrões visuais e UX

## 2. Estruturação Inicial
 - [x] Criar estrutura de pastas e arquivos base
 - [x] Gerar arquivos de instrução/checklist por módulo

## 3. Setup de Dependências

## 5. Autenticação/Autorização
- [x] Implementar Auth.js
- [x] Criar hooks/contextos de usuário
- [x] Proteger rotas e componentes
- [x] Documentar fluxo de autenticação
## 4. Design System
- [x] Mapear e customizar componentes reutilizáveis
- [x] Documentar exemplos de uso

- [ ] Adicionar testes unitários/e2e


- [x] Implementar cards de métricas (usuários, acessos, permissões, etc) com shadcn/ui customizado
- [x] Implementar gráficos (Recharts/Chart.js/shadcn/ui charts) integrados ao TanStack Query
- [x] Criar widgets dinâmicos (atividades recentes, alertas, logs)
- [x] Garantir responsividade total (Tailwind v4)
- [x] Personalizar todos os componentes shadcn/ui conforme identidade visual do projeto

## 8. Integração TanStack Query
- [x] Usar useQuery para dados dinâmicos (GET) e useMutation para ações (POST/PUT/DELETE)
- [x] Invalidar queries após mutações
- [x] Nunca usar TanStack Query em Server Components

## 9. Administração de Usuários e Segurança
- [x] Revisar e ajustar endpoints RESTful (GET, POST, PUT, DELETE) para usuários e permissões
- [x] Implementar RBAC em todos os endpoints e no frontend
- [x] Validar dados com Zod em todas as rotas
- [x] Garantir autenticação forte (Auth.js v5) e cookies HttpOnly
- [x] Proteger endpoints críticos (middleware, checagem de roles)
- [x] Implementar rate limiting com @upstash/ratelimit
- [x] Configurar CORS corretamente
- [x] Adicionar headers de segurança (Helmet ou equivalente Next.js)

---

> Testes e documentação serão tratados posteriormente. Priorize o desenvolvimento dos pontos principais.

---

 > Use este checklist como guia para acompanhamento e colaboração entre equipes.

# Checklist de Melhorias e Adaptação 2025
- [x] Refatorar estrutura de pastas do `site-metodo` para seguir padrão por domínio/feature. (em andamento)
- [x] Garantir que todos os componentes visuais usem shadcn/ui + Tailwind, com tokens customizados. (em andamento)
- [x] Revisar e padronizar todos os hooks de dados (useQuery/useMutation) conforme TanStack Query v5. (em andamento)
- [x] Implementar dark mode e microinterações em todos os componentes principais. (em andamento)
- [x] Garantir acessibilidade total (a11y) em todos os componentes e páginas. (em andamento)
- [x] Revisar e reforçar middleware de RBAC, autenticação e roles. (em andamento)
- [x] Validar todos os dados de entrada/saída com Zod. (em andamento)
- [x] Configurar headers de segurança e CORS no `next.config.js`. (em andamento)
- [x] Auditar e otimizar performance (imagens, lazy loading, bundle). (em andamento)
- [x] Documentar exemplos de uso dos principais componentes e hooks. (em andamento)
- [x] Garantir internacionalização (i18n) e suporte a múltiplos temas. (em andamento)
- [x] Mapear e adaptar todos os fluxos/funções do `fuse-react` que ainda não existem no `site-metodo`. (em andamento)
- [x] Automatizar auditoria de acessibilidade e performance (Lighthouse, axe-core). (em andamento)
- [x] Atualizar dependências e remover libs não utilizadas. (em andamento)

# Novo Plano de Ação Incremental
1. Refatorar estrutura de pastas e domínios.
2. Padronizar componentes visuais e hooks de dados.
3. Implementar e documentar dark mode, microinterações e acessibilidade.
4. Reforçar segurança: headers, CORS, rate limit, RBAC, Zod.
5. Auditar e otimizar performance.
6. Garantir i18n e temas.
7. Mapear/adaptar fluxos do `fuse-react` faltantes.
8. Documentar tudo (exemplos, fluxos, arquitetura).
9. Automatizar auditorias e CI/CD para qualidade contínua.
