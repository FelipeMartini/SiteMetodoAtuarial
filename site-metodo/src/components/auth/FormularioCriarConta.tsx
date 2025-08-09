"use client"
// Componente reutilizável de formulário de criação de conta com react-hook-form + zod
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from './schemas'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { calcularForcaSenha } from '@/utils/passwordStrength'
import { AuthErrorCode, mensagemAmigavel } from '@/utils/authErrors'
import { useRegistrarUsuario } from '@/hooks/useRegistrarUsuario'
import { cn } from '@/utils/cn'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

interface Props { onSucessoAutoLogin?: () => void }

export const FormularioCriarConta: React.FC<Props> = ({ onSucessoAutoLogin }) => {
  const { mutateAsync, isPending } = useRegistrarUsuario()
  const [mensagem, setMensagem] = React.useState<{ tipo: 'erro' | 'sucesso'; texto: string }|null>(null)
  const [mostrarSenha, setMostrarSenha] = React.useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = React.useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setFocus } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit'
  })

  const senhaValue = watch('senha') || ''
  const forca = calcularForcaSenha(senhaValue)

  const onSubmit = async (data: RegisterFormData) => {
    setMensagem(null)
    const payload = { nome: data.nome.trim(), email: data.email.trim().toLowerCase(), senha: data.senha }
    console.info('[registro] iniciando', { email: payload.email })
    const result = await mutateAsync(payload)
    if (!result.ok) {
      console.info('[registro] falha', result)
      const msg = mensagemAmigavel(result.errorCode, result.mensagem)
      setMensagem({ tipo: 'erro', texto: msg })
      if (result.errorCode === AuthErrorCode.EMAIL_JA_EXISTE) setFocus('email')
      return
    }
    setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Efetuando login...' })
    try {
      // Auto login manual via POST para rota de credentials (degradação caso SDK não esteja disponível)
      const form = new FormData()
      form.append('email', payload.email)
      form.append('password', payload.senha)
      const resp = await fetch('/api/auth/callback/credentials', { method: 'POST', body: form })
      if (resp.ok) {
        console.info('[registro] auto login ok')
        onSucessoAutoLogin?.()
        window.location.replace('/area-cliente')
      } else {
        console.warn('[registro] auto login falhou', resp.status)
      }
    } catch(e) {
      console.warn('[registro] auto login erro', e)
    }
  }

  React.useEffect(()=> {
    const keys: (keyof RegisterFormData)[] = ['nome','email','senha','confirmarSenha']
    for (const k of keys) { if (errors[k]) { setFocus(k); break } }
  }, [errors, setFocus])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {mensagem && (
        <div className={cn('text-sm text-center rounded p-2 border', mensagem.tipo==='erro' ? 'bg-red-100 text-red-700 border-red-300':'bg-green-100 text-green-700 border-green-300')}>{mensagem.texto}</div>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome completo</Label>
        <Input id="nome" type="text" placeholder="Digite seu nome" aria-invalid={!!errors.nome} aria-describedby={errors.nome? 'erro-nome': undefined} {...register('nome')} />
        {errors.nome && <p id="erro-nome" className="text-xs text-red-600">{errors.nome.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="voce@exemplo.com" aria-invalid={!!errors.email} aria-describedby={errors.email? 'erro-email': undefined} {...register('email')} />
        {errors.email && <p id="erro-email" className="text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="senha">Senha</Label>
        <div className="relative">
          <Input id="senha" type={mostrarSenha? 'text':'password'} placeholder="Senha" aria-invalid={!!errors.senha} aria-describedby={errors.senha? 'erro-senha': 'forca-senha'} {...register('senha')} />
          <button type="button" onClick={()=> setMostrarSenha(v=>!v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={mostrarSenha? 'Ocultar senha':'Mostrar senha'}>{mostrarSenha? <EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4" />}</button>
        </div>
        <div className="h-1 bg-muted rounded overflow-hidden" aria-hidden>
          <div className={cn('h-full transition-all', {
            'w-1/5 bg-red-500': forca.score === 0,
            'w-2/5 bg-orange-500': forca.score === 1,
            'w-3/5 bg-yellow-500': forca.score === 2,
            'w-4/5 bg-green-500': forca.score === 3,
            'w-full bg-emerald-600': forca.score >=4
          })} />
        </div>
        <p id="forca-senha" className="text-xs text-muted-foreground">Força: {forca.label}</p>
        {errors.senha && <p id="erro-senha" className="text-xs text-red-600">{errors.senha.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmarSenha">Confirmar senha</Label>
        <div className="relative">
          <Input id="confirmarSenha" type={mostrarConfirmar? 'text':'password'} placeholder="Repita a senha" aria-invalid={!!errors.confirmarSenha} aria-describedby={errors.confirmarSenha? 'erro-confirmar': undefined} {...register('confirmarSenha')} />
          <button type="button" onClick={()=> setMostrarConfirmar(v=>!v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={mostrarConfirmar? 'Ocultar senha':'Mostrar senha'}>{mostrarConfirmar? <EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4" />}</button>
        </div>
        {errors.confirmarSenha && <p id="erro-confirmar" className="text-xs text-red-600">{errors.confirmarSenha.message}</p>}
      </div>
      <Button type="submit" className="w-full mt-2" disabled={isSubmitting || isPending} aria-disabled={isSubmitting || isPending}>
        {(isSubmitting || isPending) ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Criando conta...</span> : 'Criar conta'}
      </Button>
    </form>
  )
}
