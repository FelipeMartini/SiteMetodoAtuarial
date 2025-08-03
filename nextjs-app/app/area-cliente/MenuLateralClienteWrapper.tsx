"use client";
// Wrapper client-side para o MenuLateralCliente
// Necessário para uso em Server Component conforme Next.js 15
import MenuLateralCliente from "./MenuLateralCliente";

/**
 * Componente wrapper para garantir que MenuLateralCliente seja renderizado apenas no client.
 * Utilizado em Server Component para evitar erro de extensão de classe.
 */
export default function MenuLateralClienteWrapper() {
  return <MenuLateralCliente />;
}
