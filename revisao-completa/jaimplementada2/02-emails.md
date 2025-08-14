---
# 01 – Sistema de E-mails Moderno, Logs e Integração

> **IMPORTANTE:**
> - O progresso desta tarefa deve ser marcado e acompanhado simultaneamente:
>   1. No checklist do template de tarefa principal;
>   2. No checklist do template de tarefa secundária (quando houver);
>   3. Neste arquivo específico da tarefa.
> - Isso garante rastreabilidade e validação cruzada.
>
> - **Ao finalizar uma tarefa principal, é OBRIGATÓRIO reler todos os arquivos da pasta `revisao-completa` para relembrar o processo como um todo antes de iniciar a próxima tarefa principal.**

## Checklist Detalhado de E-mails
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

## Plano de Implementação de E-mails
...existing code...

## Instruções Técnicas (OBRIGATÓRIAS)

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

## Referências Modernas
- [React Email](https://react.email/)
- [MJML - Framework de E-mail Responsivo](https://mjml.io/)
- [Nodemailer - Envio de E-mails](https://nodemailer.com/about/)
- [@react-email/components](https://www.npmjs.com/package/@react-email/components)
- [@react-email/render](https://www.npmjs.com/package/@react-email/render)
- [@react-email/utils](https://www.npmjs.com/package/@react-email/utils)
- [@react-email/preview](https://www.npmjs.com/package/@react-email/preview)
- [SendGrid - API de E-mail](https://docs.sendgrid.com/for-developers/sending-email)
- [Amazon SES - E-mail Service](https://docs.aws.amazon.com/ses/latest/dg/send-email.html)
- [Mailgun - API de E-mail](https://documentation.mailgun.com/en/latest/)
- [Mailtrap - Teste de E-mails](https://mailtrap.io/docs/)
- [Next.js - Envio de E-mails](https://nextjs.org/docs/app/building-your-application/optimizing/email)
- [Next.js - Logging](https://nextjs.org/docs/app/building-your-application/optimizing/logging)
- [Winston - Logging Node.js](https://www.npmjs.com/package/winston)
- [Socket.IO - Notificações em Tempo Real](https://socket.io/docs/v4/)
- [Web Push - Notificações Push](https://www.npmjs.com/package/web-push)
- [Testing Library](https://testing-library.com/)
- [Markdown Guide](https://www.markdownguide.org/)

---
