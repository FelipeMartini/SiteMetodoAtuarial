// Rota descontinuada - manter temporariamente para compatibilidade, redirecionando para /api/usuarios
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('/api/usuarios');
}

export async function POST() {
  return NextResponse.json({ erro: 'Use /api/usuarios para criação.' }, { status: 410 });
}
