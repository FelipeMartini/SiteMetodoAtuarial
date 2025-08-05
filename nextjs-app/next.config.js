// Configuração do Next.js para permitir imagens externas do Google
// Adiciona o domínio lh3.googleusercontent.com para uso seguro no componente <Image>

// Bundle Analyzer só será ativado quando a variável de ambiente ANALYZE for definida como 'true'.
// Recomenda-se rodar apenas via script "npm run analyze" para evitar ativação permanente.
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// Mescla configuração do styled-components já existente com a engine do MUI
// Removido next-transpile-modules para evitar conflito com processamento de CSS global

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "developers.google.com",
      },
      {
        protocol: "https",
        hostname: "appleid.cdn-apple.com",
      },
    ],
  },
};

// Exporta a configuração do Next.js, garantindo que o bundle analyzer só rode sob demanda e que o MUI use styled-components
module.exports = withBundleAnalyzer({
  ...nextConfig,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mui/styled-engine": "@mui/styled-engine-sc",
    };
    return config;
  },
});

// Comentário: Configuração unificada para uso de styled-components tanto no Next.js quanto como engine do MUI. Permite imagens externas e análise de bundle.
