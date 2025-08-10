// Script Prisma: Atualiza o accessLevel do usuário felipemartinii@gmail.com para 5
// Executar com: npx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'felipemartinii@gmail.com' },
    data: { accessLevel: 5 }
  });
  console.log('AccessLevel do usuário felipemartinii@gmail.com atualizado para 5.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
