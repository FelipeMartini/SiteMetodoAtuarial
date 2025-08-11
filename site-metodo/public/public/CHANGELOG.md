# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.
O formato segue o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e este projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado

- Estrutura modular baseada no padrão fuse-react (Next.js Skeleton).
- README.md detalhado, com regras, estrutura, onboarding, exemplos práticos e boas práticas para toda a equipe.
- Seção de recomendações para evolução futura: dashboards, relatórios, cálculos atuariais, controle de usuários e tecnologias modernas.
- Implementação de design system centralizado em `src/components/ui`.
- Integração com Auth.js para autenticação social (Google, GitHub, Apple, Twitter/X).
- Integração com Prisma ORM e banco de dados relacional.
- Testes automatizados com Jest e cobertura de código.
- Suporte a temas claros/escuros e alternância dinâmica.
- Configuração de ESLint, Prettier e CSpell para padronização e qualidade.
- Estrutura de features isoladas e modulares em `src/features`.
- Estrutura de API em `src/api` (hooks, services, types, models).
- Estrutura de contexts, hooks e lib para organização de lógica compartilhada.
- Estrutura de testes unitários e snapshots.
- Estrutura de assets públicos unificada em `public/`.
- Checklist de reestruturação documentado em `CHECKLIST_REESTRUTURACAO.md`.

### Modificado

- Refatoração completa da estrutura de pastas para seguir o padrão fuse-react.
- Atualização de todos os imports e caminhos para refletir a nova estrutura.
- Atualização das tasks e configurações do VS Code para uso de caminhos absolutos e corretos.
- Atualização do package-lock.json e .env.local para refletir o novo nome do projeto e caminhos.
- README.md revisado, expandido e didatizado para servir como referência obrigatória.
- Otimização de imagens, lazy loading e responsividade.
- Padronização de temas, tipagem e propriedades dos componentes.
- Comentários explicativos adicionados em todo o código.

### Corrigido

- Correção de referências quebradas a imagens e assets após unificação da pasta public.
- Correção de problemas de terminal e tasks apontando para diretórios antigos (ex: nextjs-app).
- Remoção de arquivos, pastas e resíduos obsoletos após a migração.
- Ajustes em testes automatizados, cobertura e snapshots.
- Correção de navegação, rotas protegidas e fluxo de autenticação.
- Ajustes de acessibilidade e responsividade.

---

### [2025-08-08] - Refatoração Auth.js puro, access level e logout

#### Corrigido/Refatorado

- Refatoração profunda do sistema de autenticação para uso do Auth.js puro (`@auth/core`), eliminando completamente qualquer dependência ou vestígio de `next-auth` antigo.
- Padronização do hook `useAuth` e endpoints para garantir segurança, tipagem e compatibilidade com Auth.js v5+.
- Correção de problemas de tipagem, imports e duplicidade de código no hook de autenticação.
- Auditoria completa para garantir ausência de conflitos, imports ou tipos antigos de `next-auth`.
- Identificado e será corrigido: campo `accessLevel` do usuário não está sendo retornado na sessão, impedindo menus/admin para usuários nível 5.
- Identificado e será corrigido: problema no sistema de logout, onde o menu superior não atualiza corretamente após logout.

#### Checklist das próximas tarefas

1. Corrigir o sistema de logout para que o menu superior e mensagem de usuário sumam imediatamente após logout.
2. Corrigir o endpoint `/api/auth/session` para retornar o campo `accessLevel` no objeto `user` da sessão.
3. Padronizar o uso do tipo oficial `Session` do Auth.js puro em todo o projeto.
4. Revisar e ajustar todos os componentes e hooks consumidores de sessão para garantir compatibilidade com o novo tipo e com o campo `accessLevel`.
5. Garantir que menus e páginas administrativas sejam exibidos corretamente para usuários nível 5.
6. Rodar build, lint e testes para garantir ausência de erros.
7. Documentar e versionar todas as mudanças.

---

_Commit e push detalhado realizado antes de iniciar as próximas tarefas críticas de correção e padronização._

### Removido

- Remoção de toda a estrutura antiga (nextjs-app, src/public duplicada, arquivos e pastas vazias).
- Remoção de instruções e comentários obsoletos.
- Limpeza de arquivos duplicados, resíduos e variáveis não utilizadas.

### Histórico resumido de implementações anteriores (baseado nos commits):

- Modernização completa do projeto Next.js: otimização de imports, memoização, lazy loading, responsividade, acessibilidade e documentação.
- Refatoração e padronização de todos os componentes principais, ErrorBoundary, diretiva 'use client', testes Jest, padronização de páginas e design system.
- Implementação de multi temas com alternância, persistência em cookies e revisão visual.
- Cobertura de testes automatizados expandida, ajustes em queries institucionais e garantia de sucesso em todos os testes.
- Remoção de arquivos duplicados, resíduos e migração completa para App Router.
- Ajuste do SocialLoginBox: inputs dinâmicos, alinhamento visual, limitação de caracteres e comentários explicativos.
- Correção de erros de hydration, build, tipagem e integração total de temas.
- Integração e revisão final do sistema: área do cliente, relatórios, navegação, login/logout, rodapé otimizado.

## [1.0.0] - 2025-08-06

### Adicionado

- Criação do projeto institucional Método Atuarial com Next.js, React, TypeScript e arquitetura moderna.
- Primeira versão funcional com autenticação, design system, temas, testes e documentação inicial.

---

_Mantenha este changelog sempre atualizado a cada release ou mudança importante!_
