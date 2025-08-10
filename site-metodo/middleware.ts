// Middleware global para proteger rotas usando Auth.js v5 (Next.js 15+)
// Protege todas as rotas exceto APIs, estáticos e login
// https://authjs.dev/getting-started/session-management/protecting

export { auth as middleware } from "./auth"

export const config = {
  matcher: [
    // Protege todas as rotas exceto API, estáticos e favicon
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
