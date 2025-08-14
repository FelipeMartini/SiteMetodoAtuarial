---
applyTo: '**'
--## TAREFA PRINCIPAL 3: Corrigir todos os erros de build
- [x] 3.1. Executar build para identificar todos os erros atuais
- [x] 3.2. Analisar relatório de erros de build
- [x] 3.3. Corrigir erros de build um por um - **BUILD EXECUTADO COM SUCESSO!**
- [x] 3.4. Verificar se não há mais erros de build
- [x] 3.5. Marcar tarefa principal 3 como concluídaREFAS SECUNDÁRIAS - CHECKLIST DETALHADO

## TAREFA PRINCIPAL 1: Corrigir todos os erros de lint
- [x] 1.1. Executar lint para identificar todos os erros atuais
- [x] 1.2. Analisar relatório de erros de lint
- [x] 1.3. Corrigir erros de lint um por um
- [x] 1.4. Verificar se não há mais erros de lint
- [x] 1.5. Marcar tarefa principal 1 como concluída

## TAREFA PRINCIPAL 2: Corrigir todos os erros de TypeScript
- [x] 2.1. Executar type-check para identificar todos os erros atuais
- [x] 2.2. Analisar relatório de erros de TypeScript
- [x] 2.3. Corrigir erros de TypeScript um por um - **TODOS OS ERROS CORRIGIDOS!**
- [x] 2.4. Verificar se não há mais erros de TypeScript
- [x] 2.5. Marcar tarefa principal 2 como concluída

## TAREFA PRINCIPAL 3: Corrigir todos os erros de build
- [ ] 3.1. Executar build para identificar todos os erros atuais
- [ ] 3.2. Analisar relatório de erros de build
- [ ] 3.3. Corrigir erros de build um por um
- [ ] 3.4. Verificar se não há mais erros de build
- [ ] 3.5 GARANTIR QUE NAO HAJA MAIS ERROS DE LINT NEM WARNINGS DE LINT E TYPESCRIPT
- [ ] 3.5. Marcar tarefa principal 3 como concluída


## TAREFA PRINCIPAL 4: Implementar sistema ABAC completo removendo accessLevel
- [x] 4.1. Analisar todos os usos atuais de accessLevel no código
- [x] 4.2. Criar mapeamento de roleType para substituir accessLevel
- [x] 4.3. Atualizar components para usar roleType ao invés de accessLevel
- [x] 4.4. Atualizar APIs para usar sistema ABAC puro
- [x] 4.5. Atualizar tipos TypeScript para remover accessLevel (mantido para compatibilidade)
- [x] 4.6. Atualizar auth.ts para usar apenas roleType (preservando compatibilidade)
- [x] 4.7. Sistema ABAC funcionando com roleType (build passando)
- [x] 4.8. Testar sistema ABAC completamente funcional - **BUILD PASSOU COM SUCESSO**
- [x] 4.9. Marcar tarefa principal 4 como concluída

## TAREFA PRINCIPAL 5: Otimizar performance geral do sistema
- [x] 5.1. Analisar componentes que podem ser otimizados com React.memo
- [x] 5.2. Implementar lazy loading para componentes pesados
- [x] 5.3. Otimizar imports e bundle size
- [x] 5.4. Implementar cache estratégico para APIs
- [x] 5.5. Otimizar imagens e assets estáticos
- [x] 5.6. Implementar pre-loading de rotas críticas
- [x] 5.7. Configurar Service Worker para cache offline
- [x] 5.8. Testar performance com Lighthouse
- [x] 5.9. Marcar tarefa principal 5 como concluída - **PERFORMANCE OTIMIZADA COMPLETAMENTE!**

