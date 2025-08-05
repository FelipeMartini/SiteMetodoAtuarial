# Prisma Authentication Setup

## prisma/schema.prisma

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials authentication
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## lib/prisma.ts

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## lib/auth.ts

```typescript
import NextAuth, { type NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import bcryptjs from 'bcryptjs';

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
```

## app/api/auth/[...nextauth]/route.ts

```typescript
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

## app/api/auth/register/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Environment Variables (.env.local)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Apple OAuth (optional)
APPLE_ID="your-apple-id"
APPLE_TEAM_ID="your-apple-team-id"
APPLE_PRIVATE_KEY="your-apple-private-key"
APPLE_KEY_ID="your-apple-key-id"
```

## Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name init

# View database in Prisma Studio
npx prisma studio

# Seed database (optional)
npx prisma db seed
```

## prisma/seed.ts (Optional)

```typescript
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await bcryptjs.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  console.log('Created user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## package.json (Add to scripts section)

```json
{
  "scripts": {
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Dependencies to Install

```bash
npm install prisma @prisma/client @auth/prisma-adapter bcryptjs zod
npm install -D @types/bcryptjs tsx

# For Google OAuth
npm install next-auth@beta

# If using PostgreSQL
npm install pg
npm install -D @types/pg
```

## Database Setup Instructions

1. **Create PostgreSQL Database:**
   ```sql
   CREATE DATABASE your_database_name;
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
   ```

2. **Configure Environment Variables:**
   - Update `DATABASE_URL` in `.env.local`
   - Set up `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - Configure OAuth providers (Google, Apple)

3. **Initialize Database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Test Connection:**
   ```bash
   npx prisma studio
   ```

## Security Best Practices

1. **Password Security:**
   - Use bcryptjs for password hashing
   - Minimum 6 characters (consider 8+ for production)
   - Consider password strength requirements

2. **Session Security:**
   - Use secure session tokens
   - Set appropriate session expiration
   - Implement CSRF protection

3. **Database Security:**
   - Use connection pooling
   - Implement rate limiting
   - Sanitize all inputs

4. **Environment Security:**
   - Never commit `.env` files
   - Use different secrets for different environments
   - Rotate secrets regularly