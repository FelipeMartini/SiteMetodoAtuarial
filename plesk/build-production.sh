#!/bin/bash

#########################################################################
# 🏗️ Script de Build de Produção
# Otimizado para deploy em servidor Plesk
#########################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SITE_DIR="${PROJECT_ROOT}/site-metodo"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[BUILD]${NC} $(date '+%H:%M:%S') - $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') - $*"
    exit 1
}

main() {
    log "🏗️ Iniciando build de produção..."
    
    cd "$SITE_DIR"
    
    # Verificar se está no diretório correto
    if [[ ! -f "package.json" ]]; then
        error "package.json não encontrado em $SITE_DIR"
    fi
    
    # Limpar cache anterior
    log "🧹 Limpando cache..."
    rm -rf .next node_modules package-lock.json .turbo 2>/dev/null || true
    npm cache clean --force
    
    # Instalar dependências
    log "📦 Instalando dependências..."
    npm ci --production=false
    
    # Gerar Prisma client
    log "🗄️ Gerando Prisma client..."
    npx prisma generate --schema=./prisma/schema.prisma
    
    # Verificar sintaxe TypeScript
    log "🔍 Verificando TypeScript..."
    npm run type-check || error "Erro de TypeScript encontrado"
    
    # Build do Next.js
    log "⚡ Executando build Next.js..."
    NODE_ENV=production npm run build
    
    # Verificar se build foi bem-sucedido
    if [[ ! -d ".next" ]]; then
        error "Build falhou - diretório .next não encontrado"
    fi
    
    # Estatísticas do build
    log "📊 Estatísticas do build:"
    du -sh .next
    find .next -name "*.js" | wc -l | xargs echo "Arquivos JavaScript:"
    find .next -name "*.css" | wc -l | xargs echo "Arquivos CSS:"
    
    log "✅ Build de produção concluído com sucesso!"
}

main "$@"
