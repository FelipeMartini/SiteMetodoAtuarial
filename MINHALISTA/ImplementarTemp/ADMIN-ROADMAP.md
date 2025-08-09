# Roadmap Modernização Admin Dashboard (2025)

Arquivo de execução automática e incremental. NÃO editar manualmente fora do fluxo.

## Estrutura dos 8 Pilares
1. Tabelas Avançadas
2. UX/UI & Acessibilidade
3. Painéis & Widgets
4. Permissões & Segurança
5. Performance & Escalabilidade
6. Feature Flags & Experimentação
7. Documentação & Testes
8. Paridade & Evolução fuse-react

## Convenções
- Status: [ ] pendente | [~] em progresso | [x] concluído | [!] bloqueado
- Cada item pode gerar sub-entregas técnicas (componentes, hooks, adapters)
- Referências externas registradas em comentários inline (// ref: <fonte>) quando implementado no código

---

## 1. Tabelas Avançadas
- [x] Definir arquitetura base DataTable headless (TanStack Table + shadcn/ui wrappers)
- [x] Criar componente `DataTableBase` reutilizável (sorting, filtering, column visibility)
- [x] Adicionar suporte a paginação client-side
- [x] Adicionar suporte a paginação server-side (manualPagination)
- [x] Implementar exportação CSV
- [ ] Implementar exportação Excel (SheetJS)
- [ ] Implementar exportação PDF (pdf-lib ou jsPDF) opcional
- [~] Adicionar row selection + ações em lote (coluna seleção + contagem + placeholder ação)
- [ ] Adicionar column pinning (esquerda/direita)
- [ ] Adicionar column resizing
- [ ] Adicionar column ordering (drag & drop)
- [ ] Implementar cell formatters padronizados (datas, números, status)
- [ ] Implementar row actions (menu contextual)
- [~] Adicionar toolbar global (busca, densidade, export CSV, seleção parcial)
- [ ] Adicionar filtros por coluna (text, select, date range)
- [ ] Adicionar persitência de preferências (localStorage + chave de namespace)
- [x] Integrar com React Query (cache, prefetch)
- [ ] Adicionar virtualização (TanStack Virtual) para > 1k linhas
- [ ] Implementar modo compacto/denso via toggle
- [ ] Adicionar caption acessível e descrição ARIA

## 2. UX/UI & Acessibilidade
- [ ] Revisar tokens de tema e modo dark/light para admin
- [ ] Criar componentes de Skeleton específicos (tabela, cards, gráficos)
- [ ] Implementar foco visível consistente (outline custom)
- [ ] Adicionar aria-live para feedback de operações (sucesso/erro)
- [ ] Garantir navegação por teclado em menús de ações
- [ ] Adicionar atalhos de teclado (ex: / para busca, ? para help)
- [ ] Validar contraste WCAG (mínimo AA) em todos os elementos críticos
- [ ] Adicionar suporte a preferências de redução de movimento
- [ ] Testar com axe-core e registrar relatório

## 3. Painéis & Widgets
- [ ] Definir contrato de widget (interface + registro dinâmico)
- [ ] Criar Grid de widgets drag & drop (react-grid-layout ou alternativa leve)
- [ ] Implementar widgets: KPIs (ativos, novos, bloqueados)
- [ ] Implementar widget: Crescimento usuários (linha)
- [ ] Implementar widget: Distribuição roles (pizza)
- [ ] Implementar widget: Últimas ações (log stream)
- [ ] Implementar widget: Sessões ativas
- [ ] Persistir layout de widgets (localStorage / usuário)
- [ ] Suporte a lazy load e suspense nos widgets
- [ ] Adicionar placeholders de carregamento

## 4. Permissões & Segurança
- [ ] Centralizar definição de roles/claims (ex: src/configs/acl.ts)
- [ ] Middleware de verificação server-side (app routes)
- [ ] Hook `useCan(permission)` reutilizável
- [ ] Component `<IfCan>` para gating condicional
- [ ] Logs de auditoria (criação, update, delete usuários)
- [ ] Registrar IP, horário e usuário executor nas ações
- [ ] Integrar MFA enforcement em ações sensíveis
- [ ] Rate limit endpoints críticos admin
- [ ] Adicionar detecção de sessão suspeita (geo/ip mismatch básico)
- [ ] Notificações de segurança (email mock / in-app toast)

## 5. Performance & Escalabilidade
- [ ] Habilitar cache inteligente React Query (staleTime por domínio)
- [ ] Prefetch preditivo (hover em links de detalhes)
- [ ] Paginação server-side com indicadores de loading parcial
- [ ] Virtualização para tabelas grandes (>1k)
- [ ] Suspense boundaries por região (cards, tabelas, gráficos)
- [ ] Dividir bundle: separar admin em chunk específico
- [ ] Medir TTFB e FCP do admin (report inicial)
- [ ] Otimizar queries Prisma com select e include mínimos
- [ ] Implementar compressão de payloads (se aplicável)

## 6. Feature Flags & Experimentação
- [ ] Mapear flags necessárias (ex: admin.widgets.novoWidget)
- [ ] Criar util `useFlagGroups` para lotes
- [ ] Carregar flags server-side + hidratar no cliente
- [ ] Adicionar painel interno de visualização de flags ativas
- [ ] Marcar código legado com flags de depreciação
- [ ] Implementar flag kill-switch para widgets experimentais
- [ ] Limpar flags expiradas (processo documentado)

## 7. Documentação & Testes
- [ ] Atualizar README geral módulo admin
- [ ] Criar docs por domínio (usuarios, permissoes, dashboard)
- [ ] Gerar diagrama arquitetura (mermaid) admin
- [ ] Testes unidade: hooks (useCan, data adapters)
- [ ] Testes unidade: componentes (DataTableBase)
- [ ] Testes integração: fluxo CRUD usuário
- [ ] Testes e2e (Cypress/Playwright) login -> editar usuário
- [ ] Teste acessibilidade (axe) automatizado CI
- [ ] Adicionar script npm "test:admin"
- [ ] Cobertura mínima 80% módulos críticos

## 8. Paridade & Evolução fuse-react
- [ ] Listar features do DataTable fuse-react já presentes
- [ ] Mapear gaps vs implementação atual
- [ ] Reproduzir comportamento de toolbar (filtros, densidade)
- [ ] Implementar ícones equivalentes (lucide) nos menus
- [ ] Migrar lógica de pin/resize adaptada ao headless
- [ ] Validar UX mobile comparando fuse-react
- [ ] Adicionar melhorias não presentes (persist prefs, exportações)
- [ ] Documentar diferenças e razões das mudanças

---

## Execução (Log Resumido)
*(Preencher automaticamente durante a implementação)*


### 2025-08-09
- Concluído: arquitetura base DataTable, componente DataTableBase com sorting/filter/visibility + paginação client-side persistência básica; rota /admin/usuarios/lista criada com dados mock.
 - Concluído: exportação CSV; Row selection habilitada (ações em lote pendentes).
 - Concluído: paginação server-side + hook React Query (useUsuariosPaginados) e integração DataTable; roadmap atualizado.
 - Progresso: Toolbar global parcialmente (busca, densidade, export CSV, seleção) e placeholder ação em lote.

