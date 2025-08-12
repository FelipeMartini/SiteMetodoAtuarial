/**
 * Configuração e utilitários para testes de performance com Lighthouse
 * Automatiza análise de performance e acessibilidade
 */

// === CONFIGURAÇÕES LIGHTHOUSE ===

/**
 * Configuração padrão do Lighthouse
 */
export const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    // Configurações de execução
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 40,
      throughputKbps: 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 1024,
      uploadThroughputKbps: 1024,
    },
    // Configurações de coleta
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
    emulatedUserAgent:
      'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Mobile Safari/537.36',
  },
  audits: [
    // Performance
    'first-contentful-paint',
    'largest-contentful-paint',
    'first-meaningful-paint',
    'speed-index',
    'interactive',
    'cumulative-layout-shift',
    'total-blocking-time',

    // SEO
    'meta-description',
    'http-status-code',
    'link-text',
    'crawlable-anchors',
    'is-crawlable',
    'robots-txt',
    'image-alt',

    // Accessibility
    'aria-allowed-attr',
    'aria-hidden-body',
    'aria-hidden-focus',
    'aria-required-attr',
    'aria-roles',
    'aria-valid-attr',
    'button-name',
    'bypass',
    'color-contrast',
    'definition-list',
    'dlitem',
    'document-title',
    'duplicate-id-aria',
    'form-field-multiple-labels',
    'frame-title',
    'heading-order',
    'html-has-lang',
    'html-lang-valid',
    'image-alt',
    'input-image-alt',
    'label',
    'link-name',
    'list',
    'listitem',
    'meta-refresh',
    'meta-viewport',
    'object-alt',
    'tabindex',
    'td-headers-attr',
    'th-has-data-cells',
    'valid-lang',
    'video-caption',

    // Best Practices
    'appcache-manifest',
    'charset',
    'doctype',
    'dom-size',
    'external-anchors-use-rel-noopener',
    'geolocation-on-start',
    'image-aspect-ratio',
    'image-size-responsive',
    'js-libraries',
    'no-document-write',
    'no-vulnerable-libraries',
    'notification-on-start',
    'password-inputs-can-be-pasted-into',
    'uses-http2',
    'uses-passive-event-listeners',
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
}

/**
 * URLs críticas para testar
 */
export const CRITICAL_PAGES = [
  {
    url: '/',
    name: 'HomePage',
    priority: 'high',
    thresholds: {
      performance: 90,
      accessibility: 95,
      'best-practices': 90,
      seo: 95,
    },
  },
  {
    url: '/auth/login',
    name: 'LoginPage',
    priority: 'high',
    thresholds: {
      performance: 85,
      accessibility: 95,
      'best-practices': 90,
      seo: 90,
    },
  },
  {
    url: '/dashboard',
    name: 'Dashboard',
    priority: 'medium',
    thresholds: {
      performance: 80,
      accessibility: 95,
      'best-practices': 85,
      seo: 85,
    },
  },
  {
    url: '/admin/dashboard',
    name: 'AdminDashboard',
    priority: 'medium',
    thresholds: {
      performance: 75,
      accessibility: 95,
      'best-practices': 85,
      seo: 80,
    },
  },
] as const

// === MÉTRICAS CORE WEB VITALS ===

/**
 * Thresholds para Core Web Vitals
 */
export const CORE_WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  lcp: {
    good: 2500, // <= 2.5s
    needsImprovement: 4000, // 2.5s - 4.0s
    // poor: > 4.0s
  },

  // First Input Delay (FID)
  fid: {
    good: 100, // <= 100ms
    needsImprovement: 300, // 100ms - 300ms
    // poor: > 300ms
  },

  // Cumulative Layout Shift (CLS)
  cls: {
    good: 0.1, // <= 0.1
    needsImprovement: 0.25, // 0.1 - 0.25
    // poor: > 0.25
  },

  // First Contentful Paint (FCP)
  fcp: {
    good: 1800, // <= 1.8s
    needsImprovement: 3000, // 1.8s - 3.0s
    // poor: > 3.0s
  },

  // Total Blocking Time (TBT)
  tbt: {
    good: 200, // <= 200ms
    needsImprovement: 600, // 200ms - 600ms
    // poor: > 600ms
  },
} as const

