import { NextRequest, NextResponse } from 'next/server';
import { analisarExcel } from '@/lib/analise-excel/analisadorExcel';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ erro: 'Arquivo não enviado.' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const resultado = await analisarExcel(buffer);
    return NextResponse.json(resultado);
  } catch {
    return NextResponse.json({ erro: 'Falha ao analisar o arquivo.' }, { status: 500 });
  }
}
