import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const { provider } = await req.json();
  if (!provider) {
    return NextResponse.json({ error: "Provedor não informado" }, { status: 400 });
  }
  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
  // Não permitir desvincular último provedor
  const accounts = await db.account.findMany({ where: { userId: user.id } });
  if (accounts.length <= 1) {
    return NextResponse.json({ error: "Não é possível desvincular o último provedor." }, { status: 400 });
  }
  await db.account.deleteMany({ where: { userId: user.id, provider } });
  return NextResponse.json({ ok: true });
}
