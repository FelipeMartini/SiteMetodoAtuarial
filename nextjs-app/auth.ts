// Configuração universal Auth.js (NextAuth v5+)
// Este arquivo exporta métodos universais para autenticação em todo o app
// Recomenda-se manter na raiz do projeto para facilitar importações


// Configuração universal de autenticação para Next.js 15+ (App Router)
// Utiliza NextAuth.js v5+, PrismaAdapter e provedores Google/Apple
// Este arquivo exporta métodos universais para uso em todo o app

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// Instancia o cliente Prisma para uso no adapter
const prisma = new PrismaClient();

// Exporta métodos universais para uso em todo o app
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Lista de provedores de autenticação
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    }),
  ],
  // Adapter para persistência de usuários/sessões no banco
  adapter: PrismaAdapter(prisma),
  // Estratégia de sessão: "jwt" para compatibilidade universal, "database" para persistência
  session: { strategy: "jwt" },
  // Páginas customizadas para login, logout e erro
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  // Callbacks para customização da sessão e redirecionamento
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      // Adiciona campos extras à sessão retornada para o cliente
      if (token) {
        session.id = token.sub ?? undefined;
        session.picture = token.picture ?? undefined;
        session.email = token.email ?? undefined;
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
