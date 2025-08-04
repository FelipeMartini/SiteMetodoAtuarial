// Arquivo especial do Next.js para configurar SSR do styled-components
// Garante que as classes CSS geradas no servidor sejam iguais às do cliente, evitando hydration mismatch
// Documentação: https://styled-components.com/docs/advanced#server-side-rendering

import Document, { DocumentContext, DocumentInitialProps, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  // Este método coleta os estilos do styled-components durante o SSR
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="pt-BR">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// Explicação:
// - Este arquivo é obrigatório para SSR do styled-components no Next.js.
// - O método getInitialProps coleta os estilos do styled-components durante o SSR.
// - O componente Head recebe os estilos gerados para garantir que o HTML do servidor e do cliente sejam idênticos.
// - Isso resolve o erro de hydration mismatch relacionado às classes CSS dinâmicas.
