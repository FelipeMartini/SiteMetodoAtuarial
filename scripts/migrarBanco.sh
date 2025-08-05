#!/bin/bash

# Script para migração do banco de dados Prisma
# Gera nova migração e atualiza o cliente

cd nextjs-app

echo "🔄 Gerando nova migração do banco..."
npx prisma migrate dev --name adicionar_atividades_usuario

echo "🔄 Gerando cliente Prisma atualizado..."
npx prisma generate

echo "✅ Migração concluída!"
