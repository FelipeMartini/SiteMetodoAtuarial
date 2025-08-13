#!/bin/bash

#########################################################################
# 🔒 Script de Configuração SSL
# Configuração automática de SSL/certificados Let's Encrypt no Plesk
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
    echo -e "${GREEN}[SSL]${NC} $(date '+%H:%M:%S') - $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') - $*"
    exit 1
}

main() {
    local dry_run=false
    local email="admin@metodoactuarial.com"
    
    # Processar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                dry_run=true
                shift
                ;;
            --email=*)
                email="${1#*=}"
                shift
                ;;
            *)
                error "Argumento desconhecido: $1"
                ;;
        esac
    done
    
    log "🔒 Iniciando configuração SSL..."
    
    # Carregar configuração
    if [[ ! -f "$CONFIG_FILE" ]]; then
        error "Arquivo de configuração não encontrado: $CONFIG_FILE"
    fi
    
    local domain=$(jq -r '.project.domain' "$CONFIG_FILE")
    local subdomain=$(jq -r '.project.subdomain' "$CONFIG_FILE")
    local plesk_host=$(jq -r '.plesk.server.host' "$CONFIG_FILE")
    local plesk_user=$(jq -r '.plesk.server.username' "$CONFIG_FILE")
    local plesk_port=$(jq -r '.plesk.server.port' "$CONFIG_FILE")
    
    local full_domain="${subdomain}.${domain}"
    
    log "Domínio: $domain"
    log "Subdomínio: $full_domain"
    log "Email: $email"
    
    if [[ "$dry_run" == true ]]; then
        log "🎯 Modo dry-run ativado"
    fi
    
    # Script para executar no servidor remoto
    local remote_script="
        set -euo pipefail
        
        echo '[SSL] Configurando SSL para ${domain} e ${full_domain}...'
        
        # Verificar se certbot está instalado
        if ! command -v certbot &> /dev/null; then
            echo '[SSL] Instalando certbot...'
            if command -v apt-get &> /dev/null; then
                apt-get update && apt-get install -y certbot python3-certbot-nginx
            elif command -v yum &> /dev/null; then
                yum install -y certbot python3-certbot-nginx
            else
                echo '[ERROR] Gerenciador de pacotes não suportado'
                exit 1
            fi
        fi
        
        # Parar nginx temporariamente para obter certificado
        echo '[SSL] Parando nginx...'
        systemctl stop nginx || true
        
        # Obter certificado Let's Encrypt
        echo '[SSL] Obtendo certificado Let'\''s Encrypt...'
        certbot certonly \\
            --standalone \\
            --non-interactive \\
            --agree-tos \\
            --email ${email} \\
            -d ${domain} \\
            -d ${full_domain} \\
            --expand || true
        
        # Configurar nginx com SSL
        echo '[SSL] Configurando nginx...'
        
        # Criar configuração nginx
        cat > /etc/nginx/sites-available/${domain} << 'NGINX_EOF'
server {
    listen 80;
    server_name ${domain} ${full_domain};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${domain} ${full_domain};
    
    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection \"1; mode=block\";
    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;
}
NGINX_EOF
        
        # Ativar configuração
        ln -sf /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/
        
        # Testar configuração nginx
        echo '[SSL] Testando configuração nginx...'
        nginx -t
        
        # Reiniciar nginx
        echo '[SSL] Reiniciando nginx...'
        systemctl start nginx
        systemctl enable nginx
        
        # Configurar renovação automática
        echo '[SSL] Configurando renovação automática...'
        (crontab -l 2>/dev/null; echo '0 12 * * * /usr/bin/certbot renew --quiet --post-hook \"systemctl reload nginx\"') | crontab -
        
        echo '[SSL] SSL configurado com sucesso ✅'
        echo '[SSL] Certificado válido para: ${domain}, ${full_domain}'
    "
    
    if [[ "$dry_run" == false ]]; then
        # Executar no servidor remoto
        ssh -p "$plesk_port" "${plesk_user}@${plesk_host}" "$remote_script"
        log "✅ Configuração SSL concluída!"
        log "🌐 Site disponível em: https://$full_domain"
    else
        log "🎯 Script que seria executado no servidor:"
        echo "$remote_script"
    fi
}

main "$@"
