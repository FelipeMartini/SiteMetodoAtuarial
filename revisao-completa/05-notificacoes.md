
# 05 – Sistema de Notificações

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.

> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.

## Diagnóstico
- Notificações podem não ser persistidas de forma permanente no banco de dados.
- Falta de histórico, rastreabilidade e integração total com logs e ABAC puro.

## Plano de Melhoria
1. Refatorar o sistema para que todas as notificações relevantes (push, e-mail, sistema, etc) sejam gravadas de forma permanente no banco de dados.
2. Garantir que a tabela de notificações siga o padrão ABAC puro, sem expor dados sensíveis e mantendo integridade relacional.
3. Documentar e versionar a estrutura da tabela de notificações.
4. Integrar notificações com logs e auditoria.

## Checklist Detalhado
1. [ ] Refatorar sistema para notificações permanentes no banco de dados
2. [ ] Garantir que a tabela de notificações siga o padrão ABAC puro
3. [ ] Documentar e versionar a estrutura da tabela de notificações
4. [ ] Integrar notificações com logs e auditoria
5. [ ] Validar integração das notificações com MFA, logs e demais sistemas
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

### Instruções para Modelagem Segura da Tabela de Notificações (ABAC Puro)

1. Crie uma tabela `notificacoes` com os campos mínimos:
	- `id` (PK, UUID ou auto-incremento)
	- `user_id` (FK para usuário, se aplicável)
	- `type` (string curta, ex: 'EMAIL', 'PUSH', 'SISTEMA', etc)
	- `title` (string curta)
	- `message` (string, sem dados sensíveis)
	- `status` (enum: 'ENVIADA', 'LIDA', 'FALHA', etc)
	- `timestamp` (datetime, default now)
	- `details` (JSON, para payloads não sensíveis)
2. Nunca armazene dados sensíveis diretamente (ex: tokens, dados pessoais completos).
3. Garanta que a tabela respeite as constraints e relacionamentos do ABAC puro (ex: user_id sempre referenciando usuário válido, type padronizado).
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
🚨 OBRIGATÓRIO: Todas as notificações relevantes devem ser gravadas de forma permanente no banco de dados, seguindo o padrão ABAC puro e sem expor dados sensíveis. Siga SEMPRE o ciclo de validação e as instruções de modelagem acima!
```

> **NUNCA pule a etapa de validação manual nos links/endpoints, a revisão de variáveis e a análise da estrutura do banco de dados!

## Referências Obrigatórias e Atualizadas

- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js Logging](https://nextjs.org/docs/app/building-your-application/optimizing/logging)
- [Socket.IO - Notificações em Tempo Real](https://socket.io/docs/v4/)
- [Web Push - Notificações Push](https://www.npmjs.com/package/web-push)
- [Prisma - Modelagem de Dados](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [ABAC - Attribute-Based Access Control](https://en.wikipedia.org/wiki/Attribute-based_access_control)
- [WCAG 2.2 - Acessibilidade Web](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. O ciclo de validação, modelagem e revisão está reforçado e atualizado.
