#!/bin/bash

#########################################################################
# 🗄️ Script de Migração de Banco de Dados
# Executa migrações Prisma no servidor de produção
#########################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/plesk-config.json"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[DATABASE]${NC} $(date '+%H:%M:%S') - $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') - $*"
    exit 1
}

main() {
    local dry_run=false
    local backup=true
    
    # Processar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                dry_run=true
                shift
                ;;
            --no-backup)
                backup=false
                shift
                ;;
            *)
                error "Argumento desconhecido: $1"
                ;;
        esac
    done
    
    log "🗄️ Iniciando migração de banco de dados..."
    
    # Carregar configuração
    if [[ ! -f "$CONFIG_FILE" ]]; then
        error "Arquivo de configuração não encontrada: $CONFIG_FILE"
    fi
    
    local domain=$(jq -r '.project.domain' "$CONFIG_FILE")
    local plesk_host=$(jq -r '.plesk.server.host' "$CONFIG_FILE")
    local plesk_user=$(jq -r '.plesk.server.username' "$CONFIG_FILE")
    local plesk_port=$(jq -r '.plesk.server.port' "$CONFIG_FILE")
    
    local remote_path="/var/www/vhosts/${domain}/httpdocs"
    
    log "Servidor: ${plesk_host}"
    log "Caminho: ${remote_path}"
    
    if [[ "$dry_run" == true ]]; then
        log "🎯 Modo dry-run ativado"
    fi
    
    # Script para executar no servidor remoto
    local remote_script="
        set -euo pipefail
        
        cd ${remote_path}
        
        echo '[DATABASE] Verificando ambiente...'
        
        # Verificar se o diretório existe
        if [[ ! -d '${remote_path}' ]]; then
            echo '[ERROR] Diretório do projeto não encontrado: ${remote_path}'
            exit 1
        fi
        
        # Verificar se package.json existe
        if [[ ! -f 'package.json' ]]; then
            echo '[ERROR] package.json não encontrado'
            exit 1
        fi
        
        # Backup do banco de dados atual
        if [[ '$backup' == true && -f 'prisma/dev.db' ]]; then
            echo '[DATABASE] Criando backup do banco atual...'
            cp prisma/dev.db prisma/backup-\$(date +'%Y%m%d-%H%M%S').db
            echo '[DATABASE] Backup criado ✅'
        fi
        
        # Instalar dependências se necessário
        if [[ ! -d 'node_modules' ]]; then
            echo '[DATABASE] Instalando dependências...'
            npm ci --production
        fi
        
        # Gerar Prisma client
        echo '[DATABASE] Gerando Prisma client...'
        npx prisma generate --schema=./prisma/schema.prisma
        
        # Executar migrações
        echo '[DATABASE] Executando migrações...'
        npx prisma migrate deploy --schema=./prisma/schema.prisma
        
        # Verificar integridade do banco
        echo '[DATABASE] Verificando integridade do banco...'
        npx prisma db pull --schema=./prisma/schema.prisma --print || true
        
        echo '[DATABASE] Migração concluída ✅'
    "
    
    if [[ "$dry_run" == false ]]; then
        # Executar no servidor remoto
        ssh -p "$plesk_port" "${plesk_user}@${plesk_host}" "$remote_script"
        log "✅ Migração de banco de dados concluída!"
    else
        log "🎯 Script que seria executado no servidor:"
        echo "$remote_script"
    fi
}

main "$@"
