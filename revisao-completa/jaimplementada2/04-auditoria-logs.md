
# 04 – Auditoria & Logs

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.

> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.

## Diagnóstico
- Logs atualmente podem não ser persistidos de forma permanente no banco de dados.
- Falta de padronização e rastreabilidade total dos eventos críticos.
- Estrutura da tabela de logs pode não estar adequada ao modelo ABAC puro.

## Plano de Melhoria
1. Refatorar o sistema para que todos os logs relevantes (ações de usuário, eventos críticos, autenticação, MFA, notificações, etc) sejam gravados de forma permanente no banco de dados.
2. Garantir que a tabela de logs siga o padrão ABAC puro, sem expor dados sensíveis e mantendo integridade relacional.
3. Documentar e versionar a estrutura da tabela de logs.
4. Implementar mecanismos de consulta, exportação e auditoria dos logs.

## Checklist Detalhado
1. [ ] Refatorar sistema para logs permanentes no banco de dados
2. [ ] Garantir que a tabela de logs siga o padrão ABAC puro
3. [ ] Documentar e versionar a estrutura da tabela de logs
4. [ ] Implementar mecanismos de consulta/exportação/auditoria
5. [ ] Validar integração dos logs com MFA, notificações e demais sistemas
6. [ ] Realizar limpeza de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos após build
7. [ ] Revisar todas as variáveis e seus usos para evitar conflitos, especialmente em autenticação e endpoints seguros

## Instruções Técnicas (OBRIGATÓRIAS)

> **⚠️ Siga SEMPRE o ciclo de validação abaixo:**
> 1. Corrija TODOS os erros de type-check (TypeScript)
> 2. Corrija TODOS os erros/avisos de lint
> 3. Corrija TODOS os erros de build
> 4. Repita o ciclo até zerar erros
> 5. **Antes de acessar manualmente os links/endpoints, execute uma limpeza completa de arquivos temporários, renomeados, em branco, marcados para deletar ou resíduos do processo**
> 6. **Revise todas as variáveis e seus usos atuais para garantir que nada foi quebrado, principalmente em autenticação e endpoints seguros**
> 7. Só então acesse TODOS os links/endpoints no navegador e corrija eventuais erros

### Instruções para Modelagem Segura da Tabela de Logs (ABAC Puro)

1. Crie uma tabela `logs` com os campos mínimos:
	- `id` (PK, UUID ou auto-incremento)
	- `user_id` (FK para usuário, se aplicável)
	- `action` (string curta, ex: 'LOGIN', 'MFA_SUCCESS', 'NOTIFICATION_SENT', etc)
	- `resource` (string curta, ex: 'user', 'admin', 'notificacao', etc)
	- `timestamp` (datetime, default now)
	- `details` (JSON, para payloads não sensíveis)
2. Nunca armazene dados sensíveis diretamente (ex: senhas, tokens, dados pessoais completos).
3. Garanta que a tabela respeite as constraints e relacionamentos do ABAC puro (ex: user_id sempre referenciando usuário válido, resource padronizado).
4. Use migrations versionadas (ex: Prisma, Knex, Sequelize) e documente cada alteração.
5. Teste a integridade relacional e a performance das queries de auditoria.
6. Documente exemplos de queries seguras para auditoria e exportação.

> **OBRIGATÓRIO:**
> - Não utilize `any` em hipótese alguma no código.
> - Tipos `unknown` devem ser tipados corretamente e explicitamente.
> - Sempre prefira e estenda tipagens oficiais das bibliotecas/frameworks quando necessário.
> - Revise e corrija a tipagem de todas as funções, variáveis e props.

## Destaque Visual e Reforço de Obrigatoriedade

```
🚨 OBRIGATÓRIO: Todos os logs relevantes devem ser gravados de forma permanente no banco de dados, seguindo o padrão ABAC puro e sem expor dados sensíveis. Siga SEMPRE o ciclo de validação e as instruções de modelagem acima!
```

> **NUNCA pule a etapa de validação manual nos links/endpoints, a revisão de variáveis e a análise da estrutura do banco de dados!

## Referências Obrigatórias e Atualizadas

- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js Logging](https://nextjs.org/docs/app/building-your-application/optimizing/logging)
- [Winston - Logging Node.js](https://www.npmjs.com/package/winston)
- [Elastic Stack - Observabilidade e Logs](https://www.elastic.co/elastic-stack)
- [Prisma - Modelagem de Dados](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [ABAC - Attribute-Based Access Control](https://en.wikipedia.org/wiki/Attribute-based_access_control)
- [WCAG 2.2 - Acessibilidade Web](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. O ciclo de validação, modelagem e revisão está reforçado e atualizado.
