---
applyTo: 'site-metodo/**'
---

# Checklist de Migração e Correção – site-metodo

- [ ] Remover todos os resíduos de styled-components (imports, arquivos, dependências)
- [ ] Corrigir todos os imports quebrados e referências antigas
- [ ] Garantir que o CSS global do Tailwind está aplicado corretamente
- [ ] Garantir que não há resets globais conflitantes
- [ ] Implementar/ajustar ThemeProvider do shadcn/ui no root do app
- [ ] Implementar toggle de tema (dark/light) conforme docs shadcn/ui
- [ ] Garantir que todos os componentes utilizam shadcn/ui e estão estilizados (nunca puros)
- [ ] Garantir visual moderno e atrativo, inspirado no fuse-react e nextjs-app
- [ ] Corrigir todos os erros de build
- [ ] Corrigir o problema de renderização global (layout quebrado, sem formatação, tudo à esquerda)
- [ ] Recriar o que for essencial e estiver faltando (ex: ThemeProvider, Toggle, estilos globais)
- [ ] Testar e validar o funcionamento do tema claro/escuro
- [ ] Testar e validar responsividade e acessibilidade
- [ ] Rodar linter e corrigir todos os avisos/erros
- [ ] Garantir que todos os testes unitários passam
- [ ] Remover arquivos e dependências não utilizados

_Atualize este checklist conforme avança cada etapa._
