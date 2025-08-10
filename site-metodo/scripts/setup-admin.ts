#!/usr/bin/env tsx
/**
 * Script para configurar usuário admin
 * Garante que felipemartinii@gmail.com tenha accessLevel 100 (admin)
 */

import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function setupAdminUser() {
  try {
    console.log('🔧 Configurando usuário admin...');
    
    const adminEmail = 'felipemartinii@gmail.com';
    
    // Buscar ou criar usuário admin
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (!adminUser) {
      console.log('📝 Criando usuário admin...');
      
      // Hash da senha padrão
      const hashedPassword = await bcryptjs.hash('123456', 12);
      
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Felipe Martini',
          password: hashedPassword,
          accessLevel: 100, // Admin level
          role: 'ADMIN',
          isActive: true,
          emailVerified: new Date(),
          createdAt: new Date(),
          lastLogin: new Date(),
        }
      });
      
      console.log('✅ Usuário admin criado com sucesso!');
    } else {
      console.log('📋 Usuário admin encontrado, verificando configuração...');
      
      // Atualizar para garantir que está como admin
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          accessLevel: 100, // Garantir nível admin
          role: 'ADMIN',
          isActive: true,
          name: adminUser.name || 'Felipe Martini',
        }
      });
      
      console.log('✅ Usuário admin atualizado com sucesso!');
    }
    
    // Verificar configuração final
    const finalUser = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: {
        id: true,
        email: true,
        name: true,
        accessLevel: true,
        role: true,
        isActive: true,
      }
    });
    
    console.log('🎯 Configuração final do usuário admin:');
    console.log(JSON.stringify(finalUser, null, 2));
    
    console.log('🚀 Script concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar script
setupAdminUser();
