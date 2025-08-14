#!/usr/bin/env bash
set -euo pipefail

# Script para detectar e remover duplicatas em casbin_rule
# Uso:
#  ./dedupe-casbin-rules.sh        -> dry-run (lista e salva backup das duplicatas)
#  ./dedupe-casbin-rules.sh --apply -> aplica remoção (mantém o menor id por grupo)

WORKDIR="/home/felipe/Área de Trabalho/GitHub/SiteMetodoAtuarial/site-metodo"
DB_PATH="$WORKDIR/prisma/db/dev.db"
XLOGS_DIR="$WORKDIR/../XLOGS"
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
BACKUP_FILE="$XLOGS_DIR/casbin-duplicates-backup-$TIMESTAMP.json"
GROUPS_FILE="$XLOGS_DIR/casbin-duplicate-groups-$TIMESTAMP.json"

if [ ! -f "$DB_PATH" ]; then
  echo "Banco de dados não encontrado em: $DB_PATH" >&2
  exit 1
fi

mkdir -p "$XLOGS_DIR"

echo "Detectando grupos duplicados em casbin_rule..."
sqlite3 -json "$DB_PATH" "SELECT ptype, v0, v1, v2, v3, v4, v5, COUNT(*) AS cnt, GROUP_CONCAT(id) AS ids FROM casbin_rule GROUP BY ptype, v0, v1, v2, v3, v4, v5 HAVING cnt>1 ORDER BY cnt DESC;" > "$GROUPS_FILE"

echo "Backup (linhas duplicadas) sendo exportado para: $BACKUP_FILE"
# Exportar todas as linhas que fazem parte de algum grupo duplicado
sqlite3 -json "$DB_PATH" "SELECT * FROM casbin_rule WHERE (SELECT COUNT(*) FROM casbin_rule r2 WHERE IFNULL(r2.ptype,'')=IFNULL(casbin_rule.ptype,'') AND IFNULL(r2.v0,'')=IFNULL(casbin_rule.v0,'') AND IFNULL(r2.v1,'')=IFNULL(casbin_rule.v1,'') AND IFNULL(r2.v2,'')=IFNULL(casbin_rule.v2,'') AND IFNULL(r2.v3,'')=IFNULL(casbin_rule.v3,'') AND IFNULL(r2.v4,'')=IFNULL(casbin_rule.v4,'') AND IFNULL(r2.v5,'')=IFNULL(casbin_rule.v5,''))>1;" > "$BACKUP_FILE"

echo "Resumo (grupos duplicados):"
sqlite3 "$DB_PATH" "SELECT ptype || ' | ' || IFNULL(v0,'') || ' | ' || IFNULL(v1,'') || ' | ' || IFNULL(v2,'') || ' | ' || IFNULL(v3,'') || ' | ' || IFNULL(v4,'') || ' | ' || IFNULL(v5,'') as rule, COUNT(*) as cnt, GROUP_CONCAT(id) as ids FROM casbin_rule GROUP BY ptype, v0, v1, v2, v3, v4, v5 HAVING cnt>1 ORDER BY cnt DESC LIMIT 200;"

if [ "${1-}" = "--apply" ]; then
  echo "Aplicando remoção de duplicatas: manteremos o menor id de cada grupo. (TRANSACTION)"
  sqlite3 "$DB_PATH" <<SQL
BEGIN TRANSACTION;
DELETE FROM casbin_rule WHERE id NOT IN (
  SELECT MIN(id) FROM casbin_rule GROUP BY ptype, v0, v1, v2, v3, v4, v5
);
COMMIT;
SQL
  echo "Remoção aplicada. Mantive uma linha por grupo. Backup salvo em: $BACKUP_FILE"
else
  echo "Dry-run concluído. Para aplicar, execute: $0 --apply"
fi

exit 0
