---
applyTo: '**'
---

# Task 02: Sistema ABAC (Attribute-Based Access Control) - REVISADA 2025
**Status**: 🔄 Em Progresso  
**Data de Início**: 11/08/2025 17:20  
**Última Atualização**: 11/08/2025 17:20  

## 🎯 Objetivo Principal
Garantir que o sistema de autorização utilize exclusivamente ABAC (Attribute-Based Access Control) com Casbin, eliminando qualquer resquício de RBAC, otimizando, documentando e tornando o modelo transparente e auditável.

## 📋 Checklist Geral de Progresso

### 🧹 1. LIMPEZA INICIAL E PREPARAÇÃO
- [x] **CONCLUÍDO**: Resolver warnings de lint (~130 warnings reduzidos para <50)
- [x] **CONCLUÍDO**: Mapear todos os pontos de uso de autorização no projeto
- [x] **CONCLUÍDO**: Identificar todos os resquícios de RBAC para remoção
- [x] **CONCLUÍDO**: Documentar sistema ABAC atual

### 🔍 2. ANÁLISE DETALHADA DO SISTEMA ATUAL  
- [x] **Descoberto**: Sistema ABAC já implementado em `/src/lib/abac/`
- [x] **Descoberto**: ABACEnforcer class com custom Prisma adapter
- [x] **Descoberto**: Middleware ABAC funcional
- [x] **Descoberto**: HOC components para proteção de rotas
- [ ] **Analisar**: Database schema - remover campos RBAC (accessLevel, roleType)
- [ ] **Analisar**: Policy model (.conf file) para garantir ABAC puro
- [ ] **Analisar**: Todas as referências a roles/RBAC encontradas

### 🔄 3. PURIFICAÇÃO ABAC - REMOÇÃO RBAC
- [x] **CONCLUÍDO**: Criar modelo ABAC puro (pure_abac_model.conf)
- [x] **CONCLUÍDO**: Atualizar enforcer para usar modelo ABAC puro
- [x] **CONCLUÍDO**: Remover métodos RBAC do enforcer (addRoleForUser, etc.)
- [x] **CONCLUÍDO**: Atualizar tipos para remover interfaces RBAC
- [x] **CONCLUÍDO**: Criar políticas de exemplo ABAC puras
- [ ] Remover campos deprecated do schema.prisma
  - [ ] User.accessLevel (marcado como @deprecated)
  - [ ] User.roleType (se ainda existir)
  - [ ] UserRole model (manter apenas se necessário para ABAC)
- [ ] Limpar middleware.ts de verificações RBAC
- [ ] Remover /src/utils/rbac.ts completamente
- [ ] Limpar HOC components de verificações de role
- [ ] Atualizar AuthorizationPolicy model se necessário

### 📚 4. PESQUISA E REFERÊNCIA OFICIAL
- [ ] **OBRIGATÓRIO**: Buscar documentação oficial Casbin ABAC
- [ ] **OBRIGATÓRIO**: Comparar implementação atual com best practices
- [ ] **OBRIGATÓRIO**: Verificar modelo de políticas (.conf)
- [ ] **OBRIGATÓRIO**: Consultar exemplos oficiais node-casbin

### 🛠️ 5. IMPLEMENTAÇÃO E REFINAMENTO
- [ ] Revisar e otimizar modelo ABAC (.conf file)
- [ ] Atualizar políticas de exemplo para serem puramente ABAC
- [ ] Implementar cache de decisões de autorização
- [ ] Otimizar performance das consultas ABAC
- [ ] Criar sistema de auditoria aprimorado

### 🎨 6. INTERFACE ADMINISTRATIVA
- [ ] Criar/melhorar dashboard para gerenciamento de políticas
- [ ] Implementar editor visual de regras ABAC
- [ ] Adicionar interface para gestão de atributos de usuário
- [ ] Criar relatórios de acesso e monitoramento
- [ ] Estilizar com shadcn/ui mantendo tema dark/light

### ✅ 7. VALIDAÇÃO E TESTES
- [ ] Testar todas as funcionalidades de autorização
- [ ] Validar que não há mais referências RBAC
- [ ] Testar middleware em todas as rotas protegidas
- [ ] Verificar compatibilidade com Auth.js v5
- [ ] Executar testes de performance

### 📝 8. DOCUMENTAÇÃO FINAL
- [ ] Atualizar documentação interna completa
- [ ] Criar guia de uso do sistema ABAC
- [ ] Documentar todas as políticas implementadas
- [ ] Criar exemplos de uso para desenvolvedores

## 🚨 DESCOBERTAS IMPORTANTES

### ✅ Sistema ABAC Já Existente
- **Local**: `/src/lib/abac/`
- **Componentes**: ABACEnforcer, custom Prisma adapter, middleware, HOC
- **Status**: Funcional mas com resquícios RBAC

### ⚠️ Resquícios RBAC Identificados
- `User.accessLevel` - marcado como @deprecated no schema
- Verificações de role em middleware.ts
- useRole hook em hoc.tsx
- /src/utils/rbac.ts - arquivo legado
- Referências a roles em 20+ arquivos

### 🗄️ Database Schema Issues
- UserRole model ainda existe (verificar se necessário)
- UserRoleType enum presente
- Campos accessLevel marcados como deprecated
- Possível necessidade de migration

## 📊 Progresso Atual
**Total de Tarefas**: 32  
**Concluídas**: 4  
**Em Andamento**: 1  
**Pendentes**: 27  
**Progresso**: 12.5%

## 🔗 Links de Referência Oficial
- [Casbin Documentation](https://casbin.org/docs/overview)
- [Node-Casbin GitHub](https://github.com/casbin/node-casbin)
- [ABAC Model Examples](https://casbin.org/docs/abac)
- [Casbin Online Editor](https://casbin.org/editor/)

## 📝 Notas de Implementação
- Manter compatibilidade com Auth.js v5
- Preservar funcionalidades existentes durante transição
- Focar em performance e cache
- Garantir auditoria completa de todas as alterações

---
**Próximos Passos**:  
1. Buscar documentação oficial Casbin ABAC
2. Analisar modelo atual vs. best practices
3. Começar remoção sistemática de RBAC
4. Implementar purificação do database schema
