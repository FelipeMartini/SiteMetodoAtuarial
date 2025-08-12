import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  department: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional()
})

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

export type RegisterData = z.infer<typeof RegisterSchema>
export type LoginData = z.infer<typeof LoginSchema>
