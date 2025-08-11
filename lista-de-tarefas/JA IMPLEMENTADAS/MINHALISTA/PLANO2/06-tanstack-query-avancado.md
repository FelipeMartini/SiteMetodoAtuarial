# 06 - TanStack Query Avançado

## Objetivo
Aprimorar a experiência de dados com cache persistente, prefetch, optimistic updates e integração total com Zod.

## Checklist
- [ ] Garantir uso de QueryClientProvider e Devtools
- [ ] Implementar persistência de cache (IndexedDB/localStorage)
- [ ] Adicionar prefetch e optimistic updates em mutations críticas
- [ ] Usar schemas Zod para validação de dados em queries/mutations
- [ ] Documentar hooks customizados e exemplos de uso
- [ ] Automatizar testes de integração com mocks

## Instruções Detalhadas
1. **Configuração Global:**
   - Envolva o app com QueryClientProvider no layout root.
   - Ative Devtools apenas em desenvolvimento.
2. **Persistência de Cache:**
   - Use [@tanstack/query-persist-client](https://tanstack.com/query/v5/docs/react/plugins/persist-client) para IndexedDB/localStorage.
3. **Prefetch/Optimistic Updates:**
   - Implemente prefetch em navegação e optimistic updates em mutations.
4. **Validação com Zod:**
   - Valide dados recebidos/enviados usando schemas Zod.
5. **Documentação:**
   - Explique padrões de uso, exemplos e troubleshooting.

## Referências
- [TanStack Query Docs](https://tanstack.com/query/v5/docs/react/overview)
- [Effective Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
- [Query Persist Client](https://tanstack.com/query/v5/docs/react/plugins/persist-client)
