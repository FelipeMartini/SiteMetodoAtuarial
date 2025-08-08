#!/bin/bash
# Script: depend-install.sh
# Instala dependências do projeto de forma limpa (npm ci) ou padrão (npm install)
# Uso: ./depend-install.sh [ci|install]

set -e
cd "$(dirname "$0")/../site-metodo"

if [ "$1" = "ci" ]; then
  echo "[depend-install] Executando: npm ci (instalação limpa e reprodutível)"
  npm ci
else
  echo "[depend-install] Executando: npm install (instalação padrão)"
  npm install
fi
