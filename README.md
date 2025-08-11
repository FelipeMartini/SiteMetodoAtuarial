# Site Método Atuarial

<p align="center">
	<img src="site-metodo/public/loginboxclara.png" alt="Logo" width="180" />
</p>

<p align="center">
  <strong>Plataforma completa para consultoria atuarial com gestão de clientes, área restrita e APIs robustas</strong>
</p>

<p align="center">
  <a href="#-instalação-rápida">Instalação</a> •
  <a href="#-documentação">Documentação</a> •
  <a href="#-apis">APIs</a> •
  <a href="#-stack-tecnológica">Stack</a> •
  <a href="#-contribuir">Contribuir</a>
</p>

---

## 🚀 Visão Geral

O Site Método Atuarial é uma plataforma moderna e completa para consultoria atuarial, incluindo:

- **🔐 Sistema de autenticação multi-provider** (Google, GitHub, Apple, Microsoft, Email)
- **👥 Gestão completa de usuários** com ABAC (Attribute-Based Access Control)
- **📊 Dashboard administrativo** com estatísticas em tempo real
- **🧮 Ferramentas de cálculos atuariais** integradas
- **📄 Portal de documentação** técnica e APIs
- **🌙 Dark/Light mode** com persistência
- **📱 Design responsivo** mobile-first
- **🔒 Conformidade LGPD** com políticas completas

### Estrutura do Monorepo

```
SiteMetodoAtuarial/
├─ site-metodo/         # 🏠 Aplicação principal Next.js
├─ fuse-react/          # 🎨 Design system e componentes
├─ docs/                # 📚 Documentação técnica
├─ scripts/             # ⚙️ Scripts de automação
└─ lista-de-tarefas/    # 📋 Gestão de projeto
```

---

## 📦 Stack Tecnológica

### Frontend
- **Next.js 15.4+** - Framework React com SSR/SSG
- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS 3.4+** - Estilização utilitária
- **shadcn/ui** - Componentes acessíveis
- **Framer Motion** - Animações fluidas

### Backend & Database
- **Next.js API Routes** - Backend integrado
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Banco de dados principal
- **Auth.js v5** - Autenticação e autorização

### Ferramentas & Qualidade
- **ESLint + Prettier** - Linting e formatação
- **Jest + Testing Library** - Testes unitários
- **Husky + Commitlint** - Git hooks e conventional commits
- **Zod** - Validação de schemas
- **Standard Version** - Versionamento automático

---

## ⚡ Instalação Rápida

### Pré-requisitos
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL (ou SQLite para desenvolvimento)

### 1. Clone e navegue
```bash
git clone https://github.com/FelipeMartini/SiteMetodoAtuarial.git
cd SiteMetodoAtuarial/site-metodo
```

### 2. Configuração de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Configure as variáveis necessárias
nano .env.local
```

### 3. Instalação e setup
```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular banco com dados exemplo (opcional)
npm run prisma:seed
```

### 4. Executar
```bash
# Modo desenvolvimento
npm run dev

# Aplicação estará disponível em http://localhost:3000
```

### Primeiros passos
1. Acesse `http://localhost:3000`
2. Crie uma conta ou faça login
3. Explore o dashboard em `/area-cliente`
4. Para acesso admin, consulte [Configuração ABAC](docs/ABAC.md)

---

