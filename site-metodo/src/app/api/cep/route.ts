import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cepService } from '@/lib/api/services/cep-simple'
import { getClientIP } from '@/lib/utils/ip'
import { auditService } from '@/lib/audit'

// Request validation schema
const QuerySchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP deve ter formato 00000-000 ou 00000000'),
  provider: z.enum(['viacep', 'brasilapi', 'awesomeapi']).optional(),
  forceRefresh: z
    .string()
    .transform(val => val === 'true')
    .optional(),
})

const BulkQuerySchema = z.object({
  ceps: z.array(z.string().regex(/^\d{5}-?\d{3}$/, 'CEP deve ter formato 00000-000 ou 00000000')),
  provider: z.enum(['viacep', 'brasilapi', 'awesomeapi']).optional(),
})

export async function GET(request: NextRequest) {
  const clientIp = getClientIP(request)
  const { searchParams } = new URL(request.url)

  try {
    // Validate query parameters
    const query = QuerySchema.parse({
      cep: searchParams.get('cep'),
      provider: searchParams.get('provider') || undefined,
      forceRefresh: searchParams.get('forceRefresh') || undefined,
    })

    // Log API access
    await auditService.logApiAccess(
      null, // No user session required for CEP lookup
      'GET',
      '/api/cep',
      clientIp,
      { cep: query.cep, provider: query.provider }
    )

    // Normalize CEP (remove hyphen)
    const normalizedCep = query.cep.replace('-', '')

    // Lookup CEP
    const result = await cepService.lookup(normalizedCep, {
      provider: query.provider,
      forceRefresh: query.forceRefresh,
    })

    if (!result) {
      return NextResponse.json(
        {
          error: 'CEP não encontrado',
          cep: query.cep,
          message: 'O CEP informado não foi encontrado em nossos provedores',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        cep: query.cep,
        provider: query.provider || 'auto',
        timestamp: new Date().toISOString(),
      },
    })
  } catch {
    console.error('CEP lookup error:', String(_error))

    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Parâmetros inválidos',
          details: _error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro ao buscar o CEP. Tente novamente em alguns instantes.',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIP(request)

  try {
    const body = await request.json()

    // Validate request body for bulk lookup
    const data = BulkQuerySchema.parse(body)

    // Log API access
    await auditService.logApiAccess(null, 'POST', '/api/cep', clientIp, {
      cepCount: data.ceps.length,
      provider: data.provider,
      ceps: data.ceps, // Log first few CEPs for audit
    })

    // Normalize CEPs
    const normalizedCeps = data.ceps.map(cep => cep.replace('-', ''))

    // Bulk lookup
    const results = await cepService.bulkLookup(normalizedCeps, {
      provider: data.provider,
    })

    // Process results
    const processedResults = results.map((result, index) => ({
      cep: data.ceps[index],
      success: result !== null,
      data: result,
    }))

    const successCount = processedResults.filter(r => r.success).length
    const failureCount = processedResults.length - successCount

    return NextResponse.json({
      success: true,
      results: processedResults,
      summary: {
        total: data.ceps.length,
        successful: successCount,
        failed: failureCount,
        successRate: ((successCount / data.ceps.length) * 100).toFixed(2) + '%',
      },
      metadata: {
        provider: data.provider || 'auto',
        timestamp: new Date().toISOString(),
        processingTime: Date.now(), // Could be enhanced with actual timing
      },
    })
  } catch {
    console.error('CEP bulk lookup error:', String(_error))

    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados da requisição inválidos',
          details: _error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message:
          'Ocorreu um erro ao processar a busca em lote. Tente novamente em alguns instantes.',
      },
      { status: 500 }
    )
  }
}

// Additional endpoint for CEP validation only
export async function PATCH(request: NextRequest) {
  const clientIp = getClientIP(request)

  try {
    const body = await request.json()

    const schema = z.object({
      cep: z.string(),
    })

    const { cep } = schema.parse(body)

    // Log API access
    await auditService.logApiAccess(null, 'PATCH', '/api/cep', clientIp, {
      cep,
      action: 'validate',
    })

    // Validate CEP format
    const isValid = cepService.isValidCep(cep)
    const normalized = isValid ? cep.replace('-', '') : null

    return NextResponse.json({
      success: true,
      data: {
        cep: cep,
        valid: isValid,
        normalized: normalized,
        formatted: normalized ? `${normalized.slice(0, 5)}-${normalized.slice(5)}` : null,
      },
      timestamp: new Date().toISOString(),
    })
  } catch {
    console.error('CEP validation error:', String(_error))

    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados da requisição inválidos',
          details: _error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
