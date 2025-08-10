# Teste E2E crítico: Fluxo de login social e credenciais (Auth.js v5)

Este teste cobre o fluxo completo de login social (Google) e por credenciais, validando:
- Criação de usuário social (Google) e persistência correta de emailVerified (Date/null)
- Login por credenciais
- Sessão persistente (database)
- Endpoint /api/me retorna usuário autenticado
- Falhas comuns (CSRF, credenciais inválidas)

```markdown
- [ ] Teste login social Google: simula callback, valida criação de usuário e sessão
- [ ] Teste login por credenciais: cria usuário, faz login, valida sessão
- [ ] Teste endpoint /api/me autenticado e não autenticado
- [ ] Teste falha de CSRF/state inválido
- [ ] Teste credenciais inválidas
```

> Implementar em `src/__tests__/authE2E.test.ts` cobrindo todos os fluxos críticos.
