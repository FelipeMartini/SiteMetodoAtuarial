#!/bin/bash

#########################################################################
# 📁 Script de Upload de Arquivos
# Upload otimizado via SFTP/rsync para servidor Plesk
#########################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="${SCRIPT_DIR}/plesk-config.json"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[UPLOAD]${NC} $(date '+%H:%M:%S') - $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') - $*"
    exit 1
}

main() {
    local dry_run=false
    local force=false
    
    # Processar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                dry_run=true
                shift
                ;;
            --force)
                force=true
                shift
                ;;
            *)
                error "Argumento desconhecido: $1"
                ;;
        esac
    done
    
    log "📁 Iniciando upload de arquivos..."
    
    # Carregar configuração
    if [[ ! -f "$CONFIG_FILE" ]]; then
        error "Arquivo de configuração não encontrado: $CONFIG_FILE"
    fi
    
    local domain=$(jq -r '.project.domain' "$CONFIG_FILE")
    local plesk_host=$(jq -r '.plesk.server.host' "$CONFIG_FILE")
    local plesk_user=$(jq -r '.plesk.server.username' "$CONFIG_FILE")
    local plesk_port=$(jq -r '.plesk.server.port' "$CONFIG_FILE")
    
    local source_dir="${PROJECT_ROOT}/site-metodo"
    local remote_path="/var/www/vhosts/${domain}/httpdocs"
    
    log "Fonte: $source_dir"
    log "Destino: ${plesk_user}@${plesk_host}:${remote_path}"
    
    # Verificar conectividade
    log "🔌 Verificando conectividade..."
    if ! ssh -p "$plesk_port" -o ConnectTimeout=10 "${plesk_user}@${plesk_host}" "echo 'Conexão OK'" >/dev/null 2>&1; then
        error "Não foi possível conectar ao servidor Plesk"
    fi
    
    # Confirmar se não for forçado
    if [[ "$force" == false && "$dry_run" == false ]]; then
        echo -e "${YELLOW}Confirma o upload para ${plesk_host}? (y/N)${NC}"
        read -r confirmation
        if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
            log "Upload cancelado pelo usuário"
            exit 0
        fi
    fi
    
    # Preparar arquivos para upload
    local temp_dir="${SCRIPT_DIR}/temp-upload"
    rm -rf "$temp_dir"
    mkdir -p "$temp_dir"
    
    cd "$source_dir"
    
    # Copiar arquivos essenciais
    log "📦 Preparando arquivos..."
    
    local files_to_copy=(
        ".next"
        "public"
        "package.json"
        "package-lock.json"
        "prisma"
        "next.config.js"
        "middleware.ts"
        "auth.ts"
    )
    
    for file in "${files_to_copy[@]}"; do
        if [[ -e "$file" ]]; then
            cp -r "$file" "$temp_dir/"
            log "Preparado: $file"
        else
            log "Não encontrado: $file"
        fi
    done
    
    # Criar arquivos de produção
    cat > "$temp_dir/.env.production" << 'EOF'
NODE_ENV=production
NEXTAUTH_URL=https://metodoactuarial.com
DATABASE_URL="file:./dev.db"
EOF
    
    # Otimizar package.json para produção
    jq 'del(.devDependencies) | .scripts = {start: "next start", "prisma:generate": "prisma generate"}' \
        "$temp_dir/package.json" > "$temp_dir/package.json.prod"
    mv "$temp_dir/package.json.prod" "$temp_dir/package.json"
    
    # Upload via rsync
    log "🚀 Executando upload..."
    
    local rsync_options=(
        "-avz"
        "--delete"
        "--exclude='.git'"
        "--exclude='node_modules'"
        "--exclude='*.log'"
        "--exclude='.env.local'"
        "--exclude='coverage'"
        "--exclude='*.tsbuildinfo'"
        "--progress"
    )
    
    if [[ "$dry_run" == true ]]; then
        rsync_options+=("--dry-run")
        log "🎯 Modo dry-run ativado"
    fi
    
    rsync "${rsync_options[@]}" \
        -e "ssh -p $plesk_port" \
        "$temp_dir/" \
        "${plesk_user}@${plesk_host}:${remote_path}/"
    
    if [[ "$dry_run" == false ]]; then
        log "✅ Upload concluído com sucesso!"
        log "📍 Arquivos enviados para: ${plesk_host}:${remote_path}"
    else
        log "🎯 Simulação de upload concluída"
    fi
    
    # Limpeza
    rm -rf "$temp_dir"
}

main "$@"
