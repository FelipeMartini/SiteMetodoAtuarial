# Migração Auth.js v5 - Sistema Puro Database Session

## 🎯 Objetivo
Migrar do sistema híbrido atual (JWT para Credentials + Database para OAuth) para implementação **pura** Auth.js v5 com database sessions para **todos** os providers, mantendo todas as funcionalidades de segurança existentes.

## 📋 Status da Pesquisa
### ✅ Pesquisa Concluída
- [x] Análise da documentação completa Auth.js v5
- [x] Estudo dos problemas históricos com Credentials + Database
- [x] Análise das soluções workround da comunidade
- [x] Verificação da compatibilidade do schema atual
- [x] Análise das funcionalidades de segurança existentes

### 🔍 Principais Descobertas
1. **Auth.js v5** finalmente permite database sessions com Credentials Provider usando técnicas adequadas
2. **Sistema Atual** usa workaround híbrido que funciona, mas é complexo
3. **Schema Atual** é totalmente compatível com Auth.js v5 puro
4. **Funcionalidades de Segurança** podem ser mantidas (TOTP, accessLevel, MFA)

## 🛠️ Plano de Migração

### Fase 1: Preparação e Análise ✅
- [x] Backup do sistema atual
- [x] Análise do schema atual 
- [x] Pesquisa das melhores práticas Auth.js v5
- [x] Identificação das funcionalidades que devem ser preservadas

### Fase 2: Configuração Base 🔄
- [ ] **Configuração auth.ts v5** - Arquivo de configuração centralizado
  - [ ] Mover configuração do route.ts para auth.ts na raiz
  - [ ] Implementar database session strategy pura
  - [ ] Configurar todos os providers (Google, GitHub, Facebook, Discord, Credentials)
  
- [ ] **Route Handler Simplificado**
  - [ ] Simplificar app/api/auth/[...nextauth]/route.ts
  - [ ] Usar apenas handlers export do auth.ts

### Fase 3: Providers Configuration 📝
- [ ] **OAuth Providers** (Google, GitHub, Facebook, Discord)
  - [ ] Configuração com auto-detecção de env vars (AUTH_GOOGLE_ID, etc)
  - [ ] Database sessions automáticas
  
- [ ] **Credentials Provider** - Database Session
  - [ ] Implementar authorize callback com validação Zod
  - [ ] Configurar criação automática de session no banco
  - [ ] Preservar verificação de senha com bcrypt
  - [ ] Manter campos customizados (accessLevel, isActive)

### Fase 4: Security Features 🔐
- [ ] **TOTP/MFA Integration**
  - [ ] Preservar campo totpSecret no User model  
  - [ ] Implementar callbacks para MFA validation
  - [ ] Manter processo de verificação 2FA
  
- [ ] **Access Level System**
  - [ ] Preservar campo accessLevel no schema
  - [ ] Implementar session callback para incluir accessLevel
  - [ ] Manter verificações de autorização

- [ ] **Password Security**
  - [ ] Manter bcrypt hashing
  - [ ] Preservar validações de senha
  - [ ] Implementar rate limiting se necessário

### Fase 5: Schema & Database 💾
- [ ] **Verificar Compatibilidade**
  - [x] Schema atual é compatível com Auth.js v5
  - [ ] Testar criação de sessões database
  - [ ] Verificar todos os campos necessários
  
- [ ] **Prisma Integration**
  - [ ] Usar @auth/prisma-adapter (nova versão)
  - [ ] Verificar se todas as tabelas funcionam corretamente
  - [ ] Testar relacionamentos User/Account/Session

### Fase 6: Callbacks & Logic 🎯
- [ ] **Session Callback**
  - [ ] Incluir accessLevel, isActive na sessão
  - [ ] Preservar dados customizados do usuário
  - [ ] Manter formatação adequada
  
- [ ] **JWT Callback** (se necessário)
  - [ ] Simplificar ou remover se usando apenas database
  - [ ] Manter compatibilidade com middleware se necessário
  
- [ ] **SignIn Callback**
  - [ ] Verificar isActive antes de permitir login
  - [ ] Implementar verificações de accessLevel
  - [ ] Manter logs de auditoria

### Fase 7: Testing & Validation 🧪
- [ ] **Login Flows**
  - [ ] Testar login com cada OAuth provider
  - [ ] Testar login com Credentials
  - [ ] Verificar criação de sessões no banco
  
- [ ] **Security Tests**
  - [ ] Testar TOTP/MFA flows
  - [ ] Verificar accessLevel restrictions
  - [ ] Testar password validation
  
