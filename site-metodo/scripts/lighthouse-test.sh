#!/bin/bash

# Script para executar testes de performance com Lighthouse
# Automatiza análise e gera relatórios detalhados

set -e

# === CONFIGURAÇÕES ===

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
REPORTS_DIR="$PROJECT_ROOT/lighthouse-reports"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
REPORT_FILE="$REPORTS_DIR/lighthouse-report-$TIMESTAMP.json"
HTML_REPORT="$REPORTS_DIR/lighthouse-report-$TIMESTAMP.html"

# URLs para testar
URLS=(
    "http://localhost:3000/"
    "http://localhost:3000/auth/login"
    "http://localhost:3000/dashboard"
    "http://localhost:3000/admin/dashboard"
)

# Configurações do Lighthouse
LIGHTHOUSE_CONFIG="$PROJECT_ROOT/src/lib/performance/lighthouse.config.js"
CHROME_FLAGS="--headless --disable-gpu --no-sandbox --disable-dev-shm-usage"

# === FUNÇÕES ===

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[ERROR] $1" >&2
    exit 1
}

check_dependencies() {
    log "Verificando dependências..."
    
    if ! command -v lighthouse >/dev/null 2>&1; then
        log "Instalando Lighthouse..."
        npm install -g lighthouse@latest
    fi
    
    if ! command -v google-chrome >/dev/null 2>&1 && ! command -v chromium-browser >/dev/null 2>&1; then
        error "Chrome/Chromium não encontrado. Instale Google Chrome ou Chromium."
    fi
    
    log "Dependências verificadas."
}

check_server() {
    log "Verificando se servidor está rodando..."
    
    if ! curl -s http://localhost:3000 >/dev/null; then
        log "Servidor não está rodando. Iniciando..."
        cd "$PROJECT_ROOT"
        npm run dev &
        SERVER_PID=$!
        
        # Aguardar servidor inicializar
        for i in {1..30}; do
            if curl -s http://localhost:3000 >/dev/null; then
                log "Servidor iniciado com sucesso."
                return 0
            fi
            sleep 2
        done
        
        error "Falha ao iniciar servidor."
    fi
    
    log "Servidor está rodando."
}

create_lighthouse_config() {
    log "Criando configuração do Lighthouse..."
    
    cat > "$LIGHTHOUSE_CONFIG" << 'EOF'
module.exports = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 40,
      throughputKbps: 1024,
      cpuSlowdownMultiplier: 1,
    },
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
    emulatedUserAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36',
  },
  audits: [
    'first-contentful-paint',
    'largest-contentful-paint',
    'first-meaningful-paint',
    'speed-index',
    'interactive',
    'cumulative-layout-shift',
    'total-blocking-time',
  ],
  categories: {
    performance: {
      title: 'Performance',
      weight: 1,
    },
    accessibility: {
      title: 'Accessibility',
      weight: 1,
    },
    'best-practices': {
      title: 'Best Practices',
      weight: 1,
    },
    seo: {
      title: 'SEO',
      weight: 1,
    },
  },
};
EOF
    
    log "Configuração criada: $LIGHTHOUSE_CONFIG"
}

run_lighthouse_test() {
    local url="$1"
    local output_name="$2"
    
    log "Executando teste Lighthouse para: $url"
    
    local json_output="$REPORTS_DIR/raw-$output_name-$TIMESTAMP.json"
    local html_output="$REPORTS_DIR/report-$output_name-$TIMESTAMP.html"
    
    lighthouse "$url" \
        --config-path="$LIGHTHOUSE_CONFIG" \
        --chrome-flags="$CHROME_FLAGS" \
        --output=json,html \
        --output-path="$REPORTS_DIR/temp-$output_name-$TIMESTAMP" \
        --view=false \
        --quiet \
        || error "Falha no teste Lighthouse para $url"
    
    # Mover arquivos para nomes corretos
    mv "$REPORTS_DIR/temp-$output_name-$TIMESTAMP.report.json" "$json_output"
    mv "$REPORTS_DIR/temp-$output_name-$TIMESTAMP.report.html" "$html_output"
    
    log "Teste concluído: $output_name"
    echo "$json_output"
}

