// Página de Login Social
// Permite login apenas com Google ou Apple
// Redireciona automaticamente para área do cliente após login
"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  // Renderiza botões de login social Google e Apple
  return (
    <main style={{ maxWidth: 400, margin: "40px auto", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px #0002", background: "#fff" }}>
      <h2 style={{ textAlign: "center" }}>Login do Cliente</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button onClick={() => signIn("google")}
          style={{ padding: 12, borderRadius: 8, background: "#4285F4", color: "#fff", fontWeight: "bold", border: "none", cursor: "pointer" }}>
          <Image src="/react.svg" alt="Google" width={24} height={24} style={{ verticalAlign: "middle", marginRight: 8 }} />
          Entrar com Google
        </button>
        <button onClick={() => signIn("apple")}
          style={{ padding: 12, borderRadius: 8, background: "#000", color: "#fff", fontWeight: "bold", border: "none", cursor: "pointer" }}>
          <Image src="/office-team.png" alt="Apple" width={24} height={24} style={{ verticalAlign: "middle", marginRight: 8 }} />
          Entrar com Apple
        </button>
      </div>
    </main>
  );
}
// Comentário: Esta página permite login apenas com Google ou Apple. O redirecionamento automático para área do cliente é feito pelo NextAuth após login bem-sucedido. Os botões usam boas práticas de acessibilidade e design.

// ...existing code...
