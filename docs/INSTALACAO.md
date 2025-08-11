# Guia de Instalação - Site Método Atuarial

Este guia fornece instruções detalhadas para configurar o ambiente de desenvolvimento e produção da plataforma.

## 📋 Pré-requisitos

### Software Necessário
- **Node.js** 18.0+ ([Download](https://nodejs.org/))
- **npm** 9.0+ (incluído com Node.js)
- **Git** 2.34+ ([Download](https://git-scm.com/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))

### Contas de Serviços (Opcionais)
Para funcionalidades completas, configure:
- **Google OAuth** - [Google Cloud Console](https://console.cloud.google.com/)
- **GitHub OAuth** - [GitHub Developer Settings](https://github.com/settings/developers)
- **Servidor SMTP** - Para magic links (Gmail, SendGrid, etc.)

---

## 🚀 Instalação Passo-a-Passo

### 1. Clonar o Repositório
```bash
# Clone via HTTPS
git clone https://github.com/FelipeMartini/SiteMetodoAtuarial.git

# Ou via SSH (recomendado para contribuidores)
git clone git@github.com:FelipeMartini/SiteMetodoAtuarial.git

# Navegar para o diretório
cd SiteMetodoAtuarial/site-metodo
```

### 2. Verificar Versões
```bash
# Verificar Node.js
node --version  # deve ser 18.0+

# Verificar npm
npm --version   # deve ser 9.0+

# Verificar PostgreSQL
psql --version  # deve ser 14.0+
```

### 3. Instalação de Dependências
```bash
# Instalar todas as dependências
npm install

# Verificar se não há vulnerabilidades
npm audit

# Corrigir vulnerabilidades automáticas (se houver)
npm audit fix
```

### 4. Configuração do Banco de Dados

#### PostgreSQL (Produção)
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE metodoatuarial;

# Criar usuário (opcional)
CREATE USER ma_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE metodoatuarial TO ma_user;

# Sair do psql
\q
```

#### SQLite (Desenvolvimento - Opcional)
Para desenvolvimento rápido, pode usar SQLite:
```bash
# Arquivo será criado automaticamente
# Configurar no .env.local: DATABASE_URL="file:./dev.db"
```

### 5. Configuração de Variáveis de Ambiente

#### Criar arquivo de ambiente
```bash
# Copiar template
cp .env.example .env.local

# Editar configurações
nano .env.local  # ou seu editor preferido
```

#### Variáveis obrigatórias
```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/metodoatuarial"

# Autenticação
AUTH_SECRET="gere_uma_chave_secreta_aqui"
NEXTAUTH_URL="http://localhost:3000"

# Email (para magic links)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-app"
EMAIL_FROM="noreply@metodoatuarial.com.br"
```

#### Variáveis opcionais (OAuth)
```env
# Google OAuth
AUTH_GOOGLE_ID="seu-google-client-id"
AUTH_GOOGLE_SECRET="seu-google-client-secret"

# GitHub OAuth
AUTH_GITHUB_ID="seu-github-client-id"
AUTH_GITHUB_SECRET="seu-github-client-secret"

# Apple OAuth (mais complexo)
AUTH_APPLE_ID="seu-apple-service-id"
AUTH_APPLE_TEAM_ID="seu-apple-team-id"
AUTH_APPLE_KEY_ID="seu-apple-key-id"
AUTH_APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua-chave-privada\n-----END PRIVATE KEY-----"
```

### 6. Setup do Banco de Dados
```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations (criar tabelas)
npm run prisma:migrate

# Popular com dados exemplo
npm run prisma:seed

# Verificar estrutura (opcional)
npm run prisma:studio
```

### 7. Primeiro Teste
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Aplicação estará em http://localhost:3000
```

---

## ⚙️ Configurações Avançadas

### OAuth Providers Setup

#### Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie/selecione um projeto
3. Ative a "Google+ API"
4. Vá em "Credenciais" > "Criar credenciais" > "ID do cliente OAuth 2.0"
5. Configure URLs autorizadas:
   - **Desenvolvimento**: `http://localhost:3000/api/auth/callback/google`
   - **Produção**: `https://seudominio.com/api/auth/callback/google`

#### GitHub OAuth
1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. "New OAuth App"
3. Configure:
   - **Application name**: "Método Atuarial"
   - **Homepage URL**: `http://localhost:3000` (dev) ou sua URL
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

### SMTP Configuration

#### Gmail
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"  # Não a senha normal!
```

Para senha de app:
1. Ativar 2FA na conta Google
2. Ir em "Senhas de app"
3. Gerar nova senha específica

#### SendGrid
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="sua-api-key-sendgrid"
```

---

## 🧪 Testes e Verificação

### Executar Testes
```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

### Verificações de Qualidade
```bash
# Lint (verificar código)
npm run lint

# Type checking
npm run type-check

# Build de produção (teste)
npm run build
```

### Testes Manuais
1. **Autenticação**:
   - ✅ Registro com email
   - ✅ Login com credenciais
   - ✅ Login social (se configurado)
   - ✅ Magic link (se SMTP configurado)

2. **Navegação**:
   - ✅ Página inicial carrega
   - ✅ Dark/light mode funciona
   - ✅ Menu mobile responsivo
   - ✅ Dashboard cliente acessível

3. **Admin** (após login):
   - ✅ Dashboard admin (se role adequado)
   - ✅ Gestão de usuários
   - ✅ Sistema ABAC funcionando

---

## 🔧 Troubleshooting

### Problemas Comuns

#### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
sudo service postgresql status

# Iniciar PostgreSQL
sudo service postgresql start

# Verificar conexão
psql -U postgres -d metodoatuarial -c "SELECT 1;"
```

#### Erro: "Auth.js configuration error"
```bash
# Verificar se AUTH_SECRET está definido
echo $AUTH_SECRET

# Gerar nova chave se necessário
openssl rand -base64 32
```

#### Erro: "Cannot resolve module"
```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

#### Erro: "Prisma client not generated"
```bash
# Regenerar cliente Prisma
npm run prisma:generate

# Verificar se schema está correto
npm run prisma:validate
```

### Performance Issues

#### Build lento
```bash
# Verificar tamanho do bundle
npm run build
npm run analyze

# Limpar .next cache
rm -rf .next
npm run build
```

#### Runtime lento
- Verificar queries N+1 no Prisma
- Analisar Network tab no browser
- Usar `npm run build` ao invés de `npm run dev` para testes

---

## 📦 Scripts Úteis

### Desenvolvimento
```bash
npm run dev          # Servidor desenvolvimento
npm run dev:turbo    # Com Turbopack (experimental)
npm run dev:debug    # Com debug habilitado
```

### Database
```bash
npm run db:reset     # Reset completo do banco
npm run db:migrate   # Apenas migrations
npm run db:seed      # Apenas seed
npm run db:studio    # Interface visual
```

### Deploy
```bash
npm run build        # Build produção
npm run start        # Servidor produção
npm run preview      # Preview local do build
```

---

## 🚀 Próximos Passos

Após instalação bem-sucedida:

1. **[Guia de Desenvolvimento](DESENVOLVIMENTO.md)** - Workflow e padrões
2. **[Documentação de APIs](API.md)** - Endpoints disponíveis
3. **[Sistema ABAC](ABAC.md)** - Controle de acesso
4. **[Deploy em Produção](DEPLOY.md)** - Publicação

---

## 💬 Suporte

Problemas na instalação?

- 📋 **Issues**: [GitHub Issues](https://github.com/FelipeMartini/SiteMetodoAtuarial/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/FelipeMartini/SiteMetodoAtuarial/discussions)
- 📧 **Email**: dev@metodoatuarial.com.br

---

*Última atualização: Janeiro 2025*
