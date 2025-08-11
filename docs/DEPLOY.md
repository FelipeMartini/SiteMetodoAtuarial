# Guia de Deploy - Site Método Atuarial

Este guia aborda estratégias e práticas para deploy em produção da plataforma.

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado)

A opção mais simples e otimizada para Next.js:

#### Setup Inicial
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy inicial
vercel --prod
```

#### Configuração no vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["gru1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "AUTH_SECRET": "@auth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "app/api/**": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/healthz",
      "destination": "/api/health"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### Variáveis de Ambiente na Vercel
```bash
# Adicionar via CLI
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production
vercel env add NEXTAUTH_URL production

# Ou via dashboard Vercel
# Ir em Project Settings > Environment Variables
```

### 2. AWS (Escalabilidade)

Para aplicações que precisam de maior controle e escala:

#### ECS com Fargate
```dockerfile
# Dockerfile.production
FROM node:18-alpine AS base

# Dependências
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose para desenvolvimento
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.production
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - AUTH_SECRET=${AUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: metodoatuarial
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 3. Railway (Simplicidade)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login e deploy
railway login
railway link
railway up
```

---

## 🔐 Configuração de Produção

### Variáveis de Ambiente Essenciais

```env
# .env.production
NODE_ENV=production

# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"
POSTGRES_PRISMA_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://user:pass@host:5432/db"

# Auth.js
AUTH_SECRET="chave-secreta-super-forte-64-caracteres"
NEXTAUTH_URL="https://seudominio.com"

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="sua-api-key"
EMAIL_FROM="noreply@seudominio.com"

# OAuth Providers
AUTH_GOOGLE_ID="google-client-id"
AUTH_GOOGLE_SECRET="google-client-secret"
AUTH_GITHUB_ID="github-client-id"
AUTH_GITHUB_SECRET="github-client-secret"

# Monitoring
SENTRY_DSN="https://sentry-dsn"
NEXT_TELEMETRY_DISABLED=1

# Features
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=true
```

### Next.js Production Config

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance
  compress: true,
  poweredByHeader: false,
  
  // Output standalone para Docker
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Images
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google avatars
      'avatars.githubusercontent.com', // GitHub avatars
      'images.unsplash.com', // Stock images
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard/admin',
        permanent: true,
      },
    ]
  },
  
  // Rewrites para API
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/healthcheck',
      },
    ]
  },
}

module.exports = nextConfig
```

---

## 🗄️ Banco de Dados em Produção

### PostgreSQL Managed (Recomendado)

#### Supabase
```bash
# Criar projeto no Supabase
# Obter connection string
# Configurar no .env.production

DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

#### Neon
```bash
# Criar database no Neon
# Branch para staging/production
DATABASE_URL="postgresql://username:password@ep-cool-name.neon.tech/neondb"
```

#### PlanetScale (MySQL)
```bash
# Se preferir MySQL
DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"
```

### Migrations em Produção

```bash
# Script para deploy seguro
#!/bin/bash
set -e

echo "🚀 Iniciando deploy..."

# 1. Backup do banco
echo "📦 Fazendo backup..."
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# 2. Rodar migrations
echo "🔄 Executando migrations..."
npm run prisma:migrate:deploy

# 3. Build da aplicação
echo "🏗️ Building aplicação..."
npm run build

# 4. Deploy
echo "📡 Fazendo deploy..."
vercel --prod

echo "✅ Deploy concluído!"
```

---

## 🔍 Monitoramento e Observabilidade

### 1. Sentry para Error Tracking

```javascript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    debug: false,
    integrations: [
      new Sentry.BrowserTracing({
        tracingOrigins: ['localhost', /^https:\/\/seudominio\.com/],
      }),
    ],
  })
}
```

```javascript
// sentry.server.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
})
```

### 2. Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Verificar banco de dados
    await prisma.$queryRaw`SELECT 1`
    
    // Verificar outros serviços críticos
    const checks = {
      database: 'ok',
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || 'unknown',
      timestamp: new Date().toISOString(),
    }
    
    return NextResponse.json(checks, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { status: 'error', message: 'Service unavailable' },
      { status: 503 }
    )
  }
}
```

### 3. Logging Estruturado

```typescript
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'metodo-atuarial',
    environment: process.env.NODE_ENV,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
})

// Em produção, adicionar transports externos
if (process.env.NODE_ENV === 'production') {
  // Exemplo: DataDog, LogDNA, etc.
  logger.add(new winston.transports.Http({
    host: 'http-intake.logs.datadoghq.com',
    path: `/v1/input/${process.env.DATADOG_API_KEY}`,
  }))
}

export { logger }
```

---

## 🔒 Segurança em Produção

### 1. Certificados SSL

```bash
# Automatic com Vercel/Netlify
# Manual com Let's Encrypt
certbot --nginx -d seudominio.com -d www.seudominio.com
```

### 2. Firewall e Rate Limiting

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
})

export async function middleware(request: NextRequest) {
  // Rate limiting para APIs
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return new NextResponse('Too many requests', { status: 429 })
    }
  }
  
  // Verificar auth para rotas protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Implementar verificação de auth
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
}
```

### 3. Content Security Policy

```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com;
  child-src *.youtube.com *.google.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' fonts.gstatic.com;
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
]
```

---

## 📊 Performance em Produção

### 1. Otimizações do Next.js

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Compressão
  compress: true,
  
  // Otimizações experimentais
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  
  // SWC minification
  swcMinify: true,
  
  // Tree shaking agressivo
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }
    return config
  },
})
```

### 2. CDN e Caching

