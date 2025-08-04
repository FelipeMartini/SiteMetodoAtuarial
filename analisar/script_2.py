# 2. ARQUIVO: next.config.js corrigido
next_config_corrigido = '''// next.config.js - Configuração corrigida para styled-components no Next.js 15
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração essencial para styled-components
  compiler: {
    // Habilita o compilador SWC para styled-components
    styledComponents: {
      // Habilita Server Side Rendering para styled-components
      ssr: true,
      // Mostra nome do componente junto com className (útil para debug)
      displayName: true,
      // Remove comentários de desenvolvimento na produção
      minify: true,
      // Transpila apenas importações de styled-components
      topLevelImports: true,
      // Namespace para evitar conflitos
      namespace: 'metodo-atuarial',
      // Remove props customizadas dos elementos DOM
      meaninglessFileNames: ['index', 'styles'],
    },
  },

  // Configuração de imagens existente
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // Otimizações de performance
  swcMinify: true,
  
  // Configuração para produção
  productionBrowserSourceMaps: false,
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

// Exporta configuração com bundle analyzer condicional
module.exports = withBundleAnalyzer(nextConfig);

/**
 * Principais mudanças:
 * 1. Adicionado compiler.styledComponents com todas as opções necessárias
 * 2. ssr: true - Essencial para evitar hydration errors
 * 3. displayName: true - Facilita debugging
 * 4. namespace - Evita conflitos com outras libs CSS-in-JS
 * 5. Otimizações de performance adicionais
 */'''

# Salvando arquivo 2
with open('next.config.js', 'w', encoding='utf-8') as f:
    f.write(next_config_corrigido)

print("✅ Arquivo 2 criado: next.config.js")