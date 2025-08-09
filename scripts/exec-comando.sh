#!/bin/bash
# Script seguro para execução controlada de comandos no workspace
WORKSPACE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
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




# Garante que as pastas de lista e logs existem
mkdir -p "$LOGDIR"
mkdir -p "$WORKSPACE_DIR/Yprograma-comandos/lista"

# Testa permissão de escrita
if ! touch "$LOGDIR/teste-permissao.log" 2>/dev/null; then
  echo -e "${RED}[ERRO]${NC} Sem permissão de escrita em '$LOGDIR'. Tente rodar como usuário com permissão ou ajuste as permissões."
  exit 10
fi
rm -f "$LOGDIR/teste-permissao.log"

# Garante que arquivos de lista existem
touch "$LISTA_PERMITIDOS" "$LISTA_BLOQUEADOS" "$LISTA_PENDENTES"

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


# Se não está na lista de permitidos, negar automaticamente em modo não interativo (stdin ou stdout não são TTY)
if [ ! -t 0 ] || [ ! -t 1 ]; then
  echo -e "${YELLOW}[NEGADO] Comando não autorizado (execução não-interativa).${NC}"
  echo "$(date) [NEGADO-NONINTERACTIVE] $comando" >> "$LOGFILE"
  exit 4
fi


# NUNCA abrir prompt. Negar comandos não permitidos SEMPRE, sem input.
echo -e "${YELLOW}[NEGADO] Comando não autorizado.${NC}"
echo "$(date) [NEGADO] $comando" >> "$LOGFILE"
exit 4
