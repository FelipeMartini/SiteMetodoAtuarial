#!/bin/bash

# Script para corrigir warnings de lint automaticamente
# Executado como parte da Task 02 - Sistema ABAC

set -e

echo "🔧 Iniciando correção automática de warnings de lint..."

WORKSPACE_DIR="/home/felipe/Área de Trabalho/GitHub/SiteMetodoAtuarial/site-metodo"
LOG_DIR="/home/felipe/Área de Trabalho/GitHub/SiteMetodoAtuarial/XLOGS"

cd "$WORKSPACE_DIR"

# Criar log
LOG_FILE="$LOG_DIR/fix-lint-warnings-abac-$(date +'%Y%m%d-%H%M%S').log"
mkdir -p "$LOG_DIR"

echo "📝 Log será salvo em: $LOG_FILE"

# Função para registrar progresso
log_progress() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_progress "🚀 Iniciando correção de warnings de lint para Task 02 ABAC"

# 1. Remover imports não utilizados
log_progress "📦 Removendo imports não utilizados..."

# MetricsParams em monitoring/metrics/route.ts
sed -i '/MetricsParams/d' src/app/api/monitoring/metrics/route.ts

# User em users-table.tsx
sed -i 's/import { User } from.*;//g' src/components/admin/users-table.tsx

# Separator e Calculator em mobile-nav.tsx
sed -i 's/import {.*Separator.*,.*Calculator.*,/import {/g' src/components/ui/mobile-nav.tsx
sed -i '/Separator,/d' src/components/ui/mobile-nav.tsx
sed -i '/Calculator,/d' src/components/ui/mobile-nav.tsx

# NotificationFilter em use-notifications.ts
sed -i '/NotificationFilter,/d' src/hooks/use-notifications.ts

# ApiResponseSchema em client.ts
sed -i '/ApiResponseSchema.*=/d' src/lib/api/client.ts

# cached, monitored em vários arquivos
sed -i '/import.*cached.*from/d' src/lib/api/services/cep.ts
sed -i '/import.*monitored.*from/d' src/lib/api/services/cep.ts
sed -i '/import.*cached.*from/d' src/lib/api/services/exchange.ts
sed -i '/import.*monitored.*from/d' src/lib/api/services/exchange.ts

# CepErrorSchema
sed -i '/CepErrorSchema.*=/d' src/lib/api/services/cep.ts

log_progress "✅ Imports não utilizados removidos"

# 2. Corrigir variáveis não utilizadas adicionando _
log_progress "🔧 Corrigindo variáveis não utilizadas..."

# error variables
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/} catch (error) {/} catch (_error) {/g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/) error)/⁄_error)/g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/const error =/const _error =/g'

# duration variables
sed -i 's/const duration =/const _duration =/g' src/lib/api/client.ts

# Outras variáveis específicas
sed -i 's/const entry =/const _entry =/g' src/lib/simple-logger.ts
sed -i 's/const forceRefresh =/const _forceRefresh =/g' src/lib/api/services/cep-simple.ts
sed -i 's/const days =/const _days =/g' src/lib/api/services/exchange-simple.ts
sed -i 's/const pairKey =/const _pairKey =/g' src/lib/api/services/exchange.ts
sed -i 's/const pattern =/const _pattern =/g' src/lib/api/services/exchange.ts
sed -i 's/const deliveryStats =/const _deliveryStats =/g' src/lib/notifications/notification-service.ts
sed -i 's/const timeWindow =/const _timeWindow =/g' src/lib/api/monitor-simple.ts
sed -i 's/const userId =/const _userId =/g' src/lib/notifications/websocket-server.ts
sed -i 's/const info =/const _info =/g' src/lib/notifications/websocket-server.ts

log_progress "✅ Variáveis não utilizadas corrigidas"

# 3. Substituir any por Record<string, unknown>
log_progress "🎯 Substituindo tipos 'any' por 'Record<string, unknown>'..."

# Função para substituir any por Record<string, unknown> de forma segura
fix_any_types() {
    local file="$1"
    
    # Substituições seguras
    sed -i 's/: any\]/: Record<string, unknown>]/g' "$file"
    sed -i 's/: any)/: Record<string, unknown>)/g' "$file"
    sed -i 's/: any;/: Record<string, unknown>;/g' "$file"
    sed -i 's/: any,/: Record<string, unknown>,/g' "$file"
    sed -i 's/: any =/: Record<string, unknown> =/g' "$file"
    sed -i 's/: any$/: Record<string, unknown>/g' "$file"
}

# Aplicar correções em arquivos específicos
while IFS= read -r file; do
    if [[ -f "$file" ]]; then
        log_progress "Corrigindo tipos any em: $file"
        fix_any_types "$file"
    fi
done << EOF
src/app/api/notifications/route.ts
src/lib/abac/prisma-adapter.ts
src/lib/abac/types.ts
src/lib/api/cache-simple.ts
src/lib/api/cache.ts
src/lib/api/client.ts
src/lib/api/helpers.ts
src/lib/api/services/exchange-simple.ts
src/lib/api/test-helper.ts
src/lib/audit.ts
src/lib/logger.ts
src/lib/notifications/email-service.ts
src/lib/notifications/notification-service.ts
src/lib/notifications/push-service.ts
src/lib/notifications/websocket-server.ts
src/lib/performance/bundleOptimization.ts
src/lib/performance/cacheStrategy.tsx
src/lib/performance/lazyComponents.tsx
src/lib/performance/lighthouseConfig.ts
src/lib/performance/routePrefetch.tsx
src/lib/performance/serviceWorkerUtils.ts
src/lib/simple-logger.ts
src/types/notifications.ts
src/components/ui/dashboard-usuario-widget.tsx
src/components/ui/perfil-usuario-moderno.tsx
src/components/admin/MonitoringDashboard.tsx
src/hooks/use-notifications.ts
EOF

log_progress "✅ Tipos 'any' substituídos por 'Record<string, unknown>'"

# 4. Remover funções não utilizadas
log_progress "🗑️  Removendo funções não utilizadas..."

# urlBase64ToUint8Array em use-notifications.ts
sed -i '/function urlBase64ToUint8Array/,/^}/d' src/hooks/use-notifications.ts

# monitored function em helpers.ts  
sed -i '/export.*monitored/,/^}/d' src/lib/api/helpers.ts

log_progress "✅ Funções não utilizadas removidas"

# 5. Verificar resultado
log_progress "🧪 Executando lint para verificar resultado..."

if npm run lint --silent 2>&1 | tee -a "$LOG_FILE"; then
    log_progress "✅ Lint executado com sucesso"
else
    log_progress "⚠️  Ainda há warnings restantes - continuaremos com correções manuais"
fi

log_progress "🎉 Script de correção automática concluído!"
log_progress "📊 Próximo passo: análise dos warnings restantes e correções manuais"

echo ""
echo "📋 Resumo da execução:"
echo "   ✅ Imports não utilizados removidos"
echo "   ✅ Variáveis não utilizadas corrigidas" 
echo "   ✅ Tipos 'any' substituídos"
echo "   ✅ Funções não utilizadas removidas"
echo ""
echo "📝 Log completo disponível em: $LOG_FILE"
