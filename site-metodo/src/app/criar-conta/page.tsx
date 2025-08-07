/**
 * Página de Criação de Conta
 * Permite criar nova conta com email/senha ou usando provedores sociais
 */
'use client';

import React from 'react';
import Link from 'next/link';
import SocialLoginBox from '@/components/SocialLoginBox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


export default function CriarContaPage() {
  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [mensagem, setMensagem] = React.useState<{ texto: string; tipo: 'erro' | 'sucesso' } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem(null);
    try {
      if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
        throw new Error('Todos os campos são obrigatórios');
      }
      if (formData.senha !== formData.confirmarSenha) {
        throw new Error('As senhas não coincidem');
      }
      if (formData.senha.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          password: formData.senha,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }
      setMensagem({ texto: 'Conta criada com sucesso! Você pode fazer login agora.', tipo: 'sucesso' });
      setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });
    } catch (error) {
      setMensagem({ texto: error instanceof Error ? error.message : 'Erro inesperado', tipo: 'erro' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl w-full items-center">
        {/* Seção do formulário */}
        <div className="bg-card text-card-foreground p-8 rounded-lg border border-border shadow-md">
          <h1 className="text-3xl font-bold text-center mb-2">Criar Conta</h1>
          <p className="text-base text-muted-foreground text-center mb-8 leading-relaxed">
            Preencha os dados abaixo para criar sua conta ou use uma das opções de login social
          </p>
          {mensagem && (
            <div className={`text-sm text-center mb-4 rounded p-2 ${mensagem.tipo === 'erro' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
              {mensagem.texto}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Digite sua senha (mín. 6 caracteres)"
                value={formData.senha}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmarSenha">Confirmar senha</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
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
  );
}
