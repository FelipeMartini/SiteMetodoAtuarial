# Arquitetura e Plano de Implementação: Auth.js v5 + MFA (2025)

## Stack e Abordagem
- **Auth.js v5** (NextAuth.js v5, open source, extensível, seguro)
- **MFA**: TOTP (Google Authenticator, Authy), WebAuthn (passkeys, biometria), recovery codes
- **Integração CRUD, roles, flows modernos, UX, logs, segurança, SSR/CSR**

## Fluxo Macro
1. **Infraestrutura**
   - [ ] Instalar e configurar Auth.js v5
   - [ ] Configurar providers (email, social, enterprise, etc)
   - [ ] Configurar banco seguro para sessões, usuários, MFA
   - [ ] Variáveis de ambiente seguras
2. **MFA: TOTP e WebAuthn**
   - [ ] Instalar libs: `speakeasy`, `qrcode`, `@simplewebauthn/server` (ou Authsignal para flows prontos)
   - [ ] Criar endpoints para geração, verificação e status do MFA
   - [ ] UI para setup, QR code, verificação, recovery
   - [ ] Flows: registro, login, step-up, recovery, fallback
3. **Integração CRUD/Permissões**
   - [ ] MFA obrigatório para admins/sensível
   - [ ] Flags para exigir MFA em flows críticos
   - [ ] CRUD de usuários com status MFA, reset, logs
4. **Segurança e Governança**
   - [ ] Hash seguro de secrets, HTTPS, rate limit, logs
   - [ ] Monitoramento de tentativas, alertas, bloqueio
   - [ ] Testes automatizados de flows e segurança
5. **UX/Recovery**
   - [ ] UI/UX moderna, acessível, mobile-first
   - [ ] Recovery codes, fallback, notificações
   - [ ] Documentação para onboarding e suporte
6. **Documentação e Boas Práticas**
   - [ ] Documentar flows, endpoints, UI, recovery
   - [ ] Checklist de revisão periódica

## Referências
- [Auth.js Docs](https://authjs.dev/)
- [TOTP Next.js Guide](https://medium.com/@corbado_tech/how-to-implement-totp-authentication-in-next-js-97c07c120a88)
- [WebAuthn Auth.js](https://authjs.dev/getting-started/authentication/webauthn)
- [Authsignal MFA/Passkeys](https://www.authsignal.com/passkeys-mfa/nextauth-js)
- [NextAuth.js Example](https://github.com/nextauthjs/next-auth-example)