// === FUNÇÕES DE ANÁLISE ===

/**
 * Analisa resultado do Lighthouse
 */
export function analyzeLighthouseResult(result: Record<string, unknown>) {
  const { lhr } = result
  const { audits, categories } = lhr as Record<string, unknown>

  // Scores das categorias
  const scores = {
    performance: Math.round((categories as any).performance.score * 100),
    accessibility: Math.round((categories as any).accessibility.score * 100),
    bestPractices: Math.round((categories as any)['best-practices'].score * 100),
    seo: Math.round((categories as any).seo.score * 100),
  }

  // Core Web Vitals
  const coreWebVitals = {
    lcp: (audits as any)['largest-contentful-paint']?.numericValue || 0,
    fid: (audits as any)['max-potential-fid']?.numericValue || 0,
    cls: (audits as any)['cumulative-layout-shift']?.numericValue || 0,
    fcp: (audits as any)['first-contentful-paint']?.numericValue || 0,
    tbt: (audits as any)['total-blocking-time']?.numericValue || 0,
  }

  // Performance metrics
  const performanceMetrics = {
    speedIndex: (audits as any)['speed-index']?.numericValue || 0,
    interactive: (audits as any)['interactive']?.numericValue || 0,
    firstMeaningfulPaint: (audits as any)['first-meaningful-paint']?.numericValue || 0,
  }

  // Opportunities (melhorias de performance)
  const opportunities = Object.values(audits as any)
    .filter(
      (audit: any) =>
        audit.scoreDisplayMode === 'numeric' &&
        audit.score !== null &&
        audit.score < 1 &&
        (audit.details as any)?.overallSavingsMs > 100
    )
    .sort(
      (a: any, b: any) =>
        b.details.overallSavingsMs - a.details.overallSavingsMs
    )
    .slice(0, 10)

  // Diagnostics (problemas gerais)
  const diagnostics = Object.values(audits as any)
    .filter(
      (audit: any) =>
        audit.scoreDisplayMode === 'informative' && audit.score !== null && audit.score < 1
    )
    .slice(0, 10)

  return {
    url: (lhr as any).finalUrl,
    timestamp: (lhr as any).fetchTime,
    scores,
    coreWebVitals,
    performanceMetrics,
    opportunities,
    diagnostics,
    runtime: (lhr as any).timing?.total || 0,
  }
}

/**
 * Avalia se métricas estão dentro dos thresholds
 */
export function evaluateMetrics(
  metrics: Record<string, unknown>,
  thresholds: Record<string, unknown>
) {
  const evaluation = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: {} as Record<string, string>,
  }

  // Avaliar scores das categorias
  Object.entries(thresholds).forEach(([category, threshold]) => {
    const score = (metrics.scores as any)[category]
    const thresholdNum = Number(threshold)
    if (score >= thresholdNum) {
      evaluation.passed++
      evaluation.details[category] = 'passed'
    } else if (score >= thresholdNum - 10) {
      evaluation.warnings++
      evaluation.details[category] = 'warning'
    } else {
      evaluation.failed++
      evaluation.details[category] = 'failed'
    }
  })

  // Avaliar Core Web Vitals
  Object.entries(CORE_WEB_VITALS_THRESHOLDS).forEach(([metric, thresholds]) => {
    const value = (metrics.coreWebVitals as any)[metric]

    if (value <= thresholds.good) {
      evaluation.details[`cwv-${metric}`] = 'good'
    } else if (value <= thresholds.needsImprovement) {
      evaluation.details[`cwv-${metric}`] = 'needs-improvement'
      evaluation.warnings++
    } else {
      evaluation.details[`cwv-${metric}`] = 'poor'
      evaluation.failed++
    }
  })

  return evaluation
}