## 📋 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Iniciar servidor de desenvolvimento
npm run build           # Build de produção
npm run start           # Iniciar servidor de produção
npm run lint            # Verificar código (ESLint)
npm run type-check      # Verificar tipos TypeScript
```

### Database
```bash
npm run prisma:generate # Gerar cliente Prisma
npm run prisma:migrate  # Executar migrations
npm run prisma:seed     # Popular banco com dados
npm run prisma:studio   # Interface visual do banco
```

### Testes & Qualidade
```bash
npm run test            # Executar testes
npm run test:coverage   # Testes com cobertura
npm run test:watch      # Testes em modo watch
```

### Automação
```bash
npm run commit          # Commit convencional (Commitizen)
npm run release         # Gerar changelog e versão
./scripts/git-auto.sh   # Automação completa git
```

---

## 🏗️ Arquitetura do Projeto

### `/site-metodo` - Aplicação Principal
```
src/
├─ app/                     # 🛣️ App Router (Next.js 13+)
│  ├─ (auth)/              # Grupo de rotas de autenticação
│  ├─ admin/               # Dashboard administrativo
│  ├─ area-cliente/        # Dashboard do cliente
│  ├─ api/                 # API Routes
│  │  ├─ auth/             # Endpoints de autenticação
│  │  ├─ users/            # Gestão de usuários
│  │  ├─ abac/             # Sistema ABAC
│  │  └─ admin/            # APIs administrativas
│  ├─ globals.css          # Estilos globais
│  └─ layout.tsx           # Layout raiz
├─ components/             # 🧩 Componentes reutilizáveis
│  ├─ ui/                  # Componentes base (shadcn/ui)
│  ├─ forms/               # Formulários específicos
│  └─ layouts/             # Layouts de página
├─ lib/                    # 🔧 Utilitários e configurações
│  ├─ auth.ts              # Configuração Auth.js
│  ├─ prisma.ts            # Cliente Prisma
│  ├─ abac/                # Sistema ABAC completo
│  └─ utils.ts             # Funções utilitárias
└─ types/                  # 📝 Definições TypeScript
```

### Principais Funcionalidades

#### 🔐 Sistema de Autenticação
- **Multi-provider OAuth**: Google, GitHub, Apple, Microsoft
- **Magic Links** via email (SMTP configurável)
- **Credentials** login tradicional
- **2FA/TOTP** autenticação de dois fatores
- **Session management** com Auth.js v5

#### 👥 Gestão de Usuários (ABAC)
- **Attribute-Based Access Control** moderno
- **Roles dinâmicos**: GUEST, USER, MODERATOR, ADMIN
- **Políticas granulares** de acesso
- **Interface administrativa** para gestão

#### 📊 Dashboards
- **Dashboard Cliente**: Área personalizada por usuário
- **Dashboard Admin**: Estatísticas, gestão e monitoramento
- **Widgets configuráveis** e responsivos

---

## � APIs Principais

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `GET /api/auth/session` - Sessão atual
- `POST /api/auth/forgot-password` - Reset de senha
- `POST /api/auth/totp-setup` - Configurar 2FA

### Usuários
- `GET /api/users` - Listar usuários (admin)
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/[id]` - Atualizar usuário
- `DELETE /api/users/[id]` - Remover usuário

### ABAC (Controle de Acesso)
- `GET /api/abac/policies` - Listar políticas
- `POST /api/abac/check` - Verificar permissão
- `GET /api/abac/roles` - Listar roles disponíveis

### Admin
- `GET /api/admin/dashboard/stats` - Estatísticas do sistema
- `GET /api/admin/users` - Gestão de usuários
- `PUT /api/admin/dashboard/config` - Configurações

> 📖 **Documentação completa**: [docs/API.md](docs/API.md)

---

## 🌟 Funcionalidades Principais

### ✨ Para Usuários
- 🔐 **Login social** (Google, GitHub, Apple, Microsoft)
- 📧 **Magic links** via email
- 🔒 **2FA/TOTP** para segurança extra
- 🌙 **Dark/Light mode** com persistência
- 📱 **Mobile-first** design responsivo
- ♿ **Acessibilidade** (WCAG 2.1)

### 🛠️ Para Desenvolvedores
- 🏗️ **TypeScript strict** mode
- 🧪 **Testes automatizados** (Jest + Testing Library)
- 📏 **ESLint + Prettier** configurados
- 🔄 **Hot reload** desenvolvimento rápido
- 📦 **Bundle optimization** automática
- 🔍 **API documentation** com exemplos

### 🔧 Para Admins
- 📊 **Dashboard** com métricas em tempo real
- 👥 **Gestão de usuários** avançada
- 🛡️ **Sistema ABAC** para controle granular
- 📈 **Analytics** e monitoramento
- ⚙️ **Configurações** dinâmicas

---

## 📚 Documentação

- **[Guia de Instalação](docs/INSTALACAO.md)** - Setup detalhado
- **[Documentação de APIs](docs/API.md)** - Endpoints e exemplos
- **[Sistema ABAC](docs/ABAC.md)** - Controle de acesso
- **[Guia de Desenvolvimento](docs/DESENVOLVIMENTO.md)** - Workflow
- **[Deploy e Produção](docs/DEPLOY.md)** - Publicação
- **[Exemplos Práticos](docs/EXEMPLOS.md)** - Casos de uso

---

## 💡 Diferenciais & Boas Práticas

- ✅ **Automação completa** - Git, changelog, versionamento
- ✅ **Conventional Commits** - Padronização de commits
- ✅ **Acessibilidade garantida** - WCAG 2.1 compliance
- ✅ **Segurança robusta** - OAuth, JWT, ABAC, auditoria
- ✅ **Performance otimizada** - Bundle splitting, lazy loading
- ✅ **SEO preparado** - Meta tags, sitemap, structured data
- ✅ **LGPD compliance** - Políticas e termos atualizados
- ✅ **CI/CD ready** - Deploy automático Vercel/Netlify

