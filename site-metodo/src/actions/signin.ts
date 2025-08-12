'use server'

import { redirect } from 'next/navigation'
import { signIn } from '../../auth'

/**
 * Server action for credentials sign in with Auth.js v5 - ESTRATÉGIA HÍBRIDA
 * Agora funciona com JWT sessions para resolver o bug do Credentials + Database Sessions
 */
export type SignInCredentialsResult =
  | {
      status: 'error'
      errorMessage: string
    }
  | undefined

export async function signInCredentials(
  previousState: SignInCredentialsResult | null,
  formData: FormData
): Promise<SignInCredentialsResult> {
  try {
    const email = formData.get('email')
    const password = formData.get('password')

    if (!email || !password) {
      return {
        status: 'error',
        errorMessage: 'Email e senha são obrigatórios',
      }
    }

    console.log('[SignIn] Tentando login credentials para:', email)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    console.log('[SignIn] Resultado do login credentials:', result)

    if (!result) {
      return {
        status: 'error',
        errorMessage: 'Falha na autenticação. Verifique suas credenciais.',
      }
    }
  } catch {
    console.error('[SignIn] Erro na autenticação credentials:', "Unknown error")

    // Melhor tratamento de erro para Auth.js v5
    if (_error instanceof Error) {
      if (_error.message.includes('CredentialsSignin')) {
        return {
          status: 'error',
          errorMessage: 'Email ou senha incorretos.',
        }
      }
      if (_error.message.includes('CallbackRouteError')) {
        return {
          status: 'error',
          errorMessage: 'Erro no processamento do login. Tente novamente.',
        }
      }
    }

    return {
      status: 'error',
      errorMessage: 'Falha na autenticação. Verifique suas credenciais.',
    }
  }

  redirect('/area-cliente')
}

/**
 * Server action for OAuth sign in with Auth.js v5 - ESTRATÉGIA HÍBRIDA
 * OAuth providers agora usam database sessions e funcionam perfeitamente
 */
export async function signInOAuth({ providerId }: { providerId: string }) {
  try {
    console.log('[SignIn] Tentando login OAuth com provider:', providerId)

    // Validar provider ID - agora com 4 providers
    const allowedProviders = ['google', 'github', 'facebook', 'discord']
    if (!allowedProviders.includes(providerId)) {
      console.error('[SignIn] Provider não suportado:', providerId)
      return {
        status: 'error',
        errorMessage: 'Provider não suportado',
      } as const
    }

    // Verificar se o provider está configurado
    const providerConfigs = {
      google: process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
      github:
        process.env.AUTH_GITHUB_ID &&
        process.env.AUTH_GITHUB_SECRET &&
        process.env.AUTH_GITHUB_ID !== 'github_client_id_placeholder',
      facebook:
        process.env.AUTH_FACEBOOK_ID &&
        process.env.AUTH_FACEBOOK_SECRET &&
        process.env.AUTH_FACEBOOK_ID !== 'facebook_app_id_placeholder',
      discord:
        process.env.AUTH_DISCORD_ID &&
        process.env.AUTH_DISCORD_SECRET &&
        process.env.AUTH_DISCORD_ID !== 'discord_client_id_placeholder',
    }

    if (!providerConfigs[providerId as keyof typeof providerConfigs]) {
      console.error('[SignIn] Provider não configurado:', providerId)
      return {
        status: 'error',
        errorMessage: `${providerId} não está configurado. Entre em contato com o administrador.`,
      } as const
    }

    const redirectUrl = await signIn(providerId, {
      redirect: false,
      callbackUrl: '/area-cliente',
    })

    console.log('[SignIn] URL de redirecionamento OAuth:', redirectUrl)

    if (!redirectUrl) {
      return {
        status: 'error',
        errorMessage: 'Falha no login, URL de redirecionamento não encontrada',
      } as const
    }

    redirect(redirectUrl)
  } catch {
    // O redirect() do Next.js gera uma exceção NEXT_REDIRECT que é normal
    if (_error instanceof Error && _error.message === 'NEXT_REDIRECT') {
      // Este é o comportamento esperado, não é um erro real
      throw _error // Re-throw para permitir o redirect
    }

    console.error('[SignIn] Erro na autenticação OAuth:', "Unknown error")

    // Melhor tratamento de erro para OAuth
    if (_error instanceof Error) {
      if (_error.message.includes('OAuthSignin')) {
        return {
          status: 'error',
          errorMessage: 'Erro na autenticação OAuth. Tente novamente.',
        } as const
      }
      if (_error.message.includes('OAuthCallback')) {
        return {
          status: 'error',
          errorMessage: 'Erro no callback OAuth. Verifique a configuração.',
        } as const
      }
    }

    return {
      status: 'error',
      errorMessage: 'Falha no login OAuth',
    } as const
  }
}

/**
 * Server action for email sign in with Auth.js v5
 * (Mantido para compatibilidade, mas não implementado no auth.ts atual)
 */
export type SignInEmailResult =
  | {
      status: 'error'
      errorMessage: string
    }
  | undefined

export async function signInEmail(
  previousState: SignInEmailResult | null,
  formData: FormData
): Promise<SignInEmailResult> {
  try {
    const email = formData.get('email')

    if (!email) {
      return {
        status: 'error',
        errorMessage: 'Email é obrigatório',
      }
    }

    console.log('[SignIn] Tentando login por email para:', email)

    const redirectUrl = await signIn('email', {
      redirect: false,
      email,
    })

    if (!redirectUrl) {
      return {
        status: 'error',
        errorMessage: 'Falha no envio do email de login',
      }
    }
  } catch {
    console.error('[SignIn] Erro no login por email:', "Unknown error")
    return {
      status: 'error',
      errorMessage: 'Falha no envio do email de login',
    }
  }

  redirect('/verify-request')
}
