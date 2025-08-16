const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.user.count();
    console.log('User count:', count);
  } catch (e) {
    console.error('DB error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
