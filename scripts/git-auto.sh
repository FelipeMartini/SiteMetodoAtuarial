#!/bin/bash
# Script profissional para automatizar git add/commit/push com prompts seguros
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


# Sempre roda na raiz do repositório
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

# Se argumento for passado, roda modo automático (sem prompt)
if [[ $# -ge 1 ]]; then
  MSG="$1"
  if [[ -z "$MSG" ]]; then
    printf "${RED}Mensagem de commit não pode ser vazia!${NC}\n"
    exit 1
  fi
  printf "${GREEN}Modo automático: versionamento, changelog e push automático${NC}\n"
  # Gera/atualiza CHANGELOG.md e faz versionamento
  npx standard-version --commit-all --release-as patch --skip.tag || true
  # Adiciona tudo (inclui CHANGELOG.md e arquivos fora de site-metodo)
  git add .
  # Commit e push
  if git diff --cached --quiet; then
    printf "${YELLOW}Nenhuma alteração para commit.${NC}\n"
  else
    git commit -m "$MSG"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    git push origin "$BRANCH"
    printf "${GREEN}Push realizado com sucesso!${NC}\n"
  fi
  exit 0
fi

# Modo interativo (padrão)
printf "${GREEN}Status atual:${NC}\n"
git status
read -p "Deseja adicionar todos os arquivos alterados? (s/n) " ADDALL
if [[ "$ADDALL" =~ ^[sSyY]$ ]]; then
  git add .
else
  echo "Adicione manualmente os arquivos desejados e execute novamente."
  exit 0
fi

echo "Push cancelado. Commit realizado localmente."
