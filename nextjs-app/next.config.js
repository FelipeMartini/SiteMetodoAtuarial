// Configuração do Next.js para permitir imagens externas do Google
// Adiciona o domínio lh3.googleusercontent.com para uso seguro no componente <Image>

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

module.exports = nextConfig;

// Comentário: Este arquivo garante que imagens de perfil do Google sejam exibidas corretamente na área do cliente. Adicione outros domínios conforme necessário.
