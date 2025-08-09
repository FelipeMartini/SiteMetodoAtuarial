"use client";
// Página de criação de conta utilizando componente de formulário moderno
import React from 'react';
import Link from 'next/link';
import SocialLoginBox from '@/components/SocialLoginBox';
import { FormularioCriarConta } from '@/components/auth/FormularioCriarConta';

export default function CriarContaPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl w-full items-center">
        {/* Seção do formulário */}
        <div className="bg-card text-card-foreground p-8 rounded-lg border border-border shadow-md">
          <h1 className="text-3xl font-bold text-center mb-2">Criar Conta</h1>
            <p className="text-base text-muted-foreground text-center mb-8 leading-relaxed">
              Preencha os dados abaixo para criar sua conta ou use uma das opções de login social
            </p>
            <FormularioCriarConta />
            <div className="text-center mt-6">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary underline hover:text-primary/90">Faça login</Link>
            </div>
        </div>
        {/* Seção do login social */}
        <div>
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">ou crie usando</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <SocialLoginBox showTitle={false} />
        </div>
      </div>
    </div>
  )
}
