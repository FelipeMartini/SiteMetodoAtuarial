#!/bin/bash

#########################################################################
# 💾 Script de Sistema de Backup
# Backup automático de aplicação e banco de dados
#########################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/plesk-config.json"
BACKUP_DIR="${SCRIPT_DIR}/backups"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[BACKUP]${NC} $(date '+%H:%M:%S') - $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') - $*"
    exit 1
}

main() {
    local backup_type="full"
    local retention_days=30
    local remote_backup=true
    local dry_run=false
    
    # Processar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --type=*)
                backup_type="${1#*=}"
                shift
                ;;
            --retention=*)
                retention_days="${1#*=}"
                shift
                ;;
            --local-only)
                remote_backup=false
                shift
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            *)
                error "Argumento desconhecido: $1"
                ;;
        esac
    done
    
    log "💾 Iniciando sistema de backup..."
    log "Tipo: $backup_type"
    log "Retenção: $retention_days dias"
    
    # Carregar configuração
    if [[ ! -f "$CONFIG_FILE" ]]; then
        error "Arquivo de configuração não encontrado: $CONFIG_FILE"
    fi
    
    local domain=$(jq -r '.project.domain' "$CONFIG_FILE")
    local plesk_host=$(jq -r '.plesk.server.host' "$CONFIG_FILE")
    local plesk_user=$(jq -r '.plesk.server.username' "$CONFIG_FILE")
    local plesk_port=$(jq -r '.plesk.server.port' "$CONFIG_FILE")
    
    # Criar diretório de backup
    mkdir -p "$BACKUP_DIR"
    
    local timestamp=$(date +'%Y%m%d-%H%M%S')
    local backup_name="${domain}-${backup_type}-${timestamp}"
    
    log "Nome do backup: $backup_name"
    
    if [[ "$dry_run" == true ]]; then
        log "🎯 Modo dry-run ativado"
    fi
    
    # Backup local (se aplicável)
    if [[ "$backup_type" == "local" || "$backup_type" == "full" ]]; then
        backup_local "$backup_name"
    fi
    
    # Backup remoto
    if [[ "$remote_backup" == true && ("$backup_type" == "remote" || "$backup_type" == "full") ]]; then
        backup_remote "$backup_name"
    fi
    
    # Limpeza de backups antigos
    cleanup_old_backups "$retention_days"
    
    log "✅ Sistema de backup concluído!"
}

backup_local() {
    local backup_name="$1"
    local project_root="$(dirname "$SCRIPT_DIR")"
    
    log "📦 Executando backup local..."
    
    if [[ "$dry_run" == false ]]; then
        # Backup do projeto
        tar -czf "${BACKUP_DIR}/${backup_name}-project.tar.gz" \
            -C "$project_root" \
            --exclude='node_modules' \
            --exclude='.next' \
            --exclude='*.log' \
            --exclude='.git' \
            --exclude='coverage' \
            site-metodo
        
        # Backup do banco de dados
        if [[ -f "${project_root}/site-metodo/prisma/dev.db" ]]; then
            cp "${project_root}/site-metodo/prisma/dev.db" \
               "${BACKUP_DIR}/${backup_name}-database.db"
        fi
        
        # Criar manifesto do backup
        cat > "${BACKUP_DIR}/${backup_name}-manifest.json" << EOF
{
  "backup_name": "${backup_name}",
  "timestamp": "$(date -Iseconds)",
  "type": "local",
  "files": {
    "project": "${backup_name}-project.tar.gz",
    "database": "${backup_name}-database.db"
  },
  "git_commit": "$(cd "$project_root" && git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "git_branch": "$(cd "$project_root" && git branch --show-current 2>/dev/null || echo 'unknown')"
}
EOF
        
        log "✅ Backup local concluído"
    else
        log "🎯 [DRY-RUN] Backup local simulado"
    fi
}

