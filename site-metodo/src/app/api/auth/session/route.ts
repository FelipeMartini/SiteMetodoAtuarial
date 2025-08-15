import { NextResponse, NextRequest } from 'next/server'
import { auth, handlers } from '@/lib/auth'
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro'

// Diagnostic wrapper: recebe o NextRequest para inspecionar headers/cookies
export async function GET(request: NextRequest) {
  try {
  // Log headers and cookies to diagnose missing session cookie
  try { console.log('[session-route] request.headers.cookie:', String(request.headers.get('cookie'))) } catch (e) { console.warn('[session-route] failed to read cookies', String(e)) }

    // Primeiro tente delegar ao handler oficial do NextAuth, preservando cookies
    try {
      // Chamar diretamente com o NextRequest original pois handlers.GET espera req.nextUrl
      const authResp: any = await handlers.GET(request as any)
      if (authResp && typeof authResp.json === 'function') {
        const status = authResp.status
        let payload: any = null
        try { payload = await authResp.json() } catch (e) { console.warn('[session-route] failed to parse authResp.json()', String(e)) }
        console.log('[session-route] handlers.GET -> status:', status, 'payloadKeys:', payload ? Object.keys(payload) : null)
        // se o handler retornou 200 e payload.user, usar essa sessão
        if (status === 200 && payload?.user) {
          const session = { user: payload.user }
          if (request) {
            console.log('[session-route] got session from handlers.GET for user:', payload.user?.email || payload.user?.id)
          }
          (request as any)._sessionFromAuth = session
        } else {
          console.warn('[session-route] handlers.GET did not return an authenticated session', { status, payload })
        }
      }
    } catch (err) {
      console.warn('[session-route] handlers.GET delegation failed', String(err))
    }

    // fallback: call compatibility auth() helper
    const session = (request as any)._sessionFromAuth || await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Preferir o email como subject. Do NOT use user:{id} as subject; the
    // enforcer now enforces email-only policies. If no email is present,
    // treat as unauthenticated for ABAC purposes.
    const subject = session.user?.email ? String(session.user.email) : ''
    const hasPermission = await checkABACPermission(
      subject,
      'session:read',
      'read',
      {
        time: new Date().toISOString(),
        location: session.user.location || 'unknown',
        department: session.user.department || 'unknown',
        ip: 'session-check'
      }
    )
    // Dev fallback behavior is now configurable via ABAC_ALLOW_DEV_FALLBACK.
    // Set to 'true' to keep the old permissive behavior in development.
    const allowDevFallback = String(process.env.ABAC_ALLOW_DEV_FALLBACK || 'true') === 'true'

    if (!hasPermission.allowed) {
      if (process.env.NODE_ENV !== 'production' && allowDevFallback) {
        console.warn('ABAC denied session:read but ABAC_ALLOW_DEV_FALLBACK=true; allowing for dev', { subject })
      } else {
        return NextResponse.json(
          { error: 'Acesso negado pelo sistema ABAC' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          department: session.user.department,
          location: session.user.location,
          jobTitle: session.user.jobTitle,
          isActive: session.user.isActive,
          validFrom: session.user.validFrom,
          validUntil: session.user.validUntil
        },
        abac: {
          enabled: true,
          permission: hasPermission,
          context: hasPermission.context
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao obter sessão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
