import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { createPushNotificationService, PushConfig } from '../../../../lib/notifications/push-service'
import { simpleLogger } from '@/lib/simple-logger'
import { auditService } from '@/lib/audit'
import { getClientIP } from '@/lib/utils/ip'
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro'

/**
 * API para Push Notifications
 * POST /api/notifications/push/subscribe - Registra subscription
 * DELETE /api/notifications/push/unsubscribe - Remove subscription
 * POST /api/notifications/push/test - Testa push notification
 */

// Configuração do Push Service (em produção, usar variáveis de ambiente)
const pushConfig: PushConfig = {
  vapidPublicKey:
    process.env.VAPID_PUBLIC_KEY ||
    'BEl62iUYgUivxIkv69yViEuiBIa40HI2BN4EMYaRJifrJbRGCLxs9vPO4LvKL5u8Y-E_7V7Z1Y4pZ9dRLJhTQOY',
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || 'aT9ZTQfJwdW8fHpGt9G7r9z7G7tBKtGp3CdwJkGhZZY',
  vapidEmail: process.env.VAPID_SUBJECT || 'mailto:felipe@metodoatuarial.com',
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const clientIp = getClientIP(request)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { action, subscription } = body

    const pushService = createPushNotificationService(pushConfig)

    switch (action) {
      case 'subscribe':
        if (!subscription || !subscription.endpoint || !subscription.keys) {
          return NextResponse.json({ error: 'Dados de subscription inválidos' }, { status: 400 })
        }

        const subscriptionId = await pushService.registerSubscription(
          session.user.id,
          subscription,
          request.headers.get('user-agent') || undefined
        )

        // Log do registro
        await auditService.logApiAccess(
          session.user.id,
          'POST',
          '/api/notifications/push',
          clientIp,
          { action: 'subscribe', subscriptionId }
        )

        return NextResponse.json({
          success: true,
          data: { subscriptionId },
        })

      case 'test':
        const testResult = await pushService.testPushNotification(session.user.id)

        // Log do teste
        await auditService.logApiAccess(
          session.user.id,
          'POST',
          '/api/notifications/push',
          clientIp,
          { action: 'test', success: testResult }
        )

        return NextResponse.json({
          success: testResult,
          message: testResult
            ? 'Notificação de teste enviada'
            : 'Falha ao enviar notificação de teste',
        })

      default:
        return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
    }
  } catch (_error) {
    simpleLogger.error('Erro na API de push notifications', { error: _error })
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    const clientIp = getClientIP(request)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { endpoint } = body

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint é obrigatório' }, { status: 400 })
    }

    const pushService = createPushNotificationService(pushConfig)
    await pushService.unregisterSubscription(endpoint)

    // Log da remoção
    await auditService.logApiAccess(
      session.user.id,
      'DELETE',
      '/api/notifications/push',
      clientIp,
      { endpoint: endpoint.substring(0, 50) + '...' } // Log parcial por segurança
    )

    return NextResponse.json({
      success: true,
      message: 'Subscription removida com sucesso',
    })
  } catch (_error) {
    simpleLogger.error('Erro ao remover push subscription', { error: _error })
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    // const clientIp = getClientIP(request); // Removido: não utilizado

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    const pushService = createPushNotificationService(pushConfig)

    switch (action) {
      case 'config':
        // Retorna configuração pública para o cliente
        return NextResponse.json({
          success: true,
          data: {
            vapidPublicKey: pushConfig.vapidPublicKey,
            isSupported: true,
          },
        })

      case 'subscriptions':
        const subscriptions = await pushService.getUserSubscriptions(session.user.id)
        return NextResponse.json({
          success: true,
          data: { subscriptions },
        })

      case 'stats':
        // Verificar permissão ABAC para visualizar estatísticas
        const hasStatsPermission = await checkABACPermission(
          session.user.email || '',
          'resource:notifications:stats',
          'read',
          {
            department: session.user.department || '',
            location: session.user.location || '',
            jobTitle: session.user.jobTitle || '',
            timestamp: new Date()
          }
        )
        
        if (!hasStatsPermission.allowed) {
          return NextResponse.json({ error: 'Permissão insuficiente' }, { status: 403 })
        }

        const stats = await pushService.getStats()
        return NextResponse.json({
          success: true,
          data: stats,
        })

      default:
        return NextResponse.json({ error: 'Ação não especificada' }, { status: 400 })
    }
  } catch (_error) {
    simpleLogger.error('Erro ao obter dados de push notifications', { error: _error })
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