backup_remote() {
    local backup_name="$1"
    local remote_path="/var/www/vhosts/${domain}/httpdocs"
    
    log "🌐 Executando backup remoto..."
    
    # Script para executar no servidor remoto
    local remote_script="
        set -euo pipefail
        
        BACKUP_DIR=\"/var/backups/${domain}\"
        TIMESTAMP=\"${timestamp}\"
        BACKUP_NAME=\"${backup_name}\"
        DOCUMENT_ROOT=\"${remote_path}\"
        
        echo '[BACKUP] Criando backup remoto...'
        
        # Criar diretório de backup
        mkdir -p \"\$BACKUP_DIR\"
        
        # Backup da aplicação (sem node_modules)
        echo '[BACKUP] Fazendo backup da aplicação...'
        tar -czf \"\$BACKUP_DIR/\$BACKUP_NAME-app.tar.gz\" \\
            -C \"\$DOCUMENT_ROOT\" \\
            --exclude='node_modules' \\
            --exclude='logs' \\
            --exclude='*.log' \\
            .
        
        # Backup do banco de dados
        if [[ -f \"\$DOCUMENT_ROOT/prisma/dev.db\" ]]; then
            echo '[BACKUP] Fazendo backup do banco de dados...'
            cp \"\$DOCUMENT_ROOT/prisma/dev.db\" \"\$BACKUP_DIR/\$BACKUP_NAME-database.db\"
        fi
        
        # Backup dos logs PM2
        if [[ -d \"\$DOCUMENT_ROOT/logs\" ]]; then
            echo '[BACKUP] Fazendo backup dos logs...'
            tar -czf \"\$BACKUP_DIR/\$BACKUP_NAME-logs.tar.gz\" -C \"\$DOCUMENT_ROOT\" logs
        fi
        
        # Backup da configuração nginx
        if [[ -f \"/etc/nginx/sites-available/${domain}\" ]]; then
            echo '[BACKUP] Fazendo backup da configuração nginx...'
            cp \"/etc/nginx/sites-available/${domain}\" \"\$BACKUP_DIR/\$BACKUP_NAME-nginx.conf\"
        fi
        
        # Criar manifesto do backup remoto
        cat > \"\$BACKUP_DIR/\$BACKUP_NAME-manifest.json\" << 'MANIFEST_EOF'
{
  \"backup_name\": \"$BACKUP_NAME\",
  \"timestamp\": \"$(date -Iseconds)\",
  \"type\": \"remote\",
  \"server\": \"$(hostname)\",
  \"files\": {
    \"application\": \"$BACKUP_NAME-app.tar.gz\",
    \"database\": \"$BACKUP_NAME-database.db\",
    \"logs\": \"$BACKUP_NAME-logs.tar.gz\",
    \"nginx\": \"$BACKUP_NAME-nginx.conf\"
  },
  \"app_status\": \"$(pm2 describe ${domain} --silent | jq -r '.status' 2>/dev/null || echo 'unknown')\",
  \"disk_usage\": \"$(df -h \$DOCUMENT_ROOT | tail -1 | awk '{print \$5}')\"
}
MANIFEST_EOF
        
        # Verificar tamanho dos backups
        echo '[BACKUP] Tamanho dos arquivos de backup:'
        ls -lh \"\$BACKUP_DIR/\$BACKUP_NAME\"*
        
        echo '[BACKUP] Backup remoto concluído ✅'
    "
    
    if [[ "$dry_run" == false ]]; then
        ssh -p "$plesk_port" "${plesk_user}@${plesk_host}" "$remote_script"
        
        # Download do backup remoto (opcional)
        if [[ "$remote_backup" == true ]]; then
            log "📥 Fazendo download do backup remoto..."
            scp -P "$plesk_port" \
                "${plesk_user}@${plesk_host}:/var/backups/${domain}/${backup_name}-manifest.json" \
                "${BACKUP_DIR}/"
        fi
        
        log "✅ Backup remoto concluído"
    else
        log "🎯 [DRY-RUN] Backup remoto simulado"
        echo "Script que seria executado:"
        echo "$remote_script"
    fi
}

cleanup_old_backups() {
    local retention_days="$1"
    
    log "🧹 Limpando backups antigos (>${retention_days} dias)..."
    
    if [[ "$dry_run" == false ]]; then
        # Limpeza local
        find "$BACKUP_DIR" -name "*.tar.gz" -mtime +${retention_days} -delete
        find "$BACKUP_DIR" -name "*.db" -mtime +${retention_days} -delete
        find "$BACKUP_DIR" -name "*-manifest.json" -mtime +${retention_days} -delete
        
        # Limpeza remota
        ssh -p "$plesk_port" "${plesk_user}@${plesk_host}" "
            find /var/backups/${domain} -name '*.tar.gz' -mtime +${retention_days} -delete
            find /var/backups/${domain} -name '*.db' -mtime +${retention_days} -delete
            find /var/backups/${domain} -name '*.json' -mtime +${retention_days} -delete
        "
        
        log "✅ Limpeza de backups concluída"
    else
        log "🎯 [DRY-RUN] Limpeza simulada"
    fi
}

show_help() {
    cat << EOF
💾 Sistema de Backup Automático

Uso: $0 [opções]

Opções:
  --type=TIPO           Tipo de backup (local|remote|full) [padrão: full]
  --retention=DIAS      Dias para manter backups [padrão: 30]
  --local-only          Fazer apenas backup local
  --dry-run             Simular backup sem executar
  --help                Mostrar esta ajuda

Tipos de backup:
  local     Backup apenas dos arquivos locais
  remote    Backup apenas do servidor remoto
  full      Backup completo (local + remoto)

Exemplos:
  $0                           # Backup completo
  $0 --type=local             # Apenas backup local
  $0 --retention=7            # Manter por 7 dias
  $0 --dry-run                # Simular backup

EOF
}

# Verificar argumentos de ajuda
if [[ "${1:-}" == "--help" ]]; then
    show_help
    exit 0
fi

main "$@"
