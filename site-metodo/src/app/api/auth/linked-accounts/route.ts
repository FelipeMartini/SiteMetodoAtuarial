import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
  return NextResponse.json({
    accounts: user.accounts.map((acc) => ({
      provider: acc.provider,
      providerAccountId: acc.providerAccountId,
      createdAt: (acc as { createdAt?: Date; id: string }).createdAt ?? acc.id,
    })),
  });
}
