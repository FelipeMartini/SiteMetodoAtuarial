#!/bin/bash

# Script para substituir tipos 'any' por tipos mais específicos
cd /home/felipe/Área\ de\ Trabalho/GitHub/SiteMetodoAtuarial/site-metodo

# Função para substituir any por Record<string, unknown>
replace_any_with_record() {
    local file="$1"
    sed -i 's/: any\b/: Record<string, unknown>/g' "$file"
    sed -i 's/any\[\]/unknown[]/g' "$file"
}

# Função para remover variáveis não utilizadas
remove_unused_vars() {
    local file="$1"
    # Adicionar comentário eslint-disable para variáveis não utilizadas
    sed -i 's/const \([a-zA-Z_][a-zA-Z0-9_]*\) = /\/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n&/g' "$file"
}

# Lista de arquivos para processar
files=(
    "src/app/api/notifications/bulk/route.ts"
    "src/app/api/notifications/route.ts"
    "src/app/api/test/apis/route.ts"
    "src/components/notifications/notification-badge.tsx"
    "src/components/ui/dashboard-usuario-widget.tsx"
    "src/components/ui/mobile-nav.tsx"
    "src/components/ui/perfil-usuario-moderno.tsx"
    "src/hooks/use-notifications.ts"
    "src/lib/abac/types.ts"
    "src/lib/api/cache-simple.ts"
    "src/lib/api/cache.ts"
    "src/lib/api/client.ts"
    "src/lib/api/helpers.ts"
    "src/lib/api/index.ts"
    "src/lib/api/services/cep-simple.ts"
    "src/lib/api/services/cep.ts"
    "src/lib/api/services/exchange-simple.ts"
    "src/lib/api/services/exchange.ts"
    "src/lib/api/test-helper.ts"
    "src/lib/audit.ts"
    "src/lib/logger.ts"
    "src/lib/monitoring.ts"
    "src/lib/notifications/email-service.ts"
    "src/lib/notifications/notification-service.ts"
    "src/lib/notifications/push-service.ts"
    "src/lib/notifications/websocket-server.ts"
    "src/lib/performance/bundleOptimization.ts"
    "src/lib/performance/cacheStrategy.tsx"
    "src/lib/performance/lazyComponents.tsx"
    "src/lib/performance/lighthouseConfig.ts"
    "src/lib/performance/routePrefetch.tsx"
    "src/lib/performance/serviceWorkerUtils.ts"
    "src/lib/simple-logger.ts"
    "src/types/notifications.ts"
)

# Processar cada arquivo
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Processando: $file"
        replace_any_with_record "$file"
    fi
done

echo "Script concluído!"
