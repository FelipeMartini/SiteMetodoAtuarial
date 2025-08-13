# Integração Global com Zustand: Sidebars Duplas (Admin + Cliente)

## Instruções para Integração Global com Zustand

### Por que Zustand?
Zustand é uma solução de gerenciamento de estado global para React/Next.js, leve, sem boilerplate e altamente performática. Permite controlar o estado das sidebars (abertas, recolhidas, modo mobile, etc.) de forma global, sem necessidade de múltiplos providers ou contextos.

### Exemplo de Store Global para Sidebars
```ts
// src/store/sidebarStore.ts
import { create } from 'zustand'

interface SidebarState {
  adminOpen: boolean
  clienteOpen: boolean
  setAdminOpen: (open: boolean) => void
  setClienteOpen: (open: boolean) => void
  toggleAdmin: () => void
  toggleCliente: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  adminOpen: true,
  clienteOpen: false,
  setAdminOpen: (open) => set({ adminOpen: open }),
  setClienteOpen: (open) => set({ clienteOpen: open }),
  toggleAdmin: () => set((state) => ({ adminOpen: !state.adminOpen })),
  toggleCliente: () => set((state) => ({ clienteOpen: !state.clienteOpen })),
}))
```

### Como Usar no Projeto
```tsx
import { useSidebarStore } from '@/store/sidebarStore'

const SidebarAdmin = () => {
  const { adminOpen, toggleAdmin } = useSidebarStore()
  // ...
}

const SidebarCliente = () => {
  const { clienteOpen, toggleCliente } = useSidebarStore()
  // ...
}
```

### Melhores Práticas
- Use um único store global para sidebars, evitando múltiplos providers/contextos.
- Utilize persistência (zustand/middleware) para manter o estado entre reloads.
- Separe ações e estado para cada sidebar (admin/cliente) para máxima flexibilidade.
- Use selectors para evitar re-renderizações desnecessárias.
- Integre com SSR apenas se necessário (ver docs oficiais).

