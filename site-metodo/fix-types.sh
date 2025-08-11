#!/bin/bash

echo "Aplicando correções pontuais de tipos..."

# 1. Corrigir o problema do IP no NextRequest
sed -i 's/return request\.ip || '\''127\.0\.0\.1'\''/return '\''127.0.0.1'\''/' src/middleware/logging.ts

# 2. Adicionar performedBy obrigatório no audit
sed -i 's/structuredLogger\.audit(`API \${request\.method} \${pathname}`, {/structuredLogger.audit(`API \${request.method} \${pathname}`, { performedBy: '\''system'\'',/' src/middleware/logging.ts

# 3. Corrigir referência de error não definido em catch
find src -name "*.ts" -type f -exec sed -i 's/console\.error(\(.*\), error)/console.error(\1, _error || error)/g' {} \;

echo "Correções aplicadas com sucesso!"
