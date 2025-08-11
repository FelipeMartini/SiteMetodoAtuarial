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

## Principais Tecnologias Utilizadas

- **Next.js 15**: Framework React para SSR, SSG e rotas modernas.
- **React 19**: Biblioteca para construção de interfaces reativas e componentes reutilizáveis.
- **TypeScript**: Tipagem estática para maior segurança e produtividade.
  **Tailwind CSS**: Estilização moderna, flexível e com suporte a temas.
- **shadcn/ui**: Componentes de UI acessíveis, modernos e customizáveis.
- **Prisma ORM**: Mapeamento objeto-relacional para bancos SQL.
- **Jest + Testing Library**: Testes unitários, integração e snapshots.
- **ESLint, Prettier, CSpell**: Padronização, formatação e revisão ortográfica.

## Convenções, Boas Práticas e Onboarding

- Sempre utilize nomes de arquivos, pastas e variáveis claros e em português, exceto quando usar bibliotecas de terceiros.
- Mantenha o `use cliente` na primeira linha dos arquivos que o exigirem.
- Prefira componentes desacoplados, reutilizáveis e documentados com comentários explicativos.
- Utilize contextos e hooks para lógica compartilhada.
- Separe features em módulos (`src/features`) e mantenha a API organizada em `src/api`.
- Documente todas as novas funcionalidades e mantenha o CHANGELOG.md atualizado.
- Implemente testes para toda nova feature e garanta cobertura mínima de 80%.
- Antes de rodar o projeto, finalize instâncias antigas e garanta que a porta 3000 está livre.
- Sempre revise dependências antes de instalar, atualizar ou remover.

### Exemplo de Estrutura de Componente

```tsx
// use cliente
import React from 'react'
/**
 * Componente de exemplo para login social.
 * Props: provider (string)
 */
export function BotaoSocial({ provider }: { provider: string }) {
  // ...implementação
}
```

### Fluxo de Onboarding para Novos Devs

1. Leia este README e o CHANGELOG.md.
2. Instale as dependências e rode os testes.
3. Explore a estrutura de pastas e exemplos de componentes.
4. Siga as convenções e utilize comentários explicativos.
5. Consulte sempre as recomendações de evolução e mantenha a documentação atualizada.

---

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

## Diretrizes para Evolução do Projeto e Recomendações Futuras

Esta seção traz recomendações e diretrizes para a evolução do projeto, visando um sistema completo de previdência, com dashboard administrativo, controle de níveis de usuários, relatórios atuariais, gráficos avançados e arquitetura moderna.

### 1. Dashboard Administrativo e Visualização de Dados

- **Luzmo**: Plataforma moderna para dashboards analíticos, integração fácil com React/Next.js, suporte a autenticação e personalização visual. Ideal para dashboards de clientes e administração ([luzmo.com](https://www.luzmo.com/)).
- **Recharts, Victory, Nivo**: Bibliotecas open source para gráficos interativos e responsivos. Permitem visualização de dados atuariais, financeiros e relatórios customizados.
- **Tremor**: Biblioteca de UI para dashboards modernos, com componentes prontos para KPIs, gráficos e tabelas.

### 2. Geração e Download de Relatórios

- **ActiveReportsJS**: Ferramenta para geração de relatórios customizados em PDF, Excel e outros formatos, com integração React.
- **react-pdf**: Para geração de PDFs customizados diretamente no frontend.
- **jsPDF**: Alternativa para exportação de relatórios e gráficos em PDF.

### 3. Controle de Usuários, Níveis de Acesso e Autenticação

- **Auth.js (NextAuth)**: Já integrado, continue utilizando para autenticação social e customizada.
- **Casbin**: Biblioteca para controle de permissões e RBAC (Role-Based Access Control), ideal para sistemas com múltiplos níveis de acesso (admin, gestor, cliente, etc).
- **Zod**: Para validação de dados e regras de acesso no frontend e backend.

### 4. Cálculos Atuariais e Financeiros

- **math.js**: Biblioteca robusta para cálculos matemáticos, financeiros e atuariais.
- **NumJS**: Alternativa para manipulação de arrays e cálculos numéricos.
- **Planilha Google API**: Para integração e automação de cálculos complexos e relatórios dinâmicos.

### 5. Outras Dependências e Boas Práticas

- **TanStack Query (React Query)**: Para gerenciamento de dados assíncronos, cache e sincronização com APIs.
- **Formik ou React Hook Form**: Para formulários complexos e validação robusta.
- **Jest + Testing Library**: Para testes unitários, integração e snapshots.
- **ESLint, Prettier, CSpell**: Já integrados para padronização, qualidade e revisão ortográfica.
- **Storybook**: Para documentação visual e testes de componentes UI.

### 6. Diretrizes de Arquitetura e Manutenção

- Mantenha a estrutura modular e separação de features (src/features, src/api, src/components, etc).
- Utilize contextos e hooks para lógica compartilhada.
- Prefira componentes desacoplados e reutilizáveis.
- Documente todas as novas features e mantenha o CHANGELOG.md atualizado.
- Implemente testes para toda nova funcionalidade.

### 7. Sugestão de Evolução: Sistema Completo de Previdência

- **Dashboard do Administrador**: Visualização de KPIs, relatórios globais, gestão de usuários e permissões.
- **Área do Cliente**: Cada cliente acessa seus próprios relatórios, cálculos e histórico, podendo baixar documentos e gráficos.
- **Relatórios Atuariais**: Geração automática de relatórios PDF customizados, com gráficos e tabelas dinâmicas.
- **Controle de Acesso**: Diferentes níveis (admin, gestor, cliente), com permissões configuráveis via Casbin.
- **Cálculos Atuariais**: Implementação de fórmulas e simulações usando math.js ou integração com APIs especializadas.

#### Tecnologias recomendadas para evolução:

- **Backend**: Node.js, Prisma, PostgreSQL, integração com APIs externas.
- **Frontend**: Next.js, React 19, shadcn/ui, Tailwind CSS, Recharts/Nivo/Victory, Luzmo.
- **DevOps**: Docker, CI/CD (GitHub Actions), monitoramento (Sentry, LogRocket).

---

_Mantenha este README sempre atualizado com novas recomendações, decisões arquiteturais e boas práticas adotadas pela equipe._