#### Referências:
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [shadcn-ui-sidebar (usa Zustand)](https://github.com/salimi-my/shadcn-ui-sidebar)

---

# Um Componente ou Dois? Análise de Padrão para Sidebars Duplas

## Opção 1: Um Componente Único (Sidebar Dinâmica)
- Um único componente Sidebar recebe props/contexto para alternar entre admin/cliente.
- Vantagem: Menos duplicação, fácil manutenção, lógica centralizada.
- Desvantagem: Pode ficar complexo se as sidebars forem muito diferentes.

## Opção 2: Dois Componentes Separados (SidebarAdmin + SidebarCliente)
- Cada área tem seu próprio componente, ambos podem ser renderizados lado a lado ou alternados.
- Vantagem: Separação total de responsabilidades, fácil customização individual.
- Desvantagem: Pode duplicar lógica de base, mas facilita estilos e menus distintos.

## O que grandes projetos fazem?
- **shadcn-ui-sidebar**: Usa dois componentes, um para admin, outro para cliente, ambos controlados por Zustand global.
- **Taxonomy (shadcn)**: Usa múltiplos layouts e sidebars, cada um com lógica própria, mas pode compartilhar store global.
- **TailAdmin/NextAdmin**: Componentes separados para cada contexto, mas com store global para controle e persistência.

## Recomendação para o Projeto
- Use DOIS componentes separados (SidebarAdmin e SidebarCliente), ambos integrados ao Zustand global.
- Isso permite menus, estilos e lógica distintos, mas mantém controle centralizado e responsivo.
- Para mobile, ambos podem ser "offcanvas" e controlados pelo mesmo store.

## Referências e Fontes (componentização e padrões)
1. https://ui.shadcn.com/docs/components/sidebar
2. https://github.com/salimi-my/shadcn-ui-sidebar
3. https://shadcn-ui-sidebar.salimi.my/
4. https://github.com/shadcn-ui/taxonomy
5. https://github.com/TailAdmin/free-nextjs-admin-dashboard
6. https://github.com/NextAdminHQ/nextjs-admin-dashboard
7. https://docs.pmnd.rs/zustand/getting-started/introduction
8. https://github.com/pmndrs/zustand
9. https://zustand-demo.pmnd.rs/
10. https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md

---

# Planejamento de Implementação (Rascunho)

## 1. Criar store global Zustand para sidebars (admin/cliente)
## 2. Criar componentes separados: SidebarAdmin e SidebarCliente
## 3. Integrar ambos no layout principal (ex: app/layout.tsx), lado a lado ou alternando
## 4. Garantir responsividade (offcanvas/mobile)
## 5. Adicionar persistência de estado (zustand/middleware)
## 6. Testar acessibilidade, atalhos e integração com SSR
## 7. Refatorar menus, estilos e lógica conforme contexto (admin/cliente)

---

# Melhores Práticas e Recomendações para o Projeto
- Use Zustand para controle global, com persistência e selectors.
- Separe componentes para cada contexto (admin/cliente), mas compartilhe lógica base quando possível.
- Siga o padrão de composição do shadcn/ui (SidebarProvider, Sidebar, SidebarContent, etc).
- Use Tailwind para customização visual e responsividade.
- Consulte exemplos reais: [shadcn-ui-sidebar](https://github.com/salimi-my/shadcn-ui-sidebar), [Taxonomy](https://github.com/shadcn-ui/taxonomy), [TailAdmin](https://github.com/TailAdmin/free-nextjs-admin-dashboard), [NextAdmin](https://github.com/NextAdminHQ/nextjs-admin-dashboard).
- Documente e comente o código para facilitar manutenção.

---

# Fontes e Links Pesquisados (Zustand, Sidebars, Componentização)
1. https://ui.shadcn.com/docs/components/sidebar
2. https://github.com/salimi-my/shadcn-ui-sidebar
3. https://shadcn-ui-sidebar.salimi.my/
4. https://github.com/shadcn-ui/taxonomy
5. https://github.com/TailAdmin/free-nextjs-admin-dashboard
6. https://github.com/NextAdminHQ/nextjs-admin-dashboard
7. https://docs.pmnd.rs/zustand/getting-started/introduction
8. https://github.com/pmndrs/zustand
9. https://zustand-demo.pmnd.rs/
10. https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md
11. https://github.com/pmndrs/zustand/blob/main/docs/guides/flux-inspired-practice.md
12. https://github.com/pmndrs/zustand/blob/main/docs/guides/testing.md
13. https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md
14. https://github.com/pmndrs/zustand/blob/main/docs/guides/persisting-store-data.md
15. https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md

---

> **Próximos passos:**
> - Definir o estilo visual preferido (lado a lado, empilhado, offcanvas, etc.)
> - Implementar store Zustand e componentes conforme planejamento acima
> - Adaptar menus, estilos e lógica conforme contexto admin/cliente
> - Testar responsividade, acessibilidade e persistência
> - Documentar decisões e padrões adotados
# Sidebars Duplas (Admin + Cliente) – Padrões, Alternativas e Fontes (2025)

## Contexto do Projeto
Nosso objetivo é implementar uma solução de sidebar para a área do cliente e para o dashboard admin, permitindo que:
- Ambas possam coexistir (lado a lado, ou uma recolhida sob a outra, ou modo "mini-ícone").
- O layout seja responsivo, acessível e moderno.
- O usuário admin possa alternar entre as áreas sem perder contexto.

## Alternativas e Padrões Encontrados
Após pesquisa extensiva em fontes de referência, as principais abordagens para sidebars duplas são:

1. **Sidebar Lateral Dupla (lado a lado):**
  - Uma sidebar "principal" (admin) e uma "secundária" (cliente) ficam lado a lado.
  - A secundária pode ser recolhida para ícones ou "dock".
  - Exemplo: [shadcn/ui sidebar](https://ui.shadcn.com/docs/components/sidebar) com `collapsible="icon"`.

2. **Sidebar Empilhada (uma abaixo da outra):**
  - Em telas menores, a sidebar secundária "desce" para baixo da principal.
  - Útil para mobile ou layouts verticais.

3. **Sidebar Flutuante/Offcanvas:**
  - Uma sidebar "flutua" sobre a outra, ativada por botão/hamburger.
  - Muito usada em mobile.

4. **Sidebar Dinâmica/Contextual:**
  - A sidebar muda de acordo com o contexto (admin/cliente), mas mantém um "mini-ícone" para alternância rápida.
  - Exemplo: [shadcn-ui-sidebar](https://github.com/salimi-my/shadcn-ui-sidebar)

## Recomendações para o Projeto

- **Utilizar o componente Sidebar do shadcn/ui** (https://ui.shadcn.com/docs/components/sidebar), pois é altamente customizável, suporta modo `icon`, offcanvas, persistência de estado e integração com Tailwind.
- Implementar duas instâncias de Sidebar, uma para admin e outra para cliente, controlando a visibilidade/contexto via Zustand ou Context API.
- Adotar o padrão "sidebar principal + sidebar mini" (lado a lado, com recolhimento para ícones), pois é o mais moderno, responsivo e usado em dashboards profissionais (ver exemplos abaixo).
- Para mobile, usar o modo offcanvas para ambas, com overlays distintos.
- Permitir que o usuário "fixe" ou "recolha" cada sidebar individualmente.
- Garantir acessibilidade (atalhos, foco, ARIA roles) e persistência de estado (cookies/localStorage).

## Exemplos e Inspirações
- [shadcn/ui sidebar blocks](https://ui.shadcn.com/blocks/sidebar)
- [shadcn-ui-sidebar (Salimi)](https://github.com/salimi-my/shadcn-ui-sidebar) | [Demo](https://shadcn-ui-sidebar.salimi.my/)
- [Taxonomy (shadcn)](https://github.com/shadcn-ui/taxonomy)
- [TailAdmin Next.js](https://github.com/TailAdmin/free-nextjs-admin-dashboard) | [Demo](https://nextjs-demo.tailadmin.com/)
- [NextAdmin](https://github.com/NextAdminHQ/nextjs-admin-dashboard) | [Demo](https://demo.nextadmin.co/)
- [Awesome Shadcn UI](https://github.com/bytefer/awesome-shadcn-ui)
- [Reddit: Sidebar Next.js 14 + shadcn/ui](https://www.reddit.com/r/react/comments/1briyqf/build_a_responsive_sidebar_using_nextjs_14_react/)
- [BuiltAtLightspeed: shadcn-ui-sidebar](https://www.builtatlightspeed.com/theme/salimi-my-shadcn-ui-sidebar)
- [YouTube: Ultimate ShadCN Tutorial 2025](https://www.youtube.com/watch?v=SjsQdfvxjL8)
- [YouTube: Next.js 14 Admin Dashboard Tutorial](https://www.youtube.com/watch?v=cBg6xA5C60s&t=975s)
- [YouTube: Next js Admin Sidebar with Icons, Toggle & Tailwind Styling](https://www.youtube.com/watch?v=yO-11jQx7P8)
- [YouTube: Next.js E-Commerce App & Admin Panel UI Design](https://www.youtube.com/watch?v=6dvYioHX328&t=12287s)

## Fontes e Referências (10+)
1. https://ui.shadcn.com/docs/components/sidebar
2. https://ui.shadcn.com/blocks/sidebar
3. https://github.com/salimi-my/shadcn-ui-sidebar
4. https://shadcn-ui-sidebar.salimi.my/
5. https://github.com/shadcn-ui/taxonomy
6. https://github.com/TailAdmin/free-nextjs-admin-dashboard
7. https://nextjs-demo.tailadmin.com/
8. https://github.com/NextAdminHQ/nextjs-admin-dashboard
9. https://demo.nextadmin.co/
10. https://github.com/bytefer/awesome-shadcn-ui
11. https://www.reddit.com/r/react/comments/1briyqf/build_a_responsive_sidebar_using_nextjs_14_react/
12. https://www.builtatlightspeed.com/theme/salimi-my-shadcn-ui-sidebar
13. https://www.youtube.com/watch?v=SjsQdfvxjL8
14. https://www.youtube.com/watch?v=cBg6xA5C60s&t=975s
15. https://www.youtube.com/watch?v=yO-11jQx7P8
16. https://www.youtube.com/watch?v=6dvYioHX328&t=12287s

## Conclusão
O padrão mais recomendado para nosso projeto é o de sidebars duplas lado a lado, com recolhimento para ícones (modo "icon" do shadcn/ui), responsivo e com persistência de estado. Isso garante UX moderna, flexibilidade e fácil manutenção.

> **Dica:** Veja exemplos práticos e código pronto nos links acima, especialmente nos repositórios do shadcn/ui e nos templates TailAdmin/NextAdmin.
# Guia Definitivo: Sidebar Colapsável Moderna com shadcn/ui, Next.js e React (2025)

## Visão Geral

Este guia compila as melhores práticas, padrões e referências para implementar sidebars colapsáveis, responsivas, acessíveis e modernas em projetos Next.js/React, utilizando shadcn/ui e Tailwind CSS. Baseado em mais de 30 fontes da comunidade, templates open source, documentação oficial e exemplos de produção.

---

## 1. Padrão Oficial shadcn/ui Sidebar

- **Documentação**: [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/sidebar)
- **Componentes principais**:
  - `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarFooter`
  - `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarGroupAction`
  - `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuBadge`, `SidebarMenuAction`, `SidebarMenuSub`
  - `SidebarTrigger`, `SidebarRail`, `SidebarSeparator`, `SidebarMenuSkeleton`
- **Colapsamento**: `collapsible="offcanvas"`, `collapsible="icon"`, `collapsible="none"`
- **Responsividade**: `variant="sidebar"`, `variant="floating"`, `variant="inset"`
- **Persistência de estado**: Cookie automático (`sidebar_state`)
- **Atalhos de teclado**: `ctrl+b`/`cmd+b` (customizável)
- **Theming**: Variáveis CSS exclusivas para sidebar (cores, contraste, dark/light)
- **Acessibilidade**: ARIA, navegação por teclado, foco, contraste
- **Skeletons**: `SidebarMenuSkeleton` para loading com React Query/SWR
- **Exemplo de uso**: [Exemplo oficial](https://ui.shadcn.com/docs/components/sidebar#usage)

---

## 2. Templates e Exemplos Open Source

- [TailAdmin Next.js Dashboard](https://github.com/TailAdmin/free-nextjs-admin-dashboard) ([Demo](https://nextjs-demo.tailadmin.com/))
- [NextAdmin Dashboard](https://github.com/NextAdminHQ/nextjs-admin-dashboard) ([Demo](https://demo.nextadmin.co/))
- [Salimi shadcn-ui-sidebar](https://github.com/salimi-my/shadcn-ui-sidebar) ([Demo](https://shadcn-ui-sidebar.salimi.my/))
- [Taxonomy (shadcn)](https://github.com/shadcn/taxonomy)
- [Awesome shadcn/ui](https://github.com/bytefer/awesome-shadcn-ui) (lista de templates, libs e exemplos)
- [Shadcnblocks.com](https://www.shadcnblocks.com/) (300+ blocos prontos)
- [Next.js Admin Templates 2025](https://nextjstemplates.com/blog/admin-dashboard-templates) (21+ templates modernos)
- [Reddit: Sidebar com shadcn/ui](https://www.reddit.com/r/react/comments/1briyqf/build_a_responsive_sidebar_using_nextjs_14_react/)

---

## 3. Padrões de UX e Composição

- **Grupos colapsáveis**: Use `Collapsible` do shadcn/ui para grupos e submenus.
- **Badges**: `SidebarMenuBadge` para notificações, contadores, status.
- **Submenus**: `SidebarMenuSub` para navegação hierárquica.
- **Rail**: `SidebarRail` para toggle rápido (mini sidebar).
- **Trigger customizado**: Use `useSidebar` para criar botões/atalhos personalizados.
- **Skeletons**: Exiba loading com `SidebarMenuSkeleton` durante fetch de dados.
- **Ações rápidas**: `SidebarGroupAction` e `SidebarMenuAction` para botões de ação.
- **Responsividade**: Sheet para mobile, largura customizável, variantes de layout.
- **Acessibilidade**: Labels, foco, navegação por teclado, contraste, ARIA.

---

## 4. Integração com Stack Moderno

- **State Management**: Zustand, React Context, Redux (se necessário)
- **Data Fetching**: React Query, SWR, Server Components
- **Auth**: Auth.js, NextAuth, Clerk, Supabase Auth
- **Theming**: Tailwind CSS, customização via CSS variables
- **Testes**: Jest, Testing Library, Cypress

---

## 5. Melhores Práticas

- Sempre use o CLI do shadcn/ui para instalar/atualizar componentes:  
  `pnpm dlx shadcn@latest add sidebar`
- Importe sempre de `@/components/ui/sidebar`
- Adapte as variáveis de tema no seu `globals.css` conforme a doc oficial
- Use composição: combine grupos, menus, badges, triggers, skeletons, etc.
- Prefira variantes colapsáveis para UX moderna e responsiva
- Teste dark/light mode, acessibilidade e navegação por teclado
- Consulte sempre a [doc oficial](https://ui.shadcn.com/docs/components/sidebar) para atualizações

---

## 6. Referências e Fontes

### Documentação e Componentes Oficiais
- [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/sidebar)
- [shadcn/ui Collapsible](https://ui.shadcn.com/docs/components/collapsible)
- [shadcn/ui Sheet](https://ui.shadcn.com/docs/components/sheet)
- [shadcn/ui Blocks](https://ui.shadcn.com/blocks)

### Templates e Exemplos
- [TailAdmin Next.js Dashboard](https://github.com/TailAdmin/free-nextjs-admin-dashboard)
- [NextAdmin Dashboard](https://github.com/NextAdminHQ/nextjs-admin-dashboard)
- [Salimi shadcn-ui-sidebar](https://github.com/salimi-my/shadcn-ui-sidebar)
- [Taxonomy (shadcn)](https://github.com/shadcn/taxonomy)
- [Shadcnblocks.com](https://www.shadcnblocks.com/)
- [Awesome shadcn/ui](https://github.com/bytefer/awesome-shadcn-ui)
- [Next.js Admin Templates 2025](https://nextjstemplates.com/blog/admin-dashboard-templates)
- [Reddit: Sidebar com shadcn/ui](https://www.reddit.com/r/react/comments/1briyqf/build_a_responsive_sidebar_using_nextjs_14_react/)

### Comunidade e Inspiração
- [GitHub: shadcn-ui-sidebar](https://github.com/salimi-my/shadcn-ui-sidebar)
- [GitHub: awesome-shadcn-ui](https://github.com/bytefer/awesome-shadcn-ui)
- [GitHub: react-pro-sidebar](https://github.com/azouaoui-med/react-pro-sidebar)
- [GitHub: material-kit-react](https://github.com/Devias-IO/material-kit-react)
- [GitHub: rsuite-sidebar](https://github.com/rsuite/rsuite/tree/master/packages/rsuite-sidebar)

### Artigos e Tutoriais
- [Next.js Admin Dashboard Templates 2025](https://nextjstemplates.com/blog/admin-dashboard-templates)
- [Reddit: Sidebar com shadcn/ui](https://www.reddit.com/r/react/comments/1briyqf/build_a_responsive_sidebar_using_nextjs_14_react/)

---

## 7. Recomendações Finais

- Use o padrão shadcn/ui como base para qualquer sidebar moderna em Next.js/React.
- Sempre consulte a documentação oficial antes de implementar ou atualizar.
- Inspire-se em templates open source e adapte para as necessidades do seu projeto.
- Priorize acessibilidade, responsividade, dark mode e experiência do usuário.
- Mantenha o código modular, testável e fácil de evoluir.

---

**Este guia é atualizado com base nas melhores práticas e tendências de 2025. Para dúvidas ou sugestões, consulte as fontes acima ou contribua com a comunidade shadcn/ui.**