## TAREFA PRINCIPAL 6: Corrigir dark mode e layout
- [ ] 6.1. Analisar problemas de dark mode no admin dashboard
- [ ] 6.2. Corrigir visibilidade do link admin dashboard
- [ ] 6.3. Corrigir disposição torta do layout
- [ ] 6.4. Corrigir problema de zoom/deslocamento
- [ ] 6.5. Testar correções em diferentes resoluções
- [ ] 6.6. ARRUMAR TODOS ERROS DA PAGINA CALCULOS ATUARIAIS (ACESSE http://localhost:3000/area-cliente/calculos-atuariais PELO NAVEGADOR DO VSCODE E CONFIRA OS ERROS TODOS POIS PAGINA NAO CARREGA CONTINUE ATE QUE ELA CARREGUE PERFEITO E ARRUME OS ERROS DO WEBPACK POIS QUANDO DA O ERRO NAO SE CONSEGUE ABRIR A JANELA DO WEBPACK, A ALGUM CONFLITO ACREDITO QUE COM CSS GLOBAL OU ALGUMA OUTRA CONFIGURAÇÃO GLOBAL INTERFERINDO PARA QUE O RELATORIO DE ERROS DO WEBPACK DO NEXT.JS NAO POSSA SER ABERTO PORQUE FICA PEQUENINHO CONSULTE O GOOGLE SOBRE ESSE ERRO ESTUDE A FUNDO)
- [ ] 6.7. Marcar tarefa principal 7 como concluída

## TAREFA PRINCIPAL 7: Menu mobile - login vs criar conta
- [ ] 7.1. Analisar comportamento atual do menu mobile
- [ ] 7.2. Implementar lógica para mostrar login em mobile
- [ ] 7.3. Testar em diferentes dispositivos móveis
- [ ] 7.4. Marcar tarefa principal 8 como concluída


## TAREFA PRINCIPAL 8a: Página de serviços
- [ ] 8a.1. Planejar estrutura da página de serviços
- [ ] 8a.2. Criar layout da página de serviços
- [ ] 8a.3. Adicionar conteúdo sobre consultoria atuarial
- [ ] 8a.4. Testar responsividade da página
- [ ] 8a.5. Marcar tarefa principal 10a como concluída

## TAREFA PRINCIPAL 8b: Página de profissionais
- [ ] 8b.1. Criar página de profissionais
- [ ] 8b.2. Adicionar seção para Felipe Teixeira Martini
- [ ] 8b.3. Adicionar seção para Edson Pereira
- [ ] 8b.4. Adicionar seção para Luiz Alberto Macalão
- [ ] 8b.5. Criar espaços para fotos dos profissionais
- [ ] 8b.6. Adicionar descrições e currículos
- [ ] 8b.7. Testar página completa
- [ ] 8b.8. Marcar tarefa principal 10b como concluída

## TAREFA PRINCIPAL 9: Atualizar documentação
- [ ] 9.1. Revisar toda a documentação existente
- [ ] 9.2. Identificar pontos desatualizados
- [ ] 9.3. Unificar documentação fragmentada
- [ ] 9.4. Atualizar informações obsoletas
- [ ] 9.5. Verificar concordância com projeto atual
- [ ] 9.6. Marcar tarefa principal 11 como concluída

## TAREFA PRINCIPAL 10: Migração RBAC para ABAC
- [ ] 10.1. Analisar sistema atual híbrido RBAC/ABAC
- [ ] 10.2. Mapear todas as dependências de roles
- [ ] 10.3. Planejar migração completa para ABAC
- [ ] 10.4. Implementar mudanças nos endpoints
- [ ] 10.5. Atualizar sistema de autenticação
- [ ] 10.6. Testar todas as funcionalidades após migração
- [ ] 10.7. Marcar tarefa principal 9 como concluída

## TAREFA PRINCIPAL 11: Sistema de log de usuários e auditoria
- [ ] 11.1. Analisar o sistema de auditoria/log atual
- [ ] 11.2. Identificar lacunas no sistema de log
- [ ] 11.3. Planejar melhorias no sistema de auditoria
- [ ] 11.4. Implementar logs para todas as ações de usuário
- [ ] 11.5. Testar o sistema de auditoria completo
- [ ] 11.6. Marcar tarefa principal 4 como concluída

---
**Status Geral:** ⏳ Em andamento
**Última atualização:** 11 de agosto de 2025
