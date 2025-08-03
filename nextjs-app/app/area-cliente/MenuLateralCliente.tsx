/**
 * Componente MenuLateralCliente
 * Menu lateral exclusivo para área do cliente, exibido apenas para usuários autenticados.
 * Os itens podem ser personalizados conforme necessidade do projeto.
 */
import Link from "next/link";

export default function MenuLateralCliente() {
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
