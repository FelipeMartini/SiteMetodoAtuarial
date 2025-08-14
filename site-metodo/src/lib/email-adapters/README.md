# Email Adapters

Skeletons para integração com provedores externos de e-mail.

- `ses-adapter.server.ts` - exemplo usando SMTP compatível com SES (pode ser substituído por AWS SDK)
- `sendgrid-adapter.server.ts` - exemplo usando SendGrid via `@sendgrid/mail`

Variáveis de ambiente úteis:

- `EMAIL_SEND_ENABLED` - quando `true` envia realmente; em desenvolvimento por padrão é simulado
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `SES_SMTP_HOST`, `SES_SMTP_PORT`, `SES_SMTP_USER`, `SES_SMTP_PASS`, `SES_FROM`
- `SENDGRID_API_KEY`, `SENDGRID_FROM`

Uso:
- Os adapters são módulos auxiliares. O `email-service.server.ts` pode importar e usar o adapter correto conforme a configuração (por exemplo, `process.env.EMAIL_PROVIDER = 'sendgrid'` ou `ses`).

Segurança:
- Nunca insira chaves em código. Use variáveis de ambiente e segredos no deploy.
