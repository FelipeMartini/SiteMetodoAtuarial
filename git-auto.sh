#!/bin/bash
# Script profissional para automatizar git add/commit/push com prompts seguros
printf "${GREEN}Status atual:${NC}\n"
  exit 0
  exit 1
BRANCH=$(git rev-parse --abbrev-ref HEAD)
set -euo pipefail

# Cores para feedback visual
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

printf "${YELLOW}Iniciando fluxo automatizado de git add/commit/push...${NC}\n"

# Verifica se está em um repositório git
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  printf "${RED}Erro: Não está em um repositório git!${NC}\n"
  exit 1
fi

# Se argumento for passado, roda modo automático (sem prompt)
if [[ $# -ge 1 ]]; then
  MSG="$1"
  if [[ -z "$MSG" ]]; then
    printf "${RED}Mensagem de commit não pode ser vazia!${NC}\n"
    exit 1
  fi
  printf "${GREEN}Modo automático: git add . && git commit -m \"$MSG\" && git push${NC}\n"
  git add .
  git commit -m "$MSG"
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  git push origin "$BRANCH"
  printf "${GREEN}Push realizado com sucesso!${NC}\n"
  exit 0
fi

# Modo interativo (padrão)
printf "${GREEN}Status atual:${NC}\n"
git status

else
read -p "Deseja adicionar todos os arquivos alterados? (s/n) " ADDALL
if [[ "$ADDALL" =~ ^[sSyY]$ ]]; then
  git add .
else
  echo "Adicione manualmente os arquivos desejados e execute novamente."
  exit 0
fi

  echo "Push cancelado. Commit realizado localmente."
read -p "Digite a mensagem de commit: " MSG
if [[ -z "$MSG" ]]; then
  printf "${RED}Mensagem de commit não pode ser vazia!${NC}\n"
  exit 1
fi

fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
printf "${GREEN}Branch atual: $BRANCH${NC}\n"


read -p "Deseja fazer push para o branch '$BRANCH'? (s/n) " PUSH
if [[ "$PUSH" =~ ^[sSyY]$ ]]; then
  git push origin "$BRANCH"
  printf "${GREEN}Push realizado com sucesso!${NC}\n"
else
  echo "Push cancelado. Commit realizado localmente."
fi
