# Checklist de Refatoração para ABAC

## Arquivos/Funções Impactados
- `site-metodo/middleware.ts`: substituir lógica de roles/accessLevel por checagem ABAC.
- `src/lib/auth/apiAuth.ts`: adaptar função `checkApiAuthorization` para usar ABAC.
- `src/lib/auth/permissions.ts`: migrar lógica de roles para uso de atributos ABAC.
- Endpoints API protegidos: substituir checagem de roles por `checkPermission`.
- Hooks e componentes que usam roles: migrar para uso de atributos e ABAC.
- Testes automatizados: atualizar para cobrir cenários de atributos e políticas ABAC.

## Passos de Refatoração
- [ ] Remover dependências e funções legadas de RBAC/roles.
- [ ] Integrar utilitário ABAC (`checkPermission`) nos pontos de autorização.
- [ ] Garantir que atributos necessários (usuário, recurso) estejam disponíveis.
- [ ] Adaptar modelos/políticas conforme regras do domínio.
- [ ] Atualizar documentação e exemplos de uso.
- [ ] Validar com testes automatizados e cenários reais.

## Observações
- Refatore de forma incremental, testando cada etapa.
- Use logs para auditar decisões de autorização.
- Documente políticas e exemplos para onboarding da equipe.
