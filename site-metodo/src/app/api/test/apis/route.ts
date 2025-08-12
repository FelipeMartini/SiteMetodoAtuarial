import { NextRequest, NextResponse } from 'next/server'
import { ApiTestHelper } from '@/lib/api/test-helper'
import { getClientIP } from '@/lib/utils/ip'
import { auditService } from '@/lib/audit'

export async function GET(request: NextRequest) {
  const clientIp = getClientIP(request)
  const { searchParams } = new URL(request.url)
  const testType = searchParams.get('type') || 'all'

  try {
    // Log da requisição de teste
    await auditService.logApiAccess(null, 'GET', '/api/test/apis', clientIp, { testType })

    console.log(`🧪 Iniciando teste de APIs: ${testType}`)

    let results: Record<string, unknown> = {}

    switch (testType) {
      case 'cep':
        results = await ApiTestHelper.testCepService()
        break

      case 'exchange':
        results = await ApiTestHelper.testExchangeService()
        break

      case 'monitoring':
        results = await ApiTestHelper.testMonitoring()
        break

      case 'all':
      default:
        results = await ApiTestHelper.runAllTests()
        break
    }

    return NextResponse.json({
      success: true,
      testType,
      results,
      timestamp: new Date().toISOString(),
      message: `Teste ${testType} executado com sucesso`,
    })
  } catch (_error) {
    console.error('Erro durante teste de APIs:', String(_error))

    return NextResponse.json(
      {
        error: 'Erro durante execução dos testes',
        testType,
        details: _error instanceof Error ? _error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIP(request)

  try {
    const body = await request.json()
    const { action, ...params } = body

    await auditService.logApiAccess(null, 'POST', '/api/test/apis', clientIp, { action, params })

    switch (action) {
      case 'test-cep':
        const cepResult = await ApiTestHelper.testCepService()
        return NextResponse.json({
          success: true,
          action,
          results: cepResult,
          timestamp: new Date().toISOString(),
        })

      case 'test-exchange':
        const exchangeResult = await ApiTestHelper.testExchangeService()
        return NextResponse.json({
          success: true,
          action,
          results: exchangeResult,
          timestamp: new Date().toISOString(),
        })

      case 'test-monitoring':
        const monitoringResult = await ApiTestHelper.testMonitoring()
        return NextResponse.json({
          success: true,
          action,
          results: monitoringResult,
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json(
          {
            error: 'Ação não suportada',
            supportedActions: ['test-cep', 'test-exchange', 'test-monitoring'],
          },
          { status: 400 }
        )
    }
  } catch (_error) {
    console.error('Erro durante teste POST:', String(_error))

    return NextResponse.json(
      {
        error: 'Erro durante execução do teste',
        details: _error instanceof Error ? _error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
