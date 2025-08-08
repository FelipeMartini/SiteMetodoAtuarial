#!/bin/bash
# Script: depend-add.sh
# Adiciona uma dependência ao projeto (npm install <pacote> [flags])
# Uso: ./depend-add.sh <pacote> [flags]

set -e
cd "$(dirname "$0")/../site-metodo"

if [ -z "$1" ]; then
  echo "[depend-add] Informe o nome do pacote a ser instalado."
  exit 1
fi

echo "[depend-add] Instalando dependência: $@"
npm install "$@"
