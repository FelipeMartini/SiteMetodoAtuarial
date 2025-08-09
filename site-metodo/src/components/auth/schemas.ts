// use client
// Schemas Zod compartilhados para formulários de autenticação / registro
import { z } from 'zod'

// Regras básicas de senha (pode evoluir depois para exigir variedade de caracteres)
export const senhaSchema = z.string()
  .min(6, 'Senha deve ter pelo menos 6 caracteres')
  .max(128, 'Senha muito longa')

export const registerSchema = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(120, 'Nome muito longo'),
  email: z.string().trim().toLowerCase().email('Email inválido').max(120, 'Email muito longo'),
  senha: senhaSchema,
  confirmarSenha: senhaSchema
}).refine(d => d.senha === d.confirmarSenha, {
  path: ['confirmarSenha'],
  message: 'As senhas não coincidem'
})

export type RegisterFormData = z.infer<typeof registerSchema>
