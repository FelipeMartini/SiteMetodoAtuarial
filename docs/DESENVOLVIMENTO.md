# Guia de Desenvolvimento - Site Método Atuarial

Este guia estabelece padrões, workflows e melhores práticas para contribuir com o projeto.

## 🏗️ Arquitetura do Projeto

### Stack Tecnológico
- **Frontend**: Next.js 15.4.6 + React 19
- **Styling**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand (global) + TanStack Query (server)
- **Autenticação**: Auth.js v5
- **Database**: PostgreSQL + Prisma ORM
- **Validação**: Zod
- **Testes**: Jest + Testing Library
- **Build**: Turbopack (dev) + Webpack (prod)

### Estrutura de Diretórios
```
site-metodo/
├── prisma/                 # Database schema e migrations
│   ├── schema.prisma
│   └── migrations/
├── public/                 # Assets estáticos
├── src/
│   ├── app/               # App Router (Next.js 13+)
│   │   ├── api/           # API Routes
│   │   ├── auth/          # Páginas de autenticação
│   │   ├── dashboard/     # Dashboard (protegido)
│   │   └── ...páginas
│   ├── components/        # Componentes reutilizáveis
│   │   ├── ui/           # shadcn/ui components
│   │   ├── forms/        # Formulários
│   │   └── layouts/      # Layouts
│   ├── lib/              # Utilitários e configurações
│   │   ├── auth.ts       # Auth.js config
│   │   ├── db.ts         # Prisma client
│   │   ├── utils.ts      # Utilidades gerais
│   │   └── validations/  # Schemas Zod
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand stores
│   └── types/            # TypeScript types
├── tests/                # Testes
└── scripts/              # Scripts utilitários
```

---

## 🔄 Workflow de Desenvolvimento

### Git Flow Simplificado

#### Branches
- **`main`**: Produção estável
- **`develop`**: Desenvolvimento ativo
- **`feature/nome-da-feature`**: Novas funcionalidades
- **`fix/nome-do-bug`**: Correções
- **`hotfix/nome-critico`**: Correções críticas

#### Processo
```bash
# 1. Criar branch da feature
git checkout -b feature/nova-funcionalidade develop

# 2. Desenvolver e commitar
git add .
git commit -m "feat: adicionar nova funcionalidade"

# 3. Push e PR
git push origin feature/nova-funcionalidade
# Abrir Pull Request para develop

# 4. Após approval, merge para develop
# 5. Deploy de develop para staging
# 6. Merge de develop para main (produção)
```

### Conventional Commits
Usamos padrão de commits convencionais:

```bash
# Tipos principais
feat:     # Nova funcionalidade
fix:      # Correção de bug
docs:     # Documentação
style:    # Formatação (sem mudança lógica)
refactor: # Refatoração
test:     # Testes
chore:    # Tarefas de build/ferramentas

# Exemplos
git commit -m "feat(auth): adicionar login social com Google"
git commit -m "fix(dashboard): corrigir carregamento de dados"
git commit -m "docs(api): atualizar documentação de endpoints"
```

---

## 🎨 Padrões de Código

### TypeScript

#### Configuração Strict
```typescript
// tsconfig.json já configurado com:
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

#### Tipos e Interfaces
```typescript
// ✅ Correto: Use interface para objetos extensíveis
interface User {
  id: string
  name: string
  email: string
}

// ✅ Correto: Use type para unions/composições
type UserRole = 'admin' | 'user' | 'moderator'
type UserWithRole = User & { role: UserRole }

// ❌ Evitar: any
const data: any = fetchData() // ❌

// ✅ Preferir: unknown + type guards
const data: unknown = fetchData()
if (isUser(data)) {
  // data é tipado como User aqui
}
```

### React Components

#### Function Components
```typescript
// ✅ Padrão recomendado
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      className={cn('btn', `btn-${variant}`)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ❌ Evitar: React.FC
export const Button: React.FC<ButtonProps> = ({ children }) => {
  // ...
}
```

#### Hooks Customizados
```typescript
// hooks/useUser.ts
import { useQuery } from '@tanstack/react-query'

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  })
}

