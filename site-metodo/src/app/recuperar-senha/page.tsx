/**
 * Página de Recuperação de Senha - Modernizada
 * Sistema completo de recuperação de senha com interface responsiva
 */
'use client';
import Link from 'next/link';

import React, { useState } from 'react';
// import { useTema } from '../contexts/ThemeContext'; // Removido para evitar warning


import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'enviando' | 'sucesso' | 'erro'>('idle');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('enviando');
    setMensagem('');
    try {
      // Simulação de chamada de API
      await new Promise(res => setTimeout(res, 1200));
      setStatus('sucesso');
      setMensagem('Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.');
    } catch {
      setStatus('erro');
      setMensagem('Erro ao enviar email. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-card text-card-foreground rounded-lg border border-border shadow-lg p-8 text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4a4 4 0 01-8 0v-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Recuperar Senha</h1>
          <p className="text-base text-muted-foreground mb-4">Informe seu email para receber instruções de redefinição de senha.</p>
        </div>
        {mensagem && (
          <div className={`text-sm mb-4 rounded p-2 ${status === 'erro' ? 'bg-red-100 text-red-700 border border-red-300' : status === 'sucesso' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-primary/10 text-primary border border-primary/20'}`}>
            {mensagem}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-4">
          <div className="flex flex-col gap-2 text-left">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Digite seu email"
              disabled={status === 'enviando'}
            />
          </div>
          <Button type="submit" className="w-full" disabled={status === 'enviando'}>
            {status === 'enviando' ? 'Enviando...' : 'Enviar instruções'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-primary underline text-sm hover:text-primary/90">Voltar para login</Link>
        </div>
      </div>
    </div>
  );
}
