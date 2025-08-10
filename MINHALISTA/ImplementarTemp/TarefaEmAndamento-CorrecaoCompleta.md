# Lista de Tarefas - Correção Completa do Sistema de Autenticação

## ✅ Problemas Identificados
- [ ] **Lint/Build Warnings**: Correção de todas as warnings de TypeScript/ESLint
- [ ] **Erro OAuth Account Not Linked**: Implementar estratégia de linking automático
- [ ] **Página 404 para erros OAuth**: Criar páginas de erro customizadas
- [ ] **Sistema de Roles**: Reverter para sistema puro de roles (sem accessLevel)
- [ ] **Página Criar Conta**: Adicionar Microsoft e modernizar design
- [ ] **Audit Log**: Implementação completa do sistema de auditoria
- [ ] **Testes de Autenticação**: Melhorar cobertura e cenários
- [ ] **Análise Fuse-React**: Extrair melhorias para implementação
- [ ] **Scripts de Usuário**: Criar scripts para usuários teste
- [ ] **Teste Fluxo Completo**: Validação end-to-end

## 📋 Tarefas Detalhadas

### 1. Correção Lint/Build
- [ ] Remover imports não utilizados nos testes
- [ ] Corrigir tipos `any` em usuarios/route.ts  
- [ ] Remover variáveis não utilizadas em login/page.tsx
- [ ] Corrigir import JWT não utilizado e remover tudo de JWT e next-auth v4 procurar por residuos em toda pasta site-metodo.

### 2. Sistema OAuth
- [ ] Implementar `allowDangerousEmailAccountLinking: true` para desenvolvimento
- [ ] Criar páginas de erro OAuth customizadas
- [ ] Implementar linking automático seguro para produção

### 3. Sistema de Roles Moderno
- [ ] Remover completamente accessLevel do sistema
- [ ] Implementar sistema completo de acccount linkin com provedores sociais revisar tudo que ja temos 
- [ ] Implementar enum de roles: USER, MANAGER, ADMIN
- [ ] Atualizar middleware para usar apenas roles
- [ ] Atualizar banco de dados e tabelas para usar apenas roles
- [ ] Atualizar área cliente e admin dashboard
- [ ] Migrar todas verificações de permissão

### 4. Implementar Carregamento rapido e seletivo em paginas pesadas
- [ ] Identificar paginas pesadas para carregamento seletivo como area cliente e admindashboar implantar de forma completa tanstack/react-query e tanstack/react-table 
- [ ] Implementar Suspense e lazy loading onde aplicável
- [ ] Melhorar performance de carregamento de dados
- [ ] Implementar pré-carregamento de dados onde aplicável
- [ ] Skeleton screens para carregamento de dados onde aplicável



### 5. Página Criar Conta
- [ ] Adicionar provedor Microsoft
- [ ] Modernizar layout responsivo
- [ ] Harmonizar formulários normal e social
- [ ] Melhorar UX e acessibilidade

### 6. Audit Log Completo
- [ ] Log de login/logout
- [ ] Log de mudanças de perfil
- [ ] Log de ações administrativas
- [ ] Log de falhas de autenticação
- [ ] Dashboard de auditoria

### 7. Testes Avançados
- [ ] Teste de login credentials
- [ ] Teste de criação de conta normal
- [ ] Teste de login OAuth (todos provedores)
- [ ] Teste de criação de conta OAuth
- [ ] Teste de linking de contas
- [ ] Teste de permissões de roles

### 8. Análise Fuse-React
- [ ] Analisar sistema de permissões
- [ ] Analisar componentes de UI
- [ ] Analisar estrutura de navigation
- [ ] Analisar sistema de themes
- [ ] Extrair melhorias para implementação
- [ ] Analisar todos componentes de tabelas e exports e de dashboard no geral e implementar/adaptar para nosso projeto.
- [ ] Documentar melhorias possíveis

### 9. Scripts e Utilitários
- [ ] Script para criar usuário admin
- [ ] Script para resetar banco de desenvolvimento
- [ ] Script para popular dados teste
- [ ] Comandos de manutenção

### 10. Validação Final
- [ ] Teste manual completo
- [ ] Verificação de segurança
- [ ] Verificação de performance
- [ ] Documentação atualizada
