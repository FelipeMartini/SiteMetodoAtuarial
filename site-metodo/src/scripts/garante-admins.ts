// Script para garantir que usuários 'mail' e 'Teste da Silva' tenham accessLevel 5
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const emails = ['mail', 'mail@', 'mail@teste.com', 'teste', 'teste@', 'teste@teste.com', 'teste@cliente.com', 'teste@admin.com'];
  const nomes = ['Teste da Silva', 'mail', 'Mail', 'Teste'];

  // Atualiza por email
  for (const email of emails) {
    await prisma.user.updateMany({
      where: { email: { contains: email } },
      data: { accessLevel: 5 }
    });
  }
  // Atualiza por nome
  for (const nome of nomes) {
    await prisma.user.updateMany({
      where: { name: { contains: nome } },
      data: { accessLevel: 5 }
    });
  }
  console.log('Usuários mail e Teste da Silva agora são nível 5!');
}

main().finally(() => prisma.$disconnect());
