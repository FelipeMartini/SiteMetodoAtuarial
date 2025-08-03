
"use client";
// Componente client-side para exibir o conteúdo da área do cliente.
// Recebe os dados do usuário autenticado via props.

import React from "react"; // Import necessário para JSX
import MenuLateralClienteWrapper from "./MenuLateralClienteWrapper";
import Image from "next/image";
import { ErrorBoundary } from "../components/ErrorBoundary";

/**
 * Componente client-side para exibir o menu lateral e perfil do cliente.
 * Recebe os dados do usuário autenticado via props.
 */
export default function AreaClienteConteudo({
  usuario,
}: {
  usuario: { name?: string; email?: string; image?: string | null };
}) {
  return (
    <ErrorBoundary>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 24,
          marginTop: 40,
        }}
      >
        {/* Menu lateral exclusivo para usuário autenticado */}
        <MenuLateralClienteWrapper />
        <main
          style={{
            maxWidth: 400,
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 8px #0002",
            background: "#fff",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Perfil do Cliente</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Exibe foto do usuário se disponível */}
            {usuario.image ? (
              <Image
                src={usuario.image}
                alt="Foto do usuário"
                width={120}
                height={120}
                style={{ borderRadius: "50%" }}
                loading="lazy"
                quality={85}
                placeholder="blur"
              />
            ) : null}
            <div>
              <strong>Nome:</strong> {usuario.name || "Não informado"}
            </div>
            <div>
              <strong>Email:</strong> {usuario.email || "Não informado"}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}