# GUIA PR & ROADMAP — Unificação Aderência de Tábuas

Resumo: este documento consolida as decisões e o plano de PRs que propus para unificar o sistema de aderência de tábuas, descreve o estado atual, a ordem de PRs recomendada, checklist de revisão, e um passo-a-passo detalhado para primeiro eliminar todos os erros de lint (conforme solicitado).

Data: 16/08/2025
Branch atual de trabalho: `feat/log-notifications-wip`
Comparações usadas: `origin/main` e commit `20fbcde4fdfde67b938ba6d61c13097a8ee4cbcf`

---

## 1. Objetivo deste guia
- Padronizar o fluxo de PRs para a unificação do sistema (atuariais, excel, UI, auditoria, notifications).
- Garantir qualidade (lint, type-check, build, testes) antes de cada PR.
- Entregar um checklist e comandos reproduzíveis para a equipe.

## 2. Estado atual (resumo técnico)
- Bibliotecas unificadas já presentes: `site-metodo/src/lib/atuarial/CalculosEstatisticos.ts` e `site-metodo/src/lib/excel/ProcessadorUnificado.ts`.
- Endpoints adaptados: `chi-quadrado/route.ts` e `analise-exceljs/route.ts` delegam à bibliotecas.
- Dashboard unificado em `site-metodo/src/app/dashboard/aderencia-tabuas/page.tsx` (client component).
- Grandes adições relacionadas a notifications e logging (`PushNotificationsAdmin`, `push-service`, `database-logger`).

## 3. Plano de PRs (ordem recomendada)
1. Atuariais (Core estatístico)
2. Excel Processor e pipeline de importação
3. Dashboard UI (Aderência)
4. Auditoria / Logs / Monitoring
5. Notifications / Push / Admin UI
6. Docs e limpeza final

Para cada PR abaixo está o escopo, testes necessários, riscos e checklist.

### PR 01 — Atuariais (Core estatístico)
- Escopo: `site-metodo/src/lib/atuarial/CalculosEstatisticos.ts`, tipos em `src/types`, endpoint `chi-quadrado/route.ts` (wrap)
- Testes: unitários (gamma, cdf chi2, calcular chi2), fixtures numéricos com valores conhecidos
- Checks: `npm run type-check`, `npm run lint`, `npm run build`, `npx jest` (se houver)
- Risco crítico: resultados numéricos incorretos invalidam todo o sistema
- Rollback: reverter commit(s) desta lib

### PR 02 — Processador Excel & Importação
- Escopo: `site-metodo/src/lib/excel/ProcessadorUnificado.ts`, `analise-exceljs/route.ts`, ajustes prisma importacao
- Testes: integração com fixture `.xlsx` pequeno; validar `dadosProcessados.metadados`
- Checks: type-check, lint, build, teste de integração local
- Riscos: Buffer/ExcelJS, caminhos de arquivos, permissões

### PR 03 — Dashboard UI
- Escopo: `site-metodo/src/app/dashboard/aderencia-tabuas/page.tsx` e componentes reutilizáveis UI
- Testes: smoke manual (upload fixture → pipeline → exibir resultado)
- Checks: type-check, lint, build
- Risco: falhas UX e chamadas de API; mitigação por recursos de fallback/erros claros

### PR 04 — Auditoria / Logs
- Escopo: `src/lib/audit.ts`, `auditLogger.ts`, `logging/database-logger.ts`, endpoints `api/admin/logs/*`
- Testes: integração com DB mock ou ambiente de staging

### PR 05 — Notifications / Push
- Escopo: `src/lib/notifications/*`, `src/components/admin/PushNotificationsAdmin.tsx`, `api/push/*`
- Testes: unit com mocks, smoke de envio em staging (tokens de teste)
- Atenção: segredos VAPID/credentials fora do repositório

### PR 06 — Docs e limpeza
- Atualizar `README`, `.github` instructions, `lista-de-tarefas` e criar changelog final

---

## 4. Estratégia para eliminar erros de lint (primeira tarefa solicitada)
Objetivo: deixar o código sem erros de lint antes de abrir PRs. A estratégia é:
1. Rodar o linter global e coletar relatório.
2. Aplicar `--fix` automático para problemas corrigíveis.
3. Corrigir manualmente os problemas restantes por prioridade (erros → avisos críticos → estilo).
4. Adicionar regras temporárias (especificar exceptions) apenas se justificadas, com comentário TODO e issue link.

