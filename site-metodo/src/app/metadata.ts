// SEO: exporta metadados para a página inicial
export const metadata = {
  title: 'Método Atuarial | Consultoria e Soluções Atuariais',
  description:
    'Consultoria especializada em soluções atuariais, excelência técnica e inovação para previdência e seguros.',
  openGraph: {
    title: 'Método Atuarial | Consultoria e Soluções Atuariais',
    description:
      'Consultoria especializada em soluções atuariais, excelência técnica e inovação para previdência e seguros.',
    url: 'https://metodoatuarial.com.br/',
    siteName: 'Método Atuarial',
    images: [
      {
        url: '/office-team.png', // Caminho já está correto, pois a imagem existe em site-metodo/public
        width: 1200,
        height: 630,
        alt: 'Equipe Método Atuarial',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
}
