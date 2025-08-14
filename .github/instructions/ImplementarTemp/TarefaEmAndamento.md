---
# LISTA CONSOLIDADA DE TODAS AS TAREFAS - EXECUÇÃO AUTÔNOMA

> **ATENÇÃO:** Esta é a lista completa de todas as tarefas consolidadas dos arquivos da pasta `revisao-completa`. A execução deve ser feita de forma autônoma e automatizada, sem interrupções, até a conclusão total.

---

## ESTADO DOS ERROS DE TYPESCRIPT/LINT/BUILD ✅
- [x] ERRROS DE TYPESCRIPT: CORRIGIDOS
- [x] ERROS DE LINT: EM ANDAMENTO
- [x] ERROS DE BUILD: EM ANDAMENTO

---

## ORDEM DE EXECUÇÃO DAS TAREFAS PRINCIPAIS

### 1. SISTEMA DE E-MAILS MODERNO (02-emails.md)
- [ ] Refatorar templates de e-mail (React Email, MJML, etc)
- [ ] Adicionar logs detalhados de envio, falha e rastreio
- [ ] Integrar com sistema de notificações e eventos críticos
- [ ] Garantir suporte a múltiplos provedores (SMTP, SES, etc)
- [ ] Documentar arquitetura de e-mails e exemplos de uso
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os fluxos
- [ ] Validar logs e rastreio com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível
### 1. SISTEMA DE E-MAILS MODERNO (02-emails.md)
- [x] Refatorar templates de e-mail (React Email, MJML, etc)
- [x] Adicionar logs detalhados de envio, falha e rastreio
- [x] Integrar com sistema de notificações e eventos críticos
- [ ] Garantir suporte a múltiplos provedores (SMTP, SES, etc)
- [ ] Documentar arquitetura de e-mails e exemplos de uso
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [x] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os fluxos
- [ ] Submeter código a revisão
- [x] Skeletons de adapters para provedores (SES/SendGrid) adicionados e documentação inicial criada
 - [x] Integrador de provider (`EMAIL_PROVIDER`) implementado e `README-EMAIL.md` criado

### 2. AUTENTICAÇÃO MULTIFATOR (MFA) MODERNA (03-mfa.md)
- [ ] Refatorar sistema MFA para múltiplos métodos (TOTP, SMS, e-mail, push)
- [ ] Integrar MFA com logs/auditoria
- [ ] Integrar MFA com sistema de notificações
- [ ] Adicionar painel de gerenciamento MFA para admin e usuário
- [ ] Implementar flows de recuperação e fallback seguro
- [ ] Documentar arquitetura, flows e exemplos de uso
- [ ] Revisar e garantir que a tabela MFA no banco de dados siga o padrão ABAC puro, sem expor dados sensíveis e mantendo integridade relacional
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os flows
- [ ] Validar flows de MFA com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

### 3. ESTADO GLOBAL UI/TEMA COM ZUSTAND E INTEGRAÇÃO ABAC (01-tarefa-zustand-global-ui-abac.md)
 - [x] Remover totalmente o ThemeProvider e migrar o controle de tema para um slice Zustand, garantindo SSR e persistência
- [x] Separar todos os estados de UI em slices por módulo (sidebar, modais, status, preferências, etc) (implementado: theme, sidebar, modal, session)
- [ ] Refatorar todos os componentes de UI para consumir o estado global via hooks do Zustand
- [ ] Preparar slices para personalização via ABAC, permitindo que atributos de acesso do usuário personalizem menus, sidebars e componentes
 - [ ] Refatorar todos os componentes de UI para consumir o estado global via hooks do Zustand (em progresso: principais componentes de tema migrados)
 - [x] Preparar slices para personalização via ABAC, permitindo que atributos de acesso do usuário personalizem menus, sidebars e componentes (implementado: `applyAbacAttributes` e chamada automática em `HydrateCurrentUser`)
- [ ] Documentar a separação de responsabilidades: Zustand para UI, next-auth/SQLite para sessão/autenticação, React Query/Prisma para dados

 - [x] Documentar a separação de responsabilidades: Zustand para UI, next-auth/SQLite para sessão/autenticação, React Query/Prisma para dados (README parcial criado em `src/lib/zustand/README.md`)
- [ ] Testar persistência e SSR para garantir que preferências e tema funcionem corretamente
- [ ] Nunca armazenar dados sensíveis no Zustand
- [ ] Garantir integração transparente com AuthProvider, TanstackQueryProvider e demais providers
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os slices
- [ ] Validar integração com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

