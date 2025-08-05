// Configuração do Next.js para styled-components e outros recursos
// Inclui Bundle Analyzer, configuração de imagens e compilação otimizada

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
      fileName: true,
    },
  },
  transpilePackages: ['styled-components'],
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
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

// Exporta a configuração otimizada para styled-components
module.exports = withBundleAnalyzer(nextConfig);