```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }
  
  static async set(key: string, value: any, ttlSeconds = 3600) {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }
  
  static async invalidate(pattern: string) {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Cache invalidate error:', error)
    }
  }
}
```

### 3. Database Optimization

```typescript
// lib/db-optimized.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Connection pooling
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('🗄️ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

export async function disconnectDB() {
  await prisma.$disconnect()
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test -- --coverage
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - run: npm ci
      
      # Deploy para Vercel
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          
      # Notificar Slack/Discord
      - name: Notify Deploy
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: '🚀 Deploy realizado com sucesso!'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Preview Deployments

```yaml
# .github/workflows/preview.yml
name: Preview Deploy

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - run: npm ci
      - run: npm run build
      
      - uses: amondnet/vercel-action@v25
        id: vercel-deploy
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-comment: true
```

---

## 🔧 Backup e Recuperação

### Backup Automatizado

```bash
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="metodoatuarial"

# Backup do banco
echo "🗄️ Fazendo backup do banco..."
pg_dump $DATABASE_URL > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup de uploads (se houver)
echo "📁 Fazendo backup de arquivos..."
tar -czf "$BACKUP_DIR/files_backup_$DATE.tar.gz" /app/uploads

# Upload para S3 (opcional)
if [ -n "$AWS_S3_BUCKET" ]; then
  echo "☁️ Enviando para S3..."
  aws s3 cp "$BACKUP_DIR/db_backup_$DATE.sql" "s3://$AWS_S3_BUCKET/backups/"
  aws s3 cp "$BACKUP_DIR/files_backup_$DATE.tar.gz" "s3://$AWS_S3_BUCKET/backups/"
fi

# Limpar backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup concluído: $DATE"
```

### Cron Job para Backups

```bash
# Adicionar ao crontab
# crontab -e

# Backup diário às 2h
0 2 * * * /path/to/scripts/backup.sh >> /var/log/backup.log 2>&1

# Backup semanal completo aos domingos às 1h
0 1 * * 0 /path/to/scripts/full-backup.sh >> /var/log/backup.log 2>&1
```

---

## 📈 Scaling e Performance

### Horizontal Scaling

```yaml
# kubernetes/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: metodo-atuarial
spec:
  replicas: 3
  selector:
    matchLabels:
      app: metodo-atuarial
  template:
    metadata:
      labels:
        app: metodo-atuarial
    spec:
      containers:
      - name: app
        image: metodo-atuarial:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Load Balancer

```yaml
# kubernetes/service.yml
apiVersion: v1
kind: Service
metadata:
  name: metodo-atuarial-service
spec:
  selector:
    app: metodo-atuarial
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

---

## 🛡️ Disaster Recovery

### Plano de Recuperação

```markdown
# Disaster Recovery Plan

## RTO (Recovery Time Objective): 4 horas
## RPO (Recovery Point Objective): 1 hora

### Cenários de Falha:

1. **Aplicação Down**
   - Verificar health checks
   - Verificar logs
   - Restart containers
   - Rollback se necessário

2. **Banco de Dados Indisponível**
   - Verificar conexões
   - Restaurar from backup
   - Failover para read-replica

3. **Perda de Dados**
   - Identificar último backup válido
   - Parar aplicação
   - Restaurar banco
   - Verificar integridade
   - Reiniciar aplicação

### Contatos de Emergência:
- Tech Lead: +55 11 99999-9999
- DevOps: +55 11 88888-8888
- Suporte Banco: 0800-xxx-xxxx
```

---

## 📞 Monitoramento e Alertas

### Uptime Monitoring

```typescript
// scripts/monitoring.ts
import fetch from 'node-fetch'

const monitors = [
  { name: 'Website', url: 'https://metodoatuarial.com.br' },
  { name: 'API Health', url: 'https://metodoatuarial.com.br/api/health' },
  { name: 'Dashboard', url: 'https://metodoatuarial.com.br/dashboard' },
]

async function checkServices() {
  for (const monitor of monitors) {
    try {
      const response = await fetch(monitor.url, { timeout: 10000 })
      const status = response.ok ? '✅' : '❌'
      console.log(`${status} ${monitor.name}: ${response.status}`)
      
      if (!response.ok) {
        // Enviar alerta (Slack, email, etc.)
        await sendAlert(`${monitor.name} is down! Status: ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ ${monitor.name}: ERROR`)
      await sendAlert(`${monitor.name} is unreachable! Error: ${error.message}`)
    }
  }
}

async function sendAlert(message: string) {
  // Implementar notificação (Slack, Discord, email, etc.)
  console.log(`🚨 ALERT: ${message}`)
}

// Executar a cada 5 minutos
setInterval(checkServices, 5 * 60 * 1000)
```

---

## 📋 Checklist de Deploy

### Pré-Deploy
- [ ] Todos os testes passando
- [ ] Code review aprovado
- [ ] Backup do banco realizado
- [ ] Variáveis de ambiente configuradas
- [ ] Certificados SSL válidos

### Deploy
- [ ] Build bem-sucedido
- [ ] Migrations executadas
- [ ] Health checks passando
- [ ] Performance acceptable
- [ ] Funcionalidades críticas testadas

### Pós-Deploy
- [ ] Monitoramento ativo
- [ ] Logs sendo coletados
- [ ] Alertas configurados
- [ ] Documentação atualizada
- [ ] Stakeholders notificados

---

## 📞 Suporte

- **DevOps**: devops@metodoatuarial.com.br
- **Emergência**: +55 11 99999-9999
- **Documentação**: [Runbook](RUNBOOK.md)
- **Status Page**: [status.metodoatuarial.com.br](https://status.metodoatuarial.com.br)

---

*Última atualização: Janeiro 2025*
