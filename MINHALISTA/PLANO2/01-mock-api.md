# 01 - Mock API e Fixtures

## Objetivo
Permitir desenvolvimento offline, testes rápidos e integração contínua com dados simulados.

## Checklist
- [ ] Adicionar pasta `/src/mocks` e `/src/fixtures`
- [ ] Instalar e configurar [MSW (Mock Service Worker)](https://mswjs.io/)
- [ ] Criar handlers para endpoints REST/GraphQL usados no projeto
- [ ] Criar fixtures para usuários, permissões, dashboards, etc
- [ ] Adicionar toggle/env para ativar/desativar mocks
- [ ] Documentar exemplos de uso e como contribuir
- [ ] Garantir integração com TanStack Query e testes automatizados

## Instruções Detalhadas
1. **Instalação:**
   ```bash
   npm install msw --save-dev
   ```
2. **Estrutura recomendada:**
   ```
   /src/mocks
     browser.ts
     server.ts
     handlers/
   /src/fixtures
     users.json
     permissoes.json
     ...
   ```
3. **Configuração:**
   - Importe e inicialize o MSW no entrypoint do app (ex: `src/app/layout.tsx` ou `src/main.tsx`).
   - Use handlers para simular respostas dos endpoints reais.
4. **Toggle:**
   - Use variável de ambiente (`NEXT_PUBLIC_USE_MOCKS=true`) para ativar/desativar mocks.
5. **Contribuição:**
   - Documente como criar novos handlers e fixtures.
   - Adote padrão de PR para novos mocks.

## Referências
- [MSW Docs](https://mswjs.io/docs/)
- [Mocking APIs in Next.js](https://dev.to/karanpratapsingh/how-to-mock-apis-in-nextjs-4b1g)
