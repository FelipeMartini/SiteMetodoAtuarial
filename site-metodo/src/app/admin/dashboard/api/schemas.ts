import { z } from 'zod'

export const usuarioSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  role: z.string().min(1, 'Permissão obrigatória'),
})

export type Usuario = z.infer<typeof usuarioSchema>

export const permissaoSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  descricao: z.string().min(2, 'Descrição obrigatória'),
})

export type Permissao = z.infer<typeof permissaoSchema>
