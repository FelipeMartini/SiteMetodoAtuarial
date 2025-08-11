import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureAdminUser(email: string) {
  // 1. Garante que o usuário existe
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`Usuário não encontrado: ${email}`);
  }

  // 2. Garante que o role 'admin' existe
  let adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'admin', description: 'Administrador do sistema' }
    });
  }

  // 3. Garante que o vínculo UserRole existe
  const userRole = await prisma.userRole.findUnique({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: adminRole.id
      }
    }
  });
  if (!userRole) {
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: adminRole.id,
        isActive: true
      }
    });
    console.log(`Role 'admin' atribuído ao usuário ${email}`);
  } else {
    console.log(`Usuário ${email} já possui o role 'admin'`);
  }
}

async function main() {
  const email = 'felipemartinii@gmail.com';
  try {
    await ensureAdminUser(email);
    console.log('Pronto! Usuário admin garantido no ABAC.');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