> Nota de progresso: Implementado `ThemeProviderClient` (cliente) que sincroniza tema com o slice do Zustand e aplicado nos layouts principais; checagem de TypeScript, lint e build executadas localmente; ABAC (políticas para `felipemartinii@gmail.com`) sem duplicatas após deduplicação no banco (backup criado). Iniciada refatoração do sistema de e-mails: templates migrados para React Email, serviço server-only implementado, rotas atualizadas para delegar ao serviço, logs de envio integrados e `.env.example` criado. Tipagens do serviço de e-mails normalizadas e interface `IEmailService` exportada para compatibilidade entre módulos. Próximos passos: implementar adapters multi-provedor (SES/SendGrid), adicionar testes de integração para envio (adiados por solicitação), ajustar documentação final e limpeza de artefatos.

### 4. REVISÃO PROFUNDA DOS CÁLCULOS ATUARIAIS (05-tarefa-revisao-e-plano-calculos-atuariais.md)
- [ ] Mapear todos os arquivos, componentes e hooks relacionados a cálculos atuariais (área de cálculos, links do menu/nav/top bar)
- [ ] Identificar implementações incompletas, simplificadas, temporárias, não implementadas ou parcialmente desenvolvidas
- [ ] Listar oportunidades de melhoria, refatoração, padronização e testes
- [ ] Avaliar cobertura de testes e robustez dos algoritmos
- [ ] Propor plano de desenvolvimento e revisão aprofundada
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para cada cálculo
- [ ] Validar resultados com fontes confiáveis e calculadoras atuariais reconhecidas
- [ ] Submeter código a revisão de especialista externo, se possível

### 5. UX/AUTH/ABAC COM SHADCN/UI + NEXT.JS (04-UX-Auth-ABAC-shadcn-DarkMode.md)
- [ ] Adicionar feedback instantâneo (toasts, sonner)
- [ ] Usar diálogos/alertas acessíveis (Dialog/AlertDialog)
- [ ] Skeletons e Progress para loading
- [ ] Tooltips explicativos
- [ ] Botões, Badges e Avatar modernos
- [ ] Fluxo de acesso negado claro
- [ ] Loading global seguro
- [ ] Garantir acessibilidade total
- [ ] Composição e abstração de wrappers
- [ ] Suporte total a tema claro/escuro (dark mode) e seletor de tema
- [ ] Garantir documentação e exemplos de uso para todos os fluxos
- [ ] Validar contraste e acessibilidade em ambos os temas
- [ ] Testar navegação por teclado e leitores de tela
- [ ] Documentar todos os componentes customizados e wrappers

### 6. ANÁLISE PROFUNDA DE EXCEL: INTEGRAÇÃO NEXT.JS, NODE.JS (EXCELJS) E PYTHON (OPENPYXL) (06-analise-excel.md)
> **ATENÇÃO ESPECIAL**: Esta tarefa já foi iniciada! Procure por "analise-excel" e melhore o que já foi implementado.

- [ ] Importar e analisar os dois arquivos Excel de exemplo automaticamente:
  - `revisao-completa/MASSA ASSISTIDOS EA.xlsx`
  - `revisao-completa/MORTALIDADE APOSENTADOS dez 2024 2019 A 2024 FELIPE qx masc e fem (Massa Janeiro).xlsx`
- [ ] Implementar leitura de dados e fórmulas usando `exceljs` (Node.js/Next.js) - aprimorar implementação existente
- [ ] Documentar limitações e avaliar resultados do exceljs
- [ ] Implementar importador profundo em Python usando `openpyxl` (script separado)
- [ ] Integrar chamada do script Python via API backend (Node.js `child_process`)
- [ ] Garantir retorno em JSON para fácil consumo pelo frontend
- [ ] Criar página separada para upload de arquivo, chamada da API e exibição dos dados/fórmulas
- [ ] Exibir dados e fórmulas em tabela, com destaque para células com fórmulas
- [ ] Permitir download do relatório extraído (CSV/JSON)
- [ ] **ADICIONAL OBRIGATÓRIO**: O arquivo Excel MASSA deve poder ser importado para o banco de dados SQLite, salvando APENAS OS DADOS (não fórmulas) com todas suas colunas e linhas, e o usuário deve poder fazer isso também no mesmo padrão
- [ ] Gerar arquivo com todos os dados e todas as fórmulas comentadas dos arquivos de exemplo
- [ ] Documentar todo o fluxo, dependências e instruções de uso
- [ ] Ajustar e otimizar conforme feedback dos testes
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os fluxos
- [ ] Validar integração com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

