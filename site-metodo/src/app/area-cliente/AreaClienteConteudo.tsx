"use client";
// Componente client-side para exibir o conteúdo da área do cliente.
// Recebe os dados do usuário autenticado via props.

import React from "react";
import MenuLateralClienteWrapper from "./MenuLateralClienteWrapper";
import Image from "next/image";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Componente client-side para exibir o menu lateral e perfil do cliente.
 * Usa Tailwind CSS para temas dark/light
 */
export default function AreaClienteConteudo({ usuario }: { usuario?: { name?: string | null; email?: string | null; image?: string | null } }) {
  return (
    <ErrorBoundary>
      <div className="flex flex-row justify-center items-start gap-6 mt-10">
        <MenuLateralClienteWrapper />

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Perfil do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
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
                      className="rounded-full border-3 border-primary"
                      loading="lazy"
                      quality={85}
                    />
                  ) : (
                    <Skeleton className="h-[120px] w-[120px] rounded-full mb-2" />
                  )}
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-primary">Nome:</span> {usuario.name || <Skeleton className="h-[20px] w-[160px] inline-block align-middle" />}
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-primary">Email:</span> {usuario.email || <Skeleton className="h-[20px] w-[200px] inline-block align-middle" />}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
