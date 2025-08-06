
"use client";
// Componente client-side para exibir o conteúdo da área do cliente.
// Recebe os dados do usuário autenticado via props.

import React from "react";
import MenuLateralClienteWrapper from "./MenuLateralClienteWrapper";
import Image from "next/image";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useTema } from '@core/theme/ContextoTema';
import { Skeleton } from "../components/ui/skeleton";

/**
 * Componente client-side para exibir o menu lateral e perfil do cliente.
 * Alterna cores do box e texto conforme tema selecionado.
 */
export default function AreaClienteConteudo({ usuario }: { usuario?: { name?: string | null; email?: string | null; image?: string | null } }) {
  const { currentTheme } = useTema();
  const cores = currentTheme.colors;
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
        <MenuLateralClienteWrapper />
        <main
          style={{
            maxWidth: 400,
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 8px #0002",
            background: cores.surface,
            color: cores.text,
            transition: "background 0.3s, color 0.3s",
          }}
        >
          <h2 style={{ textAlign: "center", color: cores.primary }}>Perfil do Cliente</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Exibe Skeleton enquanto dados do usuário não estão disponíveis */}
            {!usuario ? (
              <>
                <Skeleton className="h-[120px] w-[120px] rounded-full mb-2" />
                <Skeleton className="h-[20px] w-[160px] mb-2" />
                <Skeleton className="h-[20px] w-[200px]" />
              </>
            ) : (
              <>
                {usuario.image ? (
                  <Image
                    src={usuario.image}
                    alt="Foto do usuário"
                    width={120}
                    height={120}
                    style={{ borderRadius: "50%", border: `3px solid ${cores.primary}` }}
                    loading="lazy"
                    quality={85}
                  />
                ) : (
                  <Skeleton className="h-[120px] w-[120px] rounded-full mb-2" />
                )}
                <div style={{ color: cores.textSecondary }}>
                  <strong style={{ color: cores.primary }}>Nome:</strong> {usuario.name || <Skeleton className="h-[20px] w-[160px] inline-block align-middle" />}
                </div>
                <div style={{ color: cores.textSecondary }}>
                  <strong style={{ color: cores.primary }}>Email:</strong> {usuario.email || <Skeleton className="h-[20px] w-[200px] inline-block align-middle" />}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}