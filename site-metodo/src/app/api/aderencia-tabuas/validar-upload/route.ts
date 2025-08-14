import { NextRequest, NextResponse } from 'next/server'
import detectarLayout from '@/lib/aderencia/detector-layout'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('arquivo') as File
    const dataReferencia = (form.get('data_referencia') as string) || undefined

    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

    // salvar upload temporário
    const uploadsDir = join(process.cwd(), 'uploads', 'mortalidade')
    await mkdir(uploadsDir, { recursive: true })
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadsDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // criar registro importacao se necessário
    const importacao = await prisma.importacaoMortalidade.create({
      data: {
        nomeArquivo: file.name,
        tipoArquivo: (file.name.split('.').pop() || '').toUpperCase(),
        tamanhoArquivo: file.size,
        caminhoArquivo: filePath,
        status: 'PENDENTE',
        logImportacao: { uploadInfo: { originalName: file.name, uploadedAt: new Date().toISOString() } }
      }
    })

    const resultado = await detectarLayout(buffer, file.name, { dataReferencia })

    // persistir preview no log da importacao (salvamos o detector completo)
    await prisma.importacaoMortalidade.update({
      where: { id: importacao.id },
      data: { logImportacao: { ...importacao.logImportacao, detector: resultado, updatedAt: new Date().toISOString() } }
    })

    // retornar resultado incluindo perColumnScores e colStats para UI diagnóstico
    const { perColumnScores, colStats, ...rest } = resultado as any
    return NextResponse.json({ success: true, importacaoId: importacao.id, ...rest, perColumnScores, colStats })
  } catch (error) {
    console.error('Erro validar-upload:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
