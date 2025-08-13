# 06 – Sistema de E-mails

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.

> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

> **Observação:** Todo o conteúdo, progresso e checklist deste arquivo se refere exclusivamente ao projeto na pasta `site-metodo`. O restante do workspace não deve ser analisado ou considerado para marcação de progresso.

## Diagnóstico
1. Templates e envio de e-mails básicos, sem logs detalhados, rastreio ou integração com notificações.

## Plano de Melhoria
1. Refatorar sistema de e-mails para uso de templates modernos (MJML, React Email, etc).
2. Adicionar logs detalhados de envio, falha e rastreio.
3. Integrar com sistema de notificações e eventos críticos.

## Checklist Detalhado
1. [ ] Refatorar templates de e-mail
2. [ ] Adicionar logs de envio/rastreio
3. [ ] Integrar com notificações
4. [ ] Garantir suporte a múltiplos provedores (SMTP, SES, etc)
5. [ ] Documentar arquitetura de e-mails
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

### E-mails, Templates, Logs, Rastreamento e Integração
1. [React Email](https://react.email/)
2. [MJML - Framework de E-mail Responsivo](https://mjml.io/)
3. [Nodemailer - Envio de E-mails](https://nodemailer.com/about/)
4. [Nodemailer (npm)](https://www.npmjs.com/package/nodemailer)
5. [@react-email/components](https://www.npmjs.com/package/@react-email/components)
6. [@react-email/render](https://www.npmjs.com/package/@react-email/render)
7. [@react-email/utils](https://www.npmjs.com/package/@react-email/utils)
8. [@react-email/preview](https://www.npmjs.com/package/@react-email/preview)

### Novas Referências e Melhores Práticas (2025)
9. [SendGrid - API de E-mail](https://docs.sendgrid.com/for-developers/sending-email)
10. [Amazon SES - E-mail Service](https://docs.aws.amazon.com/ses/latest/dg/send-email.html)
11. [Mailgun - API de E-mail](https://documentation.mailgun.com/en/latest/)
12. [Mailtrap - Teste de E-mails](https://mailtrap.io/docs/)
13. [Next.js - Envio de E-mails](https://nextjs.org/docs/app/building-your-application/optimizing/email)
14. [Next.js - Logging](https://nextjs.org/docs/app/building-your-application/optimizing/logging)
15. [Winston - Logging Node.js](https://www.npmjs.com/package/winston)
16. [Socket.IO - Notificações em Tempo Real](https://socket.io/docs/v4/)
17. [Web Push - Notificações Push](https://www.npmjs.com/package/web-push)

---

**Checklist de Referências Atualizado:**
1. Todas as referências obrigatórias e recomendadas estão presentes.
2. Novos links de templates, logs, rastreamento, integração com notificações e provedores foram incluídos.
3. Todos os tópicos abordados nas tarefas e sub-tarefas possuem referência moderna e oficial.
4. O ciclo de validação e revisão está reforçado e atualizado.
