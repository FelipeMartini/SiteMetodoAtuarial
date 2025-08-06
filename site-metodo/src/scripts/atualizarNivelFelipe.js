// Script para atualizar o nível de acesso do usuário 'felipemartinii@gmail.com' para 5
// Execute com: node scripts/atualizarNivelFelipe.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function atualizarNivel() {
  try {
    const user = await prisma.user.update({
      where: { email: 'felipemartinii@gmail.com' },
      data: { accessLevel: 5 },
    });
    console.log('Usuário atualizado:', user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarNivel();
