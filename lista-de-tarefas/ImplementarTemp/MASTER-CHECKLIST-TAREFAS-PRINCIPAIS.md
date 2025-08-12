# 🚀 TAREFAS PRINCIPAIS EM ANDAMENTO - PROJETO SITE MÉTODO ATUARIAL

**Data de Início:** 12/08/2025  
**Responsável:** GitHub Copilot  
**Status:** EM EXECUÇÃO

---

## 🎯 CHECKLIST MASTER DE TAREFAS

### ✅ FASE 1: ANÁLISE E MIGRAÇÃO ABAC/ASIC (PRIORIDADE MÁXIMA)
- [ ] **1.1** Ler e analisar completamente `Analise-ABAC-ASIC.md`
- [ ] **1.2** Acessar TODOS os links de referência obrigatórios
- [ ] **1.3** Executar Lint Absoluto (corrigir todos os erros)
- [ ] **1.4** Executar Type Check Absoluto (corrigir todos os erros)
- [ ] **1.5** Executar Build Next.js Absoluto (corrigir todos os erros)
- [ ] **1.6** Remover completamente todos os resquícios de RBAC/accessLevel
- [ ] **1.7** Implementar ABAC/ASIC puro usando Casbin
- [ ] **1.8** Centralizar todas as permissões no backend
- [ ] **1.9** Criar endpoint `/api/auth/permissions` para frontend
- [ ] **1.10** Configurar usuário admin: `felipemartinii@gmail.com` com privilégios máximos
- [ ] **1.11** Corrigir seeds e inconsistências de usuários
- [ ] **1.12** Testar endpoints críticos: `/area-cliente`, `/admin/dashboard`, `/admin/abac`
- [ ] **1.13** Validar acesso do admin e usuários comuns no navegador VS Code
- [ ] **1.14** Limpeza estrutural: remover arquivos `old`, `bak`, `backup`
- [ ] **1.15** Padronizar nomes de arquivos (sem `moderno`, `simples`, etc.)
- [ ] **1.16** Deletar arquivos sem uso e em branco

### ✅ FASE 2: DEPLOY AUTOMATIZADO PLESK
- [ ] **2.1** Ler e analisar `Tarefa-01-OBRIGATORIA-PRIORIDADE.md`
- [ ] **2.2** Acessar TODOS os links de referência sobre deploy Plesk
- [ ] **2.3** Configurar pré-requisitos SSH e Node.js no Plesk
- [ ] **2.4** Criar script de build e validação local
- [ ] **2.5** Implementar upload automatizado (rsync/scp)
- [ ] **2.6** Configurar instalação de dependências no servidor
- [ ] **2.7** Configurar build no servidor
- [ ] **2.8** Criar arquivo `start.js` customizado
- [ ] **2.9** Configurar Document Root e startup no Plesk
- [ ] **2.10** Implementar validação pós-deploy
- [ ] **2.11** Criar sistema de rollback automático
- [ ] **2.12** Documentar e gerar logs do processo

### ✅ FASE 3: SISTEMA ABAC VALIDAÇÃO
- [ ] **3.1** Ler e analisar `Tarefa-02-Sistema-ABAC-Validacao.md`
- [ ] **3.2** Implementar testes automatizados ABAC
- [ ] **3.3** Validar todas as policies existentes
- [ ] **3.4** Criar suite de testes para diferentes perfis
- [ ] **3.5** Documentar casos de uso e cenários

### ✅ FASE 4: CÁLCULOS ATUARIAIS
- [ ] **4.1** Ler e analisar `Tarefa-03-Calculos-Atuariais.md`
- [ ] **4.2** Implementar funcionalidades de cálculo
- [ ] **4.3** Integrar com sistema de permissões
- [ ] **4.4** Criar interface de usuário
- [ ] **4.5** Validar precisão dos cálculos

### ✅ FASE 5: OTIMIZAÇÃO PERFORMANCE
- [ ] **5.1** Ler e analisar `Tarefa-04-Otimizacao-Performance.md`
- [ ] **5.2** Identificar gargalos de performance
- [ ] **5.3** Implementar cache e otimizações
- [ ] **5.4** Configurar monitoramento
- [ ] **5.5** Testar melhorias

