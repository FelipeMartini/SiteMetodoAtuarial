# Script de Refatoração Estrutural Segura

Este sistema automatiza a reorganização da estrutura de pastas e arquivos do projeto `site-metodo`, alinhando ao padrão profissional aprovado e garantindo máxima segurança, logs e possibilidade de retomada.

## Como funciona o auto-restart

- O script principal agora é o `scripts/refatorar-estrutura.sh`, que executa o `refatorar-estrutura.js` em loop.
- Se faltar uma dependência (ex: `chalk`), o `.js` instala automaticamente e sai com código especial (42).
- O wrapper `.sh` detecta esse código e reinicia o script automaticamente, sem intervenção do usuário.
- Isso garante funcionamento perfeito em tasks do VS Code, CI/CD e shells interativos.

## Como rodar

**Via VS Code Task:**
- Certifique-se de que a task de refatoração aponte para o `scripts/refatorar-estrutura.sh` (e não mais para o `.js` direto).

**Manual:**
```bash
chmod +x scripts/refatorar-estrutura.sh
./scripts/refatorar-estrutura.sh
```

## Retomada
- O progresso é salvo em `.migration-status.json`.
- Se houver erro, corrija e execute novamente: o script retoma do ponto de falha.

## Logs e relatórios
- Todos os passos são logados com cores.
- O relatório final é salvo em `relatorio-migracao.txt`.

## Observação
- Não é mais necessário rodar manualmente após instalar dependências: o wrapper faz tudo automaticamente.

---

## Histórico de uso (fluxo antigo)

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
