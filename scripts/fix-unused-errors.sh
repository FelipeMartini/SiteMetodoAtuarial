#!/bin/bash

# Script para corrigir warnings de _error não utilizados

files_to_fix=(
    "src/app/api/auth/custom-callbacks/apple/route.ts"
    "src/app/api/usuario/definir-senha/route.ts"
    "src/app/api/usuarios/[id]/route.ts"
    "src/components/admin/data-table/usePersistenciaTabela.ts"
    "src/components/admin/users-table.tsx"
    "src/components/form/FormularioContato.tsx"
    "src/components/ui/toast-notifications.tsx"
)

for file in "${files_to_fix[@]}"; do
    if [[ -f "$file" ]]; then
        echo "Corrigindo $file..."
        # Procura por catch (_error) que não usa _error no bloco
        if grep -q "} catch (_error) {" "$file" && ! grep -A 10 "} catch (_error) {" "$file" | grep -q "_error"; then
            sed -i 's/} catch (_error) {/} catch {/g' "$file"
            echo "  - Removido parâmetro _error não utilizado"
        fi
    fi
done

echo "Correções concluídas!"