/**
 * Gera relatório de performance
 */
export function generatePerformanceReport(results: Record<string, unknown>[]) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      averageScores: {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
      },
      coreWebVitalsStatus: {
        good: 0,
        needsImprovement: 0,
        poor: 0,
      },
    },
    pages: results,
    recommendations: [] as string[],
  }

  // Calcular médias
  results.forEach(result => {
    report.summary.averageScores.performance += (result.scores as any).performance
    report.summary.averageScores.accessibility += (result.scores as any).accessibility
    report.summary.averageScores.bestPractices += (result.scores as any).bestPractices
    report.summary.averageScores.seo += (result.scores as any).seo
  })

  Object.keys(report.summary.averageScores).forEach(key => {
    const scores = report.summary.averageScores as any
    scores[key] = Math.round(scores[key] / results.length)
  })

  // Gerar recomendações baseadas nos problemas mais comuns
  const commonIssues = new Map()

  results.forEach(result => {
    const opportunities = (result.opportunities as any) || [];
    opportunities.forEach((opportunity: Record<string, unknown>) => {
      const count = commonIssues.get(opportunity.title) || 0
      commonIssues.set(opportunity.title, count + 1)
    })
  })

  // Top 5 problemas mais comuns
  const topIssues = Array.from(commonIssues.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  report.recommendations = topIssues.map(
    ([issue, count]) => `${issue} (presente em ${count}/${results.length} páginas)`
  )

  return report
}

// === INTEGRAÇÃO COM CI/CD ===

/**
 * Configuração para CI/CD
 */
export const CI_CONFIG = {
  // Configurações mais leves para CI
  settings: {
    ...LIGHTHOUSE_CONFIG.settings,
    throttling: {
      rttMs: 40,
      throughputKbps: 1024,
      cpuSlowdownMultiplier: 1,
    },
    formFactor: 'desktop', // Desktop é mais estável para CI
    onlyCategories: ['performance', 'accessibility'],
  },

  // Thresholds mais permissivos para CI
  thresholds: {
    performance: 70,
    accessibility: 90,
  },

  // Budget de performance
  budgets: [
    {
      resourceType: 'script',
      budget: 200, // 200KB
    },
    {
      resourceType: 'stylesheet',
      budget: 50, // 50KB
    },
    {
      resourceType: 'image',
      budget: 300, // 300KB
    },
    {
      resourceType: 'total',
      budget: 1000, // 1MB
    },
  ],
}

/**
 * Valida se resultado passa nos critérios de CI
 */
export function validateCIResult(result: Record<string, unknown>): boolean {
  const analysis = analyzeLighthouseResult(result)

  return (
    analysis.scores.performance >= CI_CONFIG.thresholds.performance &&
    analysis.scores.accessibility >= CI_CONFIG.thresholds.accessibility &&
    analysis.coreWebVitals.lcp <= CORE_WEB_VITALS_THRESHOLDS.lcp.needsImprovement &&
    analysis.coreWebVitals.cls <= CORE_WEB_VITALS_THRESHOLDS.cls.needsImprovement
  )
}

// === MONITORAMENTO CONTÍNUO ===

/**
 * Configuração para monitoramento contínuo
 */
export const MONITORING_CONFIG = {
  // Frequência de execução
  schedule: {
    daily: '0 2 * * *', // 2:00 AM todos os dias
    weekly: '0 2 * * 1', // 2:00 AM segunda-feira
    monthly: '0 2 1 * *', // 2:00 AM primeiro dia do mês
  },

  // Alertas
  alerts: {
    performanceDrop: 10, // Alerta se performance cair 10 pontos
    accessibilityIssue: 5, // Alerta se acessibilidade cair 5 pontos
    coreWebVitalsRegression: true, // Alerta para regressão em CWV
  },

  // Retenção de dados
  retention: {
    detailed: 30, // 30 dias de dados detalhados
    summary: 365, // 1 ano de resumos
  },
}
