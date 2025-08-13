# Controle de Progresso - Revisão Completa Site Método Atuarial

## Status Geral: EM ANDAMENTO

### Lista de Tarefas Principal

- [x] **01 - Tarefas Iniciais**
  - [x] Corrigir item do menu superior para consistência de layout - CONCLUÍDO: Adicionado ThemeToggle ao AdminLayout
  - [x] Garantir que página admin ABAC não tenha loop infinito - CONCLUÍDO: Removido dependências infinitas do useEffect
  - [x] Seguir ciclo de validação obrigatório - CONCLUÍDO: Type-check e lint passando
  
- [ ] **02 - Dashboard Admin & Página ABAC**
  - [ ] Análise profunda do projeto referência: https://github.com/arhamkhnz/next-shadcn-admin-dashboard
  - [ ] Refatorar TODOS os componentes para shadcn/ui
  - [ ] Implementar dark/light mode unificado
  - [ ] Adicionar widgets de métricas, logs e status
  - [ ] Integrar TanStack Table para tabelas dinâmicas
  - [ ] Garantir acessibilidade (WCAG 2.2+)
  - [ ] Testar responsividade
  - [ ] Documentar padrões
  - [ ] Modernizar área do cliente integrada
  - [ ] Exibir foto de perfil na barra superior

- [ ] **03 - Área do Cliente**
  - [ ] Refatorar TODOS os componentes para shadcn/ui
  - [ ] Implementar dark/light mode
  - [ ] Adicionar dashboard do usuário
  - [ ] Integrar logs/auditoria em tempo real
  - [ ] Garantir acessibilidade
  - [ ] Testar responsividade
  - [ ] Documentar padrões
  - [ ] Garantir integração visual/técnica com admin
  - [ ] Limpeza de arquivos temporários
  - [ ] Revisão de variáveis e conflitos

- [ ] **04 - Auditoria & Logs**
  - [ ] Refatorar sistema para logs permanentes no BD
  - [ ] Garantir tabela logs siga padrão ABAC puro
  - [ ] Documentar estrutura da tabela
  - [ ] Implementar consulta/exportação/auditoria
  - [ ] Validar integração MFA/notificações
  - [ ] Limpeza de arquivos
  - [ ] Revisão de variáveis

- [ ] **05 - Sistema de Notificações**
  - [ ] Refatorar para notificações permanentes no BD
  - [ ] Garantir tabela notificações ABAC puro
  - [ ] Documentar estrutura
  - [ ] Integrar com logs e auditoria
  - [ ] Validar integração MFA/logs
  - [ ] Limpeza de arquivos
  - [ ] Revisão de variáveis

- [ ] **06 - Sistema de E-mails**
  - [ ] Refatorar templates de e-mail
  - [ ] Adicionar logs de envio/rastreio
  - [ ] Integrar com notificações
  - [ ] Suporte múltiplos provedores
  - [ ] Documentar arquitetura
  - [ ] Limpeza de arquivos
  - [ ] Revisão de variáveis

- [ ] **07 - Cálculos Atuariais**
  - [ ] Criar modelo Prisma para Tábuas de Mortalidade
  - [ ] Implementar importação Excel
  - [ ] Implementar exportação Excel/PDF
  - [ ] Validar integridade das tábuas
  - [ ] Integrar com cálculos existentes
  - [ ] Adicionar testes unitários
  - [ ] Documentar exemplos
  - [ ] Validação manual completa

- [ ] **08 - Autenticação Multifator (MFA)**
  - [ ] Refatorar para múltiplos métodos
  - [ ] Integrar com logs/auditoria
  - [ ] Integrar com notificações
  - [ ] Painel gerenciamento MFA
  - [ ] Flows de recuperação
  - [ ] Documentar arquitetura
  - [ ] Revisar tabela MFA ABAC puro
  - [ ] Limpeza e revisão

- [ ] **09 - Limpeza Profunda & Refatoração**
  - [ ] Mapear arquivos/pastas obsoletos
  - [ ] Remover desnecessários
  - [ ] Auditar arquivos em implementação
  - [ ] Garantir ausência código morto
  - [ ] Documentar mudanças estrutura
  - [ ] Limpeza arquivos temporários
  - [ ] Revisão variáveis

- [ ] **10 - Auditoria Final & Validação**
  - [ ] Lint e type-check completo
  - [ ] Build sem erros
  - [ ] Validar acessibilidade e responsividade
  - [ ] Documentar todas mudanças
  - [ ] Limpeza final
  - [ ] Revisão variáveis final
  - [ ] Teste manual todos links/endpoints

## Instruções Obrigatórias Sempre Seguir:

### Ciclo de Validação Obrigatório:
1. Corrija TODOS os erros de type-check (TypeScript)
2. Corrija TODOS os erros/avisos de lint
3. Corrija TODOS os erros de build
4. Repita até zerar erros
5. Execute limpeza arquivos temporários/resíduos
6. Revise variáveis para evitar conflitos (auth/endpoints)
7. Acesse TODOS links/endpoints no navegador
8. Só avance após 100% limpo

### Tipagem Obrigatória:
- Nunca usar `any`
- Tipos `unknown` devem ser tipados explicitamente
- Prefira tipagens oficiais das bibliotecas
- Revise tipagem de funções, variáveis e props

### Projeto de Referência Obrigatório:
https://github.com/arhamkhnz/next-shadcn-admin-dashboard

## Log de Atividades:
- **[13/08/2025 - Início]** Criado arquivo de controle e iniciando leitura completa de documentação
- **[13/08/2025 - Análise]** Analisou profundamente projeto de referência: https://github.com/arhamkhnz/next-shadcn-admin-dashboard
- **[13/08/2025 - Tarefa 01]** INICIANDO TAREFA 01 - TAREFAS INICIAIS
- **[13/08/2025 - Tarefa 01 CONCLUÍDA]** ✅ TAREFA 01 CONCLUÍDA COM SUCESSO
  - ✅ Corrigido menu superior admin com ThemeToggle para consistência
  - ✅ Corrigido loop infinito página ABAC removendo dependências infinitas
  - ✅ Type-check e lint zerados
  - ✅ Servidor funcionando corretamente
