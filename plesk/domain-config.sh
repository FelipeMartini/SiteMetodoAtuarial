#!/bin/bash

#########################################################################
# 🌐 Script de Configuração de Domínio
# Configuração automática de domínios e subdomínios no Plesk
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
    echo -e "${GREEN}[DOMAIN]${NC} $(date '+%H:%M:%S') - $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') - $*"
    exit 1
}

main() {
    local dry_run=false
    
    # Processar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                dry_run=true
                shift
                ;;
            *)
                error "Argumento desconhecido: $1"
                ;;
        esac
    done
    
    log "🌐 Iniciando configuração de domínio..."
    
    # Carregar configuração
    if [[ ! -f "$CONFIG_FILE" ]]; then
        error "Arquivo de configuração não encontrado: $CONFIG_FILE"
    fi
    
    local domain=$(jq -r '.project.domain' "$CONFIG_FILE")
    local subdomain=$(jq -r '.project.subdomain' "$CONFIG_FILE")
    local plesk_host=$(jq -r '.plesk.server.host' "$CONFIG_FILE")
    local plesk_user=$(jq -r '.plesk.server.username' "$CONFIG_FILE")
    local plesk_port=$(jq -r '.plesk.server.port' "$CONFIG_FILE")
    local nodejs_version=$(jq -r '.project.nodejs_version' "$CONFIG_FILE")
    
    local full_domain="${subdomain}.${domain}"
    local document_root="/var/www/vhosts/${domain}/httpdocs"
    
    log "Domínio: $domain"
    log "Subdomínio: $full_domain"
    log "Node.js: $nodejs_version"
    
    if [[ "$dry_run" == true ]]; then
        log "🎯 Modo dry-run ativado"
    fi
    
    # Script para executar no servidor remoto
    local remote_script="
        set -euo pipefail
        
        echo '[DOMAIN] Configurando domínio no Plesk...'
        
        # Criar diretório do domínio se não existir
        echo '[DOMAIN] Criando estrutura de diretórios...'
        mkdir -p ${document_root}
        
        # Configurar permissões
        echo '[DOMAIN] Configurando permissões...'
        chown -R www-data:www-data /var/www/vhosts/${domain}
        chmod -R 755 /var/www/vhosts/${domain}
        
        # Verificar/instalar Node.js
        echo '[DOMAIN] Verificando Node.js...'
        if ! command -v node &> /dev/null; then
            echo '[DOMAIN] Instalando Node.js ${nodejs_version}...'
            curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
            apt-get install -y nodejs
        fi
        
        node_version=\$(node --version)
        echo '[DOMAIN] Node.js versão: \$node_version'
        
        # Verificar/instalar PM2
        if ! command -v pm2 &> /dev/null; then
            echo '[DOMAIN] Instalando PM2...'
            npm install -g pm2
        fi
        
        # Criar arquivo de configuração PM2
        echo '[DOMAIN] Criando configuração PM2...'
        cat > ${document_root}/ecosystem.config.js << 'PM2_EOF'
module.exports = {
  apps: [{
    name: '${domain}',
    script: './node_modules/.bin/next',
    args: 'start',
    cwd: '${document_root}',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
PM2_EOF
        
        # Criar diretório de logs
        mkdir -p ${document_root}/logs
        
        # Configurar logrotate para logs do PM2
        echo '[DOMAIN] Configurando logrotate...'
        cat > /etc/logrotate.d/${domain} << 'LOGROTATE_EOF'
${document_root}/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
LOGROTATE_EOF
        
        # Criar arquivo de health check
        echo '[DOMAIN] Criando health check...'
        cat > ${document_root}/health-check.js << 'HEALTH_EOF'
const http = require('http')

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
}

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Health check: OK')
    process.exit(0)
  } else {
    console.log('Health check: FAIL - Status:', res.statusCode)
    process.exit(1)
  }
})

req.on('error', (err) => {
  console.log('Health check: ERROR -', err.message)
  process.exit(1)
})

req.on('timeout', () => {
  console.log('Health check: TIMEOUT')
  req.destroy()
  process.exit(1)
})

req.setTimeout(5000)
req.end()
HEALTH_EOF
        
        # Criar script de monitoramento
        echo '[DOMAIN] Criando script de monitoramento...'
        cat > /usr/local/bin/monitor-${domain} << 'MONITOR_EOF'
#!/bin/bash

DOMAIN=\"${domain}\"
DOCUMENT_ROOT=\"${document_root}\"
LOG_FILE=\"/var/log/monitor-\${DOMAIN}.log\"

log() {
    echo \"\$(date '+%Y-%m-%d %H:%M:%S') - \$*\" >> \"\$LOG_FILE\"
}

# Verificar se PM2 está rodando
if ! pm2 describe \"\$DOMAIN\" > /dev/null 2>&1; then
    log \"ALERT: PM2 app \$DOMAIN não está rodando\"
    cd \"\$DOCUMENT_ROOT\"
    pm2 start ecosystem.config.js
    log \"INFO: PM2 app \$DOMAIN reiniciado\"
fi

# Health check
cd \"\$DOCUMENT_ROOT\"
if ! node health-check.js > /dev/null 2>&1; then
    log \"ALERT: Health check falhou para \$DOMAIN\"
    pm2 restart \"\$DOMAIN\"
    log \"INFO: PM2 app \$DOMAIN reiniciado após falha no health check\"
fi

# Verificar uso de memória
MEMORY_USAGE=\$(ps -o pid,ppid,rss,vsize,pcpu,pmem,cmd -p \$(pgrep -f \"next.*start\") | tail -n +2 | awk '{sum+=\$3} END {print sum}')
if [[ \$MEMORY_USAGE -gt 1048576 ]]; then  # 1GB em KB
    log \"ALERT: Alto uso de memória (\${MEMORY_USAGE}KB) para \$DOMAIN\"
fi

log \"INFO: Monitor executado - Tudo OK\"
MONITOR_EOF
        
        chmod +x /usr/local/bin/monitor-${domain}
        
        # Adicionar ao crontab para monitoramento a cada 5 minutos
        echo '[DOMAIN] Configurando monitoramento automático...'
        (crontab -l 2>/dev/null; echo '*/5 * * * * /usr/local/bin/monitor-${domain}') | crontab -
        
        echo '[DOMAIN] Configuração de domínio concluída ✅'
        echo '[DOMAIN] Document Root: ${document_root}'
        echo '[DOMAIN] PM2 App: ${domain}'
        echo '[DOMAIN] Monitoramento: Ativo (a cada 5 minutos)'
    "
    
    if [[ "$dry_run" == false ]]; then
        # Executar no servidor remoto
        ssh -p "$plesk_port" "${plesk_user}@${plesk_host}" "$remote_script"
        log "✅ Configuração de domínio concluída!"
        log "🌐 Domínio configurado: $full_domain"
        log "📁 Document Root: $document_root"
    else
        log "🎯 Script que seria executado no servidor:"
        echo "$remote_script"
    fi
}

main "$@"
