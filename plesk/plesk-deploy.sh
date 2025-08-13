#!/bin/bash

#########################################################################
# 🚀 Sistema de Deploy Automático para Plesk
# Site Método Atuarial - Deploy Production
#
# ✨ Funcionalidades:
# - Build otimizado para produção
# - Upload via SFTP/FTP
# - Configuração automática do Plesk
# - Migração de banco de dados
# - Configuração SSL/certificados
# - Backup automático
# - Monitoramento pós-deploy
#
# 📝 Uso: ./plesk-deploy.sh [opções]
# Opções:
#   --config=arquivo    Arquivo de configuração (padrão: plesk-config.json)
#   --env=ambiente      Ambiente de deploy (padrão: production)
#   --backup           Criar backup antes do deploy
#   --force            Forçar deploy sem confirmação
#   --rollback         Fazer rollback para versão anterior
#   --dry-run          Simular deploy sem executar
#########################################################################

set -euo pipefail

# Configurações padrão
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="${SCRIPT_DIR}/plesk-config.json"
LOG_DIR="${PROJECT_ROOT}/XLOGS"
DEPLOY_LOG="${LOG_DIR}/plesk-deploy-$(date +'%Y%m%d-%H%M%S').log"
BACKUP_DIR="${SCRIPT_DIR}/backups"

# Variáveis de ambiente
ENVIRONMENT="production"
FORCE_DEPLOY=false
CREATE_BACKUP=true
DRY_RUN=false
ROLLBACK=false

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

#########################################################################
# Funções auxiliares
#########################################################################

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "INFO")  echo -e "${GREEN}[INFO]${NC}  ${timestamp} - $message" | tee -a "$DEPLOY_LOG" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC}  ${timestamp} - $message" | tee -a "$DEPLOY_LOG" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} ${timestamp} - $message" | tee -a "$DEPLOY_LOG" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} ${timestamp} - $message" | tee -a "$DEPLOY_LOG" ;;
    esac
}

check_dependencies() {
    log "INFO" "Verificando dependências..."
    
    local deps=("jq" "rsync" "ssh" "npm" "node")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log "ERROR" "Dependência não encontrada: $dep"
            exit 1
        fi
    done
    
    log "INFO" "Todas as dependências verificadas ✅"
}

load_config() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        log "ERROR" "Arquivo de configuração não encontrado: $CONFIG_FILE"
        exit 1
    fi
    
    log "INFO" "Carregando configuração de $CONFIG_FILE"
    
    # Validar JSON
    if ! jq empty "$CONFIG_FILE" 2>/dev/null; then
        log "ERROR" "Arquivo de configuração JSON inválido"
        exit 1
    fi
    
    # Carregar variáveis do JSON
    export DOMAIN=$(jq -r '.project.domain' "$CONFIG_FILE")
    export SUBDOMAIN=$(jq -r '.project.subdomain' "$CONFIG_FILE")
    export PLESK_HOST=$(jq -r '.plesk.server.host' "$CONFIG_FILE")
    export PLESK_USER=$(jq -r '.plesk.server.username' "$CONFIG_FILE")
    export PLESK_PORT=$(jq -r '.plesk.server.port' "$CONFIG_FILE")
    
    log "INFO" "Configuração carregada - Deploy para: ${SUBDOMAIN}.${DOMAIN}"
}

create_backup() {
    if [[ "$CREATE_BACKUP" == true ]]; then
        log "INFO" "Criando backup do estado atual..."
        
        mkdir -p "$BACKUP_DIR"
        local backup_name="backup-$(date +'%Y%m%d-%H%M%S')"
        local backup_path="${BACKUP_DIR}/${backup_name}"
        
        # Backup do projeto atual
        if [[ -d "${PROJECT_ROOT}/site-metodo" ]]; then
            tar -czf "${backup_path}-project.tar.gz" -C "$PROJECT_ROOT" site-metodo
            log "INFO" "Backup do projeto criado: ${backup_path}-project.tar.gz"
        fi
        
        # Backup do banco de dados
        if [[ -f "${PROJECT_ROOT}/site-metodo/prisma/dev.db" ]]; then
            cp "${PROJECT_ROOT}/site-metodo/prisma/dev.db" "${backup_path}-database.db"
            log "INFO" "Backup do banco criado: ${backup_path}-database.db"
        fi
        
        echo "$backup_name" > "${BACKUP_DIR}/latest-backup.txt"
        log "INFO" "Backup concluído ✅"
    fi
}

