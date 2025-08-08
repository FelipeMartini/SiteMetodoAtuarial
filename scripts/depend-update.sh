#!/bin/bash
# Script: depend-update.sh
# Atualiza dependências do projeto (todas, específicas ou modo interativo)
# Uso: ./depend-update.sh [all|interactive|<pacote>]

set -e
cd "$(dirname "$0")/../site-metodo"

if ! command -v ncu &> /dev/null; then
  echo "[depend-update] npm-check-updates não encontrado. Usando npx."
  NCU="npx npm-check-updates"
else
  NCU="ncu"
fi

case "$1" in
  all)
    echo "[depend-update] Atualizando todas as dependências para as últimas versões..."
    $NCU -u && npm install
    ;;
  interactive)
    echo "[depend-update] Modo interativo para atualização de dependências..."
    $NCU -i && npm install
    ;;
  "")
    echo "[depend-update] Checando dependências desatualizadas..."
    $NCU
    ;;
  *)
    echo "[depend-update] Atualizando dependência específica: $1"
    $NCU -u -f "$1" && npm install
    ;;
esac