---

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Para contribuir:

### 1. Setup do ambiente
```bash
# Fork o projeto
git clone https://github.com/SEU_USUARIO/SiteMetodoAtuarial.git
cd SiteMetodoAtuarial/site-metodo

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.local
```

### 2. Desenvolvimento
```bash
# Criar branch para feature
git checkout -b feature/minha-feature

# Fazer alterações...

# Commit convencional
npm run commit
# ou
npx git-cz
```

### 3. Pull Request
```bash
# Push da branch
git push origin feature/minha-feature

# Abrir PR no GitHub
```

### Diretrizes
- ✅ Use **Conventional Commits** para mensagens
- ✅ Mantenha **cobertura de testes** > 80%
- ✅ Siga o **ESLint + Prettier** configurado
- ✅ Documente **novas APIs** adequadamente
- ✅ Teste em **mobile** e diferentes navegadores

---

## 🔒 Segurança

### Reportar Vulnerabilidades
Encontrou uma vulnerabilidade? 

- 📧 **Email**: seguranca@metodoatuarial.com.br
- 🔐 **GitHub Security**: Use o tab "Security" para reportar privately
- ⚠️ **Não**: Abra issues públicas para vulnerabilidades

### Boas Práticas Implementadas
- 🔐 **Autenticação robusta** com Auth.js v5
- 🛡️ **CSRF protection** habilitado
- 🔒 **Rate limiting** em APIs sensíveis
- 📊 **Audit logs** para ações administrativas
- 🌐 **HTTPS only** em produção
- 🔑 **Environment variables** para secrets

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**. Consulte o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2024 Método Atuarial

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

---

## � Suporte & Contato