build_production() {
    log "INFO" "Iniciando build de produção..."
    
    cd "${PROJECT_ROOT}/site-metodo"
    
    # Limpar cache e dependências
    if [[ "$DRY_RUN" == false ]]; then
        log "INFO" "Limpando cache..."
        rm -rf .next node_modules package-lock.json 2>/dev/null || true
        npm cache clean --force
        
        # Instalar dependências
        log "INFO" "Instalando dependências..."
        npm ci --production=false
        
        # Gerar Prisma
        log "INFO" "Gerando Prisma client..."
        npx prisma generate --schema=./prisma/schema.prisma
        
        # Build do projeto
        log "INFO" "Executando build Next.js..."
        npm run build
        
        log "INFO" "Build de produção concluído ✅"
    else
        log "INFO" "[DRY-RUN] Build simulado"
    fi
}

prepare_deploy_package() {
    log "INFO" "Preparando pacote de deploy..."
    
    local deploy_temp="${SCRIPT_DIR}/temp-deploy"
    rm -rf "$deploy_temp"
    mkdir -p "$deploy_temp"
    
    cd "${PROJECT_ROOT}/site-metodo"
    
    # Copiar arquivos necessários
    local files_to_copy=(
        ".next"
        "public"
        "package.json"
        "package-lock.json"
        "prisma"
        "next.config.js"
        "middleware.ts"
    )
    
    for file in "${files_to_copy[@]}"; do
        if [[ -e "$file" ]]; then
            cp -r "$file" "$deploy_temp/"
            log "DEBUG" "Copiado: $file"
        fi
    done
    
    # Criar package.json otimizado para produção
    jq '.scripts.start = "next start"' "$deploy_temp/package.json" > "$deploy_temp/package.json.tmp"
    mv "$deploy_temp/package.json.tmp" "$deploy_temp/package.json"
    
    log "INFO" "Pacote de deploy preparado ✅"
}

upload_to_plesk() {
    log "INFO" "Fazendo upload para servidor Plesk..."
    
    local deploy_temp="${SCRIPT_DIR}/temp-deploy"
    local remote_path="/var/www/vhosts/${DOMAIN}/httpdocs"
    
    if [[ "$DRY_RUN" == false ]]; then
        # Upload via rsync
        rsync -avz --delete \
            --exclude='.git' \
            --exclude='node_modules' \
            --exclude='*.log' \
            --exclude='.env.local' \
            "$deploy_temp/" \
            "${PLESK_USER}@${PLESK_HOST}:${remote_path}/"
        
        log "INFO" "Upload concluído ✅"
    else
        log "INFO" "[DRY-RUN] Upload simulado para ${PLESK_USER}@${PLESK_HOST}:${remote_path}/"
    fi
}

configure_plesk_environment() {
    log "INFO" "Configurando ambiente Plesk..."
    
    if [[ "$DRY_RUN" == false ]]; then
        # Executar comandos remotos no servidor
        ssh "${PLESK_USER}@${PLESK_HOST}" -p "$PLESK_PORT" << 'EOF'
            cd /var/www/vhosts/metodoactuarial.com/httpdocs
            
            # Instalar dependências de produção
            npm ci --production
            
            # Configurar permissões
            chown -R www-data:www-data .
            chmod -R 755 .
            
            # Reiniciar aplicação Node.js
            systemctl restart nodejs-app || true
EOF
        
        log "INFO" "Configuração do ambiente concluída ✅"
    else
        log "INFO" "[DRY-RUN] Configuração do ambiente simulada"
    fi
}

configure_ssl() {
    log "INFO" "Configurando SSL/certificados..."
    
    if [[ "$DRY_RUN" == false ]]; then
        # Configurar SSL via API do Plesk ou comando remoto
        ssh "${PLESK_USER}@${PLESK_HOST}" -p "$PLESK_PORT" << 'EOF'
            # Configurar Let's Encrypt se disponível
            if command -v certbot &> /dev/null; then
                certbot --nginx -d metodoactuarial.com -d www.metodoactuarial.com --non-interactive --agree-tos -m admin@metodoactuarial.com
            fi
EOF
        
        log "INFO" "SSL configurado ✅"
    else
        log "INFO" "[DRY-RUN] Configuração SSL simulada"
    fi
}

migrate_database() {
    log "INFO" "Executando migrações do banco de dados..."
    
    if [[ "$DRY_RUN" == false ]]; then
        ssh "${PLESK_USER}@${PLESK_HOST}" -p "$PLESK_PORT" << 'EOF'
            cd /var/www/vhosts/metodoactuarial.com/httpdocs
            
            # Executar migrações Prisma
            npx prisma migrate deploy --schema=./prisma/schema.prisma
            
            # Gerar client Prisma
            npx prisma generate --schema=./prisma/schema.prisma
EOF
        
        log "INFO" "Migrações executadas ✅"
    else
        log "INFO" "[DRY-RUN] Migrações simuladas"
    fi
}

health_check() {
    log "INFO" "Verificando saúde da aplicação..."
    
    local health_url="https://${SUBDOMAIN}.${DOMAIN}/api/health"
    local max_attempts=10
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "$health_url" > /dev/null; then
            log "INFO" "Health check passou ✅"
            return 0
        fi
        
        log "WARN" "Health check falhou (tentativa $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done
    
    log "ERROR" "Health check falhou após $max_attempts tentativas"
    return 1
}

