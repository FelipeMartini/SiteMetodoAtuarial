'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Página para usuários sociais definirem uma senha para login tradicional
 * Permite criar/atualizar senha caso o usuário tenha sido criado via Google/Apple
 */
const DefinirSenhaPage: React.FC = () => {
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.')
      return
    }
    // Chamada para API que atualiza a senha do usuário logado
    try {
      const res = await fetch('/api/usuario/definir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })
      if (res.ok) {
        setSucesso('Senha definida com sucesso! Você já pode acessar pelo login tradicional.')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setErro('Erro ao definir senha. Tente novamente.')
      }
    } catch {
      setErro('Erro inesperado. Tente novamente.')
    }
  }

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center py-8 px-4'>
      <div className='w-full max-w-md mx-auto'>
        <form
          onSubmit={handleSubmit}
          className='bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm space-y-6'
        >
          <h2 className='text-2xl font-bold text-center text-foreground mb-6'>Definir senha</h2>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='senha'>Nova senha</Label>
              <Input
                id='senha'
                type='password'
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                autoComplete='new-password'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmacao'>Confirme a senha</Label>
              <Input
                id='confirmacao'
                type='password'
                value={confirmacao}
                onChange={e => setConfirmacao(e.target.value)}
                required
                autoComplete='new-password'
              />
            </div>
          </div>
          {erro && <div className='text-destructive text-sm mt-3'>{erro}</div>}
          {sucesso && <div className='text-success text-sm mt-3'>{sucesso}</div>}
          <Button type='submit' className='w-full mt-4'>
            Definir senha
          </Button>
        </form>
      </div>
    </div>
  )
}

export default DefinirSenhaPage

// Comentário: Esta página permite que usuários sociais criem uma senha para login tradicional. O endpoint /api/usuario/definir-senha deve validar o usuário logado e atualizar o campo password no banco de dados.
