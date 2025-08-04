// Componente para SSR do styled-components no App Router
// Garante que os estilos sejam sincronizados entre server e client
// Documentação oficial: https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components

'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Cria uma instância do ServerStyleSheet para coletar estilos SSR
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  // No client, retorna apenas os children sem processamento
  if (typeof window !== 'undefined') return <>{children}</>;

  // No servidor, usa StyleSheetManager para coletar estilos
  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}

// Explicação:
// - Este componente deve envolver todo o conteúdo do layout principal (app/layout.tsx)
// - Ele resolve o problema de hydration mismatch para styled-components no App Router
// - Não é necessário usar _document.tsx para rotas do diretório app/
