# 08 – Autenticação Multifator (MFA)

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.

> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.

## Diagnóstico
1. Implementação básica, falta de flows avançados, integração com logs/auditoria e UI moderna.
2. MFA não está integrado com logs de auditoria, notificações e painel de gerenciamento para admin/usuário.
3. Falta de suporte a múltiplos métodos (TOTP, SMS, e-mail, push) e flows de recuperação.

## Plano de Melhoria
1. Refatorar sistema MFA para flows avançados (TOTP, SMS, e-mail, push).
2. Integrar MFA com logs/auditoria e sistema de notificações.
3. Adicionar painel de gerenciamento MFA para admin e usuário.
4. Garantir flows de recuperação e fallback seguro.
5. Documentar arquitetura, flows e exemplos de uso.
6. Revisar e garantir que a tabela MFA no banco de dados siga o padrão ABAC puro, sem expor dados sensíveis e mantendo integridade relacional.

## Checklist Detalhado
1. [ ] Refatorar sistema MFA para múltiplos métodos (TOTP, SMS, e-mail, push)
2. [ ] Integrar MFA com logs/auditoria
3. [ ] Integrar MFA com sistema de notificações
4. [ ] Adicionar painel de gerenciamento MFA para admin e usuário
5. [ ] Implementar flows de recuperação e fallback seguro
6. [ ] Documentar arquitetura, flows e exemplos de uso
7. [ ] Revisar e garantir que a tabela MFA no banco de dados siga o padrão ABAC puro, sem expor dados sensíveis e mantendo integridade relacional
8. [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
9. [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros
## Instruções para Modelagem Segura da Tabela MFA (ABAC Puro)

1. Crie ou revise a tabela `mfa` com os campos mínimos:
	- `id` (PK, UUID ou auto-incremento)
	- `user_id` (FK para usuário)
	- `method` (enum: 'TOTP', 'SMS', 'EMAIL', 'PUSH')
	- `enabled` (boolean)
	- `created_at` (datetime)
	- `updated_at` (datetime)
	- `details` (JSON, para payloads não sensíveis)
2. Nunca armazene segredos ou códigos em texto puro. Use hash seguro ou criptografia.
3. Garanta que a tabela respeite as constraints e relacionamentos do ABAC puro (ex: user_id sempre referenciando usuário válido, method padronizado).
4. Use migrations versionadas (ex: Prisma, Knex, Sequelize) e documente cada alteração.
5. Teste a integridade relacional e a performance das queries de auditoria.
6. Documente exemplos de queries seguras para auditoria e exportação.


## Instruções Técnicas (OBRIGATÓRIAS)

> **⚠️ Siga SEMPRE o ciclo de validação abaixo:**
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

## Destaque Visual e Reforço de Obrigatoriedade

```
🚨 OBRIGATÓRIO: Siga SEMPRE o ciclo de validação para cada alteração:
1. Corrija TODOS os erros de type-check (TypeScript)
2. Corrija TODOS os erros/avisos de lint
3. Corrija TODOS os erros de build
4. Repita o ciclo até zerar erros
5. Execute limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos
6. Revise todas as variáveis e seus usos para evitar conflitos, principalmente em autenticação e endpoints seguros
7. ACESSE TODOS os links/endpoints no navegador e corrija eventuais erros
8. Só avance após tudo estar 100% limpo!
```

> **NUNCA pule a etapa de validação manual nos links/endpoints e a revisão de variáveis!**

## Referências Obrigatórias e Atualizadas

### MFA, Autenticação, Logs, Notificações e UI
1. [Auth.js - Autenticação Moderna](https://authjs.dev/getting-started)
2. [Twilio Authy - MFA/2FA](https://www.twilio.com/docs/authy/api)
3. [Otplib - MFA/2FA TOTP/HOTP](https://www.npmjs.com/package/otplib)
4. [Speakeasy - MFA/2FA](https://www.npmjs.com/package/speakeasy)
5. [NextAuth.js - MFA](https://next-auth.js.org/providers/credentials)
6. [React Email](https://react.email/)
7. [Socket.IO - Notificações em Tempo Real](https://socket.io/docs/v4/)
8. [Web Push - Notificações Push](https://www.npmjs.com/package/web-push)
9. [Winston - Logging Node.js](https://www.npmjs.com/package/winston)
10. [Elastic Stack - Observabilidade e Logs](https://www.elastic.co/elastic-stack)
11. [Next.js - Logging](https://nextjs.org/docs/app/building-your-application/optimizing/logging)
12. [Next.js - Data Security](https://nextjs.org/docs/app/guides/data-security)
13. [Next.js - Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)
14. [Next.js - Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
15. [Next.js - Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
16. [Next.js - Accessibility](https://nextjs.org/docs/architecture/accessibility)
17. [WCAG 2.2 - Acessibilidade Web](https://www.w3.org/WAI/standards-guidelines/wcag/)
18. [shadcn/ui - Componentes UI](https://ui.shadcn.com/docs/components)
19. [Radix UI - Dialog](https://www.radix-ui.com/primitives/components/dialog)
20. [TanStack Table - Tabelas Avançadas](https://tanstack.com/table/v8/docs/guide)

---

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. Novos links de MFA, autenticação, logs, notificações, UI, acessibilidade e ciclo de validação foram incluídos.
3. Todos os tópicos abordados nas tarefas e sub-tarefas possuem referência moderna e oficial.
4. O ciclo de validação e revisão está reforçado e atualizado.

