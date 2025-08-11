# Tarefa 02: Sistema ABAC (Attribute-Based Access Control) - Revisada 2025

## Objetivo
Garantir que o sistema de autorização utilize exclusivamente ABAC (Attribute-Based Access Control) com Casbin, eliminando qualquer resquício de RBAC, otimizando, documentando e tornando o modelo transparente e auditável.

---

## Checklist Detalhado
 [ ] remova todos warning de lint
- [ ] **Mapear todos os pontos de uso de autorização**
  - Buscar por `casbin`, `abac`, `rbac`, `policy`, `enforce`, role, acesslevel, banco de dados, revise afundo o banco de dados e remova qualquer inconsistencia e mantenha o padrao oficial, confira se o correto é roletype mesmo e se ja foi removido do banco acess level, e confira todas implicações e ajustes necessarios caso mexa no banco de dados mantenha tudo em sqlite etc.
  - Referência: [Busca no GitHub por Casbin](https://github.com/search?q=casbin)

- [ ] **Revisar e documentar o modelo ABAC**
  - Garantir que o arquivo `.conf` está modelado para ABAC puro.
  - Exemplo: [Modelo ABAC Casbin](https://casbin.org/docs/overview)
  - Usar atributos de usuário, recurso e ação.

- [ ] **Remover qualquer lógica/resíduo de RBAC**
  - Conferir middlewares, helpers, UI admin, scripts, etc.
  - Referência: [Discussão ABAC vs RBAC](https://github.com/casbin/casbin/issues/1000)

- [ ] **Revisar e documentar políticas de exemplo**
  - Exemplo de política ABAC: [Casbin Examples](https://github.com/casbin/casbin#examples)
  - Usar atributos dinâmicos e exemplos reais do sistema.

- [ ] **Revisar middlewares e hooks de autorização**
  - Garantir integração correta com Next.js (API/middleware).
  - Referência: [Casbin middlewares](https://casbin.org/docs/middlewares)

- [ ] **Documentar uso do editor online Casbin**
  - [Casbin Online Editor](https://casbin.org/editor/)

- [ ] **Documentar exemplos de uso e integração**
  - Exemplo de uso no backend e frontend.
  - Referência: [node-casbin](https://github.com/casbin/node-casbin)

- [ ] **Revisar e documentar UI administrativa**
  - Garantir que a UI admin reflete apenas ABAC.
  - Referência: [Casbin Admin Portal](https://casbin.org/docs/admin-portal)

- [ ] **Atualizar documentação interna**
  - Adicionar links para docs, exemplos e projetos de referência.


## 🎯 Subtarefas

### 1. Validação do Sistema Atual
- [ ] Conulta extensa e aprofundada na internet google e docs oficiais e no repositorio do github do CASBIN sobre abac puro nao hibrido e toda remoção completa do rbac ficando só com ABAC que é o que quermos dai compare com nosso sistema atual e implemente da melhor maneira possivel e atualizada ja criando os mesmo parametros de acesso e politicas que tinhamos antes.
- [ ] Testar todas as políticas de acesso implementadas
- [ ] Verificar funcionamento do Casbin adapter
- [ ] Validar integração com Auth.js
- [ ] Testar middleware de autorização
- [ ] Verificar logs de auditoria de acesso

### 2. Melhorias de Performance
- [ ] Otimizar cache de políticas
- [ ] Implementar cache de decisões de autorização
- [ ] Melhorar consultas ao banco de dados
- [ ] Otimizar verificação de permissões

### 3. Funcionalidades Avançadas
- [ ] Adicionar suporte a atributos contextuais
- [ ] Criar sistema de herança de roles

### 4. Interface de Administração
- [ ] Melhorar/criar  interface para gerenciar políticas para que o usuario possa ter controle total de cada uma das permissoes e alterálas e ver quem faz parte do que e toda hierarquia, tudo com shacn estilizado voce deve ter como referencia o componente-base e estilizar cada novo compoenente de acordo com o visual e temas escuro e claro do nosso projeto
- [ ] Implementar editor visual de regras
- [ ] Adicionar dashboard de monitoramento e gestao/configuração de forma completa
- [ ] Criar relatórios de acesso

### 5. ELIMINAR POR COMPLETO TODOS ERROS DE LINT WARNING E TUDO
- [ ] Executar linting no código
- [ ] Corrigir todos os warnings e erros
- [ ] Garantir que não haja novos warnings


### 7. Garantir que o sistema de roles antigos nao existe mais e eliminar todos arquivos nao utilizados
- [ ] Remover referências a roles antigas mas cuidando para nao quebrar nada que foi implementado DE ABAC PURO, tenha ceteza que esta usando abac puro consulte na internet a fonte coom referencia
- [ ] Eliminar arquivos não utilizados
- [ ] Atualizar documentação para refletir mudanças



---
**Prioridade**: Alta  
**Complexidade**: Alta  
**Tempo Estimado**: 10-12 horas

---

## Referências
- [Casbin (GitHub)](https://github.com/casbin/casbin)
- [Casbin Docs](https://casbin.org/docs/overview)
- [node-casbin](https://github.com/casbin/node-casbin)
- [Casbin Online Editor](https://casbin.org/editor/)
- [Busca Google: casbin abac](https://www.google.com/search?q=casbin+abac)
- [Projetos no GitHub usando Casbin](https://github.com/search?q=casbin)
