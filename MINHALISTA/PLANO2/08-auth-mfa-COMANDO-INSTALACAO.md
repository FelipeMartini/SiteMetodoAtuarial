---
applyTo: '**'
---

# Comando recomendado para instalar dependências MFA (Auth.js v5, TOTP, WebAuthn)

Execute no terminal, na raiz do projeto `site-metodo`:

```bash
cd /home/felipe/Área de Trabalho/GitHub/SiteMetodoAtuarial/site-metodo && npm install @auth/core @auth/prisma-adapter speakeasy qrcode @simplewebauthn/server @simplewebauthn/browser
```

> Isso garante suporte a Auth.js v5, TOTP (speakeasy/qrcode) e WebAuthn (passkeys, biometria).

Após instalar, prossiga para atualizar o schema do Prisma conforme checklist detalhado.
