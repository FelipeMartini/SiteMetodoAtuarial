# Root Layout Integration

## app/layout.tsx

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '../lib/registry';
import { ThemeProvider } from '../contexts/ThemeContext';
import { GlobalStyles } from '../styles/GlobalStyles';
import { SessionProvider } from '../providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Site Método Atuarial',
  description: 'Sistema de autenticação e gestão',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
  );
}
```

## providers/SessionProvider.tsx

```typescript
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
```

## components/ThemeToggle/ThemeToggle.styled.ts

```typescript
import styled from 'styled-components';

export const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ThemeButton = styled.button<{ $isActive?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.outline};
    outline-offset: 2px;
  }
`;

export const LightThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #F7F8FA 0%, #FFFFFF 100%);
`;

export const DarkThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #121212 0%, #1E1E1E 100%);
`;

export const BlueThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #E3F2FD 0%, #1976D2 100%);
`;

export const GreenThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #E8F5E8 0%, #2E7D32 100%);
`;

export const PurpleThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #F3E5F5 0%, #7B1FA2 100%);
`;

export const ThemeLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.spacing.md};
`;
```

## components/ThemeToggle/index.tsx

```typescript
'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  ThemeToggleContainer,
  ThemeLabel,
  LightThemeButton,
  DarkThemeButton,
  BlueThemeButton,
  GreenThemeButton,
  PurpleThemeButton,
} from './ThemeToggle.styled';

export const ThemeToggle: React.FC = () => {
  const { themeName, setTheme } = useTheme();

  const themeButtons = [
    { name: 'light' as const, Component: LightThemeButton, label: 'Light' },
    { name: 'dark' as const, Component: DarkThemeButton, label: 'Dark' },
    { name: 'blue' as const, Component: BlueThemeButton, label: 'Blue' },
    { name: 'green' as const, Component: GreenThemeButton, label: 'Green' },
    { name: 'purple' as const, Component: PurpleThemeButton, label: 'Purple' },
  ];

  return (
    <ThemeToggleContainer>
      <ThemeLabel>Themes:</ThemeLabel>
      {themeButtons.map(({ name, Component, label }) => (
        <Component
          key={name}
          $isActive={themeName === name}
          onClick={() => setTheme(name)}
          title={`Switch to ${label} theme`}
          aria-label={`Switch to ${label} theme`}
        />
      ))}
    </ThemeToggleContainer>
  );
};

export default ThemeToggle;
```

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install styled-components @types/styled-components babel-plugin-styled-components
npm install next-auth@beta @auth/prisma-adapter prisma @prisma/client
npm install bcryptjs @types/bcryptjs zod react-hook-form
npm install -D tsx
```

### Step 2: Configure Next.js

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
  transpilePackages: ['styled-components'],
}

module.exports = nextConfig
```

### Step 3: Set up Prisma

```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

### Step 4: Create Theme System

1. Create `styles/themes.ts` with all theme definitions
2. Create `contexts/ThemeContext.tsx` for theme management
3. Create `styles/GlobalStyles.tsx` for global styles

### Step 5: Build Components

1. Create `components/design-system/InputField/`
2. Create `components/design-system/Button/`
3. Create `components/design-system/SocialLoginButton/`
4. Create `components/design-system/LoginForm/`

### Step 6: Set up Authentication

1. Configure NextAuth in `lib/auth.ts`
2. Create API routes for authentication
3. Set up Prisma schema and migrations

### Step 7: Integrate Everything

1. Update `app/layout.tsx` with providers
2. Create theme toggle component
3. Test all themes with login form

### Step 8: Testing

```bash
# Start development server
npm run dev

# Open Prisma Studio
npx prisma studio

# Test login functionality
# Visit http://localhost:3000/login
```

## File Structure

```
nextjs-app/
├── app/
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── api/
│       └── auth/
│           ├── [...nextauth]/
│           │   └── route.ts
│           └── register/
│               └── route.ts
├── components/
│   ├── design-system/
│   │   ├── InputField/
│   │   ├── Button/
│   │   ├── SocialLoginButton/
│   │   └── LoginForm/
│   └── ThemeToggle/
├── contexts/
│   └── ThemeContext.tsx
├── styles/
│   ├── themes.ts
│   └── GlobalStyles.tsx
├── lib/
│   ├── registry.tsx
│   ├── auth.ts
│   └── prisma.ts
├── providers/
│   └── SessionProvider.tsx
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── utils/
    └── validation.ts
```

## Deployment Checklist

1. **Environment Variables:**
   - Set `DATABASE_URL` for production database
   - Set `NEXTAUTH_SECRET` (generate new one)
   - Configure OAuth provider credentials

2. **Database:**
   - Run migrations on production database
   - Set up connection pooling if needed

3. **Build:**
   ```bash
   npm run build
   npm start
   ```

4. **Testing:**
   - Test all theme variations
   - Test login/registration flow
   - Test social authentication
   - Test responsive design