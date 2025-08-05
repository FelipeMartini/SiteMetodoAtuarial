# Create comprehensive updated files for NextAuth v5 with SQLite
files_to_create = {
    "nextauth_v5_config": {
        "filename": "nextauth-v5-sqlite-config.md",
        "content": """# NextAuth v5 with SQLite Configuration

## Package Installation

```bash
# Install NextAuth v5 (beta)
npm install next-auth@beta @auth/prisma-adapter

# Install Prisma with SQLite
npm install prisma @prisma/client
npm install -D @types/bcryptjs bcryptjs zod react-hook-form

# Install additional dependencies
npm install styled-components @types/styled-components babel-plugin-styled-components
```

## Environment Variables (.env.local)

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth v5 Configuration
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"

# OAuth Providers
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Optional: Apple OAuth
AUTH_APPLE_ID="your-apple-id"
AUTH_APPLE_SECRET="your-apple-secret"
```

## Prisma Schema for SQLite (prisma/schema.prisma)

```prisma
// This is your Prisma schema file for NextAuth v5 with SQLite

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String          @id @default(cuid())
  name          String?
  email         String          @unique
  emailVerified DateTime?
  image         String?
  password      String?         // For credentials authentication
  role          String?         @default("user")
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  accounts Account[]
  sessions Session[]
  
  // Optional for WebAuthn support
  Authenticator Authenticator[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
  @@map("verificationtokens")
}

// Optional: For WebAuthn support
model Authenticator {
  credentialID         String  @unique @map("credential_id")
  userId               String  @map("user_id")
  providerAccountId    String  @map("provider_account_id")
  credentialPublicKey  String  @map("credential_public_key")
  counter              Int
  credentialDeviceType String  @map("credential_device_type")
  credentialBackedUp   Boolean @map("credential_backed_up")
  transports           String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, credentialID])
  @@map("authenticators")
}
```

## Prisma Client Setup (lib/prisma.ts)

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## NextAuth v5 Configuration (auth.ts)

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcryptjs from "bcryptjs"
import { z } from "zod"

// Validation schema for credentials
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  
  // Use database sessions for better security
  session: { 
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    
    // Credentials Provider
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const { email, password } = signInSchema.parse(credentials)
          
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email }
          })
          
          if (!user || !user.password) {
            return null
          }
          
          // Verify password
          const isValidPassword = await bcryptjs.compare(password, user.password)
          
          if (!isValidPassword) {
            return null
          }
          
          // Return user object (password excluded)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      }
    })
  ],
  
  // Custom pages
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  
  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Include user data in JWT token
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    
    async session({ session, token, user }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      
      // For database sessions
      if (user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      
      return session
    },
    
    async signIn({ user, account, profile }) {
      // You can add custom sign-in logic here
      return true
    }
  },
  
  // Events
  events: {
    async createUser({ user }) {
      console.log("New user created:", user.email)
    },
    async signIn({ user, account, profile, isNewUser }) {
      console.log("User signed in:", user.email)
    }
  },
  
  // Debug mode for development
  debug: process.env.NODE_ENV === "development",
})
```

## API Route Handler (app/api/auth/[...nextauth]/route.ts)

```typescript
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

## Database Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Create and apply initial migration
npx prisma migrate dev --name init

# View database in Prisma Studio
npx prisma studio

# Reset database (if needed)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## User Registration API Route (app/api/auth/register/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: result.error.issues },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user',
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install next-auth@beta @auth/prisma-adapter prisma @prisma/client bcryptjs zod react-hook-form
   ```

2. **Initialize Prisma with SQLite**
   ```bash
   npx prisma init --datasource-provider sqlite
   ```

3. **Configure Environment Variables**
   - Copy the `.env.local` template above
   - Generate AUTH_SECRET: `npx auth secret`
   - Add OAuth provider credentials

4. **Set up Database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Test Configuration**
   ```bash
   npm run dev
   npx prisma studio
   ```

## Key Changes from v4 to v5

- **Single auth() function** replaces getServerSession, useSession in server components
- **Simplified configuration** with auto-inferred environment variables
- **Better Edge runtime support** with proper adapter configuration
- **Database sessions** as default strategy with adapters
- **Improved TypeScript** support and type safety
- **Streamlined imports** from single auth.ts file
"""
    },
    
    "updated_components": {
        "filename": "nextauth-v5-components.md", 
        "content": """# Updated Components for NextAuth v5

## Updated Login Form (components/design-system/LoginForm/index.tsx)

```typescript
'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  LoginContainer,
  LoginCard,
  LoginTitle,
  LoginForm as StyledLoginForm,
  FormSection,
  SocialSection,
  Divider,
  DividerText,
  ForgotPasswordLink,
  SignUpPrompt,
  SignUpLink,
  ErrorAlert,
  SuccessAlert,
} from './LoginForm.styled'
import { InputField } from '../InputField'
import { Button } from '../Button'
import { SocialLoginButton } from '../SocialLoginButton'

interface LoginFormData {
  email: string
  password: string
  name?: string
}

interface LoginFormProps {
  mode?: 'login' | 'register'
  onModeChange?: (mode: 'login' | 'register') => void
  redirectTo?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  mode = 'login',
  onModeChange,
  redirectTo = '/dashboard',
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'login') {
        // NextAuth v5 signIn
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Invalid email or password. Please try again.')
        } else if (result?.ok) {
          setSuccess('Login successful! Redirecting...')
          setTimeout(() => {
            router.push(redirectTo)
            router.refresh()
          }, 1000)
        }
      } else {
        // Register mode
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          setSuccess('Account created successfully! You can now log in.')
          reset()
          setTimeout(() => {
            onModeChange?.('login')
          }, 2000)
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'An error occurred during registration.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Auth error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setError(null)
    setIsLoading(true)
    
    try {
      // NextAuth v5 signIn with redirect
      await signIn(provider, { 
        redirectTo: redirectTo,
        redirect: true 
      })
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`)
      console.error('Social login error:', err)
      setIsLoading(false)
    }
  }

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>
          {mode === 'login' ? 'Login' : 'Create Account'}
        </LoginTitle>

        {error && <ErrorAlert>{error}</ErrorAlert>}
        {success && <SuccessAlert>{success}</SuccessAlert>}

        <StyledLoginForm onSubmit={handleSubmit(onSubmit)}>
          <FormSection>
            {mode === 'register' && (
              <InputField
                id="name"
                type="text"
                placeholder="Full Name"
                label="Full Name"
                required
                error={errors.name?.message}
                {...register('name', {
                  required: mode === 'register' ? 'Name is required' : false,
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />
            )}

            <InputField
              id="email"
              type="email"
              placeholder="Email address"
              label="Email address"
              required
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\\S+@\\S+$/i,
                  message: 'Please enter a valid email address',
                },
              })}
            />

            <InputField
              id="password"
              type="password"
              placeholder="Password"
              label="Password"
              required
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            {mode === 'login' && (
              <ForgotPasswordLink href="/auth/forgot-password">
                Forgot your password?
              </ForgotPasswordLink>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            >
              {mode === 'login' ? 'Log in' : 'Create Account'}
            </Button>
          </FormSection>

          <Divider>
            <DividerText>or</DividerText>
          </Divider>

          <SocialSection>
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              Continue with Google
            </SocialLoginButton>
          </SocialSection>
        </StyledLoginForm>

        <SignUpPrompt>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <SignUpLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onModeChange?.(mode === 'login' ? 'register' : 'login')
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </SignUpLink>
        </SignUpPrompt>
      </LoginCard>
    </LoginContainer>
  )
}

export default LoginForm
```

## Session Provider for NextAuth v5 (providers/SessionProvider.tsx)

```typescript
'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface SessionProviderProps {
  children: ReactNode
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  )
}

export default SessionProvider
```

## Updated Layout with NextAuth v5 (app/layout.tsx)

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from '../lib/registry'
import { ThemeProvider } from '../contexts/ThemeContext'
import { GlobalStyles } from '../styles/GlobalStyles'
import { SessionProvider } from '../providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Site Método Atuarial - NextAuth v5',
  description: 'Sistema de autenticação moderno com NextAuth v5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <SessionProvider>
            <ThemeProvider defaultTheme="light">
              <GlobalStyles />
              {children}
            </ThemeProvider>
          </SessionProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

## Authentication Hooks for NextAuth v5 (hooks/useAuth.ts)

```typescript
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useAuth = (redirectTo?: string) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session && redirectTo) {
      router.push(redirectTo)
    }
  }, [session, status, router, redirectTo])

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    user: session?.user,
  }
}

export const useRequireAuth = (redirectTo: string = '/login') => {
  return useAuth(redirectTo)
}

// Server-side auth utility
export const getAuthSession = async () => {
  const { auth } = await import('@/auth')
  return await auth()
}
```

## Middleware for NextAuth v5 (middleware.ts)

```typescript
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/api/auth/register"]
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // Redirect to login if not authenticated and trying to access protected route
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Redirect to dashboard if logged in and trying to access login page
  if (isLoggedIn && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
```

## Server Component Example (app/dashboard/page.tsx)

```typescript
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  // Get session in server component
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name || session.user?.email}!</p>
      <p>Role: {session.user?.role}</p>
    </div>
  )
}
```

## Client Component Example (components/UserProfile.tsx)

```typescript
'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from './design-system/Button'

export const UserProfile = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
      <p>Role: {session.user?.role}</p>
      
      <Button 
        onClick={() => signOut({ callbackUrl: '/login' })}
        variant="outline"
      >
        Sign Out
      </Button>
    </div>
  )
}
```

## Type Definitions (types/next-auth.d.ts)

```typescript
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      role?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
  }
}
```

## Key NextAuth v5 Features Used

1. **Unified auth() function** - works in server components, middleware, API routes
2. **Automatic environment variable inference** - AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
3. **Database sessions** - more secure than JWT for user data persistence
4. **Improved TypeScript support** - better type inference and safety
5. **Streamlined configuration** - single auth.ts file for all auth config
6. **Better Edge runtime support** - optimized for modern deployment platforms
"""
    }
}