- [ ] **Session Management**
  - [ ] Testar logout/revoke sessions
  - [ ] Verificar session expiration
  - [ ] Testar session rotation

### Fase 8: Documentation & Cleanup 📚
- [ ] **Update Documentation**
  - [ ] Documentar nova configuração Auth.js v5
  - [ ] Atualizar README com setup instructions
  - [ ] Documentar funcionalidades de segurança
  
- [ ] **Code Cleanup**
  - [ ] Remover código híbrido obsoleto
  - [ ] Simplificar route handlers
  - [ ] Otimizar imports e dependências

## 🏗️ Estrutura de Arquivos Nova

```
/
├── auth.ts                          # ✨ NOVO: Configuração Auth.js v5 centralizada
├── src/
│   ├── app/api/auth/[...nextauth]/
│   │   └── route.ts                 # 🔄 SIMPLIFICADO: Apenas handlers export
│   ├── lib/
│   │   ├── auth-config.ts          # Configurações auxiliares se necessário
│   │   └── validation.ts           # Schemas Zod para validação
│   ├── prisma/
│   │   └── schema.prisma           # ✅ MANTIDO: Schema atual compatível
│   └── ...
```

## 🚨 Funcionalidades que DEVEM ser Preservadas

### 1. Sistema de Autenticação Atual
- [x] Login com Google, GitHub, Facebook, Discord
- [x] Login com email/senha (Credentials)
- [x] Database sessions para persistência

### 2. Funcionalidades de Segurança
- [x] TOTP/2FA com QR code
- [x] Access levels (ADMIN, USER, etc)
- [x] Campo isActive para controle de usuários
- [x] Password hashing com bcrypt
- [x] Validação com Zod

### 3. Schema Database
- [x] User model com campos customizados
- [x] Account linkage para múltiplos providers
- [x] Session management no SQLite
- [x] VerificationToken para email verification

## 📝 Configuração Auth.js v5 (Rascunho)

```typescript
// auth.ts (novo arquivo na raiz)
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Discord from "next-auth/providers/discord"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/src/prisma/client"
import bcrypt from "bcryptjs"
import { signInSchema } from "@/src/lib/validation"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" }, // 🎯 PURO DATABASE
  
  providers: [
    // OAuth Providers - Database automático
    Google,
    GitHub, 
    Discord,
    Facebook,
    
    // Credentials Provider - Database session
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)
          
          const user = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true }
          })
          
          if (!user || !user.password) {
            throw new Error("Invalid credentials")
          }
          
          const passwordValid = await bcrypt.compare(password, user.password)
          if (!passwordValid) {
            throw new Error("Invalid credentials")
          }
          
          if (!user.isActive) {
            throw new Error("Account disabled")
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            accessLevel: user.accessLevel,
            isActive: user.isActive
          }
        } catch (error) {
          return null
        }
      }
    })
  ],
  
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.accessLevel = user.accessLevel
        session.user.isActive = user.isActive
      }
      return session
    },
    
    async signIn({ user, account }) {
      // Verificações de segurança
      if (!user.isActive) {
        return false
      }
      return true
    }
  }
})
```

## 🎯 Benefícios da Migração

### ✅ Vantagens
1. **Simplicidade**: Configuração muito mais limpa e simples
2. **Consistência**: Database sessions para todos os providers
3. **Manutenibilidade**: Código mais fácil de manter e entender
4. **Futuro-prova**: Alinhado com Auth.js v5 oficial
5. **Performance**: Menos complexidade de código
6. **Padrão**: Segue as melhores práticas atuais

### ⚠️ Considerações
1. **Testagem Extensiva**: Precisa testar todos os fluxos
2. **Backup Essencial**: Manter backup do sistema atual
3. **Migração Gradual**: Implementar em ambiente de teste primeiro
4. **Documentação**: Atualizar toda documentação

## 📊 Cronograma Estimado
- **Fase 1-2**: 1 dia (Preparação + Config base)
- **Fase 3-4**: 2 dias (Providers + Security) 
- **Fase 5-6**: 1 dia (Schema + Callbacks)
- **Fase 7**: 2 dias (Testing extensivo)
- **Fase 8**: 1 dia (Documentation)

**Total Estimado**: 7 dias de trabalho

## 🏁 Próximos Passos
1. ✅ Confirmar plano de migração
2. ⏳ Criar arquivo auth.ts base
3. ⏳ Implementar configuração OAuth providers
4. ⏳ Implementar Credentials provider database
5. ⏳ Testar todos os fluxos de autenticação

---

**Status**: 🔄 Em Andamento - Fase 2
**Última Atualização**: 2025-01-09
**Responsável**: GitHub Copilot + Equipe Dev
