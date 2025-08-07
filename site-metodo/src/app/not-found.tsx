"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-6xl font-bold mb-4 text-destructive">404</h1>
      <p className="text-lg text-muted-foreground mb-8">Página não encontrada.</p>
      <Link href="/">
        <Button variant="outline" size="lg">
          Voltar para o início
        </Button>
      </Link>
    </div>
  );
}
