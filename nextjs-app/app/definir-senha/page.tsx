
"use client";

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputTexto } from '../design-system/InputTexto';
import { Botao } from '../design-system/Botao';
import { ThemeProvider } from '../contexts/ThemeContext';

/**
 * Página para usuários sociais definirem uma senha para login tradicional
 * Permite criar/atualizar senha caso o usuário tenha sido criado via Google/Apple
 */
const DefinirSenhaPage: React.FC = () => {
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.');
      return;
    }
    // Chamada para API que atualiza a senha do usuário logado
    try {
      const res = await fetch('/api/usuario/definir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      });
      if (res.ok) {
        setSucesso('Senha definida com sucesso! Você já pode acessar pelo login tradicional.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setErro('Erro ao definir senha. Tente novamente.');
      }
    } catch {
      setErro('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <ThemeProvider>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: 24 }}>Definir senha</h2>
        <InputTexto label="Nova senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
        <InputTexto label="Confirme a senha" type="password" value={confirmacao} onChange={e => setConfirmacao(e.target.value)} required />
        {erro && <div style={{ color: '#d32f2f', marginTop: 12 }}>{erro}</div>}
        {sucesso && <div style={{ color: '#388e3c', marginTop: 12 }}>{sucesso}</div>}
        <div style={{ marginTop: 24, width: '100%' }}>
          <Botao type="submit">Definir senha</Botao>
        </div>
      </form>
    </ThemeProvider>
  );
};

export default DefinirSenhaPage;

// Comentário: Esta página permite que usuários sociais criem uma senha para login tradicional. O endpoint /api/usuario/definir-senha deve validar o usuário logado e atualizar o campo password no banco de dados.
