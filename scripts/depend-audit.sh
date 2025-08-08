#!/bin/bash
# Script: depend-audit.sh
# Checa e corrige vulnerabilidades de dependências
# Uso: ./depend-audit.sh [fix]

set -e
cd "$(dirname "$0")/../site-metodo"

if [ "$1" = "fix" ]; then
  echo "[depend-audit] Corrigindo vulnerabilidades automaticamente (npm audit fix)"
  npm audit fix
else
  echo "[depend-audit] Checando vulnerabilidades (npm audit)"
  npm audit
fi
