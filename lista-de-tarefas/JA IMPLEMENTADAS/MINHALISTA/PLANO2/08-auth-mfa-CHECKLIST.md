---
applyTo: '**'
---

# Checklist Detalhado: Auth.js v5 + MFA (TOTP/WebAuthn)

## Etapas Principais

- [ ] Instalar dependências: @auth/core, @auth/prisma-adapter, speakeasy, qrcode, @simplewebauthn/server, @simplewebauthn/browser
- [ ] Atualizar schema do Prisma: adicionar tabela Authenticator (WebAuthn) e campo totpSecret em User
- [ ] Configurar Auth.js v5 com providers (email, social, passkey)
- [ ] Implementar endpoints para setup, verificação e status do MFA (TOTP/WebAuthn)
- [ ] Criar UI para setup, QR code, verificação, recovery e fallback
- [ ] Integrar flows de MFA ao login, registro e flows críticos (step-up)
- [ ] Adicionar testes automatizados para flows de MFA
- [ ] Documentar fluxos, endpoints e exemplos de uso

## Referências
- [Auth.js Docs](https://authjs.dev/)
- [TOTP Next.js Guide](https://medium.com/@corbado_tech/how-to-implement-totp-authentication-in-next-js-97c07c120a88)
- [WebAuthn Auth.js](https://authjs.dev/getting-started/authentication/webauthn)

> Siga este checklist incrementalmente para garantir uma implementação segura, moderna e colaborativa de autenticação multifator.
