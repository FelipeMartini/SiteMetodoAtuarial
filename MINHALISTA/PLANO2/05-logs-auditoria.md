# 05 - Logs de Auditoria

## Objetivo
Rastrear ações administrativas e de usuários para segurança, compliance e troubleshooting.

## Checklist
- [ ] Adicionar tabela/logs no banco (Prisma)
- [ ] Criar endpoints `/api/logs` para consulta e registro
- [ ] Integrar logger universal (`/utils/logger.ts`)
- [ ] Exibir logs no painel admin
- [ ] Documentar exemplos de uso e contribuição

## Instruções Detalhadas
1. **Banco de Dados:**
   - Adicione tabela de logs via migration Prisma.
2. **API:**
   - Crie endpoints REST para registrar e consultar logs.
3. **Logger:**
   - Implemente logger universal para registrar ações críticas.
4. **UI:**
   - Exiba logs em tabela com filtros e busca no admin.
5. **Documentação:**
   - Explique como contribuir e boas práticas de logging.

## Referências
- [Audit Logging Patterns](https://martinfowler.com/articles/audit-logging.html)
- [Prisma Logging](https://www.prisma.io/docs/concepts/components/prisma-logging)
