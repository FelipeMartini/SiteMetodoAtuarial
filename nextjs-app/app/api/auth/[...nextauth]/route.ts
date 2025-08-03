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

// Migração para Auth.js (NextAuth v5+)
// Utiliza configuração universal, exportando handlers para GET e POST conforme App Router
import { handlers } from "@/auth";
export const { GET, POST } = handlers;

// Comentário: Este arquivo agora utiliza Auth.js, exportando handlers universais para autenticação moderna e compatível com App Router.
