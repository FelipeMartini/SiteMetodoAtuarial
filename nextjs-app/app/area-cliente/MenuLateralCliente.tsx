// Componente de Menu Lateral exclusivo para área do cliente
// Só aparece para usuário autenticado
import Link from "next/link";

export default function MenuLateralCliente() {
  // Exemplos de itens do menu lateral
  // Adiciona data-testid para facilitar testes automatizados
  return (
    <aside data-testid="menu-lateral" style={{ width: 220, background: "#f5f5f5", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 24, marginRight: 32, minHeight: 320 }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <strong style={{ marginBottom: 12, fontSize: 18 }}>Menu do Cliente</strong>
        <Link href="/area-cliente" style={{ color: "#1976d2", fontWeight: "bold" }}>Perfil</Link>
        <Link href="#" style={{ color: "#1976d2" }}>Meus Documentos</Link>
        <Link href="#" style={{ color: "#1976d2" }}>Solicitações</Link>
      </nav>
    </aside>
  );
}

// Comentário: Este menu lateral é exclusivo da área do cliente e só aparece para usuários autenticados. Os itens são exemplos e podem ser personalizados conforme necessidade.
