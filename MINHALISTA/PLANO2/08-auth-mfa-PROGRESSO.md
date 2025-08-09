---
applyTo: '**'
---

# Log de Progresso — Auth.js v5 + MFA (TOTP/WebAuthn)

## 1️⃣ Instalação de dependências
- [ ] @auth/core
- [ ] @auth/prisma-adapter
- [ ] speakeasy
- [ ] qrcode
- [ ] @simplewebauthn/server
- [ ] @simplewebauthn/browser

## 2️⃣ Atualização do schema Prisma
- [ ] Campo `totpSecret` em User
- [ ] Tabela Authenticator (WebAuthn)

## 3️⃣ Configuração inicial do Auth.js v5
- [ ] Configuração de providers (email, social, passkey)
- [ ] Adapter Prisma
- [ ] Variáveis de ambiente

## 4️⃣ Endpoints e UI
- [ ] Endpoints para setup, verificação e status do MFA
- [ ] UI para setup, QR code, verificação, recovery

## 5️⃣ Integração de flows e testes
- [ ] Flows de MFA no login/registro
- [ ] Testes automatizados

> Marque cada etapa conforme for concluída para rastreabilidade incremental.
