import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Schema para validação do upload
const UploadSchema = z.object({
  tipoImportacao: z.enum(['MASSA_PARTICIPANTES', 'OBITOS', 'COMPLETO']),
  sobrescreverExistentes: z.boolean().default(false),
  validarDados: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('arquivo') as File
    const config = formData.get('config') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Validação do tipo de arquivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado. Use Excel (.xlsx, .xls) ou CSV' },
        { status: 400 }
      )
    }

    // Validação do tamanho (máximo 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 50MB' },
        { status: 400 }
      )
    }

    // Parse da configuração
    let configuracao
    try {
      configuracao = config ? UploadSchema.parse(JSON.parse(config)) : UploadSchema.parse({})
    } catch (error) {
      return NextResponse.json(
        { error: 'Configuração inválida', detalhes: (error as Error).message },
        { status: 400 }
      )
    }

    // Criar diretório de uploads se não existir
    const uploadsDir = join(process.cwd(), 'uploads', 'mortalidade')
    await mkdir(uploadsDir, { recursive: true })

    // Gerar nome único para o arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadsDir, fileName)

    // Salvar arquivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Registrar importação no banco
    const importacao = await prisma.importacaoMortalidade.create({
      data: {
        nomeArquivo: file.name,
        tipoArquivo: fileExtension?.toUpperCase() || 'UNKNOWN',
        tamanhoArquivo: file.size,
        caminhoArquivo: filePath,
        status: 'PENDENTE',
        logImportacao: {
          configuracao,
          uploadInfo: {
            originalName: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      importacaoId: importacao.id,
      arquivo: {
        nome: file.name,
        tamanho: file.size,
        tipo: file.type
      },
      configuracao,
      proximoPasso: `/api/aderencia-tabuas/processar-importacao/${importacao.id}`
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor durante o upload' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Retornar lista de importações recentes
    const importacoes = await prisma.importacaoMortalidade.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nomeArquivo: true,
        tipoArquivo: true,
        tamanhoArquivo: true,
        status: true,
        totalRegistros: true,
        registrosImportados: true,
        registrosErro: true,
        iniciadaEm: true,
        concluidaEm: true,
        tempoProcessamento: true
      }
    })

    // Estatísticas gerais
    const stats = await prisma.importacaoMortalidade.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    const totalParticipantes = await prisma.massaParticipantes.count()
    const totalObitos = await prisma.obitoRegistrado.count()

    return NextResponse.json({
      importacoes,
      estatisticas: {
        byStatus: stats.reduce((acc: Record<string, number>, stat: any) => {
          acc[stat.status] = stat._count.status
          return acc
        }, {} as Record<string, number>),
        totalParticipantes,
        totalObitos
      }
    })

  } catch (error) {
    console.error('Erro ao buscar importações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
