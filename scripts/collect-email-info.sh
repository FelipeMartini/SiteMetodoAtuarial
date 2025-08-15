#!/usr/bin/env bash
set -euo pipefail

# Coleta informação útil para configurar envio de email no Plesk/servidor.
# Uso:
#   ./scripts/collect-email-info.sh --ssh-user felipe --ssh-host plesk.metodoatuarial.com.br --mail-host mail.metodoatuarial.com.br
# Observação: o script usa SSH (chave ou senha) para rodar comandos remotos; não armazena senhas.

SSH_USER=""
SSH_HOST=""
MAIL_HOST="mail.metodoatuarial.com.br"
SSH_PASS=""
OUT_DIR="./XLOGS/email-collect-$(date +'%Y%m%d-%H%M%S')"

while [[ $# -gt 0 ]]; do
  case $1 in
    --ssh-user) SSH_USER="$2"; shift 2;;
    --ssh-host) SSH_HOST="$2"; shift 2;;
    --mail-host) MAIL_HOST="$2"; shift 2;;
    --out) OUT_DIR="$2"; shift 2;;
  --ssh-pass) SSH_PASS="$2"; shift 2;;
    -h|--help) echo "Usage: $0 --ssh-user <user> --ssh-host <host> [--mail-host <host>] [--out <dir>]"; exit 0;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

if [[ -z "$SSH_USER" || -z "$SSH_HOST" ]]; then
  echo "--ssh-user and --ssh-host são obrigatórios (ex: felipe plesk.metodoatuarial.com.br)"
  exit 1
fi

# Normalizar usuário SSH: se usuário foi passado como email (felipe@dominio),
# usar somente a parte antes do @ para a conexão SSH (usuário do sistema).
if [[ "$SSH_USER" == *@* ]]; then
  SSH_USER_CLEAN="${SSH_USER%@*}"
  echo "Aviso: ssh user continha '@' — usando usuário limpo: $SSH_USER_CLEAN"
else
  SSH_USER_CLEAN="$SSH_USER"
fi

mkdir -p "$OUT_DIR"

echo "Salvando informações em: $OUT_DIR"

# Função para rodar comando remoto via ssh e salvar saída
run_remote() {
  local label="$1"; shift
  local cmd="$*"
  echo "--- REMOTO: $label ---" > "$OUT_DIR/remote_${label}.log"
  # Use sshpass se uma senha foi fornecida e sshpass estiver instalado
  if [[ -n "$SSH_PASS" ]]; then
    if command -v sshpass >/dev/null 2>&1; then
      # Aviso de segurança
      echo "(Usando sshpass — evite passar senhas em comandos públicos; prefira chaves SSH)" >> "$OUT_DIR/remote_${label}.log"
      sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "${SSH_USER_CLEAN}@${SSH_HOST}" "bash -lc '$cmd'" >> "$OUT_DIR/remote_${label}.log" 2>&1 || true
    else
      echo "sshpass não encontrado — conectando interativamente (pode pedir senha)" >> "$OUT_DIR/remote_${label}.log"
      ssh "${SSH_USER_CLEAN}@${SSH_HOST}" "bash -lc '$cmd'" >> "$OUT_DIR/remote_${label}.log" 2>&1 || true
    fi
  else
    ssh "${SSH_USER_CLEAN}@${SSH_HOST}" "bash -lc '$cmd'" >> "$OUT_DIR/remote_${label}.log" 2>&1 || true
  fi
}

# Coleta remota (servidor Plesk)
run_remote "uname" "uname -a"
run_remote "os-release" "cat /etc/os-release || lsb_release -a || echo 'no os-release'"
run_remote "uptime" "uptime"
run_remote "postfix-status" "sudo systemctl status postfix --no-pager || echo 'postfix not found'"
run_remote "dovecot-status" "sudo systemctl status dovecot --no-pager || echo 'dovecot not found'"
run_remote "nginx-status" "sudo systemctl status nginx --no-pager || sudo systemctl status apache2 --no-pager || echo 'no webserver systemd unit found'"
run_remote "postconf" "postconf -n || echo 'postconf not available'"
run_remote "mail-logs" "sudo tail -n 200 /var/log/mail.log || sudo tail -n 200 /var/log/maillog || echo 'no mail log'"
run_remote "installed-pkgs" "(which swaks || true); (which openssl || true); node -v || true; pm2 -v || true"
run_remote "docker-ps" "docker ps --format '{{.Names}}: {{.Image}}' || echo 'docker not available'"

# Coleta local (DNS e conexão ao MX)
echo "--- LOCAL: dns_mx ---" > "$OUT_DIR/dns_mx.log"
dig +short MX "$MAIL_HOST" | tee -a "$OUT_DIR/dns_mx.log" || true

echo "--- LOCAL: dig_spf ---" > "$OUT_DIR/dig_spf.log"
dig +short TXT "$MAIL_HOST" | grep -i spf || dig +short TXT "$MAIL_HOST" || true

# Checar resolução/porta 587 (local)
echo "--- LOCAL: smtp_connect_587 ---" > "$OUT_DIR/smtp_connect_587.log"
( echo 'QUIT' | timeout 8 bash -c "cat <(echo 'QUIT') | openssl s_client -starttls smtp -connect ${MAIL_HOST}:587 2>/dev/null" ) >> "$OUT_DIR/smtp_connect_587.log" 2>&1 || true

# Gerar resumo
cat > "$OUT_DIR/README.txt" <<EOF
Relatório de coleta de email - $(date -u)
SSH target: ${SSH_USER}@${SSH_HOST}
Mail host (testado): ${MAIL_HOST}
Arquivos: 
$(ls -1 "$OUT_DIR")

Recomendações iniciais:
 - Verificar status de postfix/dovecot nos logs remotos
 - Confirmar que porta 587 está aceitando STARTTLS
 - Verificar se swaks está instalado no servidor para testes mais completos
EOF

echo "Coleta concluída. Veja: $OUT_DIR"

echo "Para empacotar resultados em um tar.gz:"
echo "  tar -czf ${OUT_DIR}.tar.gz -C $(dirname "$OUT_DIR") $(basename "$OUT_DIR")"

exit 0
