# Configuração de E-mails - Método Atuarial

Este arquivo descreve a configuração básica do sistema de e-mails do projeto.

Variáveis de ambiente principais

- EMAIL_PROVIDER: 'nodemailer' | 'ses' | 'sendgrid' (padrão: nodemailer)
- EMAIL_SEND_ENABLED: 'true' para enviar emails reais em ambientes não-prod
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
- SES_SMTP_HOST, SES_SMTP_PORT, SES_SMTP_USER, SES_SMTP_PASS, SES_FROM
- SENDGRID_API_KEY, SENDGRID_FROM
- NEXTAUTH_URL (usado nos templates)

Como testar localmente

- Por padrão o sistema opera em modo simulado (não envia e-mails reais). Para enviar em dev:

```bash
EMAIL_SEND_ENABLED=true SMTP_HOST=... SMTP_PORT=... SMTP_USER=... SMTP_PASS=... npm run dev
```

Seleção de provider

- Configure `EMAIL_PROVIDER=sendgrid` para usar o adapter SendGrid (exige `SENDGRID_API_KEY`).

Nota sobre warnings no build
---------------------------
O adaptador SendGrid usa um import dinâmico construído por string para evitar resolução
estática por bundlers; isso pode gerar o warning "Critical dependency: the request of a dependency is an expression"
durante o build. Isso é esperado e benigno no runtime do servidor quando a dependência e chaves estão corretamente configuradas.
Não vamos alterar esse comportamento agora — registrar aqui para que futuros mantenedores saibam o motivo e opções de correção.
- Configure `EMAIL_PROVIDER=ses` para usar o adapter SES.

Segurança

- Nunca commite chaves em repositório. Use segredos do provider ou variáveis de ambiente no deploy.

Observações

- Adapters são skeletons; ajuste conforme seu fluxo de entrega (SES via AWS SDK, SendGrid com configuração avançada, etc).
