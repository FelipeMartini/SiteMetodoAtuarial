# Zustand Slices - site-metodo

Este diretório contém slices do Zustand usados pela aplicação. Objetivo:

- Separar estado de UI por domínio (tema, sidebar, modais, sessão)
- Fornecer hooks auxiliares para consumo (`useTheme`, `useSidebarState`, `useSessionState`, `useModalState`)
- Permitir aplicação de atributos ABAC via `applyAbacAttributes`

Exemplo de uso:

```ts
import { useTheme } from '@/lib/zustand/hooks'

function Componente() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}
```

Persistência: apenas `theme` e `sidebarOpen` são persistidos no localStorage para preservar preferências do usuário.

Segurança: nunca guarde dados sensíveis nos slices de UI. Apenas ids e emails não sensíveis são permitidos na sessão.

Manual testing / SSR notes:

- Para testar SSR / hydratation: garantir que o `ThemeProviderClient` seja usado apenas no client (ele já é `use client`). A store persiste em localStorage; durante SSR o valor padrão é aplicado e o client irá rehidratar.
- Em layout principal (`src/app/layout.tsx`) deixe o `ThemeProviderClient` e `HydrateCurrentUser` conforme estão; isso garante sincronização de sessão e tema.
- Para aplicar políticas ABAC vindo do backend, chame `applyAbacAttributes(user.attributes)` após a sessão ser carregada (ex: dentro de `HydrateCurrentUser`).

Exemplo de integração ABAC (cliente):

```ts
import { applyAbacAttributes } from '@/lib/zustand/abac'

// após carregar a sessão com atributos
applyAbacAttributes(session.user?.attributes)
```

Isso permite que atributos como `{ theme: 'dark', sidebarCollapsed: true }` ajustem a UI automaticamente.

## Limpeza e refatoração recente

Alterações realizadas (para auditoria):

- Removido componente duplicado `src/components/theme/ThemeToggle.tsx` e unificado uso em `src/components/ui/theme-toggle.tsx`.
- Removido arquivo legacy `src/app/admin/abac/page-old.tsx`.
- Mantido `src/components/theme-provider.tsx` como wrapper de compatibilidade (sem lógica) para evitar que imports externos queiram quebrar; recomenda-se migrar imports para `useTheme` do Zustand.
- Adicionado `excelSlice` (`src/lib/zustand/slices/excelSlice.ts`) para gerenciar estado de análises de Excel em memória (não persistido).

Recomendações:

- Atualizar imports que referenciem caminhos legacy (`components/theme`) para `components/ui/theme-toggle`.
- Evitar persistir objetos grandes em localStorage (ex: resultado de análise Excel). Use slices em memória e rotas de download/export quando necessário.
- Executar `npm run build` e `npm test` após alterações estruturais maiores para capturar quebras; já executado com sucesso nesta sessão.

