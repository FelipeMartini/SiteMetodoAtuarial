import { z } from 'zod'

export const usuarioSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  roleType: z.string().min(3),
})

export const usuarioUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  roleType: z.string().min(3).optional(),
})