generate_summary_report() {
    log "Gerando relatório resumo..."
    
    local summary_file="$REPORTS_DIR/summary-$TIMESTAMP.json"
    
    cat > "$summary_file" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "testRun": "$TIMESTAMP",
  "results": []
}
EOF
    
    # Processar cada resultado
    for result_file in "$REPORTS_DIR"/raw-*-"$TIMESTAMP".json; do
        if [[ -f "$result_file" ]]; then
            local page_name=$(basename "$result_file" | sed "s/raw-\(.*\)-$TIMESTAMP.json/\1/")
            
            # Extrair métricas principais usando jq se disponível
            if command -v jq >/dev/null 2>&1; then
                local performance_score=$(jq -r '.lhr.categories.performance.score * 100 | round' "$result_file")
                local accessibility_score=$(jq -r '.lhr.categories.accessibility.score * 100 | round' "$result_file")
                local lcp=$(jq -r '.lhr.audits["largest-contentful-paint"].numericValue' "$result_file")
                local fcp=$(jq -r '.lhr.audits["first-contentful-paint"].numericValue' "$result_file")
                local cls=$(jq -r '.lhr.audits["cumulative-layout-shift"].numericValue' "$result_file")
                
                # Adicionar ao resumo
                jq --arg page "$page_name" \
                   --argjson perf "$performance_score" \
                   --argjson acc "$accessibility_score" \
                   --argjson lcp "$lcp" \
                   --argjson fcp "$fcp" \
                   --argjson cls "$cls" \
                   '.results += [{
                     page: $page,
                     scores: {
                       performance: $perf,
                       accessibility: $acc
                     },
                     coreWebVitals: {
                       lcp: $lcp,
                       fcp: $fcp,
                       cls: $cls
                     }
                   }]' "$summary_file" > "$summary_file.tmp" && mv "$summary_file.tmp" "$summary_file"
            fi
        fi
    done
    
    log "Relatório resumo gerado: $summary_file"
}

check_thresholds() {
    log "Verificando thresholds de performance..."
    
    local failed_tests=0
    
    for result_file in "$REPORTS_DIR"/raw-*-"$TIMESTAMP".json; do
        if [[ -f "$result_file" ]] && command -v jq >/dev/null 2>&1; then
            local page_name=$(basename "$result_file" | sed "s/raw-\(.*\)-$TIMESTAMP.json/\1/")
            local performance_score=$(jq -r '.lhr.categories.performance.score * 100 | round' "$result_file")
            local accessibility_score=$(jq -r '.lhr.categories.accessibility.score * 100 | round' "$result_file")
            
            # Thresholds baseados na página
            local perf_threshold=70
            local acc_threshold=90
            
            if [[ "$page_name" == "home" ]]; then
                perf_threshold=85
                acc_threshold=95
            fi
            
            if (( performance_score < perf_threshold )); then
                log "FALHA: $page_name - Performance: $performance_score < $perf_threshold"
                ((failed_tests++))
            fi
            
            if (( accessibility_score < acc_threshold )); then
                log "FALHA: $page_name - Accessibility: $accessibility_score < $acc_threshold"
                ((failed_tests++))
            fi
            
            if (( performance_score >= perf_threshold && accessibility_score >= acc_threshold )); then
                log "PASSOU: $page_name - Performance: $performance_score, Accessibility: $accessibility_score"
            fi
        fi
    done
    
    if (( failed_tests > 0 )); then
        log "❌ $failed_tests teste(s) falharam nos thresholds"
        return 1
    else
        log "✅ Todos os testes passaram nos thresholds"
        return 0
    fi
}

cleanup() {
    log "Limpando arquivos temporários..."
    
    # Parar servidor se foi iniciado pelo script
    if [[ -n "$SERVER_PID" ]]; then
        log "Parando servidor..."
        kill $SERVER_PID 2>/dev/null || true
    fi
    
    # Remover configuração temporária
    rm -f "$LIGHTHOUSE_CONFIG"
    
    log "Limpeza concluída."
}

# === MAIN ===

main() {
    log "Iniciando testes de performance com Lighthouse"
    
    # Setup
    mkdir -p "$REPORTS_DIR"
    
    # Verificações
    check_dependencies
    check_server
    create_lighthouse_config
    
    # Executar testes
    local test_results=()
    
    for url in "${URLS[@]}"; do
        local page_name
        case "$url" in
            "*/")
                page_name="home"
                ;;
            "*/auth/login")
                page_name="login"
                ;;
            "*/dashboard")
                page_name="dashboard"
                ;;
            "*/admin/dashboard")
                page_name="admin"
                ;;
            *)
                page_name="unknown"
                ;;
        esac
        
        local result_file
        result_file=$(run_lighthouse_test "$url" "$page_name")
        test_results+=("$result_file")
    done
    
    # Gerar relatórios
    generate_summary_report
    
    # Verificar thresholds
    local threshold_result=0
    check_thresholds || threshold_result=$?
    
    # Cleanup
    cleanup
    
    log "Testes concluídos. Relatórios em: $REPORTS_DIR"
    
    # Retornar código de saída baseado nos thresholds
    exit $threshold_result
}

# Trap para cleanup em caso de erro
trap cleanup EXIT

# Executar se chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
