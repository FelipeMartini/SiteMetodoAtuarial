#!/bin/bash
# Script: depend-remove.sh
# Remove uma dependência do projeto
# Uso: ./depend-remove.sh <pacote>

set -e
cd "$(dirname "$0")/../site-metodo"

if [ -z "$1" ]; then
  echo "[depend-remove] Informe o nome do pacote a ser removido."
  exit 1
fi

echo "[depend-remove] Removendo dependência: $1"
npm remove "$1"
