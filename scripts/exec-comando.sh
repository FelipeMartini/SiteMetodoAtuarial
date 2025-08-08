#!/bin/bash
# Script seguro para execução controlada de comandos no workspace
# Uso: ./exec-comando.sh "comando"

WORKSPACE_DIR="$(dirname $(dirname "$0"))"
LISTA_PERMITIDOS="$WORKSPACE_DIR/Yprograma-comandos/lista/comandos_permitidos.txt"
LISTA_BLOQUEADOS="$WORKSPACE_DIR/Yprograma-comandos/lista/comandos_bloqueados.txt"
LISTA_PENDENTES="$WORKSPACE_DIR/Yprograma-comandos/lista/comandos_pendentes.txt"
LOGDIR="$WORKSPACE_DIR/Yprograma-comandos/logs"
LOGFILE="$LOGDIR/exec-comando-$(date +%Y%m%d).log"

# Funções de cor
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

comando="$1"


# Garante que a pasta de logs existe
mkdir -p "$LOGDIR"

if [ -z "$comando" ]; then
  echo -e "${YELLOW}[ERRO]${NC} Nenhum comando informado."
  exit 1
fi

# Normaliza comando (pega só o nome base)
comando_base=$(echo "$comando" | awk '{print $1}')

# Verifica lista negra
if grep -Fxq "$comando_base" "$LISTA_BLOQUEADOS"; then
  echo -e "${RED}[BLOQUEADO] Comando proibido: $comando_base${NC}"
  echo "$(date) [BLOQUEADO] $comando" >> "$LOGFILE"
  exit 2
fi

# Verifica lista branca
if grep -Fxq "$comando_base" "$LISTA_PERMITIDOS"; then
  # Restrição: só permite comandos no workspace
  if [[ "$comando" == *..* || "$comando" == /* ]]; then
    echo -e "${RED}[ERRO] Caminho proibido no comando: $comando${NC}"
    echo "$(date) [CAMINHO PROIBIDO] $comando" >> "$LOGFILE"
    exit 3
  fi
  echo -e "${GREEN}[EXECUTANDO]$NC $comando"
  echo "$(date) [EXECUTADO] $comando" >> "$LOGFILE"
  eval "$comando"
  exit $?
fi

# Se não está em nenhuma lista, adiciona à lista de pendentes
if ! grep -Fxq "$comando_base" "$LISTA_PENDENTES"; then
  echo "$comando_base" >> "$LISTA_PENDENTES"
fi

# Prompt simples para aprovação
read -p "Comando '$comando_base' não está na lista. Deseja executar? [s/N]: " resp
if [[ "$resp" =~ ^[sS]$ ]]; then
  echo -e "${YELLOW}[ATENÇÃO] Execução manual autorizada.${NC}"
  echo "$(date) [EXECUCAO MANUAL] $comando" >> "$LOGFILE"
  eval "$comando"
  exit $?
else
  echo -e "${YELLOW}[NEGADO] Comando não autorizado.${NC}"
  echo "$(date) [NEGADO] $comando" >> "$LOGFILE"
  exit 4
fi
