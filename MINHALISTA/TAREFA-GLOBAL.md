# TAREFA GLOBAL

## Autenticação Unificada (Atualizado)
- [x] Remover rotas customizadas /api/auth/signin/* duplicadas
- [x] Ajustar SocialLoginBox para usar /api/auth/signin/<provider>
- [x] Criar /api/me (GET/PATCH)
- [x] Hook useCurrentUser
- [x] Hook useAuditLogs
- [x] Teste básico authFlow (providers + credentials callback)
- [ ] Expandir testes (social redirect / fluxo MFA)

## Próximos Passos Área do Cliente
- [ ] Página dashboard pessoal com widgets (recentes, MFA, sessões)
- [ ] Hook useSessions
- [ ] Gestão de sessões (revogar)
- [ ] Preferências (tema/idioma) persistidas
- [ ] Página segurança (MFA status, WebAuthn passkeys)
- [ ] Página atividades (audit logs filtrados do usuário)

## Auditoria & Métricas
- [x] Métricas unificadas /api/admin/metrics
- [x] AuditLog básico listado
- [ ] Rota dedicada /api/audit/logs com paginação
- [ ] Filtros de auditoria (action, user, intervalo)

## Qualidade & Testes
- [ ] Ampliar cobertura testes de autenticação
- [ ] Testar fluxo de registro + auto login
- [ ] Testar troca de nome (/api/me PATCH)
- [ ] Testar erro de permissão usuário não autenticado

