#!/bin/bash
# Wrapper robusto para auto-restart do refatorar-estrutura.js
# Reinicia automaticamente se o script pedir (exit code 42)

cd "$(dirname "$0")/.."

while true; do
  node scripts/refatorar-estrutura.js
  code=$?
  if [ "$code" -eq 0 ]; then
    exit 0
  elif [ "$code" -eq 42 ]; then
    echo -e "\033[1;33m[WRAPPER] Reiniciando refatoração após instalação de dependências...\033[0m"
    sleep 1
    continue
  else
    echo -e "\033[1;31m[WRAPPER] Refatoração falhou com código $code.\033[0m"
    exit $code
  fi
done
