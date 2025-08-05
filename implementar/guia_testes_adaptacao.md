# Guia de Testes para Adaptação

Este guia orienta como garantir a qualidade e cobertura dos testes durante a adaptação das funcionalidades do fuse-react para o stack moderno.

## Estratégia de Testes
- **Testes unitários**: Implemente testes para cada função, componente e hook adaptado.
- **Testes de integração**: Garanta que os fluxos principais (login, navegação, CRUD) estejam cobertos.
- **Cobertura**: Utilize `npx jest --coverage` para monitorar a cobertura dos testes.
- **Automação**: Sempre rode os testes após cada adaptação e corrija inconsistências imediatamente.

## Ferramentas
- **Jest**: Para testes unitários e integração.
- **React Testing Library**: Para testes de componentes React.

## Boas práticas
- Nomeie os arquivos de teste de acordo com o componente/função testada.
- Utilize mocks para dependências externas.
- Documente cenários de teste relevantes.

Consulte o checklist para garantir que todos os itens estejam cobertos por testes.
