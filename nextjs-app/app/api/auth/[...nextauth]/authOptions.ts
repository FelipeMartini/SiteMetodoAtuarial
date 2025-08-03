import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
const authOptions = {
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
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // Adiciona campos extras à sessão, mantendo compatibilidade com NextAuth
      if (token) {
        (session as Session & { id?: string; picture?: string; email?: string }).id = token.sub ?? undefined;
        (session as Session & { id?: string; picture?: string; email?: string }).picture = token.picture ?? undefined;
        (session as Session & { id?: string; picture?: string; email?: string }).email = token.email ?? undefined;
      }
      return session;
    },
    async redirect() {
      return "/area-cliente";
    },
  },
};

export default authOptions;
// Comentário: Este arquivo exporta apenas as opções de autenticação para uso em outros módulos, evitando conflito de tipagem no Next.js moderno.
