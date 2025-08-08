#!/bin/bash
# Script: depend-outdated.sh
# Lista dependências desatualizadas (detalhado)
# Uso: ./depend-outdated.sh

set -e
cd "$(dirname "$0")/../site-metodo"

echo "[depend-outdated] Listando dependências desatualizadas:"
npm outdated --long || true
