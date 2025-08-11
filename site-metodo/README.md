# Site Método – Autenticação Unificada (Resumo Providers)

## Providers OAuth Configurados Condicionalmente

Os seguintes providers podem ser habilitados definindo suas variáveis no `.env` (ver `.env.example`):

| Provider           | Variáveis Necessárias                                                                                 | Observações                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Credentials        | AUTH_SECRET                                                                                           | Sempre ativo (login interno)          |
| Email (magic link) | SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM                                                           | Inserido após Credentials             |
| Google             | AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET                                                                    |                                       |
| GitHub             | AUTH_GITHUB_ID, AUTH_GITHUB_SECRET                                                                    |                                       |
| Apple              | AUTH_APPLE_ID, AUTH_APPLE_TEAM_ID, AUTH_APPLE_KEY_ID, AUTH_APPLE_PRIVATE_KEY                          | Converte \n escapado para quebra real |
| Twitter            | AUTH_TWITTER_ID, AUTH_TWITTER_SECRET                                                                  |                                       |
| Microsoft Entra ID | AUTH_MICROSOFT_ENTRA_ID_ID, AUTH_MICROSOFT_ENTRA_ID_SECRET, (opcional AUTH_MICROSOFT_ENTRA_ID_ISSUER) | ID provider: `microsoft-entra-id`     |

O componente `SocialLoginBox` consome `/api/auth/providers` para detectar quais providers estão ativos e desabilita os botões ausentes mostrando tooltip.

## Limpeza Realizada

- Removidas rotas manuais customizadas Microsoft.
- Removido endpoint duplicado `/api/auth/local/register`.
- Registro consolidado em `/api/auth/register` usando prisma singleton.

## Próximos Passos Sugeridos

- Refinar testes de integração (quando retomados).
- Adicionar indicadores de rate limit visual no formulário de registro caso backend implemente.
