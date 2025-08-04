# 1. ARQUIVO: StyledComponentsRegistry.tsx - Solução principal para o hydration
registry_styled_components = '''// StyledComponentsRegistry.tsx - Correção para hydration no Next.js 15
'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

/**
 * Registry global para styled-components no Next.js 15
 * Coleta todas as regras CSS durante o render no servidor
 * e as injeta no <head> antes do hydration no cliente
 */
export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cria stylesheet uma única vez com lazy initial state
  // Referência: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // No cliente, retorna apenas os children sem processamento
  if (typeof window !== 'undefined') return <>{children}</>;

  // No servidor, usa StyleSheetManager para coletar estilos
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}

/**
 * Como funciona:
 * 1. No servidor: StyleSheetManager coleta todos os estilos dos styled-components
 * 2. useServerInsertedHTML injeta esses estilos no <head> antes do conteúdo
 * 3. No cliente: Após hydration, styled-components assume o controle normalmente
 * 4. Isso previne FOUC (Flash of Unstyled Content) e erros de hydration
 */'''

# Salvando arquivo 1
with open('StyledComponentsRegistry.tsx', 'w', encoding='utf-8') as f:
    f.write(registry_styled_components)

print("✅ Arquivo 1 criado: StyledComponentsRegistry.tsx")