rollback_deployment() {
    log "INFO" "Executando rollback..."
    
    local latest_backup=$(cat "${BACKUP_DIR}/latest-backup.txt" 2>/dev/null || echo "")
    
    if [[ -z "$latest_backup" ]]; then
        log "ERROR" "Nenhum backup encontrado para rollback"
        return 1
    fi
    
    log "INFO" "Fazendo rollback para backup: $latest_backup"
    
    if [[ "$DRY_RUN" == false ]]; then
        # Restaurar backup
        tar -xzf "${BACKUP_DIR}/${latest_backup}-project.tar.gz" -C "$PROJECT_ROOT"
        
        # Restaurar banco de dados se existir
        if [[ -f "${BACKUP_DIR}/${latest_backup}-database.db" ]]; then
            cp "${BACKUP_DIR}/${latest_backup}-database.db" "${PROJECT_ROOT}/site-metodo/prisma/dev.db"
        fi
        
        log "INFO" "Rollback concluído ✅"
    else
        log "INFO" "[DRY-RUN] Rollback simulado"
    fi
}

cleanup() {
    log "INFO" "Limpando arquivos temporários..."
    rm -rf "${SCRIPT_DIR}/temp-deploy" 2>/dev/null || true
    log "INFO" "Limpeza concluída ✅"
}

show_help() {
    cat << EOF
🚀 Sistema de Deploy Automático para Plesk
Site Método Atuarial

Uso: $0 [opções]

Opções:
  --config=arquivo    Arquivo de configuração (padrão: plesk-config.json)
  --env=ambiente      Ambiente de deploy (padrão: production)
  --backup           Criar backup antes do deploy (padrão: true)
  --no-backup        Não criar backup
  --force            Forçar deploy sem confirmação
  --rollback         Fazer rollback para versão anterior
  --dry-run          Simular deploy sem executar
  --help             Mostrar esta ajuda

Exemplos:
  $0                          # Deploy normal
  $0 --dry-run               # Simular deploy
  $0 --force --no-backup     # Deploy rápido sem backup
  $0 --rollback              # Rollback para backup anterior

EOF
}

#########################################################################
# Processamento de argumentos
#########################################################################

while [[ $# -gt 0 ]]; do
    case $1 in
        --config=*)
            CONFIG_FILE="${1#*=}"
            shift
            ;;
        --env=*)
            ENVIRONMENT="${1#*=}"
            shift
            ;;
        --backup)
            CREATE_BACKUP=true
            shift
            ;;
        --no-backup)
            CREATE_BACKUP=false
            shift
            ;;
        --force)
            FORCE_DEPLOY=true
            shift
            ;;
        --rollback)
            ROLLBACK=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            log "ERROR" "Opção desconhecida: $1"
            show_help
            exit 1
            ;;
    esac
done

#########################################################################
# Execução principal
#########################################################################

main() {
    log "INFO" "🚀 Iniciando deploy automático para Plesk"
    log "INFO" "Ambiente: $ENVIRONMENT"
    log "INFO" "Dry Run: $DRY_RUN"
    log "INFO" "Log: $DEPLOY_LOG"
    
    # Criar diretório de logs
    mkdir -p "$LOG_DIR"
    mkdir -p "$BACKUP_DIR"
    
    # Verificações iniciais
    check_dependencies
    load_config
    
    # Rollback se solicitado
    if [[ "$ROLLBACK" == true ]]; then
        rollback_deployment
        exit 0
    fi
    
    # Confirmação se não for forçado
    if [[ "$FORCE_DEPLOY" == false && "$DRY_RUN" == false ]]; then
        echo -e "${YELLOW}Confirma o deploy para ${SUBDOMAIN}.${DOMAIN}? (y/N)${NC}"
        read -r confirmation
        if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
            log "INFO" "Deploy cancelado pelo usuário"
            exit 0
        fi
    fi
    
    # Processo de deploy
    create_backup
    build_production
    prepare_deploy_package
    upload_to_plesk
    configure_plesk_environment
    migrate_database
    configure_ssl
    
    # Verificações pós-deploy
    if [[ "$DRY_RUN" == false ]]; then
        if health_check; then
            log "INFO" "🎉 Deploy concluído com sucesso!"
            log "INFO" "Site disponível em: https://${SUBDOMAIN}.${DOMAIN}"
        else
            log "ERROR" "Deploy falhou no health check"
            log "WARN" "Considere executar rollback: $0 --rollback"
            exit 1
        fi
    else
        log "INFO" "🎯 Simulação de deploy concluída"
    fi
    
    cleanup
}

# Trap para limpeza em caso de erro
trap cleanup EXIT

# Executar função principal
main "$@"