### Comunidade
- 🐛 **Issues**: [GitHub Issues](https://github.com/FelipeMartini/SiteMetodoAtuarial/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/FelipeMartini/SiteMetodoAtuarial/discussions)
- 📖 **Wiki**: [GitHub Wiki](https://github.com/FelipeMartini/SiteMetodoAtuarial/wiki)

### Comercial
- 🌐 **Site**: [metodoatuarial.com.br](https://metodoatuarial.com.br)
- 📧 **Email**: contato@metodoatuarial.com.br
- 📱 **WhatsApp**: [Clique aqui](https://wa.me/5511999999999)

---

## 📚 Links Úteis

### Tecnologias
- [Next.js Documentation](https://nextjs.org/docs) - Framework React
- [Auth.js Documentation](https://authjs.dev/) - Autenticação
- [Prisma Documentation](https://www.prisma.io/docs/) - ORM
- [shadcn/ui Documentation](https://ui.shadcn.com/) - Componentes
- [Tailwind CSS](https://tailwindcss.com/docs) - Estilos

### Padrões & Qualidade
- [Conventional Commits](https://www.conventionalcommits.org/pt-br/) - Padronização
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Tipagem
- [Jest Documentation](https://jestjs.io/docs/getting-started) - Testes
- [ESLint Rules](https://eslint.org/docs/rules/) - Linting

---

## 🏆 Reconhecimentos

Agradecimentos especiais a:

- **[shadcn/ui](https://ui.shadcn.com/)** - Sistema de componentes excepcional
- **[Vercel](https://vercel.com/)** - Plataforma de deploy e hospedagem
- **[Auth.js](https://authjs.dev/)** - Solução de autenticação robusta
- **[Prisma](https://www.prisma.io/)** - ORM moderno e type-safe

---

<div align="center">

**[⬆ Voltar ao topo](#site-método-atuarial)**

Feito com ❤️ pela equipe [Método Atuarial](https://metodoatuarial.com.br)

</div>

---

# ⚠️ AVISO IMPORTANTE SOBRE O CLI DO SHADCN/UI

> **O pacote `shadcn-ui` está DEPRECIADO!**
>
> Sempre utilize o CLI oficial atualizado para instalar ou atualizar componentes shadcn/ui:
>
> ```bash
> npx shadcn@latest add <componente>
> ```
>
> **NUNCA use:**
> `npx shadcn-ui@latest ...` (DEPRECIADO)
>
> Consulte sempre a documentação oficial: https://ui.shadcn.com/docs/cli
>
> Este aviso deve ser revisitado e reforçado em toda documentação e automação do projeto.

---

## 🔄 Automação de Gerenciamento de Dependências

O projeto possui automação completa para instalar, atualizar, remover, auditar e listar dependências via scripts e tasks do VS Code.

Consulte o arquivo [`scripts/README-dependencias.md`](scripts/README-dependencias.md) para detalhes completos, exemplos e instruções.

### Principais tasks VS Code:

| Task/Script | Descrição |
|-------------|-----------|
| **Dependências: Instalar (ci/padrão)** | Instala dependências (modo limpo ou padrão, escolha via prompt) |
| **Dependências: Atualizar (todas)** | Atualiza todas as dependências para a última versão |
| **Dependências: Atualizar (interativo)** | Atualização interativa (escolha quais atualizar) |
| **Dependências: Atualizar (específica)** | Atualiza um pacote específico (prompt) |
| **Dependências: Remover (específica)** | Remove um pacote específico (prompt) |
| **Dependências: Listar desatualizadas** | Lista dependências desatualizadas |
| **Dependências: Auditoria de vulnerabilidades** | Checa vulnerabilidades (npm audit) |
| **Dependências: Corrigir vulnerabilidades** | Corrige vulnerabilidades automaticamente (npm audit fix) |

Todos os fluxos são seguros, modernos e integrados ao VS Code, com prompts e variáveis para facilitar o uso.

---

## 🏁 Tabela Completa de Tasks/Scripts

| Nome/Comando | Tipo | Descrição |
|--------------|------|-----------|
| `npm run dev` | Script npm | Inicia o servidor Next.js em modo desenvolvimento |
| `npm run build` | Script npm | Build de produção Next.js |
| `npm run start` | Script npm | Inicia servidor Next.js em produção |
| `npm run lint` | Script npm | Lint do projeto (ESLint) |
| `npm run type-check` | Script npm | Checagem de tipos TypeScript |
| `npm run prisma:generate` | Script npm | Gera tipos do Prisma |
| `npm run prisma:seed` | Script npm | Executa seeds do banco |
| `npm run analyze` | Script npm | Build com análise de bundle |
| `npm run release` | Script npm | Gera changelog, versiona e commita (Conventional Commits) |
| `npm run postrelease` | Script npm | Push dos commits/tags do release |
| `./git-auto.sh` | Shell | Automação completa de git add/commit/push/changelog |
| **Commit Convencional (Commitizen)** | Task VS Code | Commit interativo padronizado |
| **Changelog/Versionamento/Push Automático** | Task VS Code | Executa todo o fluxo automatizado, incluindo changelog, versionamento e push, com mensagem padrão |
| **Git Auto Commit & Push** | Task VS Code | Commit e push direto com mensagem customizável |
| **Instalar dependências** | Task VS Code | Instala todas as dependências do projeto (npm install) |
| **Atualizar dependências** | Task VS Code | Atualiza todas as dependências do projeto (npm update) |
| **Backup node_modules e lock** | Task VS Code | Cria backup compactado do node_modules e package-lock.json |
| **Limpeza-Geral** | Task VS Code | Remove build, node_modules e cache, reinstala dependências e gera Prisma |
| **Diagnóstico: Checar ambiente Node/Prisma** | Task VS Code | Exibe versões do Node, NPM, Prisma e variáveis do .env |
| **Diagnóstico: Mostrar logs de build** | Task VS Code | Exibe logs de erro de build do projeto |
| **Prisma Generate Absoluto** | Task VS Code | Gera os tipos do Prisma manualmente |
| **Segurança: npm audit fix** | Task VS Code | Executa correção automática de vulnerabilidades npm |
| **Atualizar shadcn/ui** | Task VS Code | Atualiza os componentes shadcn/ui para a última versão |
| **Lint Absoluto** | Task VS Code | Executa o linter do projeto |
| **Type Check Absoluto** | Task VS Code | Executa checagem de tipos TypeScript |
| **Build Next.js Absoluto** | Task VS Code | Executa build de produção do Next.js |
| **Iniciar Next.js / Iniciar Next.js Seguro** | Task VS Code | Inicia o servidor Next.js, matando instâncias antigas |
| **Reiniciar Next.js** | Task VS Code | Reinicia o servidor Next.js |
| **Parar Next.js / Finalizar todas as instâncias Node.js / Finalizar servidores Next.js** | Task VS Code | Encerra servidores Next.js nas portas 3000-3010 |
| **Cobertura de Testes** | Task VS Code | Executa testes com cobertura (Jest) |
| **Smoke Test Next.js** | Task VS Code | Executa smoke test do Next.js |
| **Build Completo Seguro** | Task VS Code | Executa toda a cadeia de build, lint, type-check, testes e segurança |
| **Start Seguro** | Task VS Code | Executa build completo e inicia o servidor Next.js |

---

<p align="center">
	<em>Projeto desenvolvido e mantido por Felipe Martini e colaboradores.</em>
</p>
