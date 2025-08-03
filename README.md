# Site Método Atuarial

Este projeto é um site institucional moderno desenvolvido com Next.js 15, React 19 e TypeScript, seguindo as melhores práticas de arquitetura, performance e qualidade.

## Estrutura de Pastas

```
nextjs-app/
  app/
    components/         # Componentes globais reutilizáveis (ErrorBoundary, SocialLoginBox)
    design-system/      # Componentes do design system (Botao, CardInfo, InputTexto)
    area-cliente/       # Páginas e componentes da área do cliente
    clientes/           # Página de clientes
    contato/            # Página de contato
    orcamento/          # Página de orçamento
    servicos/           # Página de serviços
    sobre/              # Página institucional "Sobre"
    login/              # Página de login
    contextoTema.tsx    # Contexto de tema global
    temas.ts            # Definições de temas e cores customizadas
    mui-theme.tsx       # Configuração do tema MUI
    emotion-cache.ts    # Cache do Emotion para SSR
    ProvedorSessao.tsx  # Provedor de sessão para autenticação
    Rodape.tsx          # Componente de rodapé
    layout.tsx          # Layout principal do app
    globals.css         # CSS global
    api/                # Rotas de API (autenticação NextAuth)
  __tests__/            # Testes automatizados (Jest)
  public/               # Imagens e assets públicos
  styles/               # CSS modular
  package.json          # Dependências e scripts
  tsconfig.json         # Configuração TypeScript
  jest.config.js        # Configuração Jest
  babel-jest.config.js  # Configuração Babel para Jest
  cspell.json           # Configuração de verificação ortográfica
```

## Principais Tecnologias
- Next.js 15
- React 19
- TypeScript (strict mode)
- Material-UI
- Emotion
- Jest (testes automatizados)
- NextAuth (autenticação)

## Convenções e Diretrizes
- Imports otimizados para tree-shaking e performance
- Design system centralizado e documentado
- Contexto de tema global e alternância de tema
- Lazy loading de componentes e imagens
- ErrorBoundary em todas as páginas principais
- Testes unitários para todos os componentes do design system
- Comentários explicativos em todas as funções e componentes
- Responsividade e acessibilidade garantidas
- Estrutura modular e padronizada

## Como rodar o projeto
1. Instale as dependências:
   ```powershell
   cd nextjs-app
   npm install
   ```
2. Rode o ambiente de desenvolvimento:
   ```powershell
   npm run dev
   ```
3. Execute os testes automatizados:
   ```powershell
   npm run test
   ```
4. Gere o relatório de cobertura de testes:
   ```powershell
   npx jest --coverage
   ```

## Documentação dos Componentes
Consulte os comentários JSDoc nos arquivos do design system para exemplos de uso e props.

## Autenticação
A autenticação é feita via NextAuth, com rotas protegidas e integração com provedores sociais.

## Observações
- Todas as etapas do plano de otimização e arquitetura estão documentadas no arquivo `implementar 2.txt`.
- Para dúvidas, consulte os comentários explicativos no código ou abra uma issue.

---

*Este README segue o padrão de documentação institucional e técnica para facilitar onboarding, manutenção e evolução do projeto.*
