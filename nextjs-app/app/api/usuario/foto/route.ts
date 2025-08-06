import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

// API para upload de foto de perfil do usuário
export async function POST(req: NextRequest) {
  // Recupera sessão do Auth.js puro via cookie
  const sessionToken = req.cookies.get('authjs.session-token')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  // Busca sessão pelo token
  const sessao = await db.session.findUnique({ where: { sessionToken } });
  if (!sessao) {
    return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
  }
  // Busca usuário logado pela sessão
  const usuario = await db.user.findUnique({ where: { id: sessao.userId } });
  if (!usuario) {
    return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('foto') as File;
  if (!file) {
    return NextResponse.json({ error: 'Arquivo não enviado.' }, { status: 400 });
  }
  // Validação de tipo e tamanho
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo de arquivo não suportado. Envie uma imagem.' }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'Arquivo muito grande. Limite: 2MB.' }, { status: 400 });
  }

  // Salva arquivo localmente (pode ser adaptado para S3 ou outro storage)
  const ext = path.extname(file.name);
  const fileName = `${uuidv4()}${ext}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  // Atualiza usuário no banco
  await db.user.update({
    where: { email: token.email },
    data: { image: `/uploads/${fileName}` },
  });

  return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
}
// Comentário: Esta rota API recebe o arquivo enviado, salva localmente e atualiza o campo de foto do usuário no banco.
