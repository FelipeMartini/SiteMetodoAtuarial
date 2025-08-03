import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";

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
    async session({ session, token }) {
      session.id = token.sub;
      session.picture = token.picture;
      session.email = token.email;
      return session;
    },
    async redirect() {
      return "/area-cliente";
    },
  },
};

export default authOptions;
// Comentário: Este arquivo exporta apenas as opções de autenticação para uso em outros módulos, evitando conflito de tipagem no Next.js moderno.
