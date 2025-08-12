import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { exchangeService } from '@/lib/api/services/exchange-simple'
import { getClientIP } from '@/lib/utils/ip'
import { auditService } from '@/lib/audit'

// Request validation schemas
const RateQuerySchema = z.object({
  from: z.string().length(3).toUpperCase(),
  to: z.string().length(3).toUpperCase(),
  amount: z
    .string()
    .transform(val => parseFloat(val))
    .optional(),
  provider: z.enum(['exchangerate-api', 'awesomeapi']).optional(),
  forceRefresh: z
    .string()
    .transform(val => val === 'true')
    .optional(),
})

const ConvertRequestSchema = z.object({
  from: z.string().length(3),
  to: z.string().length(3),
  amount: z.number().positive(),
  provider: z.enum(['exchangerate-api', 'awesomeapi']).optional(),
})

const TrendRequestSchema = z.object({
  currency: z.string().length(3),
  days: z.number().int().min(1).max(365).optional().default(30),
})

type ConvertRequest = z.infer<typeof ConvertRequestSchema>

interface ExchangeApiResponse {
  success: boolean
  data: {
    from: string
    to: string
    rate: number
    amount?: number
    convertedAmount?: number
    timestamp: string
    provider: string
  }
  metadata?: Record<string, unknown>
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIP(request)
  const { searchParams } = new URL(request.url)

  try {
    // Check for special endpoints
    const action = searchParams.get('action')

    if (action === 'rates') {
      return await handleGetRates(request, clientIp)
    }

    if (action === 'trends') {
      return await handleGetTrends(request, clientIp)
    }

    // Default: Get exchange rate
    const query = RateQuerySchema.parse({
      from: searchParams.get('from') || 'USD',
      to: searchParams.get('to') || 'BRL',
      amount: searchParams.get('amount') || undefined,
      provider: searchParams.get('provider') || undefined,
      forceRefresh: searchParams.get('forceRefresh') || undefined,
    })

    // Log API access
    await auditService.logApiAccess(null, 'GET', '/api/exchange', clientIp, {
      from: query.from,
      to: query.to,
      provider: query.provider,
    })

    // Get exchange rate
    const rate = await exchangeService.getRate(query.from, query.to, {
      provider: query.provider,
      forceRefresh: query.forceRefresh,
    })

    if (!rate) {
      return NextResponse.json(
        {
          error: 'Taxa de câmbio não encontrada',
          from: query.from,
          to: query.to,
          message: `Não foi possível obter a taxa de câmbio de ${query.from} para ${query.to}`,
        },
        { status: 404 }
      )
    }

    const response: ExchangeApiResponse = {
      success: true,
      data: {
        from: query.from,
        to: query.to,
        rate: rate,
        timestamp: new Date().toISOString(),
        provider: 'exchange-api.fxratesapi.com',
      },
    }

    // Add conversion if amount was provided
    if (query.amount) {
      response.data.amount = query.amount
      response.data.convertedAmount = query.amount * rate
      response.metadata = {
        formatted: {
          amount: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: query.from,
          }).format(query.amount),
          converted: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: query.to,
          }).format(query.amount * rate),
        }
      }
    }

    return NextResponse.json(response)
  } catch (_error) {
    console.error('Exchange rate error:', String(_error))

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
        message:
          'Ocorreu um erro ao buscar as taxas de câmbio. Tente novamente em alguns instantes.',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIP(request)

  try {
    const body = await request.json()
    const action = body.action

    if (action === 'convert') {
      return await handleConversion(body, clientIp)
    }

    if (action === 'batch-convert') {
      return await handleBatchConversion(body, clientIp)
    }

    return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 })
  } catch (_error) {
    console.error('Exchange POST error:', String(_error))

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

// Handler functions
async function handleGetRates(request: NextRequest, clientIp: string) {
  const { searchParams } = new URL(request.url)
  const base = searchParams.get('base') || 'USD'

  await auditService.logApiAccess(null, 'GET', '/api/exchange?action=rates', clientIp, {
    base,
    action: 'rates',
  })

  // Get rates for common currencies
  const commonCurrencies = ['BRL', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']
  const rates: Record<string, number> = {}

  const results = await Promise.allSettled(
    commonCurrencies
      .filter(curr => curr !== base)
      .map(async currency => {
        const rate = await exchangeService.getRate(base, currency)
        return { currency, rate }
      })
  )

  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value.rate) {
      rates[result.value.currency] = result.value.rate
    }
  })

  return NextResponse.json({
    success: true,
    data: {
      base,
      rates,
      timestamp: new Date().toISOString(),
      count: Object.keys(rates).length,
    },
  })
}

async function handleGetTrends(request: NextRequest, clientIp: string) {
  const { searchParams } = new URL(request.url)

  const query = TrendRequestSchema.parse({
    currency: searchParams.get('currency') || 'USD',
    days: parseInt(searchParams.get('days') || '30'),
  })

  await auditService.logApiAccess(null, 'GET', '/api/exchange?action=trends', clientIp, {
    currency: query.currency,
    days: query.days,
  })

  const trends = await exchangeService.getTrends(query.currency, query.days)

  return NextResponse.json({
    success: true,
    data: {
      currency: query.currency,
      base: 'BRL',
      period: {
        days: query.days,
        from: new Date(Date.now() - query.days * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString(),
      },
      trends,
      timestamp: new Date().toISOString(),
    },
  })
}

async function handleConversion(body: ConvertRequest, clientIp: string) {
  const data = ConvertRequestSchema.parse(body)

  await auditService.logApiAccess(null, 'POST', '/api/exchange', clientIp, {
    action: 'convert',
    from: data.from,
    to: data.to,
    amount: data.amount,
  })

  const result = await exchangeService.convert(data.amount, data.from, data.to, {
    provider: data.provider,
  })

  if (!result) {
    return NextResponse.json(
      {
        error: 'Conversão não disponível',
        message: `Não foi possível converter de ${data.from} para ${data.to}`,
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      ...result,
      formatted: {
        amount: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: data.from,
        }).format(data.amount),
        converted: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: data.to,
        }).format(result.converted),
      },
      timestamp: new Date().toISOString(),
    },
  })
}

async function handleBatchConversion(
  body: { conversions: ConvertRequest[]; provider?: 'exchangerate-api' | 'awesomeapi' },
  clientIp: string
) {
  const schema = z.object({
    conversions: z.array(ConvertRequestSchema),
    provider: z.enum(['exchangerate-api', 'awesomeapi']).optional(),
  })

  const data = schema.parse(body)

  await auditService.logApiAccess(null, 'POST', '/api/exchange', clientIp, {
    action: 'batch-convert',
    count: data.conversions.length,
    provider: data.provider,
  })

  const results = await Promise.allSettled(
    data.conversions.map(async conversion => {
      const result = await exchangeService.convert(
        conversion.amount,
        conversion.from,
        conversion.to,
        { provider: data.provider || conversion.provider }
      )

      return {
        input: conversion,
        success: result !== null,
        data: result,
      }
    })
  )

  const processedResults = results.map(result =>
    result.status === 'fulfilled'
      ? result.value
      : {
          input: null,
          success: false,
          data: null,
          error: 'Conversion failed',
        }
  )

  const successCount = processedResults.filter(r => r.success).length

  return NextResponse.json({
    success: true,
    results: processedResults,
    summary: {
      total: data.conversions.length,
      successful: successCount,
      failed: data.conversions.length - successCount,
      successRate: ((successCount / data.conversions.length) * 100).toFixed(2) + '%',
    },
    timestamp: new Date().toISOString(),
  })
}