### 4.1 Comandos para rodar lint e gerar log
Execute na raiz do projeto (site-metodo):

```bash
# No workspace 'site-metodo'
cd /home/felipe/github/SiteMetodoAtuarial/site-metodo
# Rodar lint e salvar log (use a task já existente se preferir)
npm run lint 2>&1 | tee "$(pwd)/XLOGS/lint-$(date +'%Y%m%d-%H%M%S').log"

# Rodar lint com auto-fix (quando aplicável)
npx eslint "src/**/*.{ts,tsx,js,jsx}" --fix

# Re-rodar lint para ver o que sobrou
npm run lint
```

> Nota: há uma task predefinida `Lint Absoluto` nas tasks do workspace. Você pode usar a UI do VSCode Tasks ou rodar o comando direto conforme acima.

### 4.2 Como abordar os resultados
- Erros de compilação TypeScript (TS): trate com `npm run type-check` e corrija tipagens; não ignore TS errors via eslint.
- Erros do ESLint (reais) → corrigir primeiro.
- Warnings de estilo → agrupar por tipo e aplicar correções em lote.

### 4.3 Passos específicos e heurísticas
- Rodar `npx eslint --fix` para correções automáticas.
- Para regras não aplicáveis (ex.: regras estritas de import order), considere ajustar `.eslintrc` só após discutir; não relaxe regras sem justificativa.
- Documente cada exceção no PR com motivo e referência de issue.

### 4.4 Exemplo de correção rápida (patterns comuns)
- Imports não usados: remover
- Tipos `any` não intencionais: tipar corretamente ou criar typings temporários com TODO
- Funções async sem tratamento de erro: adicionar try/catch ou `.catch()`
- Componentes React sem `use client`: verifique e adicione `"use client"` quando necessário

---

## 5. Checklists práticos por PR (resumido)
Use este checklist antes de abrir PR:
- [ ] Branch criada a partir de `feat/log-notifications-wip` (ou `main` quando apropriado)
- [ ] `npm run type-check` ✅
- [ ] `npm run lint` ✅ (nenhum erro) 
- [ ] `npm run build` ✅ (Next build ok)
- [ ] Unit tests adicionados/atualizados ✅
- [ ] Smoke test descrito na descrição do PR ✅
- [ ] Documentação curta atualizada ✅
- [ ] Checklist de revisão incluído no PR ✅

---

## 6. Comandos de apoio para criar branches e preparar PR local
```bash
# Criar branch e comitar mudanças locais
git checkout -b feat/atuarial/calculos-unificados
# Fazer commits locais (faça commits pequenos e atômicos)
git add -A
git commit -m "feat(atuarial): adicionar CalculosEstatisticos unificado + testes"
# Rodar checks
cd site-metodo
npm run type-check && npm run lint && npm run build
# Depois de aprovado localmente, push e abrir PR
git push origin feat/atuarial/calculos-unificados
```

---

## 7. CI / PR pipeline mínimo recomendado
- Job 1: install + type-check + lint
- Job 2: build (next build)
- Job 3: unit tests (jest) e coverage
- Job 4: smoke (opcional em staging)

Se qualquer job falhar, bloquear merge.

---

## 8. Riscos e mitigação
- Cálculos matemáticos (chi2): testar com dados reais e fixtures comparativos.
- Push/Notifications: segredos e ambiente; usar stubs em CI e ambiente de staging para testes reais.
- DB migrations/prisma: extrair migrations e testar em ambiente de staging antes de produção.

---

## 9. Notas finais e próximos passos sugeridos
1. **Executar lint** e coletar relatório (faça no seu ambiente local) — usar os comandos do item 4.1.
2. Eu posso preparar o PR inicial (Atuariais) com testes unitários e checks locais prontos; diga se quer que eu crie a branch local e adicione os testes.
3. Após PR 01 aceito, partir para PR 02 (Excel), depois UI.

---

Arquivo criado automaticamente para orientar o fluxo de PRs e a limpeza de lint.

Se desejar, começo agora a preparar automaticamente a branch do PR 01 (atuariais) com testes unitários mínimos e rodar `npm run type-check` e `npm run lint` localmente; não farei push sem sua confirmação.