print("📋 UPDATED IMPLEMENTATION FOR NEXTAUTH V5 + SQLITE")
print("="*60)
print()

for category, file_info in files_to_create.items():
    print(f"✅ {category.upper().replace('_', ' ')}")
    print(f"   📄 {file_info['filename']}")
    print()

print("🎯 KEY CHANGES FOR NEXTAUTH V5:")
print("-"*40)
changes = [
    "✅ Updated to NextAuth v5 (Auth.js) beta",
    "✅ Changed from PostgreSQL to SQLite database", 
    "✅ Updated Prisma schema for SQLite compatibility",
    "✅ Implemented database sessions (more secure)",
    "✅ Used unified auth() function throughout",
    "✅ Auto-inferred environment variables (AUTH_*)",
    "✅ Updated all components for v5 compatibility",
    "✅ Improved middleware configuration",
    "✅ Enhanced TypeScript support"
]

for change in changes:
    print(f"  {change}")

print()
print("🔥 NEXTAUTH V5 ADVANTAGES:")
print("-"*40)
advantages = [
    "🚀 Better performance with Edge runtime support",
    "🔒 More secure with database sessions by default", 
    "⚡ Simplified configuration and setup process",
    "🎯 Single auth() function for all authentication needs",
    "📱 Better mobile and PWA compatibility",
    "🛡️ Enhanced security with improved session handling"
]

for advantage in advantages:
    print(f"  {advantage}")