### ✅ FASE 6: LIMPEZA E REFATORAÇÃO
- [ ] **6.1** Ler e analisar `Tarefa-05-Limpeza-Refatoracao.md`
- [ ] **6.2** Ler e analisar `Tarefa-05-Refatoracao-FrontEnd-REVISADA.md`
- [ ] **6.3** Ler e analisar `Tarefa-08-Refatoracao-BackEnd-REVISADA.md`
- [ ] **6.4** Executar limpeza completa do código
- [ ] **6.5** Refatorar frontend seguindo padrões modernos
- [ ] **6.6** Refatorar backend seguindo padrões modernos
- [ ] **6.7** Remover dependências não utilizadas
- [ ] **6.8** Padronizar estrutura de pastas

### ✅ FASE 7: UX/UI E DESIGN SYSTEM
- [ ] **7.1** Ler e analisar `Tarefa-11-UX-UI-Design-System-REVISADA.md`
- [ ] **7.2** Implementar design system consistente
- [ ] **7.3** Melhorar experiência do usuário
- [ ] **7.4** Implementar componentes reutilizáveis
- [ ] **7.5** Validar responsividade

### ✅ FASE 8: DOCUMENTAÇÃO
- [ ] **8.1** Ler e analisar `Tarefa-12-Documentacao-ModernStack-REVISADA.md`
- [ ] **8.2** Ler e analisar `Tarefa-12-Documentacao-Sistema.md`
- [ ] **8.3** Criar documentação técnica completa
- [ ] **8.4** Documentar APIs e endpoints
- [ ] **8.5** Criar guias de uso
- [ ] **8.6** Documentar processo de deploy

### ✅ FASE 9: QUALIDADE DE CÓDIGO
- [ ] **9.1** Ler e analisar `Tarefa-13-Qualidade-Codigo-Lint-Prettier-Husky-REVISADA.md`
- [ ] **9.2** Configurar ESLint avançado
- [ ] **9.3** Configurar Prettier
- [ ] **9.4** Configurar Husky para pre-commit
- [ ] **9.5** Implementar testes automatizados
- [ ] **9.6** Configurar CI/CD

---

## 🎯 PRINCÍPIOS FUNDAMENTAIS (OBRIGATÓRIOS)

### 🚨 CORREÇÃO DE ERROS A CADA PASSO
**NUNCA avance sem corrigir 100% dos erros:**
1. **LINT** (eslint, prettier)
2. **TYPESCRIPT** (type-check)
3. **COMPILAÇÃO** (build)

### 📚 CONSULTA OBRIGATÓRIA DE REFERÊNCIAS
- Todos os links mencionados nas tarefas DEVEM ser acessados e analisados
- Documentação oficial sempre consultada antes de implementar
- Boas práticas seguidas rigorosamente

### 🧪 TESTES MANUAIS OBRIGATÓRIOS
- Testar todos os endpoints no navegador VS Code
- Validar acesso de admin: `felipemartinii@gmail.com`
- Validar acesso de usuários comuns
- Documentar problemas e soluções

### 🧹 LIMPEZA ESTRUTURAL
- Remover arquivos `old`, `bak`, `backup`
- Padronizar nomes (sem `moderno`, `simples`)
- Deletar arquivos sem uso
- Manter apenas versões finais

---

## 📊 PROGRESSO ATUAL

**FASE ATUAL:** Iniciando Fase 1 - Análise ABAC/ASIC  
**PRÓXIMO PASSO:** Ler completamente Analise-ABAC-ASIC.md  
**ERROS PENDENTES:** A serem identificados após análise  

---

## 🚀 EXECUÇÃO AUTÔNOMA

**MODO:** Execução completa e autônoma  
**INTERRUPÇÕES:** Apenas para erros críticos  
**DOCUMENTAÇÃO:** Atualização contínua deste checklist  
**QUALIDADE:** Zero tolerância a erros não corrigidos  

---

**Última atualização:** 12/08/2025 - Inicio da execução
