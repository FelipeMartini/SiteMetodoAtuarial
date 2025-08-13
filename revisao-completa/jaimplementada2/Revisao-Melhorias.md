
# Revisão e Plano de Melhoria Profunda – Projeto site-metodo

> **IMPORTANTE:**
> - O progresso de cada tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. No arquivo específico da tarefa (ex: 07-calculos-atuariais.md).
> - Isso garante rastreabilidade e validação cruzada.

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.

## Introdução

Este documento apresenta o plano mestre de modernização, refatoração e limpeza do projeto `site-metodo`, detalhando tarefas principais e secundárias, critérios de sucesso, recomendações técnicas e links obrigatórios. O objetivo é garantir uma base sólida, moderna, acessível e escalável, alinhada às melhores práticas do mercado.



## Checklist Geral de Refatoração e Melhoria

- [ ] UI: Modernizar toda a interface com shadcn/ui, dark/light, responsividade e design system consistente
- [ ] Dashboard Admin & ABAC: Refatorar, padronizar e integrar métricas, logs e painéis em tempo real
- [ ] Área do Cliente: Reestruturar para UX moderna, segura e integrada a notificações/logs
- [ ] Auditoria & Logs: Centralizar, detalhar e garantir rastreabilidade e compliance
- [ ] Notificações: Implementar sistema definitivo, persistente, integrado e em tempo real
- [ ] E-mails: Modernizar templates, logs, rastreio e integração com eventos críticos
- [ ] Gestão de Tábua de Mortalidade: Importação/Exportação (Excel/PDF), validação, precisão e referências obrigatórias
- [ ] Cálculos Atuariais: Revisar, documentar, validar precisão e garantir integração com tábuas
- [ ] MFA: Implementar/atualizar autenticação multifator avançada
- [ ] Limpeza Profunda: Remover arquivos/pastas obsoletos, stubs, temporários, backups, vazios e código morto
- [ ] Auditoria Final: Garantir lint, type-check, build, acessibilidade e documentação
## Checklist Incremental para Gestão de Tábua de Mortalidade e Cálculos Atuariais

- [ ] Implementar importação de Tábua de Mortalidade (Excel)
- [ ] Implementar exportação de Tábua de Mortalidade (Excel/PDF)
- [ ] Validar integridade e formato das tábuas importadas
- [ ] Garantir integração das tábuas com os cálculos atuariais
- [ ] Adicionar testes unitários para cálculos e importação/exportação
- [ ] Documentar exemplos de uso e referências obrigatórias
- [ ] Validar manualmente todos os fluxos de importação, exportação e cálculo
- [ ] Seguir ciclo obrigatório: type-check, lint, build, validação manual
- [ ] Consultar e registrar todas as referências técnicas e atuariais utilizadas
## Referências Obrigatórias para Tábuas de Mortalidade e Cálculos Atuariais

