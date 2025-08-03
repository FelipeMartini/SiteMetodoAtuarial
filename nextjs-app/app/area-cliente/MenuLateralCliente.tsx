"use client";
// Diretiva para garantir que o componente seja client-side
/**
 * Componente MenuLateralCliente
 * Menu lateral exclusivo para área do cliente, exibido apenas para usuários autenticados.
 * Os itens podem ser personalizados conforme necessidade do projeto.
 */

// Importação do componente Link do Next.js para navegação interna
import Link from "next/link";



/**
 * Componente MenuLateralCliente
 * Menu lateral exclusivo para área do cliente, exibido apenas para usuários autenticados.
 * Os itens podem ser personalizados conforme necessidade do projeto.
 */
export default function MenuLateralCliente() {
  return (
    <aside data-testid="menu-lateral" style={{ width: 220, background: '#f5f5f5', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24, marginRight: 32, minHeight: 320 }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Título do menu lateral */}
        <strong style={{ marginBottom: 12, fontSize: 18 }}>Menu do Cliente</strong>
        {/* Link para perfil do cliente */}
        <Link href="/area-cliente" style={{ color: '#1976d2', fontWeight: 'bold' }}>Perfil</Link>
        {/* Link para documentos do cliente */}
        <Link href="#" style={{ color: '#1976d2' }}>Meus Documentos</Link>
        {/* Link para solicitações do cliente, usando entidades HTML para caracteres especiais */}
        <Link href="#" style={{ color: '#1976d2' }}>Solicita&ccedil;&otilde;es</Link>
      </nav>
    </aside>
  );
}
