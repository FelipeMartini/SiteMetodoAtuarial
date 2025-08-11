# ✅ Auth.js v5 - Solução Implementada

## 🎯 Problema Resolvido

**Erro MissingCSRF e UnknownAction no Auth.js v5**

### ❌ Problema Original:
- `[auth][error] UnknownAction: Unsupported action` 
- `[auth][error] MissingCSRF: CSRF token was missing during an action signin`
- Login redirecionando para página de erro ao invés de autenticar

### ✅ Solução Implementada:

## 🔧 Mudanças Realizadas

### 1. **Server Actions para Autenticação** (`src/actions/signin.ts`)

```typescript
"use server";

import { redirect } from "next/navigation";
import { signIn } from "../../auth";

// Server action para credentials
export async function signInCredentials(
  previousState: SignInCredentialsResult | null,
  formData: FormData,
): Promise<SignInCredentialsResult> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result) {
      return {
        status: "error",
        errorMessage: "Falha na autenticação. Verifique suas credenciais.",
      };
    }
  } catch (error) {
    return {
      status: "error",
      errorMessage: "Falha na autenticação. Verifique suas credenciais.",
    };
  }

  redirect("/area-cliente");
}

// Server action para OAuth
export async function signInOAuth({ providerId }: { providerId: string }) {
  const redirectUrl = await signIn(providerId, {
    redirect: false,
  });
  redirect(redirectUrl);
}
```

### 2. **Atualização da Página de Login** (`src/app/login/page.tsx`)

```typescript
"use client";

import { useFormState, useTransition } from "react";
import { signInCredentials, signInOAuth } from '@/actions/signin';

const LoginPage: React.FC = () => {
  // useFormState para credentials com server action
  const [credentialsState, credentialsAction] = useFormState(
    signInCredentials,
    undefined
  );

  const [isPending, startTransition] = useTransition();

  // Handler para OAuth com server action
  const handleOAuthLogin = (providerId: string) => {
    startTransition(async () => {
      await signInOAuth({ providerId });
    });
  };

  return (
    <form action={credentialsAction}>
      {/* Formulário usando server action */}
    </form>
  );
};
```

## 🎯 Por que Funcionou

### **Auth.js v5 + App Router requer Server Actions**

1. **Double Submit Cookie Pattern**: Auth.js v5 usa proteção CSRF que requer server actions
2. **App Router Compatibility**: Next.js App Router funciona melhor com server actions para autenticação
3. **Eliminação de Client-side signIn**: Remover chamadas `signIn()` no cliente resolve problemas de CSRF

### **Padrão Correto vs Incorreto**

❌ **Padrão Incorreto (causava CSRF):**
```typescript
// Client-side - causava MissingCSRF
const result = await signIn('credentials', {
  email, password, redirect: false
});
```

✅ **Padrão Correto (sem CSRF):**
```typescript
// Server action - sem problemas de CSRF
"use server";
export async function signInCredentials(previousState, formData) {
  const result = await signIn("credentials", { ... });
  redirect("/area-cliente");
}
```

## 📊 Resultados

### ✅ **Logs de Sucesso:**
```
[Auth] Successful login for: admin@test.com
[Auth] SignIn callback: { user: 'admin@test.com', provider: 'credentials' }
[Auth] User admin@test.com signed in via credentials
```

### ✅ **OAuth Funcionando:**
```
[auth][debug]: authorization url is ready
POST /login 200 in 828ms
```

### ✅ **Sem Erros de CSRF:**
- ❌ `MissingCSRF` - Eliminado
- ❌ `UnknownAction` - Eliminado
- ✅ `NEXT_REDIRECT` - Normal (redirecionamento de server action)

## 🔗 Referências

- **GitHub Issue #9189**: [How to create a custom sign-in page in Auth.js?](https://github.com/nextauthjs/next-auth/issues/9189)
- **Auth.js v5 Migration Guide**: [Migrating to v5](https://authjs.dev/getting-started/migrating-to-v5)
- **Double Submit Cookie Pattern**: Proteção CSRF padrão do Auth.js v5

## 📝 Lições Aprendidas

1. **Auth.js v5 é diferente**: Requer server actions para funcionar corretamente
2. **CSRF automático**: Server actions gerenciam CSRF automaticamente
3. **App Router first**: Auth.js v5 foi projetado para App Router
4. **useFormState > useState**: Melhor para formulários com server actions

---

**✅ Status: Implementação completa e funcional**
**🎯 Próximos passos: Testes E2E e documentação adicional**
