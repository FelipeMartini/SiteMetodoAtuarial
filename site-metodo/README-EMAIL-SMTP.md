# Como configurar o envio de e-mails via SMTP (Plesk)

1. Preencha as variáveis de ambiente no arquivo `.env.local` ou `.env`:

```
SMTP_HOST=mail.seudominio.com
SMTP_PORT=587
SMTP_USER=sistema@seudominio.com
SMTP_PASS=suasenha
SMTP_FROM="Seu Nome <sistema@seudominio.com>"
```

2. O endpoint `/api/email` aceita POST com o seguinte JSON:

```
{
  "to": "destinatario@exemplo.com",
  "subject": "Assunto do e-mail",
  "text": "Texto simples do e-mail",
  "html": "<b>HTML opcional</b>"
}
```

3. O envio funciona tanto em dev quanto em produção, usando sempre o SMTP do seu Plesk.

4. Para testar localmente, basta rodar o Next.js normalmente e chamar a rota `/api/email`.

5. Se der erro de conexão, verifique se a porta SMTP está liberada no firewall do Plesk para conexões externas.

6. Nunca exponha as credenciais do SMTP em repositórios públicos.

---

Dica: Para logs detalhados, adicione `logger: true` no transporter do Nodemailer.
