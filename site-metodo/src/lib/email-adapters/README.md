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

Nota sobre warning de bundler
---------------------------
Algumas implementações (ex.: `sendgrid-adapter.server.ts`) usam um import dinâmico construído por string
(`['@sendgrid','mail'].join('/')` + `import(pkgName)`) para evitar que bundlers façam resolução estática do pacote.

Isso frequentemente gera um warning do tipo:

	"Critical dependency: the request of a dependency is an expression"

Esse aviso é esperado quando o código usa import dinâmico por expressão. No contexto deste projeto:
- é intencional (evita bundling estático do provider e permite comportamento flexível em runtime);
- não impede a execução no servidor Node.js quando a dependência está instalada e as chaves estão configuradas;
- não será ajustado automaticamente pela equipe agora (decisão explicitada pelo time).

Como documentar / próximos passos possíveis:
- Se quiser eliminar o warning no build, substitua o import dinâmico por um import condicional claro, por exemplo:
	```ts
	try { const sg = await import('@sendgrid/mail'); /* ... */ } catch (e) { /* fallback */ }
	```
	(esse pattern tende a ser melhor entendido pelos bundlers e reduz o warning)
- Alternativamente, aceite o warning como benigno e documente-o — que é o que estamos fazendo aqui.

Quando for necessário ativar envios reais em dev, configure `EMAIL_SEND_ENABLED=true` e `EMAIL_PROVIDER=sendgrid` e forneça `SENDGRID_API_KEY` (nunca comitar a chave).
