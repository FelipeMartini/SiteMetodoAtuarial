import { z } from "zod"

/**
 * Schema de validação para login com credenciais
 * Usado no Credentials Provider para validar email e senha
 */
export const signInSchema = z.object({
  email: z
    .string({ message: "Email é obrigatório" })
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .toLowerCase()
    .trim(),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
})

/**
 * Schema de validação para cadastro de usuário
 * Usado no signup de novos usuários
 */
export const signUpSchema = z.object({
  name: z
    .string({ message: "Nome é obrigatório" })
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  email: z
    .string({ message: "Email é obrigatório" })
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .toLowerCase()
    .trim(),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número"
    ),
  confirmPassword: z
    .string({ message: "Confirmação de senha é obrigatória" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

/**
 * Schema para validação de TOTP/2FA
 */
export const totpSchema = z.object({
  code: z
    .string({ message: "Código TOTP é obrigatório" })
    .min(6, "Código deve ter 6 dígitos")
    .max(6, "Código deve ter 6 dígitos")
    .regex(/^\d{6}$/, "Código deve conter apenas números")
})

/**
 * Tipos derivados dos schemas
 */
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type TotpInput = z.infer<typeof totpSchema>