// Uso no componente
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId)
  
  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error.message}</div>
  
  return <div>{user?.name}</div>
}
```

### Estado Global (Zustand)

```typescript
// store/authStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-store' }
  )
)
```

### API Routes (Next.js)

```typescript
// app/api/users/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // 2. Validar entrada
    const body = await request.json()
    const { name, email } = CreateUserSchema.parse(body)

    // 3. Lógica de negócio
    const user = await prisma.user.create({
      data: { name, email },
    })

    // 4. Retornar resultado
    return Response.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Erro ao criar usuário:', error)
    return Response.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

---

## 🎨 UI/UX Guidelines

### shadcn/ui Components
```bash
# Instalar novo componente
npx shadcn-ui@latest add button

# Customizar componente
# Editar em src/components/ui/button.tsx
```

### Tailwind Classes
```typescript
// ✅ Use cn() para combinar classes condicionais
import { cn } from '@/lib/utils'

function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        // Variants
        {
          'bg-primary text-primary-foreground': variant === 'primary',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
        },
        // Custom className
        className
      )}
      {...props}
    />
  )
}
```

### Responsive Design
```tsx
// Mobile-first approach
<div className="
  w-full          // Base: full width
  md:w-1/2        // Medium screens: half width
  lg:w-1/3        // Large screens: one third
  p-4             // Base padding
  md:p-6          // Medium screens: more padding
">
  <h1 className="
    text-lg        // Base: large text
    md:text-xl     // Medium: extra large
    lg:text-2xl    // Large: 2x large
  ">
    Título Responsivo
  </h1>
</div>
```

### Dark Mode
```tsx
// Usar CSS variables do Tailwind
<div className="bg-background text-foreground">
  <h1 className="text-primary">Título</h1>
  <p className="text-muted-foreground">Texto secundário</p>
</div>

// Condicionais quando necessário
<div className="bg-white dark:bg-gray-900">
  Conteúdo que muda com o tema
</div>
```

---

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── __mocks__/           # Mocks globais
├── utils/               # Utilitários de teste
├── components/          # Testes de componentes
├── pages/               # Testes de páginas
├── api/                 # Testes de API
└── e2e/                 # Testes end-to-end
```

### Component Testing
```typescript
// tests/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renderiza o texto corretamente', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('chama onClick quando clicado', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clique</Button>)
    
    fireEvent.click(screen.getByText('Clique'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('aplica variant className corretamente', () => {
    render(<Button variant="secondary">Botão</Button>)
    const button = screen.getByText('Botão')
    expect(button).toHaveClass('btn-secondary')
  })
})
```

### API Testing
```typescript
// tests/api/users.test.ts
import { POST } from '@/app/api/users/route'
import { createMockRequest } from '@/tests/utils/mockRequest'

// Mock do Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      create: jest.fn(),
    },
  },
}))

describe('/api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('cria usuário com dados válidos', async () => {
    const mockUser = { id: '1', name: 'João', email: 'joao@test.com' }
    ;(prisma.user.create as jest.Mock).mockResolvedValue(mockUser)

    const request = createMockRequest({
      method: 'POST',
      body: { name: 'João', email: 'joao@test.com' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.user).toEqual(mockUser)
  })

  it('retorna erro com dados inválidos', async () => {
    const request = createMockRequest({
      method: 'POST',
      body: { name: '', email: 'email-inválido' },
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
```

### Test Coverage
```bash
# Executar com cobertura
npm run test:coverage

# Meta: manter acima de 80%
# Verificar em coverage/lcov-report/index.html
```

---

## 🔐 Segurança e Performance

### Validação de Dados
```typescript
// ✅ Sempre validar entrada da API
import { z } from 'zod'

const UserSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
  role: z.enum(['user', 'admin']),
})

// Validar antes de usar
const userData = UserSchema.parse(input)
```

### ABAC (Attribute-Based Access Control)
```typescript
// lib/abac.ts
export async function checkPermission(
  user: User,
  action: string,
  resource: string,
  context?: Record<string, any>
) {
  // Implementação do sistema ABAC
  const rules = await getRulesForUser(user)
  return evaluateRules(rules, action, resource, context)
}

// Uso em API
export async function DELETE(request: NextRequest) {
  const session = await auth()
  const hasPermission = await checkPermission(
    session.user,
    'delete',
    'user',
    { targetUserId: params.id }
  )
  
  if (!hasPermission) {
    return Response.json({ error: 'Sem permissão' }, { status: 403 })
  }
  
  // Proceder com a exclusão
}
```

### Performance

#### React Query
```typescript
// ✅ Cache e invalidação inteligente
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  })
}

