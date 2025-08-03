// API Route para autenticação NextAuth.js
// Configuração completa de autenticação social Google e Apple
// Redireciona para área do cliente após login
//
// Para configurar o Google Auth:
// 1. Crie um projeto no Google Cloud Console e ative o OAuth 2.0.
// 2. Copie o clientId e clientSecret gerados.
// 3. Crie um arquivo .env.local na raiz do diretório nextjs-app com:
//    GOOGLE_CLIENT_ID=seu_client_id_google
//    GOOGLE_CLIENT_SECRET=seu_client_secret_google
//    APPLE_CLIENT_ID=seu_client_id_apple (opcional)
//    APPLE_CLIENT_SECRET=seu_client_secret_apple (opcional)
// 4. Nunca compartilhe esses segredos publicamente.
import NextAuth from "next-auth";

import authOptions from "./authOptions";
const handler = NextAuth(authOptions);
// Exporta apenas uma vez para evitar erro de identificador duplicado
export { handler as GET, handler as POST };
// Se aparecer erro de importação do next-auth, execute 'npm install next-auth' dentro do diretório nextjs-app

// Comentário: Este arquivo configura autenticação social com Google e Apple usando NextAuth.js, redirecionando o usuário para a área do cliente após login. Informações do perfil são adicionadas à sessão para uso posterior.