- [Society of Actuaries](https://www.soa.org/resources/research-reports/)
- [International Actuarial Association](https://www.actuaries.org/)
- [ExcelJS](https://github.com/exceljs/exceljs)
- [pdf-lib](https://pdf-lib.js.org/)
## Instruções Técnicas Específicas para Tábuas de Mortalidade

1. Sempre padronize o termo "Tábua de Mortalidade" em toda a documentação e código, exceto quando se referir ao nome do projeto ou contexto amplo.
2. A importação/exportação de tábuas deve ser feita preferencialmente via ExcelJS (Excel) e pdf-lib (PDF), seguindo exemplos oficiais.
3. Toda tábua importada deve passar por validação automática de integridade e formato.
4. Os cálculos atuariais devem ser validados com testes unitários e exemplos reais.
5. É obrigatório documentar todas as referências e garantir validação manual de cada release.
## AVISO IMPORTANTE SOBRE OBRIGATORIEDADE DE VALIDAÇÃO

> **É OBRIGATÓRIO seguir o ciclo de validação completo (type-check, lint, build, validação manual) e consultar todas as referências técnicas e atuariais antes de marcar qualquer tarefa como concluída.**

> **A gestão de Tábua de Mortalidade (importação/exportação, precisão, validação) segue padrões internacionais e deve ser validada manualmente em cada release.**

> **Para detalhes, checklists expandidos, instruções e links, consulte a pasta `../revisao-completa/`**




## Como usar este plano

1. Consulte a pasta `../revisao-completa/` para cada tarefa principal e seus detalhes.
2. Para cada tarefa, revise também todos os arquivos de tarefas secundárias associados, se existirem.
3. Siga o checklist de cada arquivo, marcando o progresso tanto no checklist geral deste arquivo quanto nos checklists dos templates de tarefas secundárias (quando aplicável).
4. **É OBRIGATÓRIO consultar e estudar todos os links e recomendações técnicas de cada etapa antes de implementar.**
5. Documente todas as decisões e mantenha os arquivos atualizados.
6. Garanta que todos os arquivos de tarefas (principais e secundários) contenham SEMPRE:
	- Análise obrigatória de projeto de referência (quando aplicável)
	- Checklist incremental/manual de validação
	- Instruções técnicas obrigatórias do ciclo de validação
	- Regra de tipagem estrita (sem any, unknown tipado, tipos oficiais)
	- Referências obrigatórias e atualizadas

---


## Processo de Validação e Correção de Erros (OBRIGATÓRIO)

> **⚠️ ATENÇÃO: O ciclo abaixo é obrigatório e deve ser seguido à risca em TODAS as etapas de implementação e revisão!**

1. **Execute o type-check do projeto** (`npm run type-check`) e corrija TODOS os erros de TypeScript até que não reste nenhum.
2. **Execute o lint** (`npm run lint`) e corrija TODOS os avisos/erros de lint até que não reste nenhum.
3. **Execute o build** (`npm run build`) e corrija TODOS os erros de build até que o build finalize sem erros.
4. **Repita o ciclo**: Após corrigir erros de build, volte ao passo 1 (type-check), depois lint, depois build, até que TODOS os comandos finalizem SEM ERROS.
5. **Somente após o build estar 100% limpo, acesse obrigatoriamente TODOS os links e endpoints relevantes no navegador do VSCode** (ou browser) para validar visualmente e funcionalmente cada página, componente e fluxo. Caso encontre qualquer erro, corrija e repita o ciclo acima.
6. **Para cada página, componente ou endpoint alterado, siga o checklist incremental/manual de validação, garantindo validação manual completa antes de marcar como concluído.**

> **IMPORTANTE:**
> - Não avance para a próxima etapa sem garantir que type-check, lint e build estejam 100% limpos.
> - O acesso manual aos links/endpoints é obrigatório para validação real do sistema.
> - Documente qualquer erro encontrado e sua respectiva correção.

---

## Destaque Visual e Reforço de Obrigatoriedade

```
🚨 OBRIGATÓRIO: Siga SEMPRE o ciclo de validação abaixo para cada alteração:
1. Corrija TODOS os erros de type-check (TypeScript)
2. Corrija TODOS os erros/avisos de lint
3. Corrija TODOS os erros de build
4. Repita o ciclo até zerar erros
5. ACESSE TODOS os links/endpoints no navegador e corrija eventuais erros
6. Só avance após tudo estar 100% limpo!
```

> **NUNCA pule a etapa de validação manual nos links/endpoints!**


## Estrutura Detalhada das Tarefas (ver pasta revisao-completa)

1. `01-tarefas-iniciais.md`: Tarefas Iniciais (preencher manualmente)
2. `02-dashboard-admin-abac.md`: Dashboard Admin & ABAC
3. `03-area-cliente.md`: Área do Cliente
4. `04-auditoria-logs.md`: Auditoria & Logs
5. `05-notificacoes.md`: Sistema de Notificações
6. `06-emails.md`: Sistema de E-mails
7. `07-calculos-atuariais.md`: Cálculos Atuariais
8. `08-mfa.md`: Autenticação Multifator (MFA)
9. `09-limpeza-refatoracao.md`: Limpeza Profunda & Refatoração
10. `10-auditoria-testes.md`: Auditoria Final & Validação

Cada arquivo contém:
	1. Diagnóstico
	2. Plano de Melhoria
	3. Checklist detalhado (todos os itens numerados)
	4. Instruções técnicas obrigatórias
	5. Links e recomendações obrigatórias (todos numerados)

> **Atenção:** Siga sempre as referências e mantenha a documentação atualizada.

Cada arquivo contém:
- Diagnóstico
- Plano de Melhoria
- Checklist detalhado
- Instruções técnicas
- Links e recomendações obrigatórias

## Observações Finais

- Siga sempre as referências obrigatórias de cada tarefa.
- Mantenha a documentação atualizada e versionada.
- Garanta que todas as etapas sejam revisadas por pelo menos 1 desenvolvedor sênior.
- Use automação para lint, testes e auditoria sempre que possível.

---

> **Atenção:** O uso das referências é obrigatório para atualização de conhecimento e implementação de práticas modernas. O documento deve ser revisado e atualizado periodicamente.

## 2. Área do Cliente

### Diagnóstico
- Layout e UX desatualizados, ausência de dashboard personalizado, falta de integração com notificações e logs do usuário.

### Plano de Melhoria
- Refatorar UI com shadcn/ui, dark/light, e responsividade.
- Adicionar dashboard do usuário com métricas, notificações, histórico de ações.
- Integrar logs/auditoria do usuário.
- Melhorar navegação e acessibilidade.

### Checklist
- [ ] Refatorar UI com shadcn/ui
- [ ] Implementar dark/light mode
- [ ] Adicionar dashboard do usuário
- [ ] Integrar notificações e logs
- [ ] Garantir acessibilidade

### Referências Obrigatórias
- [ ] https://ui.shadcn.com/docs/components
- [ ] https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
- [ ] https://www.smashingmagazine.com/2021/11/modern-css-solutions-dark-mode/
- [ ] https://www.radix-ui.com/docs/primitives/components/tabs
- [ ] https://www.radix-ui.com/docs/primitives/components/tooltip
- [ ] https://www.radix-ui.com/docs/primitives/components/dialog
- [ ] https://www.radix-ui.com/docs/primitives/components/alert-dialog
- [ ] https://www.radix-ui.com/docs/primitives/components/scroll-area
- [ ] https://www.radix-ui.com/docs/primitives/components/accordion
- [ ] https://www.radix-ui.com/docs/primitives/components/checkbox
- [ ] https://www.radix-ui.com/docs/primitives/components/switch
- [ ] https://www.radix-ui.com/docs/primitives/components/slider
- [ ] https://www.radix-ui.com/docs/primitives/components/menubar
- [ ] https://www.radix-ui.com/docs/primitives/components/popover
- [ ] https://www.radix-ui.com/docs/primitives/components/select
- [ ] https://www.radix-ui.com/docs/primitives/components/combobox
- [ ] https://www.radix-ui.com/docs/primitives/components/toast
- [ ] https://www.radix-ui.com/docs/primitives/components/tooltip
- [ ] https://www.radix-ui.com/docs/primitives/components/avatar
- [ ] https://www.radix-ui.com/docs/primitives/components/progress
- [ ] https://www.radix-ui.com/docs/primitives/components/scroll-area

## 3. Auditoria e Logs

### Diagnóstico
- Falta de centralização e visualização dos logs/auditoria.
- Ausência de painel de auditoria para admin e usuário.
- Logs pouco detalhados e sem rastreabilidade.

### Plano de Melhoria
- Implementar sistema centralizado de logs/auditoria (backend e frontend).
- Adicionar painel de visualização para admin e usuário.
- Integrar logs a eventos críticos (login, MFA, ações sensíveis, etc).
- Garantir exportação e busca avançada.

### Checklist
- [ ] Implementar sistema centralizado de logs
- [ ] Adicionar painel de auditoria
- [ ] Integrar logs a eventos críticos
- [ ] Implementar busca/exportação
- [ ] Garantir compliance (LGPD, etc)

### Referências Obrigatórias
- [ ] https://www.elastic.co/what-is/elk-stack
- [ ] https://www.datadoghq.com/blog/log-management-best-practices/
- [ ] https://www.fluentd.org/guides/recipes/logging-to-elasticsearch
- [ ] https://www.loggly.com/ultimate-guide/node-logging-basics/
- [ ] https://www.npmjs.com/package/winston
- [ ] https://www.npmjs.com/package/pino
- [ ] https://www.npmjs.com/package/morgan
- [ ] https://www.npmjs.com/package/express-winston
- [ ] https://www.npmjs.com/package/express-pino-logger
- [ ] https://www.npmjs.com/package/log4js
- [ ] https://www.npmjs.com/package/next-logger
- [ ] https://www.npmjs.com/package/next-logger
- [ ] https://www.npmjs.com/package/next-logger
- [ ] https://www.npmjs.com/package/next-logger
- [ ] https://www.npmjs.com/package/next-logger
- [ ] https://www.npmjs.com/package/next-logger
- [ ] https://www.npmjs.com/package/next-logger
- [ ] https://www.npmjs.com/package/next-logger
- [ ] https://www.npmjs.com/package/next-logger
- [ ] https://www.npmjs.com/package/next-logger

## 4. Sistema de Notificações

### Diagnóstico
- Implementação atual é stub/temporária, sem persistência, sem integração real com UI e backend.
- Falta de painel de notificações, histórico, e integração com área do cliente/admin.

### Plano de Melhoria
- Implementar sistema definitivo de notificações (persistência, APIs, UI, integração com eventos do sistema).
- Adicionar painel de notificações para admin e usuário.
- Integrar com sistema de e-mails e logs.
- Garantir notificações em tempo real (WebSocket ou SSE).

### Checklist
- [ ] Implementar backend definitivo de notificações
- [ ] Adicionar painel de notificações
- [ ] Integrar com eventos do sistema
- [ ] Garantir notificações em tempo real
- [ ] Integrar com sistema de e-mails

### Referências Obrigatórias
- [ ] https://ui.shadcn.com/docs/components/toast
- [ ] https://ui.shadcn.com/docs/components/alert
- [ ] https://ui.shadcn.com/docs/components/notification
- [ ] https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
- [ ] https://socket.io/docs/v4/
- [ ] https://developer.mozilla.org/pt-BR/docs/Web/API/Server-sent_events/Using_server-sent_events
- [ ] https://www.npmjs.com/package/web-push
- [ ] https://www.npmjs.com/package/onesignal-node
- [ ] https://www.npmjs.com/package/onesignal
- [ ] https://www.npmjs.com/package/push.js
- [ ] https://www.npmjs.com/package/next-pwa
- [ ] https://www.npmjs.com/package/next-notifications
- [ ] https://www.npmjs.com/package/next-notifications
- [ ] https://www.npmjs.com/package/next-notifications
- [ ] https://www.npmjs.com/package/next-notifications
- [ ] https://www.npmjs.com/package/next-notifications
- [ ] https://www.npmjs.com/package/next-notifications
- [ ] https://www.npmjs.com/package/next-notifications
- [ ] https://www.npmjs.com/package/next-notifications
- [ ] https://www.npmjs.com/package/next-notifications

## 5. Sistema de E-mails

### Diagnóstico
- Templates e envio de e-mails básicos, sem logs detalhados, rastreio ou integração com notificações.

### Plano de Melhoria
- Refatorar sistema de e-mails para uso de templates modernos (MJML, React Email, etc).
- Adicionar logs detalhados de envio, falha e rastreio.
- Integrar com sistema de notificações e eventos críticos.

### Checklist
- [ ] Refatorar templates de e-mail
- [ ] Adicionar logs de envio/rastreio
- [ ] Integrar com notificações
- [ ] Garantir suporte a múltiplos provedores (SMTP, SES, etc)

### Referências Obrigatórias
- [ ] https://react.email/
- [ ] https://mjml.io/
- [ ] https://nodemailer.com/about/
- [ ] https://www.npmjs.com/package/nodemailer
- [ ] https://www.npmjs.com/package/@react-email/components
- [ ] https://www.npmjs.com/package/@react-email/render
- [ ] https://www.npmjs.com/package/@react-email/utils
- [ ] https://www.npmjs.com/package/@react-email/preview
- [ ] https://www.npmjs.com/package/@react-email/cli
- [ ] https://www.npmjs.com/package/@react-email/cli
- [ ] https://www.npmjs.com/package/@react-email/cli
- [ ] https://www.npmjs.com/package/@react-email/cli
- [ ] https://www.npmjs.com/package/@react-email/cli
- [ ] https://www.npmjs.com/package/@react-email/cli
- [ ] https://www.npmjs.com/package/@react-email/cli
- [ ] https://www.npmjs.com/package/@react-email/cli
- [ ] https://www.npmjs.com/package/@react-email/cli
- [ ] https://www.npmjs.com/package/@react-email/cli

## 6. Cálculos Atuariais

### Diagnóstico
- Implementações parciais, falta de testes, documentação e validação de precisão.

### Plano de Melhoria
- Revisar e documentar todos os cálculos atuariais.
- Adicionar testes unitários e de precisão.
- Garantir documentação e exemplos de uso.

### Checklist
- [ ] Revisar e documentar cálculos
- [ ] Adicionar testes unitários
- [ ] Validar precisão dos resultados
- [ ] Documentar exemplos de uso

### Referências Obrigatórias
- [ ] https://www.soa.org/resources/research-reports/
- [ ] https://www.actuaries.org/
- [ ] https://www.casact.org/
- [ ] https://www.issa.int/
- [ ] https://www.actuary.com/
- [ ] https://www.actuarialoutpost.com/
- [ ] https://www.actuaries.digital/
- [ ] https://www.actuaries.org.uk/
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd
- [ ] https://www.actuaries.org.uk/learn-and-develop/continuous-professional-development-cpd

## 7. Sistema de Autenticação Multifator (MFA)

### Diagnóstico
- Implementação básica, falta de flows avançados, integração com logs/auditoria e UI moderna.

### Plano de Melhoria
- Refatorar sistema MFA para flows avançados (TOTP, SMS, e-mail, push).
- Integrar com logs/auditoria e UI moderna.
- Adicionar painel de gerenciamento MFA para admin e usuário.

### Checklist
- [ ] Refatorar sistema MFA
- [ ] Adicionar flows avançados
- [ ] Integrar com logs/auditoria
- [ ] Adicionar painel de gerenciamento

### Referências Obrigatórias
- [ ] https://authjs.dev/
- [ ] https://www.twilio.com/docs/authy/api
- [ ] https://www.npmjs.com/package/otplib
- [ ] https://www.npmjs.com/package/speakeasy
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth
- [ ] https://www.npmjs.com/package/next-auth

## 8. Limpeza Profunda e Refatoração de Arquivos/Pastas

### Diagnóstico
- Diversos arquivos/pastas com sufixos (bak, antigo, novo, moderno, backup, etc), arquivos stubs, temporários, incompletos, marcados para deleção ou em branco.
- Pastas vazias e arquivos sem uso.

### Plano de Melhoria
- Mapear e remover todos os arquivos/pastas obsoletos, stubs, temporários, incompletos, marcados para deleção ou em branco.
- Remover pastas vazias e arquivos sem uso.
- Auditar e finalizar arquivos aguardando implementação.
- Garantir que não haja código morto ou duplicado.

### Checklist
- [ ] Mapear arquivos/pastas obsoletos
- [ ] Remover arquivos/pastas desnecessários
- [ ] Auditar arquivos aguardando implementação
- [ ] Garantir ausência de código morto/duplicado

### Referências Obrigatórias
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/code-splitting
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/images
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/production
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/bundling
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge
- [ ] https://nextjs.org/docs/app/building-your-application/optimizing/edge


## 9. Auditoria Final e Validação

- [ ] Rodar lint e type-check em todo o projeto
- [ ] Garantir build sem erros
- [ ] Validar acessibilidade e responsividade
- [ ] Documentar todas as mudanças
- [ ] Acessar manualmente todos os links/endpoints e corrigir eventuais erros


## Conclusão

Este plano é obrigatório para a modernização, segurança e escalabilidade do projeto. **A consulta e estudo dos links/referências é obrigatória antes de qualquer implementação.**

---

> **Atenção:** O uso das referências e o ciclo de validação são obrigatórios para atualização de conhecimento e implementação de práticas modernas. O documento deve ser revisado e atualizado periodicamente.
