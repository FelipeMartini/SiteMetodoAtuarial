// Configuração do Next.js para permitir imagens externas do Google
// Adiciona o domínio lh3.googleusercontent.com para uso seguro no componente <Image>


// Bundle Analyzer só será ativado quando a variável de ambiente ANALYZE for definida como 'true'.
// Recomenda-se rodar apenas via script "npm run analyze" para evitar ativação permanente.
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};


// Exporta a configuração do Next.js, garantindo que o bundle analyzer só rode sob demanda.
module.exports = withBundleAnalyzer(nextConfig);

// Comentário: Este arquivo garante que imagens de perfil do Google sejam exibidas corretamente na área do cliente. Adicione outros domínios conforme necessário.
