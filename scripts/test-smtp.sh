#!/usr/bin/env bash
set -euo pipefail

# Testa envio SMTP usando swaks se disponível, ou openssl + EHLO
# Uso: ./scripts/test-smtp.sh --server mail.metodoatuarial.com.br --port 587 --user mail@metodoatuarial.com.br

SERVER="mail.metodoatuarial.com.br"
PORT=587
USER=""
PASS=""
TO="destino@exemplo.com"
FROM="mail@metodoatuarial.com.br"

while [[ $# -gt 0 ]]; do
  case $1 in
    --server) SERVER="$2"; shift 2;;
    --port) PORT="$2"; shift 2;;
    --user) USER="$2"; shift 2;;
    --pass) PASS="$2"; shift 2;;
    --to) TO="$2"; shift 2;;
    --from) FROM="$2"; shift 2;;
    -h|--help) echo "Usage: $0 --server <host> --port <port> --user <user> --pass <pass> --to <dest>"; exit 0;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

if command -v swaks >/dev/null 2>&1; then
  echo "Using swaks to send test email (swaks found)"
  swaks --to "$TO" --from "$FROM" --server "$SERVER:$PORT" --auth LOGIN --auth-user "$USER" --auth-password "$PASS" --tls
  exit $?
fi

# Fallback: try openssl + manual SMTP conversation (best-effort)
{
  echo "VERIFICANDO CONEXÃO TLS com $SERVER:$PORT"
  echo "QUIT" | timeout 10 openssl s_client -starttls smtp -connect "$SERVER:$PORT" 2>/dev/null | sed -n '1,200p'
} || true

cat <<EOF

Nota: se swaks não estiver instalado, instale via apt/yum: 'apt install swaks' ou 'yum install swaks'
EOF

exit 0
