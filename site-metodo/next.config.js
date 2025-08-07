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
  // Permite requisições cross-origin em desenvolvimento para evitar warning
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Adicione outros IPs usados no dev, ex: sua rede local
    'http://10.0.0.69:3000'
  ],
};

module.exports = withBundleAnalyzer(nextConfig);
