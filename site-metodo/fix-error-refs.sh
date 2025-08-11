#!/bin/bash

echo "Corrigindo referências error após catch (_error)..."

# Lista de arquivos que têm } catch (_error) {
files=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "} catch (_error)" 2>/dev/null)

for file in $files; do
  echo "Processando: $file"
  
  # Dentro destes arquivos, substituir String(error) por String(_error)
  sed -i 's/String(error)/String(_error)/g' "$file"
  
  # Substituir console.error('...', error) por console.error('...', _error)
  sed -i 's/console\.error(\([^)]*\), error)/console.error(\1, _error)/g' "$file"
  
  # Substituir throw error por throw _error (quando há catch (_error))
  sed -i 's/throw error/throw _error/g' "$file"
  
  # Substituir if (error instanceof por if (_error instanceof
  sed -i 's/if (error instanceof/if (_error instanceof/g' "$file"
  
  # Substituir error.message por _error.message
  sed -i 's/error\.message/_error.message/g' "$file"
done

echo "Correções aplicadas!"