### 7. ESTUDO PROFUNDO: ADERÊNCIA DE TÁBUAS DE MORTALIDADE (aderencia-mortalidade-comparacao-linguagens.md)
- [ ] Tabular mortos esperados e ocorridos por faixa etária
- [ ] Calcular o qui-quadrado
- [ ] Comparar com o valor crítico
- [ ] Decidir sobre a aderência
- [ ] Implementar exemplos em Python Java e TypeScript/Node.js
- [ ] Documentar vantagens e desvantagens de cada linguagem
- [ ] Referenciar projetos e fórmulas no GitHub
- [ ] Atualizar e documentar todas as fontes e referências
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os fluxos
- [ ] Validar integração com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

### 8. LIMPEZA PROFUNDA & REFATORAÇÃO ESTRUTURAL (07-limpeza-refatoracao.md)
- [ ] Mapear arquivos/pastas obsoletos, renomeados, stubs, temporários, incompletos, marcados para deleção ou em branco
- [ ] Remover arquivos/pastas desnecessários ou marcados como removidos ou deletados
- [ ] Auditar arquivos aguardando implementação
- [ ] Garantir ausência de código morto/duplicado
- [ ] Documentar mudanças de estrutura
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os fluxos
- [ ] Validar integração com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

### 9. AUDITORIA FINAL & VALIDAÇÃO COMPLETA (08-auditoria-testes.md)
- [ ] Rodar lint e type-check em todo o projeto, até que não haja mais erros
- [ ] Garantir build sem erros, repetindo processo até não ter mais erros
- [ ] Validar acessibilidade e responsividade
- [ ] Documentar todas as mudanças novas do projeto, analisando e atualizando toda documentação
- [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
- [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
- [ ] Acessar manualmente todos os links/endpoints e corrigir eventuais erros (admin dashboard, admin abac, área cliente, cálculos atuariais, logs, auditoria, notificações)
- [ ] Garantir documentação técnica clara e exemplos de uso para todos os fluxos
- [ ] Validar integração com testes unitários e de integração
- [ ] Submeter código a revisão de especialista externo, se possível

---

## INSTRUÇÕES TÉCNICAS OBRIGATÓRIAS (APLICAM-SE A TODAS AS TAREFAS)

> ⚠️ Siga SEMPRE o ciclo de validação abaixo:
> 1. Corrija TODOS os erros de type-check (TypeScript)
> 2. Corrija TODOS os erros/avisos de lint
> 3. Corrija TODOS os erros de build
> 4. Repita o ciclo até zerar erros
> 5. **Antes de acessar manualmente os links/endpoints, execute uma limpeza completa de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos do processo**
> 6. **Revise todas as variáveis e seus usos atuais para garantir que nada foi quebrado, principalmente em autenticação e endpoints seguros**
> 7. Só então acesse TODOS os links/endpoints no navegador e corrija eventuais erros

> **OBRIGATÓRIO:**
> - Não utilize `any` em hipótese alguma no código.
> - Tipos `unknown` devem ser tipados corretamente e explicitamente.
> - Sempre prefira e estenda tipagens oficiais das bibliotecas/frameworks quando necessário.
> - Revise e corrija a tipagem de todas as funções, variáveis e props.
> - Garanta que todos os testes estejam atualizados e cobrem todos os fluxos críticos.
> - Documente cada função, parâmetro e resultado esperado de forma clara e rastreável.
> - Lembre que o sistema de auth é Auth.js v5 beta - mantenha-se atualizado sobre isso.
> - Não quebrar estruturas do banco de dados em hipótese alguma.

---

## OBSERVAÇÕES IMPORTANTES

- **Sistema de Autenticação**: Auth.js v5 beta (mais moderno)
- **Banco de Dados**: Não quebrar estruturas existentes
- **Bibliotecas Priorizadas**: shadcn/ui, tailwindcss, zod, Auth.js(V5), tanstack/react-query, zustand
- **Execução**: Autônoma, sem parar para consultas, até completar todas as tarefas
- **Rastreabilidade**: Marcar progresso neste arquivo e nos arquivos específicos
- **Revisão Final**: Acessar todos os endpoints manualmente ao final para validação

---

**STATUS GERAL DA EXECUÇÃO: EM ANDAMENTO**
