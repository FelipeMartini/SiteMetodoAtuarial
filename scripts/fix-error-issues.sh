#!/bin/bash

# Script para corrigir as referências error.issues para _error.issues nos blocos catch

echo "Iniciando correção das referências error.issues..."

# Lista de arquivos a serem corrigidos
FILES=(
    "site-metodo/src/app/api/abac/roles/route.ts"
    "site-metodo/src/app/api/exchange/route.ts"
    "site-metodo/src/app/api/monitoring/apis/route.ts"
    "site-metodo/src/app/api/cep/route.ts"
)

# Para cada arquivo, encontrar blocos catch (_error) e corrigir error.issues
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Processando: $file"
        
        # Fazer backup
        cp "$file" "$file.bak"
        
        # Usar sed para corrigir dentro de blocos catch (_error)
        # Procurar por catch (_error) e nas próximas linhas substituir error.issues por _error.issues
        awk '
        BEGIN { in_catch_block = 0 }
        /catch \(_error\)/ { in_catch_block = 1 }
        /^[ ]*}[ ]*$/ && in_catch_block { in_catch_block = 0 }
        in_catch_block && /error\.issues/ { gsub(/error\.issues/, "_error.issues") }
        { print }
        ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        
        echo "Corrigido: $file"
    else
        echo "Arquivo não encontrado: $file"
    fi
done

echo "Correção concluída!"
