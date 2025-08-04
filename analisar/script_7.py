# 7. ARQUIVO: babel.config.js (fallback caso SWC falhe)
babel_config = '''// babel.config.js - Configuração fallback para styled-components
module.exports = {
  presets: [
    'next/babel'
  ],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        // Habilita Server Side Rendering
        ssr: true,
        // Mostra nome do componente para debugging
        displayName: true,
        // Remove props customizadas dos elementos DOM
        pure: true,
        // Namespace para evitar conflitos
        namespace: 'metodo-atuarial',
        // Otimizações para produção
        minify: process.env.NODE_ENV === 'production',
        // Remove comentários e espaços em produção  
        transpileTemplateLiterals: process.env.NODE_ENV === 'production',
      }
    ]
  ]
};

/**
 * Este arquivo serve como fallback caso o compilador SWC
 * do Next.js não funcione corretamente com styled-components.
 * 
 * Para usar este arquivo ao invés do SWC:
 * 1. Remova a configuração compiler.styledComponents do next.config.js
 * 2. Instale: npm install --save-dev babel-plugin-styled-components
 * 3. Reinicie o servidor de desenvolvimento
 * 
 * Configurações importantes:
 * - ssr: true - Essencial para Server Side Rendering
 * - displayName: true - Facilita debugging
 * - pure: true - Remove props customizadas do DOM
 * - namespace - Evita conflitos com outros CSS-in-JS
 */'''

# Salvando arquivo 7
with open('babel.config.js', 'w', encoding='utf-8') as f:
    f.write(babel_config)

print("✅ Arquivo 7 criado: babel.config.js")