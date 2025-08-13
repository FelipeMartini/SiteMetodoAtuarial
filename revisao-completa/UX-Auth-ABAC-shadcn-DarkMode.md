---
# Guia de UX/Auth Moderno com shadcn/ui + Next.js + ABAC

## 1. Resumo das Melhorias Propostas
- Feedback instantâneo (toasts, sonner)
- Diálogos/alertas acessíveis (Dialog/AlertDialog)
- Skeletons e Progress para loading
- Tooltips explicativos
- Botões, Badges e Avatar modernos
- Fluxo de acesso negado claro
- Loading global seguro
- Acessibilidade total
- Composição e abstração de wrappers
- **Suporte total a tema claro/escuro (dark mode) e seletor de tema**

---

## 2. Checklist Detalhado de Implementação

### 2.1. Feedback Instantâneo
- [ ] Adicionar `<Toaster />` global no layout (Sonner/shadcn)
- [ ] Usar `toast()` para feedback de sucesso, erro, acesso negado, etc.
- [ ] Garantir contraste e acessibilidade em ambos os temas

### 2.2. Diálogos e Alertas
- [ ] Usar `<Dialog />` e `<AlertDialog />` para bloqueios e confirmações
- [ ] Sempre incluir título, descrição e botões acessíveis
- [ ] Overlay escurecendo fundo, foco preso no modal
- [ ] Cores adaptadas ao tema

### 2.3. Skeletons e Progress
- [ ] Exibir `<Skeleton />` e `<Progress />` durante carregamento de dados/ABAC
- [ ] Garantir contraste e animação visível em ambos os temas

### 2.4. Tooltips
- [ ] Adicionar `<Tooltip />` em ícones, botões e áreas restritas
- [ ] Mensagens curtas e explicativas
- [ ] Cores e sombras adaptadas ao tema

### 2.5. Botões, Badges e Avatar
- [ ] Usar `<Button />`, `<Badge />` e `<Avatar />` do shadcn/ui
- [ ] Botões com loading, badges para status, avatar com fallback
- [ ] Todos respeitando o tema

### 2.6. Fluxo de acesso negado
- [ ] Toast foreground + AlertDialog explicando motivo
- [ ] Botão para voltar ou solicitar acesso
- [ ] Mensagens claras e acessíveis

### 2.7. Loading global
- [ ] Skeletons e progress em áreas sensíveis
- [ ] Evitar flashes de conteúdo não autorizado

### 2.8. Acessibilidade
- [ ] Navegação por teclado em todos componentes
- [ ] Labels claros, ARIA roles, foco visível
- [ ] Testar com leitores de tela

### 2.9. Composição e abstração
- [ ] Criar wrappers reutilizáveis para feedback, loading e acesso negado
- [ ] Centralizar lógica de feedback

### 2.10. Tema Claro/Escuro (Dark Mode)
- [ ] Garantir que todos componentes usem classes/variáveis do shadcn/ui:
  - `bg-background`, `text-foreground`, `bg-primary`, etc.
- [ ] Adicionar seletor de tema global (toggle no header/menu)
- [ ] Alternar tema adicionando/removendo `.dark` no `<html>` ou `<body>`
- [ ] Persistir escolha do usuário (localStorage/cookie)
- [ ] Testar todos fluxos em ambos os temas
- [ ] Garantir contraste e acessibilidade em dark/light

---

## 3. Como aplicar o Dark Mode com shadcn/ui

### Passo a Passo
1. **Estrutura de cores:**
   - shadcn/ui já define variáveis CSS para cores em `:root` e `.dark`.
   - Use sempre classes como `bg-background`, `text-foreground`, etc.
2. **Ativando dark mode:**
   - Adicione/remova a classe `dark` no `<html>` ou `<body>`.
   - Exemplo Next.js:
     ```tsx
     // Exemplo de toggle
     document.documentElement.classList.toggle('dark')
     ```
3. **Seletor de tema:**
   - Crie um botão de alternância (ícone sol/lua) no header/menu.
   - Ao clicar, alterne a classe `dark` e salve a escolha do usuário (localStorage).
   - Exemplo:
     ```tsx
     const toggleTheme = () => {
       const html = document.documentElement;
       html.classList.toggle('dark');
       localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
     };
     ```
4. **Persistência:**
   - No carregamento da app, leia o valor salvo e aplique o tema.
   - Exemplo:
     ```tsx
     useEffect(() => {
       const theme = localStorage.getItem('theme');
       if (theme === 'dark') document.documentElement.classList.add('dark');
     }, []);
     ```
5. **Testes:**
   - Teste todos componentes e fluxos em ambos os temas.
   - Ajuste cores customizadas se necessário, sempre usando variáveis do shadcn/ui.

---

## 4. Fontes e Referências
- [shadcn/ui - Dark Mode](https://ui.shadcn.com/docs/dark-mode)
- [shadcn/ui - Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui - Button](https://ui.shadcn.com/docs/components/button)
- [shadcn/ui - Sonner (Toaster)](https://ui.shadcn.com/docs/components/sonner)

---

**Resumo:**
Todas as melhorias de UX/Auth devem ser 100% compatíveis com dark mode, respeitando o seletor de tema global, garantindo contraste, acessibilidade e experiência moderna em qualquer contexto visual.
