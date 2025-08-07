"use client";
// Componente client-side para exibir o conteúdo da área do cliente.
// Recebe os dados do usuário autenticado via props.

import React from "react";
import MenuLateralClienteWrapper from "@/app/area-cliente/MenuLateralClienteWrapper";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Componente client-side para exibir o menu lateral e perfil do cliente.
 * Usa Tailwind CSS para temas dark/light
 */
export default function AreaClienteConteudo({ usuario }: { usuario?: { name?: string | null; email?: string | null; image?: string | null } }) {
  return (
    <div className="flex flex-row justify-center items-start gap-8 mt-10 w-full px-4">
      <MenuLateralClienteWrapper />

      <Card className="max-w-md w-full bg-background/80 shadow-xl border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gradient">Perfil do Cliente</CardTitle>
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
                    className="rounded-full border-4 border-primary/30 shadow-lg mb-2"
                  />
                ) : (
                  <div className="h-[120px] w-[120px] rounded-full bg-muted flex items-center justify-center mb-2">
                    <span className="text-4xl text-muted-foreground">?</span>
                  </div>
                )}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-semibold text-foreground">{usuario.name || 'Usuário sem nome'}</span>
                  <span className="text-sm text-muted-foreground">{usuario.email || 'E-mail não informado'}</span>
                  <Badge variant="outline" className="mt-2">Cliente</Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