// ✅ Mutations com invalidação
export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

#### Next.js Optimization
```typescript
// ✅ Lazy loading de componentes
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Carregando...</div>,
})

// ✅ Image optimization
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority // Para above-the-fold
  placeholder="blur" // Para melhor UX
/>
```

---

## 🚀 Build e Deploy

### Scripts Úteis
```bash
# Desenvolvimento
npm run dev                    # Next.js dev server
npm run dev:turbo             # Com Turbopack (experimental)

# Qualidade
npm run lint                  # ESLint check
npm run lint:fix              # ESLint fix
npm run type-check            # TypeScript check
npm run format                # Prettier format

# Testes
npm run test                  # Jest tests
npm run test:watch            # Watch mode
npm run test:coverage         # Com cobertura

# Build
npm run build                 # Production build
npm run start                 # Production server
npm run analyze               # Bundle analysis

# Database
npm run db:migrate            # Run migrations
npm run db:seed               # Seed data
npm run db:studio             # Prisma Studio
npm run db:reset              # Reset database
```

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
      - run: npm run build
```

---

## 📝 Documentação

### JSDoc para Funções Complexas
```typescript
/**
 * Calcula o valor atuarial de uma anuidade
 * 
 * @param principal - Valor principal
 * @param rate - Taxa de juros anual (decimal)
 * @param periods - Número de períodos
 * @param type - Tipo de anuidade ('ordinary' | 'due')
 * @returns Valor presente da anuidade
 * 
 * @example
 * ```typescript
 * const pv = calculateAnnuityPV(1000, 0.05, 10, 'ordinary')
 * console.log(pv) // 7721.73
 * ```
 */
export function calculateAnnuityPV(
  principal: number,
  rate: number,
  periods: number,
  type: 'ordinary' | 'due' = 'ordinary'
): number {
  // Implementação...
}
```

### README de Componentes
```markdown
# Button Component

Componente de botão baseado em shadcn/ui com variantes customizadas.

## Props

| Prop | Type | Default | Descrição |
|------|------|---------|-----------|
| `variant` | `'primary' \| 'secondary' \| 'destructive'` | `'primary'` | Variante visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do botão |
| `disabled` | `boolean` | `false` | Estado desabilitado |

## Exemplos

```tsx
<Button variant="primary" size="lg">
  Botão Principal
</Button>
```
```

---

## 🎯 Melhores Práticas

### Performance
- **Bundle splitting**: Usar dynamic imports para routes pesadas
- **Image optimization**: Sempre usar next/image
- **Memo seletivo**: React.memo apenas onde necessário
- **Query optimization**: Prisma include/select específicos

### Segurança
- **Input validation**: Sempre validar com Zod
- **SQL injection**: Usar Prisma (nunca raw SQL)
- **XSS prevention**: React escapa automaticamente
- **CSRF protection**: Auth.js já protege

### UX
- **Loading states**: Skeleton loaders para melhor percepção
- **Error boundaries**: Capturar erros graciosamente
- **Accessibility**: Usar semantic HTML e ARIA
- **Mobile first**: Design responsivo sempre

### Código
- **DRY principle**: Extrair lógica comum
- **Single responsibility**: Funções com um propósito
- **Type safety**: Usar TypeScript rigorosamente
- **Error handling**: Try/catch em APIs, Error boundaries em React

---

## 🤝 Code Review Checklist

### Antes do PR
- [ ] Lint passa sem erros
- [ ] Type check passa
- [ ] Testes passam e cobertura mantida
- [ ] Build de produção funciona
- [ ] Funcionalidade testada manualmente

### Durante Review
- [ ] Código segue padrões estabelecidos
- [ ] Tem testes adequados
- [ ] Performance considerada
- [ ] Segurança verificada
- [ ] Documentação atualizada

### Merge
- [ ] Approval de pelo menos 1 reviewer
- [ ] CI/CD passa completamente
- [ ] Commits seguem conventional format
- [ ] Branch atualizada com develop

---

## 📞 Contato e Suporte

- **Tech Lead**: Felipe Martini
- **Email**: dev@metodoatuarial.com.br
- **Discussões**: [GitHub Discussions](https://github.com/FelipeMartini/SiteMetodoAtuarial/discussions)
- **Issues**: [GitHub Issues](https://github.com/FelipeMartini/SiteMetodoAtuarial/issues)

---

*Última atualização: Janeiro 2025*
