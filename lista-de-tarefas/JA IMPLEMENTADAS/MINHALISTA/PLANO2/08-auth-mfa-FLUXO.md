---
applyTo: '**'
---

# Documentação do Fluxo MFA (TOTP) — Auth.js v5

## Visão Geral
O sistema implementa autenticação multifator (MFA) baseada em TOTP (Google Authenticator/Authy) de forma modular, segura e expansível. O fluxo é controlado por uma configuração central (`src/configs/mfaConfig.ts`) que define para quais operações (flows) o MFA é obrigatório.

## Fluxo de Login com MFA
1. **Usuário acessa a tela de login** e informa email e senha normalmente.
2. **Após autenticação da senha**, o sistema verifica se o flow "login" exige MFA e se o usuário tem MFA TOTP ativado.
3. Se sim, **exibe o prompt de código TOTP** (6 dígitos) antes de liberar o acesso.
4. O código é validado via endpoint `/api/auth/totp-verify`.
5. Se correto, o login é concluído e a sessão é liberada normalmente.
6. Se incorreto, o usuário é informado e pode tentar novamente.

## Setup e Gerenciamento do MFA
- O usuário pode ativar/desativar o MFA na área do cliente.
- O setup gera um QR code para ser escaneado no app autenticador.
- O status do MFA é exibido e pode ser alterado a qualquer momento.

## Expansão para Outros Flows
A configuração `mfaConfig.obrigatorio` permite definir para quais operações o MFA será exigido. Exemplos de flows que podem ser protegidos:
- **login**: já implementado (obrigatório por padrão)
- **admin-area**: exigir MFA para acessar rotas administrativas
- **reset-password**: exigir MFA para redefinir senha
- **alterar-email**: exigir MFA para alterar email cadastrado
- **alterar-senha**: exigir MFA para alterar senha
- **transferencia**: exigir MFA para operações financeiras/sensíveis

Para expandir, basta adicionar o flow desejado no array `obrigatorio` e implementar a checagem no respectivo endpoint ou página. O sistema já está preparado para isso.

## Segurança e Boas Práticas
- O segredo TOTP nunca é exposto ao frontend.
- O código é validado sempre no backend.
- O usuário pode ativar/desativar o MFA de forma autônoma.
- O fluxo é desacoplado e pronto para ser integrado a outros flows críticos.

## Referências
- [Auth.js MFA](https://authjs.dev/reference/core/types#multifactor)
- [TOTP Next.js Guide](https://medium.com/@corbado_tech/how-to-implement-totp-authentication-in-next-js-97c07c120a88)

---

> Para expandir para outros flows, basta adicionar o nome do flow em `mfaConfig.obrigatorio` e usar a função `isMfaObrigatorio('nome-do-flow')` no local apropriado (endpoint, página, etc). O sistema já está pronto para isso.
