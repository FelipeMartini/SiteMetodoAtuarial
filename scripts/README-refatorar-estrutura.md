# Script de Refatoração Estrutural Segura

Este script automatiza a reorganização da estrutura de pastas e arquivos do projeto `site-metodo`, alinhando ao padrão profissional aprovado e garantindo máxima segurança, logs e possibilidade de retomada.

## Como usar

1. **Pré-requisitos:**
   - Node.js instalado (versão 16+ recomendada)
   - VS Code (opcional, mas recomendado para rodar via Task)

2. **Execução via VS Code (recomendado):**
   - Abra o projeto no VS Code.
   - Pressione `Ctrl+Shift+B` ou `F1 > Run Task`.
   - Selecione a task: **Refatorar Estrutura do Projeto**.
   - O terminal integrado mostrará logs detalhados de cada etapa.
   - Em caso de erro, corrija e execute novamente: o script retoma do ponto exato.

3. **Execução manual (alternativa):**
   - No terminal, execute:
     ```bash
     node scripts/refatorar-estrutura.js
     ```

4. **Relatório:**
   - Ao final, um relatório detalhado será salvo em `relatorio-migracao.txt` na raiz do projeto.

## O que o script faz
- Cria as pastas:
  - `src/components/layouts/LayoutCliente`
  - `src/components/theme`
  - `src/configs`
  - `src/contexts`
  - `src/components/ui`
- Move arquivos de layout, tema e configs para os novos locais.
- Cria arquivos de exemplo para configs/contextos se não existirem.
- Atualiza todos os imports do projeto para refletir a nova estrutura.
- Remove arquivos redundantes e legados.
- Gera logs detalhados e permite retomada automática em caso de erro.

## Estrutura Final Esperada
```
src/
  components/
    layouts/
      LayoutCliente/
        index.tsx
        Header.tsx
        Rodape.tsx
        Servicos.tsx
        SocialLoginBox.tsx
        ErrorBoundary.tsx
    theme/
      ThemeProvider.tsx
      ThemeToggle.tsx
      ThemeProviderCustom.tsx
    ui/
      ... (componentes atômicos shadcn/ui)
  configs/
    themesConfig.ts
    settingsConfig.ts
    layoutConfigTemplates.ts
    navigationConfig.ts
    themeOptions.ts
  contexts/
    AppContext.tsx
  styles/
    index.css
    ...
```

## Observações
- O script é idempotente: pode ser rodado várias vezes sem causar problemas.
- Em caso de erro, basta corrigir e rodar novamente.
- Ajustes manuais podem ser necessários em casos muito específicos (ex: imports dinâmicos, arquivos customizados).
- Sempre revise o relatório e rode os testes após a migração.

---

Dúvidas? Consulte o código do script, que está totalmente comentado, ou peça suporte ao time técnico.
