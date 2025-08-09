# 02 - Feature Flags

## Objetivo
Ativar/desativar funcionalidades sem necessidade de novo deploy, facilitando experimentação e rollout controlado.

## Checklist
- [ ] Adicionar `/src/lib/featureFlags.ts` para controle local
- [ ] Integrar [Unleash](https://www.getunleash.io/) ou [Flagsmith](https://flagsmith.com/) para controle remoto
- [ ] Criar hook `useFeatureFlag` para consumo nos componentes
- [ ] Adicionar exemplos de uso em rotas e componentes
- [ ] Documentar como criar, ativar e monitorar flags
- [ ] Garantir fallback seguro para flags críticas

## Instruções Detalhadas
1. **Implementação Local:**
   - Crie um objeto/JSON com as flags e um hook para leitura.
2. **Integração com serviço externo:**
   - Siga a doc do Unleash/Flagsmith para setup e autenticação.
3. **Exemplo de uso:**
   ```tsx
   const isNewDashboardEnabled = useFeatureFlag('newDashboard');
   if (isNewDashboardEnabled) { /* ... */ }
   ```
4. **Documentação:**
   - Explique como propor novas flags e boas práticas de versionamento.

## Referências
- [Feature Toggles - Martin Fowler](https://martinfowler.com/articles/feature-toggles.html)
- [Unleash Docs](https://docs.getunleash.io/)
- [Flagsmith Docs](https://docs.flagsmith.com/)
