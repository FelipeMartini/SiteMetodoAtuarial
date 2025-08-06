// SEO: exporta metadados para a página Contato
export const metadata = {
  title: 'Contato | Método Atuarial',
  description: 'Entre em contato com a Método Atuarial para orçamentos, dúvidas ou informações sobre nossos serviços.',
  openGraph: {
    title: 'Contato | Método Atuarial',
    description: 'Entre em contato com a Método Atuarial para orçamentos, dúvidas ou informações sobre nossos serviços.',
    url: 'https://metodoatuarial.com.br/contato',
    siteName: 'Método Atuarial',
    images: [
      {
        url: '/loginboxescura.png', // Corrigido para imagem existente em site-metodo/public
        width: 1200,
        height: 630,
        alt: 'Contato Método Atuarial',
      },
    ],
    locale: 'pt_BR',
    type: 'article',
  },
};
