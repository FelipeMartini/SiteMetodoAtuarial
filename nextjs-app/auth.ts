// Configuração universal Auth.js (NextAuth v5+)
// Este arquivo exporta métodos universais para autenticação em todo o app
// Recomenda-se manter na raiz do projeto para facilitar importações

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import MicrosoftEntraIdProvider from "next-auth/providers/microsoft-entra-id";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { z } from "zod";

// Instancia o cliente Prisma para uso no adapter
const prisma = new PrismaClient();

// Schema de validação para credenciais
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Exporta métodos universais para uso em todo o app
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Lista de provedores de autenticação
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    MicrosoftEntraIdProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
      tenantId: process.env.MICROSOFT_TENANT_ID || "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Valida as credenciais
          const { email, password } = signInSchema.parse(credentials);

          // Busca o usuário no banco de dados
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user || !user.password) {
            return null;
          }

          // Verifica a senha
          const isValidPassword = await bcryptjs.compare(password, user.password);

          if (!isValidPassword) {
            return null;
          }

          // Retorna o objeto do usuário (sem a senha)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            accessLevel: user.accessLevel,
          };
        } catch (error) {
          console.error("Erro de autorização:", error);
          return null;
        }
      }
    }),
  ],
  // Adapter para persistência de usuários/sessões no banco
  adapter: PrismaAdapter(prisma),
  // Estratégia de sessão: "jwt" para compatibilidade universal
  session: { strategy: "jwt" },
  // Páginas customizadas para login, logout e erro
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  // Callbacks para customização da sessão e redirecionamento
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider && user.email) {
        try {
          // Verificar se o usuário já existe
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Atualizar último login e garantir que Felipe seja Super Admin
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { 
                lastLogin: new Date(),
                ...(user.email === 'felipemartinii@gmail.com' && { accessLevel: 5 })
              },
            });
          } else if (account.provider !== 'credentials') {
            // Criar novo usuário apenas para provedores OAuth (não credentials)
            const accessLevel = user.email === 'felipemartinii@gmail.com' ? 5 : 1;
            
            await prisma.user.create({
              data: {
                name: user.name,
                email: user.email,
                image: user.image,
                accessLevel,
                isActive: true,
                lastLogin: new Date(),
              },
            });
          }
        } catch (error) {
          console.error('Erro ao processar login:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Adiciona dados do usuário ao token JWT
      if (user) {
        token.id = user.id;
        token.accessLevel = (user as any).accessLevel;
        token.isActive = (user as any).isActive;
      } else if (token.email) {
        // Buscar dados atualizados do banco para cada token refresh
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, accessLevel: true, isActive: true },
        });
        if (dbUser) {
          token.accessLevel = dbUser.accessLevel;
          token.isActive = dbUser.isActive;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Adiciona campos extras à sessão retornada para o cliente
      if (token) {
        session.user.id = token.id ?? token.sub ?? undefined;
        session.user.accessLevel = token.accessLevel || 1;
        session.user.isActive = token.isActive !== false;
        session.user.picture = token.picture ?? undefined;
        session.user.email = token.email ?? undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Redireciona para área do cliente após login/logout
      return url.startsWith("/") ? `${baseUrl}${url}` : baseUrl;
    },
  },
  // Ativa logs de debug em ambiente de desenvolvimento
  debug: process.env.NODE_ENV === "development",
  // Garante que o host do request será confiável (importante para produção/proxy)
  trustHost: true,
});

// Exporta handlers universais para rotas API (App Router Next.js 15+)
// Exemplo de uso em app/api/auth/[...nextauth]/route.ts:
// import { handlers } from "@/auth";
// export const { GET, POST } = handlers;

// Comentário: Este padrão segue as recomendações oficiais do Auth.js/NextAuth.js v5+ para Next.js 15+.
// Permite autenticação universal, integração com Prisma, múltiplos provedores e uso consistente em todo o app.
// Para adicionar novos provedores, basta incluir no array providers.
// Para migrar para PostgreSQL, altere o provider e a string de conexão no schema.prisma e .env.
